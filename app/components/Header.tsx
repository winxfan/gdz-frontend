 'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import AuthDialog from '@/components/AuthDialog';
import { useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import logoPng from '@/assets/gdz-logo.jpg';
import BalanceButton from '@/components/BalanceButton';
import TopUpDialog from '@/components/TopUpDialog';
import AnonUserBadge from '@/components/AnonUserBadge';
import AvatarBadge from '@/components/avatar/AvatarBadge';
import { avatarUrlById } from '@/components/avatar/images';

export default function Header() {
	const [user, setUser] = useAtom(userAtom);
	const [authOpen, setAuthOpen] = useState(false);
	const [topUpOpen, setTopUpOpen] = useState(false);

	const display = user?.name || user?.username || '';
	const initials = useMemo(() => (display ? display.split(' ').map((p) => p[0]).slice(0, 2).join('') : 'U'), [display]);

	return (
		<AppBar position="fixed" color="default" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
			<Toolbar sx={{ gap: { xs: 0, sm: 2 }, flexWrap: 'nowrap', overflowX: 'auto' }}>
				<Link href="/" style={{ textDecoration: 'none', color: '#e55f5f' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
						<Box sx={{ display: { xs: 'none', sm: 'flex', alignItems: 'center' } }}>
							<Image src={logoPng} alt="Логотип ГДЗ по фото" width={28} height={28} priority />
						</Box>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 800,
								whiteSpace: { xs: 'normal', sm: 'nowrap' },
								maxWidth: { xs: 100, sm: 'none' },
								overflowWrap: 'break-word',
								fontSize: { xs: '0.92rem', sm: '1.15rem', md: '1.25rem' },
								lineHeight: { xs: 1.1, sm: 1.2 },
								display: 'block',
							}}
						>
							гдз-по-фото.рф
						</Typography>
					</Box>
				</Link>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, flexWrap: 'nowrap', minWidth: 0 }} />

				<Box sx={{ flexGrow: 1 }} />

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
					<BalanceButton onClick={() => setTopUpOpen(true)} />
					<Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />

					{!user?.isAuthorized && <AnonUserBadge onOpenAuth={() => setAuthOpen(true)} />}

					{user?.isAuthorized && (
						<AvatarBadge
							avatarUrl={user.avatarUrl || (user.avatarId ? avatarUrlById(user.avatarId) : '')}
							displayName={user.name || user.username || ''}
							size={28}
						/>
					)}
				</Box>

				<AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
				<TopUpDialog open={topUpOpen} onClose={() => setTopUpOpen(false)} />
			</Toolbar>
		</AppBar>
	);
}