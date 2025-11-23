'use client';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { userLightningBalanceAtom } from '@/state/user';
import BoltIcon from '@mui/icons-material/Bolt';
import { ReactNode } from 'react';

export type EnergyPack = {
	id: string;
	amount: number; // количество молний (валюта)
	priceRub: number; // цена в рублях
	bonusPercent?: number; // бонус в процентах
	buttonLabel?: ReactNode;
};

export type TopUpDialogProps = {
	open: boolean;
	onClose: () => void;
	onBuy?: (pack: EnergyPack) => void;
	packs?: EnergyPack[];
};

const defaultPacks: EnergyPack[] = [
	{ id: 'p100', amount: 100, priceRub: 140 },
	{ id: 'p240', amount: 240, priceRub: 290, bonusPercent: 15 },
	{ id: 'p450', amount: 450, priceRub: 480, bonusPercent: 25 },
	{ id: 'p1700', amount: 1700, priceRub: 1440, bonusPercent: 40 },
];

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export default function TopUpDialog(props: TopUpDialogProps) {
	const [balance] = useAtom(userLightningBalanceAtom);
	const { open, onClose, onBuy, packs = defaultPacks } = props;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<Box sx={{ p: { xs: 2, sm: 3 } }}>
				<Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
					Ваш баланс: ⚡ {balance}
				</Typography>

				<Box sx={{ mt: { xs: 1, sm: 2 } }}>
					{packs.map((pack, index) => (
						<Box key={pack.id}>
							<Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
								<Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', width: 56, height: 56 }}>
									<BoltIcon />
								</Avatar>

								<Box sx={{ flexGrow: 1 }}>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										⚡ +{pack.amount}
									</Typography>
									{pack.bonusPercent ? (
										<Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
											Бонус {pack.bonusPercent}%
										</Typography>
									) : null}
								</Box>

								<Button
									variant="contained"
									color="error"
									onClick={() => onBuy?.(pack)}
									sx={{
										borderRadius: 999,
										px: 3,
										py: 1.25,
										textTransform: 'none',
										fontWeight: 800,
										whiteSpace: 'nowrap',
									}}
								>
									{pack.buttonLabel ?? `Купить за ${rub.format(pack.priceRub)}`}
								</Button>
							</Stack>
							{index < packs.length - 1 && <Divider />}
						</Box>
					))}
				</Box>

				<Box sx={{ textAlign: 'center', mt: 2 }}>
					<Button variant="text" color="error" onClick={onClose} sx={{ fontWeight: 700 }}>
						История действий
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}


