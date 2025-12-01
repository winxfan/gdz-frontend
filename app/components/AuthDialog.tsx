'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { API_BASE } from '../config';
import VkLogo from '@/assets/vk_logo.svg';
import YandexLogo from '@/assets/yandex_logo.svg';
import GoogleLogo from '@/assets/google_logo.svg';
import { useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import { avatarUrlById } from '@/components/avatar/images';

function ProviderAvatar({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <Avatar sx={{ width: 28, height: 28, bgcolor: bg, color, fontWeight: 800, fontSize: 14 }}>{label}</Avatar>
  );
}

function asUrl(mod: any): string {
  return typeof mod === 'string' ? mod : (mod && typeof mod.src === 'string' ? mod.src : '');
}

// Минимальные типы VK ID SDK для строгой типизации
declare global {
  interface Window {
    VKIDSDK?: VKIDSDK;
  }
}
type VKIDSDK = {
  Config: {
    init(config: {
      app: number;
      redirectUrl: string;
      responseMode: any;
      scope?: string;
      codeChallenge?: string;
      codeChallengeMethod?: any;
      state?: string;
      source?: any;
    }): void;
  };
  ConfigResponseMode: { Callback: any };
  WidgetEvents: { ERROR: string };
  OneTapInternalEvents: { LOGIN_SUCCESS: string };
  OneTap: new () => {
    render(params: { container: HTMLElement | null; showAlternativeLogin?: boolean }): {
      on(event: string, cb: (payload: any) => void): any;
    };
  };
  Auth: {
    login(): void;
  };
};

// PKCE helpers
const PKCE_ALLOWED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
function generateRandomString(length: number): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += PKCE_ALLOWED[arr[i] % PKCE_ALLOWED.length];
  }
  return result;
}
async function sha256(input: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  return await crypto.subtle.digest('SHA-256', enc.encode(input));
}
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
  const verifier = generateRandomString(64);
  const digest = await sha256(verifier);
  const challenge = base64UrlEncode(digest);
  return { verifier, challenge };
}

// Настройки VK ID
const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_APP_ID || 0);
const VK_REDIRECT_URL = `${API_BASE}/api/v1/auth/oauth/vk/callback`;

