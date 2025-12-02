'use client';

import { useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import { API_BASE } from '../config';
import ConsentCheckboxes, { ConsentState } from '@/components/ConsentCheckboxes';
import { avatarUrlById } from '@/components/avatar/images';

export type EmailBindingDialogProps = {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailBindingDialog({ open, onClose, onSuccess }: EmailBindingDialogProps) {
	const [user, setUser] = useAtom(userAtom);
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [consentState, setConsentState] = useState<ConsentState>({
		privacy: false,
		personalData: false,
		userAgreement: false,
		marketing: false,
	});

	const isConsentValid = consentState.privacy && consentState.personalData && consentState.userAgreement;

	const validateEmail = useCallback((value: string) => {
		const trimmed = value.trim();
		if (!trimmed) {
			setEmailError(null);
			return false;
		}
		if (!EMAIL_REGEX.test(trimmed)) {
			setEmailError('Введите корректный email адрес (например: example@mail.ru)');
			return false;
		}
		setEmailError(null);
		return true;
	}, []);

	const handleClose = useCallback(() => {
		setEmail('');
		setError(null);
		setEmailError(null);
		setConsentState({
			privacy: false,
			personalData: false,
			userAgreement: false,
			marketing: false,
		});
		onClose();
	}, [onClose]);

	const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		// Очищаем общую ошибку при изменении email
		if (error) {
			setError(null);
		}
		// Валидация в реальном времени (только если пользователь начал вводить)
		if (value.length > 0) {
			validateEmail(value);
		} else {
			setEmailError(null);
		}
	}, [error, validateEmail]);

	const handleSubmit = useCallback(async () => {
		if (!user?.id) {
			setError('Не удалось определить пользователя. Попробуйте обновить страницу и повторить попытку.');
			return;
		}

		if (!email.trim()) {
			setError('Пожалуйста, введите email');
			setEmailError('Пожалуйста, введите email');
			return;
		}

		if (!validateEmail(email)) {
			setError('Пожалуйста, введите корректный email');
			return;
		}

		if (!isConsentValid) {
			setError('Пожалуйста, согласитесь с обязательными условиями для продолжения.');
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const res = await fetch(`${API_BASE}/api/v1/users/${user.id}/email`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					...(user.ip ? { 'x-user-ip': user.ip } : {}),
				},
				credentials: 'include',
				body: JSON.stringify({
					email: email.trim(),
					is_accepted_promo: consentState.marketing || undefined,
				}),
			});

			if (!res.ok) {
				const errorText = await res.text().catch(() => '');
				if (res.status === 409) {
					throw new Error('Этот email уже занят другим пользователем');
				} else if (res.status === 400) {
					throw new Error('Неверный формат email');
				} else if (res.status === 404) {
					throw new Error('Пользователь не найден');
				} else {
					throw new Error(errorText || 'Не удалось привязать email. Попробуйте позже.');
				}
			}

			const payload = (await res.json()) as {
				id: string;
				username: string;
				avatarId: number;
				tokens?: number;
				tokensUsedAsAnon?: number;
				isAuthorized?: boolean;
				isHaveEmail?: boolean;
			};

			const next = {
				...user,
				id: payload.id,
				username: payload.username,
				avatarId: payload.avatarId,
				avatarUrl: avatarUrlById(payload.avatarId),
				tokens: payload.tokens,
				tokensUsedAsAnon: payload.tokensUsedAsAnon,
				isAuthorized: Boolean(payload.isAuthorized),
				isHaveEmail: Boolean(payload.isHaveEmail),
				email: email.trim(),
			};
			setUser(next);

			handleClose();
			onSuccess?.();
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось привязать email. Попробуйте позже.';
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [user, email, isConsentValid, consentState.marketing, setUser, handleClose, onSuccess]);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
				<IconButton
					aria-label="Закрыть"
					onClick={handleClose}
					sx={{ position: 'absolute', top: 8, right: 8 }}
					color="primary"
					disabled={loading}
				>
					<CloseIcon />
				</IconButton>
				<Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
					Введите email для отправки чека
				</Typography>

				{error ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				) : null}

				<TextField
					fullWidth
					label="Email"
					type="email"
					value={email}
					onChange={handleEmailChange}
					disabled={loading}
					error={!!emailError}
					helperText={emailError || 'Например: example@mail.ru'}
					placeholder="example@mail.ru"
					inputProps={{
						pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
						autoComplete: 'email',
					}}
					sx={{ mb: 2 }}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !loading && isConsentValid && email.trim() && !emailError) {
							void handleSubmit();
						}
					}}
				/>

				<ConsentCheckboxes value={consentState} onChange={setConsentState} />

				<Button
					variant="contained"
					color="primary"
					fullWidth
					onClick={handleSubmit}
					disabled={loading || !isConsentValid || !email.trim() || !!emailError}
					sx={{
						mt: 3,
						borderRadius: 999,
						py: 1.25,
						textTransform: 'none',
						fontWeight: 800,
					}}
					startIcon={loading ? <CircularProgress color="inherit" size={18} thickness={5} /> : undefined}
				>
					{loading ? 'Отправка...' : 'Отправить'}
				</Button>
			</Box>
		</Dialog>
	);
}

