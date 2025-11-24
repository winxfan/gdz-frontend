'use client';

import Skeleton from '@mui/material/Skeleton';
import AvatarBadge from '@/components/avatar/AvatarBadge';
import { useAvatarInfo } from '@/components/avatar/useAvatarInfo';

export default function AnonUserBadge() {
	const { data, loading } = useAvatarInfo();

	if (loading || !data) {
		return <Skeleton variant="rectangular" width={140} height={28} sx={{ borderRadius: 1 }} />;
	}

	return <AvatarBadge avatarUrl={data.avatarUrl} displayName={data.displayName} size={28} />;
}


