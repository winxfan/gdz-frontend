'use client';

import { Box, Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Stack, Alert } from '@mui/material';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import infoblock1 from '@/assets/infoblock1.png';
import infoblock2 from '@/assets/infoblock2.png';
import infoblock3 from '@/assets/infoblock3.png';
import { alpha } from '@mui/material/styles';
import Banner1 from '@/assets/banner-1.png';
import faqItems from '../faq.json';
import subjectsData from '@/subjects.json';
import TopUpDialog from '@/components/TopUpDialog';
import { useAtom } from 'jotai';
import { userAtom } from '@/state/user';
import { useCallback, useMemo, useState } from 'react';
import { API_BASE } from './config';
import ResultModal from '@/components/ResultModal';

const classes = Array.from({ length: 11 }, (_, i) => `${i + 1}-class`);

export default function Page() {
	const [user, setUser] = useAtom(userAtom);
	const [isWorking, setIsWorking] = useState(false);
	const [topUpOpen, setTopUpOpen] = useState(false);

	type JobStatus = 'queued' | 'processing' | 'done' | 'failed';
	type JobInfo = {
		id: string;
		status: JobStatus;
		inputS3Url?: string;
		detectedText?: string;
		generatedText?: string;
		errorMessage?: string | null;
	};
	const [jobDialogOpen, setJobDialogOpen] = useState(false);
	const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
	const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
	const [jobError, setJobError] = useState<string | null>(null);
	const [pollAttempt, setPollAttempt] = useState(0);
	const [resultOpen, setResultOpen] = useState(false);
	const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);

	const canSpendToken = (user?.tokens ?? 0) > 0;

	const handleSelect = useCallback(async (file: File) => {
		// Проверка баланса
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
		// превью
		try {
			const previewUrl = URL.createObjectURL(file);
			setUploadedPreviewUrl(previewUrl);
		} catch {}
		try {
			// Формируем форму
			const form = new FormData();
			form.append('image', file, file.name);
			if (user?.id) form.append('userId', user.id);

			// Отправляем создание задачи
			const res = await fetch(`${API_BASE}/api/v1/job`, {
				method: 'POST',
				body: form,
				headers: {
					...(user?.ip ? { 'x-user-ip': user.ip } : {}),
				},
				credentials: 'include',
			});
			if (res.status === 402) {
				// Недостаточно токенов
				setTopUpOpen(true);
				setJobDialogOpen(false);
				return;
			}
			if (res.status === 403) {
				// Квота анонима исчерпана
				setJobError('Достигнут лимит для анонимных пользователей. Войдите или пополните баланс.');
				setJobStatus('failed');
				return;
			}
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(text || 'Не удалось создать задачу');
			}
			const payload = await res.json() as { jobId: string; status: JobStatus; tokensLeft?: number };
			// Обновляем баланс, если сервер вернул
			if (typeof payload.tokensLeft === 'number') {
				setUser({ ...user, tokens: payload.tokensLeft });
			}
			// Поллинг статуса
			const final = await pollJobUntilDone(payload.jobId);
			setJobInfo(final);
			setJobStatus(final.status);
			if (final.status === 'failed') {
				setJobError(final.errorMessage || 'Ошибка обработки задачи');
			} else if (final.status === 'done') {
				// Закрываем прогресс-диалог и показываем ResultModal
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
			// ждём и продолжаем
			await new Promise((r) => setTimeout(r, delayMs));
		}
		throw new Error('Превышен лимит попыток ожидания результата. Попробуйте позже.');
	}

	function asUrl(mod: any): string {
		return typeof mod === 'string' ? mod : (mod && typeof mod.src === 'string' ? mod.src : '');
	}

	const subjectsByCategory = [
		{ title: '📐 Математика', list: subjectsData['Математика'] },
		{ title: '🧪 Естественные науки', list: subjectsData['Естественные науки'] },
		{ title: '📚 Общественные науки', list: subjectsData['Общественные науки'] },
		{ title: '🗣️ Гуманитарные науки', list: subjectsData['Гуманитарные науки'] },
		{ title: '🛠️ Технология', list: subjectsData['Технология'] },
		{ title: '🏃 Физическая культура', list: subjectsData['Физическая культура'] },
		{ title: '🎨 Художественные науки', list: subjectsData['Художественные науки'] },
	];

	const parseClassNum = (slug: string) => Number(slug.split('-')[0]) || 0;
	const classLabel = (slug: string) => {
		const n = parseClassNum(slug);
		return `${n} класс`;
	};
	const classesByStage = [
		{ title: 'Начальная школа (1–4)', list: classes.filter((s) => { const n = parseClassNum(s); return n >= 1 && n <= 4; }) },
		{ title: 'Основная школа (5–9)', list: classes.filter((s) => { const n = parseClassNum(s); return n >= 5 && n <= 9; }) },
		{ title: 'Старшая школа (10–11)', list: classes.filter((s) => { const n = parseClassNum(s); return n >= 10 && n <= 11; }) },
	] as const;

	const stageLabelWithEmoji = (title: string) => {
		if (title.startsWith('Начальная')) return `👶 ${title}`;
		if (title.startsWith('Основная')) return `🧑‍🏫 ${title}`;
		if (title.startsWith('Старшая')) return `🎓 ${title}`;
		return title;
	};

	// Категории предметов уже содержат эмодзи в заголовке

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Typography
						component="h1"
						align="center"
						sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
					>
					 	Гдз по фото бесплатно с помощью ИИ 🎓
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
						title="⚡ Быстрые и осмысленные ответы"
						description="Получайте точные и осмысленные ответы на домашнее задание за секунды. Просто сделайте фото упражнения - сервис распознает текст, решит задачу и выдаст понятный ответ и подробно объяснит решение. Быстро, удобно и без бесконечного листания бумажных решебников в долгих поисках ответов."
						image={asUrl(infoblock1)}
						buttonText="Получить ответ по фото"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
					<InfoBlock
						title="🧠 Понятное объяснение задачи"
						description="Наш ИИ не просто подсказывает ответ - он подробно объясняет, как решается задача. Пошаговые разборы, формулы, логика и примеры помогут действительно понять материал и разобраться в сложных темах - как с внимательным репетитором."
						image={asUrl(infoblock2)}
						buttonText="Получить объяснение"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="right"
					/>
					<InfoBlock
						title="📚 Все школьные предметы - универсальный решебник и ГДЗ"
						description="Один сервис - все решения. Поддерживаем математику, русский, физику, химию, английский и другие предметы. Универсальный решебник по фото: загрузите фото задачи - получите решение и объяснение в один клик."
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
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
						{/* Единый блок с классами - тоже часть общей сетки */}
						<Paper
							elevation={0}
							sx={(t) => ({
								p: 3,
								border: '1px solid',
								borderColor: alpha(t.palette.primary.main, 0.25),
								bgcolor: alpha(t.palette.primary.main, 0.06),
							})}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
								Классы
							</Typography>
							{classesByStage.map((seg) => (
								<Box key={seg.title} sx={{ mb: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
										<Typography sx={{ fontWeight: 600 }}>{stageLabelWithEmoji(seg.title)}</Typography>
									</Box>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
										{seg.list.map((slug) => (
											<Paper key={slug} elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
												{classLabel(slug)}
											</Paper>
										))}
									</Box>
								</Box>
							))}
						</Paper>
						{/* Карточки категорий предметов - те же правила сетки */}
						{subjectsByCategory.map((seg, segIdx) => (
							<Paper
								key={seg.title}
								elevation={0}
								sx={(t) => {
									const paletteCycle = [
										t.palette.secondary.main,
										t.palette.success.main,
										t.palette.info.main,
										t.palette.warning.main,
										t.palette.error.main,
									];
									const base = paletteCycle[segIdx % paletteCycle.length];
									return {
										p: 2,
										border: '1px solid',
										borderColor: alpha(base, 0.25),
										bgcolor: alpha(base, 0.06),
									};
								}}
							>
								<Typography sx={{ fontWeight: 700, mb: 1 }}>
									{seg.title}
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{(seg.list || []).map((item, idx) => (
										<Paper key={`${item.title}-${idx}`} elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
											{item.title}
										</Paper>
									))}
								</Box>
							</Paper>
						))}
					</Box>
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



