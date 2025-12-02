# Изменения на бэкенде для поддержки согласия на рекламную рассылку

## Обзор

Фронтенд передает флаг согласия на рекламную рассылку (`marketing_consent`) при авторизации через OAuth провайдеры (Яндекс, VK ID). Необходимо обработать этот флаг на бэкенде и сохранить в профиле пользователя.

---

## 1. Яндекс OAuth (`GET /api/v1/auth/oauth/yandex/login`)

### Изменения в эндпоинте

**Текущий формат запроса:**
```
GET /api/v1/auth/oauth/yandex/login
```

**Новый формат запроса:**
```
GET /api/v1/auth/oauth/yandex/login?marketing_consent=true
```

### Рекомендуемые изменения

1. **В обработчике `/api/v1/auth/oauth/yandex/login`:**
   - Извлечь query параметр `marketing_consent` (опциональный, может быть `true` или отсутствовать)
   - Сохранить значение в сессии/state для передачи в callback

   **Пример (Python/FastAPI):**
   ```python
   @router.get("/api/v1/auth/oauth/yandex/login")
   async def yandex_login(request: Request):
       marketing_consent = request.query_params.get("marketing_consent") == "true"
       
       # Сохранить в state для OAuth flow
       state = generate_state()
       session[state] = {
           "marketing_consent": marketing_consent,
           "provider": "yandex"
       }
       
       # Редирект на Яндекс OAuth
       redirect_url = build_yandex_oauth_url(state=state)
       return RedirectResponse(url=redirect_url)
   ```

2. **В callback обработчике `/api/v1/auth/oauth/yandex/callback`:**
   - Извлечь `marketing_consent` из сохраненного state/сессии
   - При создании/обновлении пользователя установить флаг согласия на рекламу

   **Пример:**
   ```python
   @router.get("/api/v1/auth/oauth/yandex/callback")
   async def yandex_callback(request: Request, code: str, state: str):
       # Получить сохраненные данные из state
       session_data = session.get(state, {})
       marketing_consent = session_data.get("marketing_consent", False)
       
       # Обменять code на токен
       token_data = await exchange_yandex_code(code)
       user_info = await get_yandex_user_info(token_data["access_token"])
       
       # Создать/обновить пользователя
       user = await create_or_update_user(
           provider="yandex",
           provider_id=user_info["id"],
           email=user_info.get("default_email"),
           name=user_info.get("real_name"),
           marketing_consent=marketing_consent  # <-- Передать флаг
       )
       
       # Установить сессию/куки для авторизации
       set_auth_cookies(user)
       return RedirectResponse(url="/")
   ```

---

## 2. VK ID OAuth (`POST /api/v1/auth/oauth/vk-id/exchange`)

### Изменения в эндпоинте

**Текущий формат запроса:**
```json
POST /api/v1/auth/oauth/vk-id/exchange
Content-Type: application/json
x-user-ip: <user_ip>

{
  "code": "<code>",
  "deviceId": "<device_id>",
  "codeVerifier": "<pkce_code_verifier>"
}
```

**Новый формат запроса:**
```json
POST /api/v1/auth/oauth/vk-id/exchange
Content-Type: application/json
x-user-ip: <user_ip>

{
  "code": "<code>",
  "deviceId": "<device_id>",
  "codeVerifier": "<pkce_code_verifier>",
  "marketingConsent": true  // <-- Новое поле (boolean, опциональное)
}
```

### Рекомендуемые изменения

**В обработчике `/api/v1/auth/oauth/vk-id/exchange`:**

1. Добавить поле `marketingConsent` в схему запроса (опциональное, по умолчанию `false`)
2. При создании/обновлении пользователя установить флаг согласия на рекламу

**Пример (Python/FastAPI):**
```python
from pydantic import BaseModel

class VkIdExchangeRequest(BaseModel):
    code: str
    deviceId: str
    codeVerifier: str
    marketingConsent: bool = False  # <-- Новое поле

@router.post("/api/v1/auth/oauth/vk-id/exchange")
async def vk_id_exchange(
    request: VkIdExchangeRequest,
    user_ip: str = Header(..., alias="x-user-ip")
):
    # Обменять code на токен через VK ID API
    token_data = await exchange_vk_id_code(
        code=request.code,
        device_id=request.deviceId,
        code_verifier=request.codeVerifier
    )
    
    # Получить информацию о пользователе
    user_info = await get_vk_id_user_info(token_data["id_token"])
    
    # Создать/обновить пользователя
    user = await create_or_update_user(
        provider="vk_id",
        provider_id=user_info["user_id"],
        name=user_info.get("name"),
        email=user_info.get("email"),
        marketing_consent=request.marketingConsent  # <-- Использовать флаг
    )
    
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "avatarId": user.avatar_id,
        "tokens": user.tokens,
        "tokensUsedAsAnon": user.tokens_used_as_anon,
        "isAuthorized": True
    }
```

