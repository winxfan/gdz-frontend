'use client';

import { useAtom } from 'jotai';
import { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import TopUpDialog from '@/components/TopUpDialog';
import ResultModal from '@/components/ResultModal';
import AuthDialog from '@/components/AuthDialog';
import { userAtom } from '@/state/user';
import { normalizeImageFile } from '@/utils/imageConverter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createJob, getJobStatus } from '@/utils/api';
import { AxiosError } from 'axios';

type JobStatus = 'queued' | 'processing' | 'done' | 'failed';

export default function HomeUploadSection() {
	const [user, setUser] = useAtom(userAtom);
	const [isWorking, setIsWorking] = useState(false);
	const [topUpOpen, setTopUpOpen] = useState(false);
	const [authDialogOpen, setAuthDialogOpen] = useState(false);
	const [jobDialogOpen, setJobDialogOpen] = useState(false);
	const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
	const [jobError, setJobError] = useState<string | null>(null);
	const [pollAttempt, setPollAttempt] = useState(0);
	const [resultOpen, setResultOpen] = useState(false);
	const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);

	const canSpendToken = (user?.tokens ?? 0) > 0;
	const tokens = user?.tokens ?? 0;
	const [currentJobId, setCurrentJobId] = useState<string | null>(null);
	const [fullJobInfo, setFullJobInfo] = useState<{
		id: string;
		status: JobStatus;
		detectedText?: string;
		generatedText?: string;
		errorMessage?: string | null;
	} | null>(null);

	// Polling статуса задачи
	const { data: polledJobInfo } = useQuery({
		queryKey: ['job-status', currentJobId],
		queryFn: async () => {
			if (!currentJobId) return null;
			return getJobStatus(currentJobId);
		},
		enabled: Boolean(currentJobId),
		refetchInterval: (query) => {
			const data = query.state.data;
			if (data?.status === 'done' || data?.status === 'failed') {
				return false;
			}
			return 2000; // 2 секунды
		},
		retry: false,
	});

	// Обновляем локальное состояние при изменении данных из query
	useEffect(() => {
		if (polledJobInfo) {
			// Обновляем только если данные действительно изменились
			setFullJobInfo((prev) => {
				if (prev?.id === polledJobInfo.id && prev?.status === polledJobInfo.status) {
					// Обновляем только если есть новые данные (detectedText, generatedText)
					if (prev.detectedText === polledJobInfo.detectedText && prev.generatedText === polledJobInfo.generatedText) {
						return prev;
					}
				}
				return polledJobInfo;
			});
			setJobStatus(polledJobInfo.status);
			if (polledJobInfo.status === 'done') {
				setJobDialogOpen(false);
				setResultOpen(true);
			} else if (polledJobInfo.status === 'failed') {
				setJobError(polledJobInfo.errorMessage || 'Ошибка обработки задачи');
			}
		}
	}, [polledJobInfo]);

	const createJobMutation = useMutation({
		mutationFn: async (file: File) => {
			// Нормализуем файл: конвертируем WebP и другие неподдерживаемые форматы в JPEG
			const normalizedFile = await normalizeImageFile(file);
			
			// Создаем preview URL
			if (uploadedPreviewUrl) {
				URL.revokeObjectURL(uploadedPreviewUrl);
			}
			try {
				const previewUrl = URL.createObjectURL(normalizedFile);
				setUploadedPreviewUrl(previewUrl);
			} catch {
				setUploadedPreviewUrl(null);
			}

			return createJob({
				image: normalizedFile,
				userId: user?.id,
			});
		},
		onSuccess: (payload) => {
			if (typeof payload.tokensLeft === 'number') {
				setUser((prev) => (prev ? { ...prev, tokens: payload.tokensLeft } : prev));
			}

			// Устанавливаем начальную информацию о задаче
			const initialJobInfo = {
				id: payload.jobId,
				status: payload.status as JobStatus,
			};
			setFullJobInfo(initialJobInfo);
			setCurrentJobId(payload.jobId);
			setJobStatus(payload.status as JobStatus);
			setJobDialogOpen(true);
			setJobError(null);
		},
		onError: (error: unknown) => {
			let message = 'Ошибка при создании задачи';
			if (error instanceof AxiosError) {
				if (error.response?.status === 402) {
					setTopUpOpen(true);
					setJobDialogOpen(false);
					return;
				} else if (error.response?.status === 403) {
					setJobDialogOpen(false);
					setAuthDialogOpen(true);
					return;
				}
				message = error.response?.data?.toString() || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			setJobError(message);
			setJobStatus('failed');
		},
	});

	const handleSelect = useCallback(
		async (file: File) => {
			if (!canSpendToken) {
				setTopUpOpen(true);
				return;
			}

			setIsWorking(true);
			setJobError(null);
			setPollAttempt(0);

			try {
				await createJobMutation.mutateAsync(file);
			} catch {
				// Ошибка уже обработана в onError
			} finally {
				setIsWorking(false);
			}
		},
		[canSpendToken, createJobMutation, user],
	);

	return (
		<>
			<Box sx={{ height: '100%' }}>
				<UploadZoneWithChess
					onSelect={handleSelect}
					buttonLabel="Загрузить фото задачи ⚡️1"
					backgroundOpacity={0.4}
					disabled={isWorking}
					loading={isWorking}
				/>
			</Box>

			<TopUpDialog open={topUpOpen} onClose={() => setTopUpOpen(false)} />

			<AuthDialog 
				open={authDialogOpen} 
				onClose={() => setAuthDialogOpen(false)}
				title={`Авторизуйтесь чтобы потратить ⚡️${tokens}`}
			/>

			<Dialog open={jobDialogOpen} onClose={() => setJobDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>
					{jobStatus === 'done' ? 'Готовое решение' : jobStatus === 'failed' ? 'Ошибка' : 'Обработка задачи'}
				</DialogTitle>
				<DialogContent dividers>
					<Stack spacing={2}>
						{jobStatus !== 'done' && jobStatus !== 'failed' ? (
							<Stack spacing={1} alignItems="center">
								<CircularProgress />
								<Typography color="text.secondary">
									Статус: {jobStatus ?? 'queued'} • Попытка {pollAttempt}/15
								</Typography>
							</Stack>
						) : null}
						{jobError ? <Alert severity="error">{jobError}</Alert> : null}
						{jobStatus === 'done' && fullJobInfo ? (
							<Stack spacing={2}>
								<Box>
									<Typography sx={{ fontWeight: 700, mb: 0.5 }}>Распознанный текст</Typography>
									<Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
										{fullJobInfo.detectedText || '—'}
									</Paper>
								</Box>
								<Box>
									<Typography sx={{ fontWeight: 700, mb: 0.5 }}>Решение</Typography>
									<Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
										{fullJobInfo.generatedText || '—'}
									</Paper>
								</Box>
							</Stack>
						) : null}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setJobDialogOpen(false)} variant="contained">
						{jobStatus === 'done' || jobStatus === 'failed' ? 'Закрыть' : 'Свернуть'}
					</Button>
				</DialogActions>
			</Dialog>

			<ResultModal
				open={resultOpen}
				onClose={() => {
					setResultOpen(false);
					if (uploadedPreviewUrl) {
						try {
							URL.revokeObjectURL(uploadedPreviewUrl);
						} catch {
							// ignore
						}
					}
					setUploadedPreviewUrl(null);
				}}
				imageSrc={uploadedPreviewUrl ?? undefined}
				markdown={fullJobInfo?.generatedText ?? ''}
			/>
		</>
	);
}


