import { Container, Typography, Box, Paper } from '@mui/material';
import lessons from '../../lessons.json';

type Params = { slug: string };

type LessonItem = {
	name: string;
	title: string;
	classes: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11', boolean>;
};

function isClassSlug(slug: string): boolean {
	return /^(?:[1-9]|10|11)-class$/.test(slug);
}

function subjectByName(name: string): LessonItem | undefined {
	return (lessons as LessonItem[]).find((s) => s.name === name);
}

export default async function Page({ params }: { params: Params }) {
	const { slug } = params;
	const classPage = isClassSlug(slug);

	let title = '';
	if (classPage) {
		const n = slug.split('-')[0];
		title = `${n} класс`;
	} else {
		const subj = subjectByName(slug);
		title = subj?.title || slug;
	}

	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="lg">
					<Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
						<Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
							{title}
						</Typography>
						<Typography color="text.secondary">
							{classPage ? 'Страница класса (пустая заглушка).' : 'Страница предмета (пустая заглушка).'}
						</Typography>
					</Paper>
				</Container>
			</Box>
		</main>
	);
}


