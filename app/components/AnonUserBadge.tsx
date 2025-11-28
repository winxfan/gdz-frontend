'use client';

import Skeleton from '@mui/material/Skeleton';
import AvatarBadge from '@/components/avatar/AvatarBadge';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/state/user';
import { avatarUrlById } from '@/components/avatar/images';
import ButtonBase from '@mui/material/ButtonBase';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function AnonUserBadge({ onOpenAuth }: { onOpenAuth?: () => void }) {
	const user = useAtomValue(userAtom);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const username = user?.username;
	const avatarUrl = user?.avatarId ? avatarUrlById(user.avatarId) : undefined;

	if (!username || !avatarUrl) {
		return <Skeleton variant="rectangular" width={140} height={28} sx={{ borderRadius: 1 }} />;
	}

	return (
		<ButtonBase
			onClick={onOpenAuth}
			sx={{ borderRadius: 2, px: 1, py: 0.5 }}
			aria-label="Открыть окно авторизации"
		>
			<AvatarBadge avatarUrl={avatarUrl} displayName={isMobile ? '' : username} size={28} />
		</ButtonBase>
	);
}


