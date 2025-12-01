import lessons from '../../../lessons.json';
import lessonsContent from '../../../lessons_content.json';
import { PageContent, type PageInfoBlock } from '@/page';

type Params = { slug: string; subject: string };

type LessonItem = {
	name: string;
	title: string;
	emoji?: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

type LessonContentEntry = {
	title: string;
	blocks: PageInfoBlock[];
};

type LessonContentMap = Record<string, LessonContentEntry>;

function parseClassNumber(slug: string): string | null {
	const m = slug.match(/^(1|2|3|4|5|6|7|8|9|10|11)-class$/);
	return m ? m[1] : null;
}

function subjectByName(name: string): LessonItem | undefined {
	return (lessons as LessonItem[]).find((s) => s.name === name);
}

function subjectTitleLower(title: string): string {
	return title.toLocaleLowerCase('ru-RU');
}

function extractSubjectFromTitle(title?: string): string | undefined {
	if (!title) {
		return undefined;
	}
	const match = title.match(/^Гдз по фото по (.+) бесплатно с помощью ИИ/iu);
	return match?.[1];
}

function buildTitle(baseSubjectTitle: string | undefined, fallbackSubject: string, classNum: string, emoji: string): string {
	const subjectPart = baseSubjectTitle ?? fallbackSubject;
	return `Гдз по фото по ${subjectPart} ${classNum} класс бесплатно с помощью ИИ ${emoji}`;
}

function buildDescription(subjectTitle: string, classNum: string): string {
	return [
		`Загрузите фото задания по ${subjectTitle} за ${classNum} класс — ИИ сразу распознает условие и уточнения.`,
		`Сервис подробно объяснит решение, чтобы ученик смог повторить логику и подготовиться к урокам.`,
		`Помогаем экономить время родителям и детям, превращая домашку в понятный пошаговый процесс.`,
	].join(' ');
}

function buildInfoBlocks(subjectTitle: string, subjectLower: string, classNum: string): PageInfoBlock[] {
	return [
		{
			title: `📘 ${subjectTitle} — ${classNum} класс`,
			description: `Получайте мгновенные решения по темам ${classNum} класса. Загружаете фото — получаете понятный разбор и пояснения по каждому шагу по ${subjectLower}.`,
		},
		{
			title: '🧠 Понятные объяснения',
			description:
				'ИИ показывает ход решения простым языком: формулы, определения и алгоритмы. Ребёнок повторяет логику и закрепляет материал без стресса.',
		},
		{
			title: '⚡ Быстрая проверка',
			description:
				'Не нужно листать бумажные решебники. Один снимок — и готовое объяснение, которое можно использовать для подготовки к урокам и контрольным.',
		},
	];
}

export function generateStaticParams(): Params[] {
	const items = lessons as LessonItem[];
	const params: Params[] = [];
	for (const it of items) {
		for (let n = 1; n <= 11; n += 1) {
			const k = String(n) as keyof LessonItem['classes'];
			if (it.classes[k]) {
				params.push({ slug: `${n}-class`, subject: it.name });
			}
		}
	}
	return params;
}

export default function Page({ params }: { params: Params }) {
	const classNum = parseClassNumber(params.slug);
	const subj = subjectByName(params.subject);
	const lessonsContentMap = lessonsContent as LessonContentMap;

	if (!classNum || !subj) {
		return <PageContent title="Гдз по фото" infoBlocks={[]} />;
	}

	const baseTitleSubject = extractSubjectFromTitle(lessonsContentMap[params.subject]?.title);
	const subjectLower = (baseTitleSubject ?? subjectTitleLower(subj.title)).trim();
	const title = buildTitle(baseTitleSubject, subjectLower, classNum, subj.emoji ?? '🎓');
	const description = buildDescription(subjectLower, classNum);
	const infoBlocks = buildInfoBlocks(subj.title, subjectLower, classNum);

	return <PageContent title={title} description={description} infoBlocks={infoBlocks} />;
}



