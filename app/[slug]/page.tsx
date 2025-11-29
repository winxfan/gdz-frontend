import classesContent from '../../classes_content.json';
import lessons from '../../lessons.json';
import ClassPageContent from '@/components/ClassPageContent';

type Params = { slug: string };

type LessonItem = {
	name: string;
	title: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

type ClassPageContent = {
	title: string;
	blocks: { title: string; description: string }[];
};

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

	let title = '';
	let classContent: ClassPageContent | null = null;
	if (classPage) {
		const n = slug.split('-')[0] as keyof typeof classesContent;
		classContent = (classesContent as Record<string, ClassPageContent>)[n] ?? null;
		title = classContent?.title || `${n} класс`;
	} else {
		const subj = subjectByName(slug);
		title = subj?.title || slug;
	}

	return <ClassPageContent title={title} infoBlocks={classContent?.blocks ?? []} />;
}


