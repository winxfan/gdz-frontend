'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export type AvatarBadgeProps = {
	avatarUrl: string;
	displayName: string;
	size?: number;
};

export default function AvatarBadge({ avatarUrl, displayName, size = 28 }: AvatarBadgeProps) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Avatar
				alt={displayName}
				src={avatarUrl}
				sx={{ width: size, height: size, border: '1px solid', borderColor: 'divider' }}
				imgProps={{ loading: 'lazy', referrerPolicy: 'no-referrer' }}
			>
				{/* MUI Avatar автоматически покажет fallback, если картинка не загрузится */}
			</Avatar>
			<Tooltip title={displayName}>
				<Typography
					variant="subtitle2"
					noWrap
					sx={{ fontWeight: 700, letterSpacing: 0.2, maxWidth: 180, color: 'text.primary' }}
				>
					{displayName}
				</Typography>
			</Tooltip>
		</Box>
	);
}


