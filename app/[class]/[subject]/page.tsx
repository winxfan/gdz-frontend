import { Container, Typography, Box, Paper } from '@mui/material';
import lessons from '../../../lessons.json';

type Params = { class: string; subject: string };

type LessonItem = {
	name: string;
	title: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

function parseClassNumber(classSlug: string): string | null {
	const m = classSlug.match(/^(1|2|3|4|5|6|7|8|9|10|11)-class$/);
	return m ? m[1] : null;
}

function subjectByName(name: string): LessonItem | undefined {
	return (lessons as LessonItem[]).find((s) => s.name === name);
}

export default async function Page({ params }: { params: Params }) {
	const classNum = parseClassNumber(params.class);
	const subj = subjectByName(params.subject);

	const title =
		classNum && subj
			? `${subj.title} — ${classNum} класс`
			: `${params.subject} — ${params.class}`;

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
						<Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
							{title}
						</Typography>
						<Typography color="text.secondary">
							Страница пересечения предмета и класса (пустая заглушка).
						</Typography>
					</Paper>
				</Container>
			</Box>
		</main>
	);
}


