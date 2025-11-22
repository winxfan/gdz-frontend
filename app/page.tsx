'use client';

import { Box, Container, Typography, Link as MLink, Paper } from '@mui/material';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import NextLink from 'next/link';
import infoblock1 from '@/assets/infoblock1.png';
import infoblock2 from '@/assets/infoblock2.png';
import infoblock3 from '@/assets/infoblock3.png';
import { alpha } from '@mui/material/styles';
import Banner1 from '@/assets/banner-1.png';
import subjectsData from '@/subjects.json';

const classes = Array.from({ length: 11 }, (_, i) => `${i + 1}-class`);

export default function Page() {
	const handleSelect = async (file: File) => {
		console.log('Selected file', file.name);
	};

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
						title="⚡ Быстрые и осмысленные ответы"
						description="Получайте точные и осмысленные ответы на задание за секунды. Просто сделайте фото упражнения — сервис распознает текст, решит задачу и выдаст понятный результат без лишнего поиска. Быстро, удобно и без бесконечного листания обычных решебников."
						image={asUrl(infoblock1)}
						buttonText="Попробовать"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
					<InfoBlock
						title="🧠 Понятное объяснение задачи"
						description="Наш ИИ не просто подсказывает ответ — он подробно объясняет, как решается задача. Пошаговые разборы, формулы, логика и примеры помогут действительно понять материал и разобраться в сложных темах — как с внимательным репетитором."
						image={asUrl(infoblock2)}
						buttonText="Узнать о подписке"
						onButtonClick={() => {}}
						imagePosition="right"
					/>
					<InfoBlock
						title="📚 Все школьные предметы — универсальный решебник и ГДЗ"
						description="Один сервис — все решения. Поддерживаем математику, русский, физику, химию, английский и другие предметы. Универсальный решебник по фото: загрузите фото задачи — получите решение и объяснение в один клик."
						image={asUrl(infoblock3)}
						buttonText="Открыть историю"
						onButtonClick={() => {}}
						imagePosition="left"
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }} align="center">
						📚 Любые предметы и все классы
					</Typography>
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
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
						<Paper
							elevation={0}
							sx={(t) => ({
								p: 3,
								border: '1px solid',
								borderColor: alpha(t.palette.secondary.main, 0.25),
								bgcolor: alpha(t.palette.secondary.main, 0.06),
							})}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
								Предметы
							</Typography>
							{subjectsByCategory.map((seg) => (
								<Box key={seg.title} sx={{ mb: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'secondary.main' }}>
										<Typography sx={{ fontWeight: 600 }}>{seg.title}</Typography>
									</Box>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
										{(seg.list || []).map((item, idx) => (
											<MLink
												key={`${item.title}-${idx}`}
												component={NextLink}
												href={`/${encodeURIComponent(item.title)}`}
												underline="none"
											>
												<Paper elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
													{item.title}
												</Paper>
											</MLink>
										))}
									</Box>
								</Box>
							))}
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



