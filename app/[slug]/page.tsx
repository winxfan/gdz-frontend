'use client';

import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import UploadZoneWithChess from '@/components/UploadZoneWithChess';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import type { Metadata } from 'next';

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

export async function generateStaticParams() {
	return [...subjects, ...classes].map((slug) => ({ slug }));
}

function titleFromSlug(slug: string): string {
	return slug
		.split('-')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const t = titleFromSlug(params.slug);
	return {
		title: `${t} — ГДЗ по фото`,
		description: `Решение задач по "${t}" по фото. Загрузите задачу и получите решение.`,
	};
}

export default function SubjectOrClassPage({ params }: { params: { slug: string } }) {
	const h1 = titleFromSlug(params.slug);
	const handleSelect = async (file: File) => {
		console.log('Selected file', file.name);
	};

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Typography component="h1" variant="h3" align="center" sx={{ fontWeight: 800, mb: 1 }}>
						{h1}: решаем задачи по фото
					</Typography>
					<Typography align="center" color="text.secondary" sx={{ mb: { xs: 4, md: 6 } }}>
						Загрузите фото — получайте подробные решения. 5 бесплатных молний для старта.
					</Typography>

					<Grid container spacing={3} alignItems="stretch">
						<Grid item xs={12} md={6}>
							<Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, height: '100%', border: '1px solid', borderColor: 'divider' }}>
								<Box
									component="img"
									src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1280&auto=format&fit=crop"
									alt="Учёба"
									sx={{ width: '100%', borderRadius: 2, display: 'block', objectFit: 'cover' }}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
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
						</Grid>
					</Grid>
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
						title="Под конкретный предмет и класс"
						description="Сервис адаптирует решение под предмет и уровень сложности. Мы подберём подходящую стратегию объяснения."
						image="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1280&auto=format&fit=crop"
						buttonText="Начать"
						onButtonClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						imagePosition="left"
					/>
					<InfoBlock
						title="Подписка для активного обучения"
						description="Получайте больше решений с подпиской — учитесь быстрее, готовьтесь к контрольным и экзаменам."
						image="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1280&auto=format&fit=crop"
						buttonText="Посмотреть тарифы"
						onButtonClick={() => {}}
						imagePosition="right"
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<FAQSection
						title="Частые вопросы"
						faqItems={[
							{ id: 1, question: 'Что такое молнии?', answer: 'Это внутренняя валюта: 1 молния = 1 решение.' },
							{ id: 2, question: 'Как определить предмет по фото?', answer: 'Система анализирует контент и автоматически выбирает предмет.' },
							{ id: 3, question: 'Можно ли исправить ошибки распознавания?', answer: 'Да, вы сможете отредактировать текст и переслать.' },
							{ id: 4, question: 'Есть ли история решений?', answer: 'Да, решения сохраняются для повторного просмотра.' },
						]}
					/>
				</Container>
			</Box>
		</main>
	);
}


