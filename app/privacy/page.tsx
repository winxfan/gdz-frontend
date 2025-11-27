'use client';

import { Container, Typography, Box } from '@mui/material';

export default function PrivacyPage() {
	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="md">
					<Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
						Политика конфиденциальности
					</Typography>
					<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
						Дата вступления в силу: 27.11.2025
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						1. Общие положения
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Настоящая Политика конфиденциальности (далее — «Политика») описывает, какие данные собирает и как использует сайт «гдз‑по‑фото.рф» (https://гдз-по-фото.рф, далее — «Сервис»), предназначенный для получения решения задач по фотографии. Политика применяется ко всем посетителям и пользователям Сервиса.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Контакты для вопросов по данным и поддержке: hello@гдз-по-фото.рф.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						2. Описание сервиса
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Сервис предоставляет пользователю возможность: сделать фото задачи → загрузить на сайт → получить мгновенное решение. Доступно до 3 бесплатных решений: 1 — для анонимных пользователей и 2 — для авторизованных. Внутренняя валюта — «молнии». По умолчанию пользователю начисляется 5 молний. Дополнительно молнии (токены) можно приобретать за российские рубли по тарифам, указанным ниже.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						3. Какие данные мы собираем
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Загружаемые изображения задач (фотографии, скриншоты).</Typography>
						<Typography component="li">Идентификатор авторизации на основе IP‑адреса (для учёта лимитов и предотвращения злоупотреблений). На сервер по защищённому каналу отправляется POST‑запрос, содержащий поле IP‑адреса; сервер возвращает количество токенов/молний.</Typography>
						<Typography component="li">Технические данные: cookies, сведения о браузере и устройстве, часовой пояс, дата и время запросов, сведения об ошибках (для функционирования и улучшения работы Сервиса).</Typography>
						<Typography component="li">Платёжные метаданные (статус, сумма, идентификатор операции, время) — без хранения платёжных реквизитов. Оплата осуществляется через платёжного провайдера.</Typography>
						<Typography component="li">Операционные данные по балансу и расходованию молний/токенов (история начислений/списаний).</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						4. Цели обработки данных
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Оказание услуг Сервиса: приём и обработка изображения, генерация решения и объяснений.</Typography>
						<Typography component="li">Авторизация пользователя по IP‑адресу, защита лимитов и предотвращение злоупотреблений/махинаций.</Typography>
						<Typography component="li">Учёт токенов/молний, тарификация и обработка платежей.</Typography>
						<Typography component="li">Поддержка, связь по инцидентам и улучшение качества Сервиса.</Typography>
						<Typography component="li">Выполнение требований законодательства (в т. ч. бухгалтерский и налоговый учёт).</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						5. Правовые основания
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Обработка осуществляется на основаниях: (а) согласия пользователя; (б) необходимости исполнения договора (оказание услуг Сервиса); (в) исполнения требований закона; (г) законных интересов Сервиса (обеспечение работоспособности и безопасности).
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						6. Хранение и удаление
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Изображения задач хранятся необходимое время для оказания услуги и обеспечения качества/повторного доступа (если доступ предусмотрен), после чего удаляются либо обезличиваются, если нет иной правовой необходимости хранения.</Typography>
						<Typography component="li">Платёжные метаданные и бухгалтерские документы хранятся в сроки, установленные законом.</Typography>
						<Typography component="li">Идентификатор, связанный с IP‑адресом, хранится в объёме и сроках, необходимых для соблюдения лимитов, предотвращения злоупотреблений и защиты Сервиса.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						7. Передача третьим лицам
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Данные могут передаваться:
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">платёжным провайдерам (для приёма оплат);</Typography>
						<Typography component="li">хостинг‑/облачным провайдерам (для размещения и обработки данных в рамках оказания услуги);</Typography>
						<Typography component="li">уполномоченным органам в случаях, предусмотренных законом.</Typography>
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Мы не продаём персональные данные и не передаём их в маркетинговых целях без отдельного согласия.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						8. Cookies и аналитика
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Сервис может использовать cookies и похожие технологии для авторизации, сохранения настроек, аналитики и улучшения интерфейса. Вы можете ограничить cookies в настройках браузера — это может повлиять на работу Сервиса.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						9. Безопасность
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Мы применяем необходимые организационные и технические меры для защиты данных от неправомерного доступа, изменения, раскрытия или уничтожения. Абсолютная безопасность при передаче данных через Интернет не может быть гарантирована.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						10. Права пользователя
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Вы вправе запросить сведения об обработке своих данных, требовать их уточнения, блокирования или уничтожения, отзывать согласие, а также обжаловать действия Сервиса. Запросы направляйте на hello@гдз-по-фото.рф. Срок ответа — до 30 календарных дней.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						11. Локализация и трансграничная передача
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Обработка и хранение данных граждан РФ осуществляется с использованием баз данных на территории РФ. При необходимости трансграничной передачи (например, использования зарубежных облаков) мы обеспечиваем соблюдение требований 152‑ФЗ и осуществляем передачу при наличии достаточных гарантий защиты или вашего согласия.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						12. Токены («молнии») и тарифы
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Внутренняя валюта — «молнии» (токены). По умолчанию пользователю даётся 5 молний.</Typography>
						<Typography component="li" sx={{ mb: 1 }}>
							Тарифы покупки токенов:
							<Typography component="ul" sx={{ pl: 3, mt: 1 }}>
								<Typography component="li">10 токенов — 76 рублей;</Typography>
								<Typography component="li">31 токен — 173 рубля;</Typography>
								<Typography component="li">150 токенов — 705 рублей.</Typography>
							</Typography>
						</Typography>
						<Typography component="li">Токены можно тратить на: (а) получение решения по фото; (б) получение подробного объяснения задачи.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						13. Изменения Политики
					</Typography>
					<Typography color="text.secondary">
						Мы можем обновлять Политику. Актуальная версия публикуется на этой странице и вступает в силу с момента публикации.
					</Typography>
				</Container>
			</Box>
		</main>
	);
}