export default function AuthDialog({ open: forcedOpen, onClose }: { open?: boolean; onClose?: () => void } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [user, setUser] = useAtom(userAtom);

  const open = useMemo(() => {
    if (typeof forcedOpen === 'boolean') return forcedOpen;
    const q = searchParams.get('auth');
    return q === 'true' || q === '1' || q === '';
  }, [forcedOpen, searchParams]);

  const close = () => {
    if (onClose) return onClose();
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('auth');
    router.replace(`${pathname}?${params.toString() ?? ''}`);
  };

  const oauth = (provider: 'vk' | 'yandex' | 'google') => {
    window.location.href = `${API_BASE}/api/v1/auth/oauth/${provider}/login`;
  };

  const oneTapContainerRef = useRef<HTMLDivElement | null>(null);
  const pkceStateRef = useRef<{ verifier: string; state: string } | null>(null);
  const sdkRef = useRef<VKIDSDK | null>(null);

  const ensureVkidSdk = useCallback(async (): Promise<VKIDSDK | null> => {
    if (typeof window === 'undefined') return null;
    if (window.VKIDSDK) return window.VKIDSDK;
    return await new Promise<VKIDSDK | null>((resolve) => {
      const existing = document.getElementById('vkid-sdk');
      if (existing) {
        const interval = setInterval(() => {
          if (window.VKIDSDK) {
            clearInterval(interval);
            resolve(window.VKIDSDK);
          }
        }, 50);
        setTimeout(() => {
          clearInterval(interval);
          resolve(window.VKIDSDK || null);
        }, 10000);
        return;
      }
      const script = document.createElement('script');
      script.id = 'vkid-sdk';
      script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
      script.async = true;
      script.onload = () => resolve(window.VKIDSDK || null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }, []);

  const initVkidConfig = useCallback(async () => {
    if (!sdkRef.current) return false;
    if (!VK_APP_ID) {
      console.warn('VK ID: отсутствует NEXT_PUBLIC_VK_APP_ID');
      return false;
    }
    const { verifier, challenge } = await createPkcePair();
    const state = generateRandomString(48);
    pkceStateRef.current = { verifier, state };
    try {
      sdkRef.current.Config.init({
        app: VK_APP_ID,
        redirectUrl: VK_REDIRECT_URL,
        responseMode: sdkRef.current.ConfigResponseMode.Callback,
        scope: 'vkid.personal_info',
        codeChallenge: challenge,
        codeChallengeMethod: 'S256',
        state,
      });
      return true;
    } catch (e) {
      console.error('VK ID init error', e);
      return false;
    }
  }, []);

  const exchangeCode = useCallback(
    async (code: string, deviceId: string) => {
      if (!user?.ip) {
        throw new Error('Не удалось получить IP пользователя');
      }
      const codeVerifier = pkceStateRef.current?.verifier;
      if (!codeVerifier) {
        throw new Error('PKCE verifier отсутствует');
      }
      const res = await fetch(`${API_BASE}/api/v1/auth/oauth/vk-id/exchange`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-user-ip': user.ip,
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          deviceId,
          codeVerifier,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(detail || `Ошибка обмена кода (${res.status})`);
      }
      const payload = (await res.json()) as {
        id: string;
        name?: string;
        username: string;
        avatarId: number;
        tokens?: number;
        tokensUsedAsAnon?: number;
        isAuthorized?: boolean;
      };
      const next = {
        ...user,
        id: payload.id,
        name: payload.name,
        username: payload.username,
        avatarId: payload.avatarId,
        avatarUrl: avatarUrlById(payload.avatarId),
        tokens: payload.tokens,
        tokensUsedAsAnon: payload.tokensUsedAsAnon,
        isAuthorized: true,
      };
      setUser(next);
      close();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.ip, setUser],
  );

  const handleLoginSuccess = useCallback(
    async (payload: any) => {
      try {
        const expected = pkceStateRef.current?.state;
        const gotState = payload?.state;
        if (expected && gotState && expected !== gotState) {
          throw new Error('Некорректный state');
        }
        const code = payload?.code as string;
        const deviceId = payload?.device_id as string;
        if (!code || !deviceId) {
          throw new Error('Некорректные данные VK ID');
        }
        await exchangeCode(code, deviceId);
      } catch (e) {
        console.error(e);
        alert('Не удалось выполнить вход через VK ID. Попробуйте еще раз.');
      }
    },
    [exchangeCode],
  );

  const renderOneTap = useCallback(() => {
    if (!sdkRef.current || !oneTapContainerRef.current) return;
    try {
      const widget = new sdkRef.current.OneTap();
      widget
        .render({ container: oneTapContainerRef.current, showAlternativeLogin: true })
        .on(sdkRef.current.WidgetEvents.ERROR, () => {
          // показывать не будем, но залогируем
          console.warn('VK ID OneTap: ошибка виджета');
        })
        .on(sdkRef.current.OneTapInternalEvents.LOGIN_SUCCESS, handleLoginSuccess);
    } catch (e) {
      console.error('VK ID OneTap render error', e);
    }
  }, [handleLoginSuccess]);

  const vkLogin = useCallback(async () => {
    try {
      sdkRef.current = await ensureVkidSdk();
      if (!sdkRef.current) {
        alert('Не удалось загрузить VK ID SDK');
        return;
      }
      const ok = await initVkidConfig();
      if (!ok) return;
      if (sdkRef.current.Auth?.login) {
        sdkRef.current.Auth.login();
      }
    } catch (e) {
      console.error(e);
      alert('Не удалось открыть окно VK ID');
    }
  }, [ensureVkidSdk, initVkidConfig]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!open) return;
      sdkRef.current = await ensureVkidSdk();
      if (!sdkRef.current) return;
      const ok = await initVkidConfig();
      if (!ok || cancelled) return;
      renderOneTap();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={!!open} onClose={close} fullWidth maxWidth="xs">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2, textAlign: 'center' }}>
            <div>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Вход или регистрация</Typography>
          <Typography variant="body2" sx={{ fontWeight: 400 }}>
                Получите доступ к быстрому решению задач по фото.
            </Typography>
            </div>
          <IconButton onClick={close} size="small" aria-label="Закрыть">
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={1.5}>
          <Box ref={oneTapContainerRef} sx={{ mb: 0.5 }} />

          <Button onClick={vkLogin} variant="text" color="inherit" sx={{
            justifyContent: 'flex-start',
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 18,
            fontWeight: 600,
            color: 'text.primary',
            px: 2,
            gap: 1.5,
          }}
            startIcon={<Avatar src={asUrl(VkLogo)} sx={{ width: 28, height: 28, bgcolor: 'transparent' }} />}
          >
            VK ID
          </Button>

          <Button onClick={() => oauth('yandex')} variant="text" color="inherit" sx={{
            justifyContent: 'flex-start',
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 18,
            fontWeight: 600,
            color: 'text.primary',
            px: 2,
            gap: 1.5,
          }}
            startIcon={<Avatar src={asUrl(YandexLogo)} sx={{ width: 28, height: 28, bgcolor: 'transparent' }} />}
          >
            Яндекс
          </Button>

          {/* <Button onClick={() => oauth('google')} variant="text" color="inherit" sx={{
            justifyContent: 'flex-start',
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 18,
            fontWeight: 600,
            color: 'text.primary',
            px: 2,
            gap: 1.5,
          }}
            startIcon={<Avatar src={asUrl(GoogleLogo)} sx={{ width: 28, height: 28, bgcolor: 'transparent' }} />}
          >
            Google
          </Button> */}

        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Продолжая, вы даёте{' '}
          <a href="#" style={{ color: 'inherit' }}>согласие</a>{' '}на обработку{' '}
          <a href="#" style={{ color: 'inherit' }}>персональных данных</a>{' '}и
          {' '}соглашаетесь с{' '}<a href="#" style={{ color: 'inherit' }}>офертой</a>.
        </Typography>
      </Box>
    </Dialog>
  );
}


