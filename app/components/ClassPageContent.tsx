'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import LessonsTable, { LessonsInput } from '@/components/LessonsTable';
import infoblock1 from '@/assets/infoblock1.png';
import infoblock2 from '@/assets/infoblock2.png';
import infoblock3 from '@/assets/infoblock3.png';
import Banner1 from '@/assets/banner-1.png';
import faqItems from '@/../faq.json';
import lessonsData from '@/../lessons.json';
import TopUpDialog from '@/components/TopUpDialog';
import { useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import { useCallback, useState } from 'react';
import { API_BASE } from '@/config';
import ResultModal from '@/components/ResultModal';

export type ClassPageContentProps = {
	title: string;
	infoBlocks: { title: string; description: string }[];
};

type JobStatus = 'queued' | 'processing' | 'done' | 'failed';
type JobInfo = {
	id: string;
	status: JobStatus;
	inputS3Url?: string;
	detectedText?: string;
	generatedText?: string;
	errorMessage?: string | null;
};

export default function ClassPageContent({ title, infoBlocks }: ClassPageContentProps) {
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

	const handleSelect = useCallback(async (file: File) => {
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
			const previewUrl = URL.createObjectURL(file);
			setUploadedPreviewUrl(previewUrl);
		} catch {}
		try {
			const form = new FormData();
			form.append('image', file, file.name);
			if (user?.id) form.append('userId', user.id);
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
			const payload = await res.json() as { jobId: string; status: JobStatus; tokensLeft?: number };
			if (typeof payload.tokensLeft === 'number') {
				setUser({ ...user, tokens: payload.tokensLeft });
			}
			const final = await pollJobUntilDone(payload.jobId);
			setJobInfo(final);
			setJobStatus(final.status);
			if (final.status === 'failed') {
				setJobError(final.errorMessage || 'Ошибка обработки задачи');
			} else if (final.status === 'done') {
				setJobDialogOpen(false);
				setResultOpen(true);
			}
		} catch (e: any) {
			setJobError(e?.message || 'Ошибка при создании задачи');
			setJobStatus('failed');
		} finally {
			setIsWorking(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, canSpendToken]);

	async function pollJobUntilDone(jobId: string): Promise<JobInfo> {
		const maxAttempts = 15;
		const delayMs = 2000;
		let attempt = 0;
		while (attempt < maxAttempts) {
			attempt += 1;
			setPollAttempt(attempt);
			const res = await fetch(`${API_BASE}/api/v1/job/${jobId}`, {
				method: 'GET',
				credentials: 'include',
			});
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(text || `Не удалось получить статус задачи`);
			}
			const info = await res.json() as JobInfo;
			setJobStatus(info.status);
			if (info.status === 'done' || info.status === 'failed') {
				return info;
			}
			await new Promise((r) => setTimeout(r, delayMs));
		}
		throw new Error('Превышен лимит попыток ожидания результата. Попробуйте позже.');
	}

	function asUrl(mod: any): string {
		return typeof mod === 'string' ? mod : (mod && typeof mod.src === 'string' ? mod.src : '');
	}

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Typography
						component="h1"
						align="center"
						sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
					>
						{title}
					</Typography>
					<Typography align="center" color="text.secondary" sx={{ mb: { xs: 4, md: 6 } }}>
						Загрузите фотографию задания и мгновенно получите ответ. <br />
						Нейросеть объяснит решение и поможет разобраться в задаче 📸✨
					</Typography>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
							gap: { xs: 2, md: 3 },
							alignItems: 'stretch',
						}}
					>
						<Box
							component="img"
							src={Banner1.src}
							alt="Учёба"
							sx={{ width: '100%', borderRadius: 1, display: 'block', objectFit: 'cover' }}
						/>
						<Box sx={{ height: '100%' }}>
							<UploadZoneWithChess
								onSelect={handleSelect}
								buttonLabel="Загрузить фото задачи ⚡️1"
								backgroundOpacity={0.4}
								disabled={isWorking}
								loading={isWorking}
							/>
						</Box>
					</Box>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<HowToUseSteps
						steps={[
							{
								title: '📸 Загрузите фото задания',
								description:
									'Начните с загрузки чёткой фотографии упражнения или страницы из учебника. Убедитесь, что текст хорошо освещён и полностью помещается в кадр - так ИИ точнее распознает задание.',
							},
							{
								title: '🔍 Выберите тип решения',
								description:
									'Выберите нужный предмет или формат ответа. При необходимости можно загрузить дополнительное фото, чтобы ИИ точнее понял задачу.',
							},
							{
								title: '🤖 Получите готовое решение',
								description:
									'Наш ИИ моментально обработает фото и выдаст понятный, аккуратный и точный ответ. Если результат не подошёл - просто загрузите другое фото или уточните запрос, и мы сгенерируем новое решение ⚡📘',
							},
						]}
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
					<InfoBlock
						title={infoBlocks[0]?.title || '⚡ Быстрые и осмысленные ответы'}
						description={infoBlocks[0]?.description || ''}
						image={asUrl(infoblock1)}
						buttonText="Получить ответ по фото"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
					<InfoBlock
						title={infoBlocks[1]?.title || '🧠 Понятное объяснение задачи'}
						description={infoBlocks[1]?.description || ''}
						image={asUrl(infoblock2)}
						buttonText="Получить объяснение"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="right"
					/>
					<InfoBlock
						title={infoBlocks[2]?.title || '📚 Все школьные предметы - универсальный решебник и ГДЗ'}
						description={infoBlocks[2]?.description || ''}
						image={asUrl(infoblock3)}
						buttonText="Решить задачу по фото"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
				</Container>
			</Box>

			{/* Модалка пополнения */}
			<TopUpDialog open={topUpOpen} onClose={() => setTopUpOpen(false)} />

			{/* Диалог результата задачи */}
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

			{/* Итоговое модальное окно с результатом */}
			<ResultModal
				open={resultOpen}
				onClose={() => {
					setResultOpen(false);
					if (uploadedPreviewUrl) {
						try {
							URL.revokeObjectURL(uploadedPreviewUrl);
						} catch {}
					}
					setUploadedPreviewUrl(null);
				}}
				imageSrc={uploadedPreviewUrl ?? undefined}
				markdown={jobInfo?.generatedText ?? ''}
			/>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }} align="center">
						📚 Все школьные предметы и классы
					</Typography>
					<LessonsTable data={lessonsData as unknown as LessonsInput} />
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<FAQSection
						title="Частые вопросы"
						faqItems={faqItems}
					/>
				</Container>
			</Box>
		</main>
	);
}


