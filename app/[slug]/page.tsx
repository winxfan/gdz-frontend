import classesContent from '../../classes_content.json';
import lessons from '../../lessons.json';
import lessonsContent from '../../lessons_content.json';
import { PageContent, type PageInfoBlock } from '@/page';

type Params = { slug: string };

type LessonItem = {
	name: string;
	title: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

type ContentEntry = {
	title: string;
	blocks: PageInfoBlock[];
};

type ContentMap = Record<string, ContentEntry>;

function isClassSlug(slug: string): boolean {
	return /^(?:[1-9]|10|11)-class$/.test(slug);
}

function subjectByName(name: string): LessonItem | undefined {
	return (lessons as LessonItem[]).find((s) => s.name === name);
}

export function generateStaticParams(): Params[] {
	const items = lessons as LessonItem[];
	const subjectSlugs = items.map((s) => ({ slug: s.name }));
	const classSlugs = Array.from({ length: 11 }, (_, i) => ({ slug: `${i + 1}-class` }));
	return [...subjectSlugs, ...classSlugs];
}

export default function Page({ params }: { params: Params }) {
	const { slug } = params;
	const classPage = isClassSlug(slug);

	const classesContentMap = classesContent as ContentMap;
	const lessonsContentMap = lessonsContent as ContentMap;

	let title = '';
	let content: ContentEntry | null = null;
	if (classPage) {
		const n = slug.split('-')[0];
		content = classesContentMap[n] ?? null;
		title = content?.title || `${n} класс`;
	} else {
		const subj = subjectByName(slug);
		content = lessonsContentMap[slug] ?? null;
		title = content?.title || subj?.title || slug;
	}

	return <PageContent title={title} infoBlocks={content?.blocks ?? []} />;
}


