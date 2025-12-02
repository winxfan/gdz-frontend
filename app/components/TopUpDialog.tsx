'use client';

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/state/user';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import tariff1 from '@/assets/tariff1.webp';
import tariff2 from '@/assets/tariff2.webp';
import tariff3 from '@/assets/tariff3.webp';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE } from '@/config';
import EmailBindingDialog from '@/components/EmailBindingDialog';

export type EnergyPack = {
	id: number;
	tariffId?: string;
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
		id: 1,
		tariffId: '1',
		title: 'Старт',
		amount: 10,
		priceRub: 76,
		bonusAmount: 0,
		benefitPercent: 0,
		image: tariff1,
		description: 'Реши несколько задач и ощути мощь молнии!',
	},
	{
		id: 2,
		tariffId: '2',
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
		id: 3,
		tariffId: '3',
		title: 'Максимальный',
		amount: 100,
		priceRub: 701,
		bonusAmount: 50,
		benefitPercent: 50,
		image: tariff3,
		description:
			'Запасись молнией надолго и получи максимум выгоды. +⚡️50 в подарок — это целых 50 решений бесплатно!',
	},
];

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const rubPerToken = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	maximumFractionDigits: 2,
});

const getTotalTokens = (pack: EnergyPack) =>
	pack.amount + (pack.bonusAmount ?? Math.round(pack.amount * ((pack.bonusPercent ?? 0) / 100)));

type PaymentIntentResponse = {
	id: string;
	provider: string;
	amountRub: number;
	currency: string;
	paymentUrl?: string | null;
	payment_url?: string | null;
	reference: string;
	paymentId?: string | null;
	tariffId: string;
	tokens: number;
};

