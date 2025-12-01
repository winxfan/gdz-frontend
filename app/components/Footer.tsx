import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import lessons from '../../lessons.json';

type LessonLink = {
	href: string;
	label: string;
};

const LESSON_LINKS: LessonLink[] = (lessons as Array<{ name: string; title: string; emoji?: string }>).map((lesson) => ({
	href: `/${lesson.name}`,
	label: `${lesson.emoji ?? ''} ${lesson.title}`.trim(),
}));

const CLASS_LINKS: LessonLink[] = Array.from({ length: 11 }, (_, index) => {
	const classNum = index + 1;
	return {
		href: `/${classNum}-class`,
		label: `${classNum} класс`,
	};
});

export default function Footer() {
	return (
		<Box component="footer" sx={{ mt: 6, borderTop: '1px solid', borderColor: 'divider', py: 4 }}>
			<Box sx={{ px: { xs: 2, md: 4 }, mt: 3, color: 'text.secondary', display: 'grid', rowGap: 1.25 }}>
				<Typography variant="body2">© 2025, гдз-по-фото.рф</Typography>
				<Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
					ИП Резбаев Данил Эдуардович, ИНН 021904517407, ОГРНИП 325028002186815
				</Typography>
				<Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
					Поддержка: <a href="mailto:hello@гдз-по-фото.рф">hello@гдз-по-фото.рф</a>
				</Typography>

				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
						gap: { xs: 2, md: 4 },
						mt: 2,
					}}
				>
					<FooterLinksColumn title="Уроки" links={LESSON_LINKS} />
					<FooterLinksColumn title="Классы" links={CLASS_LINKS} />
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: { xs: 1, sm: 2 },
						alignItems: { xs: 'flex-start', sm: 'center' },
						mt: 2,
					}}
				>
					<Typography component={Link as any} href="/privacy" color="text.secondary" sx={{ textDecoration: 'none' }}>
						Политика конфиденциальности
					</Typography>
					<Typography component={Link as any} href="/personal-data" color="text.secondary" sx={{ textDecoration: 'none' }}>
						Политика обработки персональных данных
					</Typography>
					<Typography component={Link as any} href="/user-agreement" color="text.secondary" sx={{ textDecoration: 'none' }}>
						Пользовательское соглашение
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

type FooterLinksColumnProps = {
	title: string;
	links: LessonLink[];
};

function FooterLinksColumn({ title, links }: FooterLinksColumnProps) {
	return (
		<Box>
			<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
				{title}
			</Typography>
			<Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', rowGap: 0.5 }}>
				{links.map((link) => (
					<li key={link.href}>
						<Typography component={Link as any} href={link.href} color="text.secondary" sx={{ textDecoration: 'none' }}>
							{link.label}
						</Typography>
					</li>
				))}
			</Box>
		</Box>
	);
}


