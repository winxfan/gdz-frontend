'use client';

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Provider as JotaiProvider, useSetAtom } from 'jotai';
import { userIpAtom } from '@/state/user';
import { useEffect } from 'react';

function UserBootstrap() {
	const setIp = useSetAtom(userIpAtom);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				// Получаем IP пользователя и сохраняем в store (и localStorage через атом)
				const res = await fetch('https://api.ipify.org?format=json');
				const data = (await res.json()) as { ip?: string };
				if (!cancelled) setIp(data?.ip);
			} catch {
				// игнорируем ошибки получения IP
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setIp]);
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