export default function TopUpDialog(props: TopUpDialogProps) {
	const user = useAtomValue(userAtom);
	const tokens = user?.tokens ?? 0;
	const userId = user?.id;
	const userIp = user?.ip;
	const { open, onClose, onBuy, packs = defaultPacks } = props;
	const [loadingPackId, setLoadingPackId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [emailDialogOpen, setEmailDialogOpen] = useState(false);
	const [pendingPack, setPendingPack] = useState<EnergyPack | null>(null);

	useEffect(() => {
		if (!open) {
			setError(null);
			setLoadingPackId(null);
			setEmailDialogOpen(false);
			setPendingPack(null);
		}
	}, [open]);

	// Функция для создания payment intent и редиректа на оплату
	const createPaymentIntent = useCallback(
		async (pack: EnergyPack, currentUserId?: string, currentUserIp?: string) => {
			const targetUserId = currentUserId ?? userId;
			if (!targetUserId) {
				throw new Error('Не удалось определить пользователя. Попробуйте обновить страницу и повторить попытку.');
			}

			setError(null);
			setLoadingPackId(pack.id);

			try {
				const idempotencyKey =
					typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
						? crypto.randomUUID()
						: `topup-${pack.id}-${Date.now()}`;

				const res = await fetch(`${API_BASE}/api/v1/payments/intents`, {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						...(currentUserIp ?? userIp ? { 'x-user-ip': currentUserIp ?? userIp } : {}),
						...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
					},
					credentials: 'include',
					body: JSON.stringify({
						user_id: targetUserId,
						tariff_id: pack.tariffId ?? String(pack.id),
						provider: 'yookassa',
						description: pack.description ?? `Пополнение баланса на ⚡️${getTotalTokens(pack)}`,
					}),
				});

				if (!res.ok) {
					const errorText = await res.text().catch(() => '');
					throw new Error(errorText || 'Не удалось создать ссылку на оплату. Попробуйте позже.');
				}

				const payload = (await res.json()) as PaymentIntentResponse;
				const paymentUrl = payload.paymentUrl ?? payload.payment_url ?? null;

				if (!paymentUrl) {
					throw new Error('Ссылка на оплату не получена. Попробуйте позже.');
				}

				onBuy?.(pack);

				window.open(paymentUrl, '_blank', 'noopener,noreferrer');
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Ошибка при создании ссылки на оплату. Попробуйте позже.';
				setError(message);
				throw err;
			} finally {
				setLoadingPackId(null);
			}
		},
		[onBuy, userId, userIp],
	);

	const handleBuy = useCallback(
		async (pack: EnergyPack) => {
			if (!userId) {
				setError('Не удалось определить пользователя. Попробуйте обновить страницу и повторить попытку.');
				return;
			}

			// Если у пользователя нет email (isHaveEmail = false или undefined), показываем диалог привязки email
			if (user?.isHaveEmail !== true) {
				setPendingPack(pack);
				setEmailDialogOpen(true);
				return;
			}

			// Если email есть, сразу создаем payment intent
			await createPaymentIntent(pack);
		},
		[user, userId, createPaymentIntent],
	);

	const handleEmailBindingSuccess = useCallback(
		async (updatedUser: { id: string; ip?: string }) => {
			// После успешной привязки email продолжаем процесс покупки
			// Диалог привязки email уже закрыт в EmailBindingDialog
			if (pendingPack) {
				// Сразу создаем payment intent с обновленными данными пользователя
				await createPaymentIntent(pendingPack, updatedUser.id, updatedUser.ip);
			}
		},
		[pendingPack, createPaymentIntent],
	);

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
				  ⚡️1 = 1 решение задачи по фото
				</Typography>
				{error ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				) : null}

				<Box sx={{ mt: { xs: 1, sm: 2 } }}>
					{packs.map((pack, index) => {
						const totalTokens = getTotalTokens(pack);
						const pricePerToken = pack.priceRub / totalTokens;
						const formattedPricePerToken = rubPerToken.format(pricePerToken);
						const isLoading = loadingPackId === pack.id;

						return (
							<Box key={pack.id}>
								<Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
								<Box
									sx={{
										width: 64,
										height: 64,
										borderRadius: 0.5,
										overflow: 'hidden',
										bgcolor: 'primary.light',
										flexShrink: 0,
									}}
								>
									{pack.image ? (
										<Image
											src={pack.image}
											alt={pack.title ?? 'Пакет энергии'}
											width={64}
											height={64}
											loading="lazy"
										/>
									) : null}
								</Box>

								<Box sx={{ flexGrow: 1 }}>
									{pack.title || pack.benefitPercent || pack.bonusAmount ? (
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											flexWrap="wrap"
											sx={{ mb: 0.75 }}
										>
											{pack.title ? (
												<Typography variant="h6" sx={{ fontWeight: 800 }}>
													{pack.title}
												</Typography>
											) : null}
											{pack.benefitPercent ? (
												<Chip
													label={`Бонус ${pack.benefitPercent}%`}
													size="small"
													sx={{
														fontWeight: 700,
														bgcolor: 'success.light',
														color: 'success.dark',
														'& .MuiChip-label': { px: 1.25 },
													}}
												/>
											) : null}
											{pack.bonusAmount ? (
												<Chip
													label={`+⚡️${pack.bonusAmount} в подарок`}
													size="small"
													sx={{
														fontWeight: 700,
														bgcolor: 'success.light',
														color: 'success.dark',
														'& .MuiChip-label': { px: 1.25 },
													}}
												/>
											) : null}
										</Stack>
									) : null}
									{pack.description ? (
										<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
											{pack.description}
										</Typography>
									) : null}
									<Typography variant="body2" color="text.secondary">
										Стоимость 1 токена: {formattedPricePerToken}
									</Typography>
								</Box>
							</Stack>

							<Button
								variant="contained"
								color="primary"
								onClick={() => void handleBuy(pack)}
								sx={{
									borderRadius: 999,
									px: 3,
									py: 1.25,
									textTransform: 'none',
									fontWeight: 800,
									whiteSpace: 'nowrap',
								}}
								fullWidth
								disabled={Boolean(loadingPackId)}
								startIcon={
									isLoading ? <CircularProgress color="inherit" size={18} thickness={5} /> : undefined
								}
							>
								{isLoading
									? 'Создаём ссылку...'
									: pack.buttonLabel ?? `Купить ⚡${totalTokens} за ${rub.format(pack.priceRub)}`}
							</Button>
							{index < packs.length - 1 && <Divider sx={{ my: 2 }} />}
						</Box>
					);
					})}
				</Box>
			</Box>

			<EmailBindingDialog
				open={emailDialogOpen}
				onClose={() => {
					setEmailDialogOpen(false);
					setPendingPack(null);
				}}
				onSuccess={handleEmailBindingSuccess}
			/>
		</Dialog>
	);
}