---

## 3. Изменения в модели пользователя

### Добавление поля в базу данных

Необходимо добавить поле для хранения согласия на рекламную рассылку:

**SQL (миграция):**
```sql
ALTER TABLE users 
ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE;

-- Индекс для быстрого поиска пользователей с согласием
CREATE INDEX idx_users_marketing_consent ON users(marketing_consent) 
WHERE marketing_consent = TRUE;
```

**Пример модели (Python/SQLAlchemy):**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=True)
    marketing_consent = Column(Boolean, default=False, nullable=False)  # <-- Новое поле
    # ... остальные поля
```

---

## 4. Функция создания/обновления пользователя

**Пример:**
```python
async def create_or_update_user(
    provider: str,
    provider_id: str,
    email: Optional[str] = None,
    name: Optional[str] = None,
    marketing_consent: bool = False  # <-- Новый параметр
) -> User:
    # Найти существующего пользователя по provider_id
    user = await db.query(User).filter(
        User.provider == provider,
        User.provider_id == provider_id
    ).first()
    
    if user:
        # Обновить существующего пользователя
        user.email = email or user.email
        user.name = name or user.name
        user.marketing_consent = marketing_consent  # <-- Обновить флаг
        user.is_authorized = True
        await db.commit()
        return user
    else:
        # Создать нового пользователя
        user = User(
            id=generate_uuid(),
            provider=provider,
            provider_id=provider_id,
            email=email,
            name=name,
            marketing_consent=marketing_consent,  # <-- Установить флаг
            is_authorized=True,
            tokens=5,  # Начальные токены
            avatar_id=random.randint(1, 5)
        )
        db.add(user)
        await db.commit()
        return user
```

---

## 5. Дополнительные рекомендации

### Валидация

- `marketing_consent` должен быть boolean или отсутствовать (по умолчанию `false`)
- Не блокировать авторизацию, если флаг не передан (обратная совместимость)

### Логирование

Рекомендуется логировать согласие на рекламу для аудита:
```python
logger.info(
    f"User {user.id} marketing consent: {marketing_consent}",
    extra={"user_id": user.id, "marketing_consent": marketing_consent}
)
```

### API для управления согласием

Можно добавить отдельный эндпоинт для изменения согласия:
```python
@router.patch("/api/v1/user/marketing-consent")
async def update_marketing_consent(
    marketing_consent: bool,
    user: User = Depends(get_current_user)
):
    user.marketing_consent = marketing_consent
    await db.commit()
    return {"marketing_consent": user.marketing_consent}
```

---

## 6. Тестирование

### Тест-кейсы

1. **Яндекс OAuth с согласием:**
   - `GET /api/v1/auth/oauth/yandex/login?marketing_consent=true`
   - Проверить, что флаг сохраняется в state
   - Проверить, что после callback пользователь создан с `marketing_consent=true`

2. **Яндекс OAuth без согласия:**
   - `GET /api/v1/auth/oauth/yandex/login`
   - Проверить, что пользователь создан с `marketing_consent=false`

3. **VK ID с согласием:**
   - `POST /api/v1/auth/oauth/vk-id/exchange` с `marketingConsent: true`
   - Проверить, что пользователь создан/обновлен с `marketing_consent=true`

4. **VK ID без согласия:**
   - `POST /api/v1/auth/oauth/vk-id/exchange` без поля `marketingConsent`
   - Проверить, что пользователь создан с `marketing_consent=false` (по умолчанию)

---

## 7. Обратная совместимость

- Если `marketing_consent` не передан, использовать значение по умолчанию `false`
- Существующие пользователи без поля должны иметь `marketing_consent=false`
- Не ломать существующий OAuth flow, если флаг отсутствует

---

## Резюме изменений

1. ✅ Добавить обработку `marketing_consent` query параметра в `/api/v1/auth/oauth/yandex/login`
2. ✅ Сохранить флаг в state/сессии для передачи в callback
3. ✅ Добавить поле `marketingConsent` в body запроса `/api/v1/auth/oauth/vk-id/exchange`
4. ✅ Добавить поле `marketing_consent` в модель пользователя (БД)
5. ✅ Обновить функцию создания/обновления пользователя для сохранения флага
6. ✅ Обеспечить обратную совместимость (по умолчанию `false`)

