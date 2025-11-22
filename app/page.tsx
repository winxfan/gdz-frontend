'use client';

import { Box, Container, Typography, Link as MLink, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import ScienceIcon from '@mui/icons-material/Science';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import NextLink from 'next/link';
import Banner1 from '@/assets/banner-1.png';

const subjects = [
	'mathematics',
	'russian-language',
	'english',
	'physics',
	'chemistry',
	'biology',
	'geography',
	'history',
	'social-science',
	'computer-science',
	'literature',
];

const classes = Array.from({ length: 11 }, (_, i) => `${i + 1}-class`);

export default function Page() {
	const handleSelect = async (file: File) => {
		console.log('Selected file', file.name);
	};

	const subjectLabels: Record<string, string> = {
		'mathematics': 'Математика',
		'russian-language': 'Русский язык',
		'english': 'Английский язык',
		'physics': 'Физика',
		'chemistry': 'Химия',
		'biology': 'Биология',
		'geography': 'География',
		'history': 'История',
		'social-science': 'Обществознание',
		'computer-science': 'Информатика',
		'literature': 'Литература',
	};

	const subjectsByCategory = [
		{ title: 'Гуманитарные', icon: <MenuBookIcon fontSize="small" />, items: ['history', 'social-science', 'literature'] },
		{ title: 'Филология и языки', icon: <TranslateIcon fontSize="small" />, items: ['russian-language', 'english'] },
		{ title: 'Естественно-научные', icon: <ScienceIcon fontSize="small" />, items: ['mathematics', 'physics', 'chemistry', 'biology', 'geography', 'computer-science'] },
	] as const;

	const parseClassNum = (slug: string) => Number(slug.split('-')[0]) || 0;
	const classLabel = (slug: string) => {
		const n = parseClassNum(slug);
		return `${n} класс`;
	};
	const classesByStage = [
		{ title: 'Начальная школа (1–4)', icon: <ChildCareIcon fontSize="small" />, list: classes.filter((s) => { const n = parseClassNum(s); return n >= 1 && n <= 4; }) },
		{ title: 'Основная школа (5–9)', icon: <SchoolIcon fontSize="small" />, list: classes.filter((s) => { const n = parseClassNum(s); return n >= 5 && n <= 9; }) },
		{ title: 'Старшая школа (10–11)', icon: <WorkspacePremiumIcon fontSize="small" />, list: classes.filter((s) => { const n = parseClassNum(s); return n >= 10 && n <= 11; }) },
	] as const;

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Typography component="h1" variant="h3" align="center" sx={{ fontWeight: 800, mb: 1 }}>
						🎓 Решайте задачи по фото бесплатно с помощью ИИ
					</Typography>
					<Typography align="center" color="text.secondary" sx={{ mb: { xs: 4, md: 6 } }}>
					Просто загрузите фотографию задания — и наша нейросеть мгновенно найдёт решение. <br />
					Получайте точные, понятные и готовые ответы за секунды 📸✨
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
							sx={{ width: '100%', borderRadius: 2, display: 'block', objectFit: 'cover' }}
						/>
						<Box sx={{ height: '100%' }}>
							<UploadZoneWithChess
								onSelect={handleSelect}
								buttonLabel="Загрузить фото задачи"
								backgroundOpacity={0.4}
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
									'Начните с загрузки чёткой фотографии упражнения или страницы из учебника. Убедитесь, что текст хорошо освещён и полностью помещается в кадр — так ИИ точнее распознает задание.',
							},
							{
								title: '🔍 Выберите тип решения',
								description:
									'Выберите нужный предмет или формат ответа. При необходимости можно загрузить дополнительное фото, чтобы ИИ точнее понял задачу.',
							},
							{
								title: '🤖 Получите готовое решение',
								description:
									'Наш ИИ моментально обработает фото и выдаст понятный, аккуратный и точный ответ. Если результат не подошёл — просто загрузите другое фото или уточните запрос, и мы сгенерируем новое решение ⚡📘',
							},
						]}
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
					<InfoBlock
						title="Мгновенные решения"
						description="Ваше фото анализируется автоматически: распознаём текст, определяем предмет и класс, формируем решение."
						image="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1280&auto=format&fit=crop"
						buttonText="Попробовать"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
					<InfoBlock
						title="5 бесплатных решений"
						description="Новые пользователи получают 5 молний. Затем оформляйте подписку и решайте больше задач."
						image="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1280&auto=format&fit=crop"
						buttonText="Узнать о подписке"
						onButtonClick={() => {}}
						imagePosition="right"
					/>
					<InfoBlock
						title="История и прогресс"
						description="Сохраняйте решения, возвращайтесь к ним и делитесь ими."
						image="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1280&auto=format&fit=crop"
						buttonText="Открыть историю"
						onButtonClick={() => {}}
						imagePosition="left"
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }} align="center">
						Каталог страниц
					</Typography>
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
						<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
								Классы
							</Typography>
							{classesByStage.map((seg) => (
								<Box key={seg.title} sx={{ mb: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
										{seg.icon}
										<Typography sx={{ fontWeight: 600 }}>{seg.title}</Typography>
									</Box>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
										{seg.list.map((slug) => (
											<MLink key={slug} component={NextLink} href={`/${slug}`} underline="none">
												<Paper elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
													{classLabel(slug)}
												</Paper>
											</MLink>
										))}
									</Box>
								</Box>
							))}
						</Paper>
						<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
								Предметы
							</Typography>
							{subjectsByCategory.map((seg) => {
								const items = seg.items.filter((s) => subjects.includes(s));
								if (!items.length) return null;
								return (
									<Box key={seg.title} sx={{ mb: 2 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
											{seg.icon}
											<Typography sx={{ fontWeight: 600 }}>{seg.title}</Typography>
										</Box>
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
											{items.map((slug) => (
												<MLink key={slug} component={NextLink} href={`/${slug}`} underline="none">
													<Paper elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
														{subjectLabels[slug] ?? slug}
													</Paper>
												</MLink>
											))}
										</Box>
									</Box>
								);
							})}
						</Paper>
					</Box>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<FAQSection
						title="Частые вопросы"
						faqItems={[
							{ id: 1, question: 'Сколько бесплатных решений?', answer: '5 молний для новых пользователей.' },
							{ id: 2, question: 'Как работает распознавание?', answer: 'Мы используем OCR и алгоритмы анализа.' },
							{ id: 3, question: 'Где сохраняются решения?', answer: 'В истории в вашем аккаунте.' },
							{ id: 4, question: 'Как оформить подписку?', answer: 'Выберите подходящий тариф и оплатите.' },
						]}
					/>
				</Container>
			</Box>
		</main>
	);
}



