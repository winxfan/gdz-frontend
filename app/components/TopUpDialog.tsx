'use client';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/state/user';
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
	description?: string;
	buttonLabel?: ReactNode;
};

export type TopUpDialogProps = {
	open: boolean;
	onClose: () => void;
	onBuy?: (pack: EnergyPack) => void;
	packs?: EnergyPack[];
};

const defaultPacks: EnergyPack[] = [
	{
		id: 'start',
		title: 'Старт',
		amount: 10,
		priceRub: 76,
		bonusAmount: 0,
		benefitPercent: 0,
		image: tariff1,
		description: 'Реши несколько задач и ощути мощь молнии!',
	},
	{
		id: 'opt',
		title: 'Оптимальный',
		amount: 25,
		priceRub: 173,
		bonusAmount: 6,
		benefitPercent: 25,
		image: tariff2,
		description:
			'Самый популярный вариант. Этого надолго хватит для учебы или работы. Получи +⚡️6 в подарок к своей энергии и решай задачи с запасом!',
	},
	{
		id: 'max',
		title: 'Максимальный',
		amount: 100,
		priceRub: 704,
		bonusAmount: 50,
		benefitPercent: 50,
		image: tariff3,
		description:
			'Запасись молнией надолго и получи максимум выгоды. +⚡️50 в подарок — это целых 50 решений бесплатно!',
	},
];

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export default function TopUpDialog(props: TopUpDialogProps) {
	const user = useAtomValue(userAtom);
	const tokens = user?.tokens ?? 0;
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
					Ваш баланс: ⚡️{tokens}
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 1.5 }}>
					1 токен = 1 решение задачи по фото
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
									{pack.description ? (
										<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
											{pack.description}
										</Typography>
									) : null}
									<Typography variant="body2" color="text.secondary">
										Всего: {pack.amount + (pack.bonusAmount ?? Math.round(pack.amount * ((pack.bonusPercent ?? 0) / 100)))} 
										{pack.benefitPercent ? ` • Бонус ${pack.benefitPercent}%` : ''}
									</Typography>
								</Box>
							</Stack>

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
                                fullWidth
                            >
									{pack.buttonLabel ?? `Купить ⚡${pack.amount + (pack.bonusAmount ?? Math.round(pack.amount * ((pack.bonusPercent ?? 0) / 100)))}  за ${pack.priceRub} рублей`}
								</Button>
							{index < packs.length - 1 && <Divider sx={{ my: 2 }} />}
						</Box>
					))}
				</Box>
			</Box>
		</Dialog>
	);
}


