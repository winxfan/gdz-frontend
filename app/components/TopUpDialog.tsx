'use client';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai';
import { userLightningBalanceAtom } from '@/state/user';
import { ReactNode } from 'react';
import Image, { StaticImageData } from 'next/image';
import tariff1 from '@/assets/tariff1.png';
import tariff2 from '@/assets/tariff2.jpg';
import tariff3 from '@/assets/tariff3.jpg';
import CloseIcon from '@mui/icons-material/Close';

export type EnergyPack = {
	id: string;
	title?: string;
	amount: number; // базовое количество 
	priceRub: number; // цена в рублях
	bonusPercent?: number; // бонус в процентах (если указан, bonusAmount игнорируется)
	bonusAmount?: number; // фиксированный бонус в 
	benefitPercent?: number; // выгода относительно базовой цены
	image?: StaticImageData;
	buttonLabel?: ReactNode;
};

export type TopUpDialogProps = {
	open: boolean;
	onClose: () => void;
	onBuy?: (pack: EnergyPack) => void;
	packs?: EnergyPack[];
};

const defaultPacks: EnergyPack[] = [
	{ id: 'start', title: 'Старт', amount: 10, priceRub: 76, bonusAmount: 0, benefitPercent: 0, image: tariff1 },
	{ id: 'opt', title: '🔥 Оптим', amount: 25, priceRub: 173, bonusAmount: 6, benefitPercent: 25, image: tariff2 },
	{ id: 'max', title: '🔥 Максимум', amount: 100, priceRub: 704, bonusAmount: 50, benefitPercent: 50, image: tariff3 },
];

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export default function TopUpDialog(props: TopUpDialogProps) {
	const [balance] = useAtom(userLightningBalanceAtom);
	const { open, onClose, onBuy, packs = defaultPacks } = props;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
				<IconButton
					aria-label="Закрыть"
					onClick={onClose}
					sx={{ position: 'absolute', top: 8, right: 8 }}
					color="primary"
				>
					<CloseIcon />
				</IconButton>
				<Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
					Ваш баланс: ⚡ {balance}
				</Typography>

				<Box sx={{ mt: { xs: 1, sm: 2 } }}>
					{packs.map((pack, index) => (
						<Box key={pack.id}>
							<Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
								<Box
									sx={{
										width: 56,
										height: 56,
										borderRadius: 2,
										overflow: 'hidden',
										bgcolor: 'primary.light',
										flexShrink: 0,
									}}
								>
									{pack.image ? (
										<Image src={pack.image} alt={pack.title ?? 'Пакет энергии'} width={56} height={56} />
									) : null}
								</Box>

								<Box sx={{ flexGrow: 1 }}>
									{pack.title ? (
										<Typography variant="h6" sx={{ fontWeight: 800 }}>
											{pack.title}
										</Typography>
									) : null}
									<Typography variant="body1" sx={{ fontWeight: 700 }}>
										⚡ {pack.amount} {(pack.bonusAmount ?? 0) > 0 ? ` + ⚡ ${pack.bonusAmount} в подарок` : ''}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Всего: {pack.amount + (pack.bonusAmount ?? Math.round(pack.amount * ((pack.bonusPercent ?? 0) / 100)))} 
										{pack.benefitPercent ? ` • Бонус ${pack.benefitPercent}%` : ''}
									</Typography>
								</Box>

								<Button
									variant="contained"
									color="primary"
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
					<Button variant="text" color="primary" onClick={onClose} sx={{ fontWeight: 700 }}>
						История действий
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}


