'use client';

import Skeleton from '@mui/material/Skeleton';
import AvatarBadge from '@/components/avatar/AvatarBadge';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/state/user';
import { avatarUrlById } from '@/components/avatar/images';

export default function AnonUserBadge() {
	const user = useAtomValue(userAtom);

	const username = user?.username;
	const avatarUrl = user?.avatarId ? avatarUrlById(user.avatarId) : undefined;

	if (!username || !avatarUrl) {
		return <Skeleton variant="rectangular" width={140} height={28} sx={{ borderRadius: 1 }} />;
	}

	return <AvatarBadge avatarUrl={avatarUrl} displayName={username} size={28} />;
}


