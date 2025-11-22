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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Dialog from '@mui/material/Dialog';
import AuthDialog from '@/components/AuthDialog';
import { useAtom } from 'jotai';
import { userAtom, userLightningBalanceAtom } from '@/state/user';
import logoPng from '@/assets/gdz-logo.jpg';

const subjects = [
	{ label: 'Математика', href: '/mathematics' },
	{ label: 'Русский язык', href: '/russian-language' },
	{ label: 'Физика', href: '/physics' },
	{ label: 'Химия', href: '/chemistry' },
	{ label: 'Биология', href: '/biology' },
	{ label: 'География', href: '/geography' },
	{ label: 'История', href: '/history' },
	{ label: 'Обществознание', href: '/social-science' },
	{ label: 'Информатика', href: '/computer-science' },
	{ label: 'Литература', href: '/literature' },
];

export default function Header() {
	const [user, setUser] = useAtom(userAtom);
	const [balance] = useAtom(userLightningBalanceAtom);
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [authOpen, setAuthOpen] = useState(false);
	const [topUpOpen, setTopUpOpen] = useState(false);

	const initials = useMemo(() => (user?.name ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('') : 'U'), [user?.name]);

	return (
		<AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
			<Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
				<Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
						<Image src={logoPng} alt="Логотип ГДЗ по фото" width={28} height={28} priority />
						<Typography variant="h6" sx={{ fontWeight: 800 }}>гдз-по-фото.рф</Typography>
					</Box>
				</Link>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, flexWrap: 'wrap' }}>
					<Button
						color="inherit"
						endIcon={<KeyboardArrowDownIcon />}
						onClick={(e) => setMenuAnchor(e.currentTarget)}
					>
						Предметы
					</Button>
					<Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
						{subjects.map((s) => (
							<MenuItem key={s.href} component={Link as any} href={s.href} onClick={() => setMenuAnchor(null)}>
								{s.label}
							</MenuItem>
						))}
					</Menu>
				</Box>

				<Box sx={{ flexGrow: 1 }} />

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => setTopUpOpen(true)}
						startIcon={<AddIcon />}
					>
						Баланс ответов: {balance}
					</Button>

					{!user?.id && (
						<Button color="primary" variant="contained" onClick={() => setAuthOpen(true)}>
							Вход или регистрация
						</Button>
					)}

					{user?.id && (
						<IconButton size="small">
							<Avatar sx={{ width: 28, height: 28 }} src={user.avatarUrl || undefined}>
								{initials}
							</Avatar>
						</IconButton>
					)}
				</Box>

				<AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
				<Dialog open={topUpOpen} onClose={() => setTopUpOpen(false)} maxWidth="xs" fullWidth>
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Пополнение баланса</Typography>
						<Typography color="text.secondary">Модалка пополнения будет реализована позже.</Typography>
						<Box sx={{ textAlign: 'right', mt: 2 }}>
							<Button onClick={() => setTopUpOpen(false)}>Закрыть</Button>
						</Box>
					</Box>
				</Dialog>
			</Toolbar>
		</AppBar>
	);
}