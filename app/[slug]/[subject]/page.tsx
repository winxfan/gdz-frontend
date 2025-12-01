import lessons from '../../../lessons.json';
import { PageContent } from '@/page';

type Params = { slug: string; subject: string };

type LessonItem = {
	name: string;
	title: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

function parseClassNumber(slug: string): string | null {
	const m = slug.match(/^(1|2|3|4|5|6|7|8|9|10|11)-class$/);
	return m ? m[1] : null;
}

function subjectByName(name: string): LessonItem | undefined {
	return (lessons as LessonItem[]).find((s) => s.name === name);
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

export default async function Page({ params }: { params: Params }) {
	const classNum = parseClassNumber(params.slug);
	const subj = subjectByName(params.subject);

	const title =
		classNum && subj
			? `${subj.title} — ${classNum} класс`
			: `${params.subject} — ${params.slug}`;

	return <PageContent title={title} infoBlocks={[]} />;
}



