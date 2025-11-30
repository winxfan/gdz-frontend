'use client';

import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
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
import { userAtom } from '@/state/user';
import { API_BASE } from '@/config';

type JobStatus = 'queued' | 'processing' | 'done' | 'failed';

type JobInfo = {
	id: string;
	status: JobStatus;
	inputS3Url?: string;
	detectedText?: string;
	generatedText?: string;
	errorMessage?: string | null;
};

export default function HomeUploadSection() {
	const [user, setUser] = useAtom(userAtom);
	const [isWorking, setIsWorking] = useState(false);
	const [topUpOpen, setTopUpOpen] = useState(false);
	const [jobDialogOpen, setJobDialogOpen] = useState(false);
	const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
	const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
	const [jobError, setJobError] = useState<string | null>(null);
	const [pollAttempt, setPollAttempt] = useState(0);
	const [resultOpen, setResultOpen] = useState(false);
	const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);

	const canSpendToken = (user?.tokens ?? 0) > 0;

	const pollJobUntilDone = useCallback(async (jobId: string): Promise<JobInfo> => {
		const maxAttempts = 15;
		const delayMs = 2000;

		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
			setPollAttempt(attempt);
			const res = await fetch(`${API_BASE}/api/v1/job/${jobId}`, {
				method: 'GET',
				credentials: 'include',
			});

			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(text || 'Не удалось получить статус задачи');
			}

			const info = (await res.json()) as JobInfo;
			setJobStatus(info.status);

			if (info.status === 'done' || info.status === 'failed') {
				return info;
			}

			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}

		throw new Error('Превышен лимит попыток ожидания результата. Попробуйте позже.');
	}, []);

	const handleSelect = useCallback(
		async (file: File) => {
			if (!canSpendToken) {
				setTopUpOpen(true);
				return;
			}

			setIsWorking(true);
			setJobDialogOpen(true);
			setJobError(null);
			setJobInfo(null);
			setJobStatus('queued');
			setPollAttempt(0);

			try {
				if (uploadedPreviewUrl) {
					URL.revokeObjectURL(uploadedPreviewUrl);
				}
				const previewUrl = URL.createObjectURL(file);
				setUploadedPreviewUrl(previewUrl);
			} catch {
				setUploadedPreviewUrl(null);
			}

			try {
				const form = new FormData();
				form.append('image', file, file.name);
				if (user?.id) {
					form.append('userId', user.id);
				}

				const res = await fetch(`${API_BASE}/api/v1/job`, {
					method: 'POST',
					body: form,
					headers: {
						...(user?.ip ? { 'x-user-ip': user.ip } : {}),
					},
					credentials: 'include',
				});

				if (res.status === 402) {
					setTopUpOpen(true);
					setJobDialogOpen(false);
					return;
				}

				if (res.status === 403) {
					setJobError('Достигнут лимит для анонимных пользователей. Войдите или пополните баланс.');
					setJobStatus('failed');
					return;
				}

				if (!res.ok) {
					const text = await res.text().catch(() => '');
					throw new Error(text || 'Не удалось создать задачу');
				}

				const payload = (await res.json()) as { jobId: string; status: JobStatus; tokensLeft?: number };

				if (typeof payload.tokensLeft === 'number') {
					setUser((prev) => (prev ? { ...prev, tokens: payload.tokensLeft } : prev));
				}

				const finalInfo = await pollJobUntilDone(payload.jobId);

				setJobInfo(finalInfo);
				setJobStatus(finalInfo.status);

				if (finalInfo.status === 'failed') {
					setJobError(finalInfo.errorMessage || 'Ошибка обработки задачи');
				} else if (finalInfo.status === 'done') {
					setJobDialogOpen(false);
					setResultOpen(true);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Ошибка при создании задачи';
				setJobError(message);
				setJobStatus('failed');
			} finally {
				setIsWorking(false);
			}
		},
		[canSpendToken, pollJobUntilDone, setUser, uploadedPreviewUrl, user],
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
						{jobStatus === 'done' && jobInfo ? (
							<Stack spacing={2}>
								<Box>
									<Typography sx={{ fontWeight: 700, mb: 0.5 }}>Распознанный текст</Typography>
									<Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
										{jobInfo.detectedText || '—'}
									</Paper>
								</Box>
								<Box>
									<Typography sx={{ fontWeight: 700, mb: 0.5 }}>Решение</Typography>
									<Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
										{jobInfo.generatedText || '—'}
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
				markdown={jobInfo?.generatedText ?? ''}
			/>
		</>
	);
}


