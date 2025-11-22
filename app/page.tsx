'use client';

import { Box, Container, Typography, Link as MLink, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import NextLink from 'next/link';

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

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Typography component="h1" variant="h3" align="center" sx={{ fontWeight: 800, mb: 1 }}>
						ГДЗ по фото — мгновенное решение задач
					</Typography>
					<Typography align="center" color="text.secondary" sx={{ mb: { xs: 4, md: 6 } }}>
						Загрузите фото задачи — получите подробное решение за секунды. 5 бесплатных решений, далее подписка.
					</Typography>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
							gap: { xs: 2, md: 3 },
							alignItems: 'stretch',
						}}
					>
						<Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, height: '100%', border: '1px solid', borderColor: 'divider' }}>
							<Box
								component="img"
								src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1280&auto=format&fit=crop"
								alt="Учёба"
								sx={{ width: '100%', borderRadius: 2, display: 'block', objectFit: 'cover' }}
							/>
						</Paper>
						<Box sx={{ height: '100%' }}>
							<UploadZoneWithChess
								onSelect={handleSelect}
								exampleImages={[
									'https://images.unsplash.com/photo-1544470903-4f755318f2d2?q=80&w=300&auto=format&fit=crop',
									'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=300&auto=format&fit=crop',
									'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=300&auto=format&fit=crop',
								]}
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
							{ title: 'Загрузите фото', description: 'Сделайте снимок задачи и загрузите изображение.' },
							{ title: 'Мы распознаем и решим', description: 'OCR → анализ → решение с пошаговыми пояснениями.' },
							{ title: 'Получите ответ', description: 'Покажем решение и сохраним в историю.' },
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
					<Grid container columns={12} columnSpacing={3} rowSpacing={3}>
						<Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
							<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
									Классы
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{classes.map((slug) => (
										<MLink key={slug} component={NextLink} href={`/${slug}`} underline="none">
											<Paper elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
												{slug}
											</Paper>
										</MLink>
									))}
								</Box>
							</Paper>
						</Grid>
						<Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
							<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
									Предметы
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{subjects.map((slug) => (
										<MLink key={slug} component={NextLink} href={`/${slug}`} underline="none">
											<Paper elevation={0} sx={{ px: 1.25, py: 0.5, border: '1px solid', borderColor: 'divider' }}>
												{slug}
											</Paper>
										</MLink>
									))}
								</Box>
							</Paper>
						</Grid>
					</Grid>
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



