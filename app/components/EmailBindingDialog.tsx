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
import ConsentCheckboxes, { ConsentState } from '@/components/ConsentCheckboxes';
import { avatarUrlById } from '@/components/avatar/images';
import { useMutation } from '@tanstack/react-query';
import { bindEmail } from '@/utils/api';
import { AxiosError } from 'axios';

export type EmailBindingDialogProps = {
	open: boolean;
	onClose: () => void;
	onSuccess?: (updatedUser: { id: string }) => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailBindingDialog({ open, onClose, onSuccess }: EmailBindingDialogProps) {
	const [user, setUser] = useAtom(userAtom);
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [consentState, setConsentState] = useState<ConsentState>({
		privacy: false,
		personalData: false,
		userAgreement: false,
		marketing: false,
	});

	const isConsentValid = consentState.privacy && consentState.personalData && consentState.userAgreement;

	const bindEmailMutation = useMutation({
		mutationFn: async (emailValue: string) => {
			if (!user?.id) {
				throw new Error('Не удалось определить пользователя. Попробуйте обновить страницу и повторить попытку.');
			}
			return bindEmail({
				userId: user.id,
				email: emailValue,
				isAcceptedPromo: consentState.marketing,
			});
		},
		onSuccess: (payload) => {
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

			// Передаем обновленные данные пользователя в callback
			onSuccess?.({ id: next.id! });
			
			// Закрываем диалог после успешного выполнения
			// Используем setTimeout, чтобы дать React время обновить состояние
			setTimeout(() => {
				handleClose();
			}, 0);
		},
		onError: (err: unknown) => {
			let message = 'Не удалось привязать email. Попробуйте позже.';
			if (err instanceof AxiosError) {
				const status = err.response?.status;
				if (status === 409) {
					message = 'Этот email уже занят другим пользователем';
				} else if (status === 400) {
					message = 'Неверный формат email';
				} else if (status === 404) {
					message = 'Пользователь не найден';
				} else {
					const errorText = typeof err.response?.data === 'string' 
						? err.response.data 
						: err.message || message;
					message = errorText;
				}
			} else if (err instanceof Error) {
				message = err.message;
			}
			setError(message);
		},
	});

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
		bindEmailMutation.mutate(email);
	}, [email, isConsentValid, bindEmailMutation, validateEmail]);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
				<IconButton
					aria-label="Закрыть"
					onClick={handleClose}
					sx={{ position: 'absolute', top: 8, right: 8 }}
					color="primary"
					disabled={bindEmailMutation.isPending}
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
					disabled={bindEmailMutation.isPending}
					error={!!emailError}
					helperText={emailError || 'Например: example@mail.ru'}
					placeholder="example@mail.ru"
					inputProps={{
						pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
						autoComplete: 'email',
					}}
					sx={{ mb: 2 }}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !bindEmailMutation.isPending && isConsentValid && email.trim() && !emailError) {
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
					disabled={bindEmailMutation.isPending || !isConsentValid || !email.trim() || !!emailError}
					sx={{
						mt: 3,
						borderRadius: 999,
						py: 1.25,
						textTransform: 'none',
						fontWeight: 800,
					}}
					startIcon={bindEmailMutation.isPending ? <CircularProgress color="inherit" size={18} thickness={5} /> : undefined}
				>
					{bindEmailMutation.isPending ? 'Отправка...' : 'Отправить'}
				</Button>
			</Box>
		</Dialog>
	);
}

