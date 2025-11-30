import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import HomeUploadSection from '@/components/home/HomeUploadSection';
import HowToUseSteps from '@/components/HowToUseSteps';
import InfoBlock from '@/components/InfoBlock';
import FAQSection from '@/components/FAQSection';
import LessonsTable, { LessonsInput } from '@/components/LessonsTable';
import infoblock1 from '@/assets/infoblock1.png';
import infoblock2 from '@/assets/infoblock2.png';
import infoblock3 from '@/assets/infoblock3.png';
import Banner1 from '@/assets/banner-1.png';
import faqItems from '../faq.json';
import lessonsData from '../lessons.json';

const lessons = lessonsData as LessonsInput;

const HOW_TO_USE_STEPS = [
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
] as const;

const INFO_BLOCKS = [
	{
		title: '⚡ Быстрые и осмысленные ответы',
		description:
			'Получайте точные и осмысленные ответы на домашнее задание за секунды. Просто сделайте фото упражнения - сервис распознает текст, решит задачу и выдаст понятный ответ и подробно объяснит решение. Быстро, удобно и без бесконечного листания бумажных решебников в долгих поисках ответов.',
		image: infoblock1,
		imagePosition: 'left' as const,
		buttonText: 'Получить ответ по фото',
	},
	{
		title: '🧠 Понятное объяснение задачи',
		description:
			'Наш ИИ не просто подсказывает ответ - он подробно объясняет, как решается задача. Пошаговые разборы, формулы, логика и примеры помогут действительно понять материал и разобраться в сложных темах - как с внимательным репетитором.',
		image: infoblock2,
		imagePosition: 'right' as const,
		buttonText: 'Получить объяснение',
	},
	{
		title: '📚 Все школьные предметы - универсальный решебник и ГДЗ',
		description:
			'Один сервис - все решения. Поддерживаем математику, русский, физику, химию, английский и другие предметы. Универсальный решебник по фото: загрузите фото задачи - получите решение и объяснение в один клик.',
		image: infoblock3,
		imagePosition: 'left' as const,
		buttonText: 'Решить задачу по фото',
	},
] as const;

export const revalidate = 3600;

export const metadata: Metadata = {
	title: 'Гдз по фото бесплатно с помощью ИИ — мгновенные решения',
	description:
		'Загрузите фото домашнего задания и получите подробное решение от ИИ. Поддерживаем все школьные предметы, объясняем шаги решения и экономим ваше время.',
};

function asUrl(mod: any): string {
	return typeof mod === 'string' ? mod : (mod && typeof mod.src === 'string' ? mod.src : '');
}

export default function Page() {
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
						<Box id="hero-upload" sx={{ height: '100%' }}>
							<HomeUploadSection />
						</Box>
					</Box>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<HowToUseSteps steps={HOW_TO_USE_STEPS} />
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
					{INFO_BLOCKS.map((block) => (
						<InfoBlock
							key={block.title}
							title={block.title}
							description={block.description}
							image={asUrl(block.image)}
							buttonText={block.buttonText}
							buttonHref="#hero-upload"
							imagePosition={block.imagePosition}
						/>
					))}
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
				<Container maxWidth="lg">
					<Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }} align="center">
						📚 Все школьные предметы и классы
					</Typography>
					<LessonsTable data={lessons} />
				</Container>
			</Box>

			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<FAQSection title="Частые вопросы" faqItems={faqItems} />
				</Container>
			</Box>
		</main>
	);
}
