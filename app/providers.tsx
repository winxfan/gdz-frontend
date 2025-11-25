'use client';

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Provider as JotaiProvider, useAtom, useSetAtom } from 'jotai';
import { userAtom, userIpAtom } from '@/state/user';
import { useEffect } from 'react';
import { avatarUrlById } from '@/components/avatar/images';
import { API_BASE } from './config';

function UserBootstrap() {
	const setIp = useSetAtom(userIpAtom);
	const [user, setUser] = useAtom(userAtom);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				// Получаем IP пользователя и сохраняем в store (и localStorage через атом)
				const res = await fetch('https://api.ipify.org?format=json');
				const data = (await res.json()) as { ip?: string };
				if (!cancelled) {
					const ip = data?.ip;
					if (ip) {
						setIp(ip);
						// Дублируем IP в cookie (для кросс-валидации на backend)
						try {
							document.cookie = `user_ip=${ip}; path=/; max-age=${60 * 60 * 24 * 30}`;
						} catch {}
					}
				}
			} catch {
				// игнорируем ошибки получения IP
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setIp]);

	// Авторизация анонима на backend (создание/получение пользователя по IP)
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				// Ждём появления IP
				if (!user?.ip) return;
				const res = await fetch(`${API_BASE}/api/v1/auth-user`, {
					method: 'POST',
					headers: {
						'x-user-ip': user.ip,
						'content-type': 'application/json',
					},
					credentials: 'include',
				});
				if (!res.ok) return;
				const payload = await res.json() as {
					id: string;
					username: string;
					avatarId: number;
					tokens?: number;
					tokensUsedAsAnon?: number;
					isAuthorized?: boolean;
				};
				if (cancelled) return;
				const next = {
					...user,
					id: payload.id,
					username: payload.username,
					avatarId: payload.avatarId,
					avatarUrl: avatarUrlById(payload.avatarId),
					tokens: payload.tokens,
					tokensUsedAsAnon: payload.tokensUsedAsAnon,
					isAuthorized: Boolean(payload.isAuthorized),
				};
				setUser(next);
			} catch {
				// игнорируем, UI покажет анонимный фолбэк
			}
		})();
		return () => {
			cancelled = true;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.ip]);
	return null;
}

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<JotaiProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<UserBootstrap />
				{children}
			</ThemeProvider>
		</JotaiProvider>
	);
}


