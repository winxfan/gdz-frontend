import classesContent from '../../classes_content.json';
import lessons from '../../lessons.json';
import lessonsContent from '../../lessons_content.json';
import lessonsDescriptions from '../../lessons_descriptions.json';
import { PageContent, type PageInfoBlock, DEFAULT_PAGE_DESCRIPTION } from '@/page';

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

type DescriptionEntry = {
	description: string;
};

type DescriptionMap = Record<string, DescriptionEntry>;

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
	const lessonsDescriptionsMap = lessonsDescriptions as DescriptionMap;

	let title = '';
	let content: ContentEntry | null = null;
	let description: string | undefined;
	if (classPage) {
		const n = slug.split('-')[0];
		content = classesContentMap[n] ?? null;
		title = content?.title || `${n} класс`;
		description = DEFAULT_PAGE_DESCRIPTION;
	} else {
		const subj = subjectByName(slug);
		content = lessonsContentMap[slug] ?? null;
		title = content?.title || subj?.title || slug;
		description = lessonsDescriptionsMap[slug]?.description ?? DEFAULT_PAGE_DESCRIPTION;
	}

	return <PageContent title={title} description={description} infoBlocks={content?.blocks ?? []} />;
}


