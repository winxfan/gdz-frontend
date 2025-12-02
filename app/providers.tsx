'use client';

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Provider as JotaiProvider, useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import { useEffect } from 'react';
import { avatarUrlById } from '@/components/avatar/images';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { authUser } from './utils/api';

// Создаем QueryClient с настройками по умолчанию
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 минут
		},
	},
});

function UserBootstrap() {
	const [user, setUser] = useAtom(userAtom);

	// Авторизация анонима на backend (создание/получение пользователя)
	const { data: userData } = useQuery({
		queryKey: ['auth-user'],
		queryFn: authUser,
		enabled: !user?.id, // Запрашиваем только если пользователь еще не авторизован
		retry: false,
	});

	useEffect(() => {
		if (userData && userData.id !== user?.id) {
			setUser((prev) => ({
				...prev,
				id: userData.id,
				username: userData.username,
				avatarId: userData.avatarId,
				avatarUrl: avatarUrlById(userData.avatarId),
				tokens: userData.tokens,
				tokensUsedAsAnon: userData.tokensUsedAsAnon,
				isAuthorized: Boolean(userData.isAuthorized),
				isHaveEmail: Boolean(userData.isHaveEmail),
			}));
		}
	}, [userData, setUser, user?.id]);

	return null;
}

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<JotaiProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<UserBootstrap />
					{children}
				</ThemeProvider>
			</JotaiProvider>
		</QueryClientProvider>
	);
}


