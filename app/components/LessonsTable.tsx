'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Box,
	Chip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme, lighten } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ClassNumber =
	| '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';

export type SubjectToClasses = Record<ClassNumber, boolean>;
export type LessonsMatrix = Record<string, SubjectToClasses>;
export type LessonsItem = {
	name: string;    // латиница, kebab-case
	title: string;   // кириллица
	classes: SubjectToClasses;
};
export type LessonsArray = LessonsItem[];
export type LessonsInput = LessonsMatrix | LessonsArray;

export type LessonsTableProps = {
	data: LessonsInput;
	title?: string;
	minTableWidth?: number;
};

const colorForClass = (cls: ClassNumber, palette: ReturnType<typeof useTheme>['palette']): string => {
	const n = Number(cls);
	const base =
		n >= 1 && n <= 4
			? palette.success.main // зелёный — начальная школа
			: n >= 5 && n <= 9
				? palette.warning.main // жёлтый — средняя школа
				: palette.error.main; // красный — старшая школа (10–11)
	// Сделаем цвет мягче и пастельнее относительно темы
	return lighten(base, 0.35);
};

export default function LessonsTable({ data, title, minTableWidth = 720 }: LessonsTableProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const classSlug = (cls: ClassNumber) => `${cls}-class`;

	const items: LessonsItem[] = useMemo(() => {
		if (Array.isArray(data)) {
			return data;
		}
		// fallback для старого формата: { [title]: { '1': boolean, ... } }
		return Object.entries(data).map(([title, classes]) => ({
			name: String(title)
				.trim()
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9\-]+/g, ''),
			title,
			classes: classes as SubjectToClasses,
		}));
	}, [data]);

	const classNumbers: ClassNumber[] = useMemo(() => {
		const first = items[0]?.classes as SubjectToClasses | undefined;
		const keys = first ? Object.keys(first) : [];
		return keys
			.sort((a, b) => Number(a) - Number(b))
			.filter((k): k is ClassNumber => ['1','2','3','4','5','6','7','8','9','10','11'].includes(k));
	}, [items]);

	if (isMobile) {
		return (
			<Box sx={{ display: 'grid', gap: 1.5 }}>
				{title ? (
					<Typography variant="h2" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 0.5 }}>
						{title}
					</Typography>
				) : null}
				{items.map((it) => {
					const available = classNumbers.filter((cls) => it.classes?.[cls]);
					return (
						<Paper key={it.name} variant="outlined" sx={{ p: 1.5 }}>
							<Link href={`/${it.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
								<Typography sx={{ fontWeight: 700, mb: 1 }}>{it.title}</Typography>
							</Link>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
								{available.length > 0 ? (
									available.map((cls, idx) => (
										<Link key={`${it.name}-${cls}`} href={`/${classSlug(cls)}/${it.name}`} style={{ textDecoration: 'none' }}>
											<Chip
												label={cls}
												size="small"
												icon={<CheckCircleOutlineIcon sx={{ color: colorForClass(cls, theme.palette) }} />}
												variant="outlined"
												sx={{
													borderColor: colorForClass(cls, theme.palette),
													color: 'text.primary',
													cursor: 'pointer',
												}}
											/>
										</Link>
									))
								) : (
									<Typography color="text.secondary">Нет данных</Typography>
								)}
							</Box>
						</Paper>
					);
				})}
			</Box>
		);
	}

	return (
		<TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
			{title ? (
				<Box sx={{ p: 2, pb: 0 }}>
					<Typography variant="h6" sx={{ fontWeight: 700 }}>
						{title}
					</Typography>
				</Box>
			) : null}
			<Table stickyHeader sx={{ minWidth: minTableWidth }}>
				<TableHead>
					<TableRow>
						<TableCell
							sx={{
								position: 'sticky',
								left: 0,
								zIndex: 2,
								bgcolor: 'background.paper',
								fontWeight: 700,
								minWidth: 200,
							}}
						/>
						{classNumbers.map((cls) => (
							<TableCell key={cls} align="center">
								<Link href={`/${classSlug(cls)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
									<Typography
										variant="subtitle2"
										sx={{ fontWeight: 700, color: colorForClass(cls, theme.palette) }}
									>
										{cls}
									</Typography>
								</Link>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{items.map((it) => (
						<TableRow key={it.name} hover>
							<TableCell
								component="th"
								scope="row"
								sx={{
									position: 'sticky',
									left: 0,
									zIndex: 1,
									bgcolor: 'background.paper',
									fontWeight: 600,
									fontSize: 16,
									whiteSpace: 'nowrap',
									minWidth: 200,
								}}
							>
								<Link href={`/${it.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
									{it.title}
								</Link>
							</TableCell>
							{classNumbers.map((cls) => (
								<TableCell key={`${it.name}-${cls}`} align="center">
									{it.classes?.[cls] ? (
										<Link href={`/${classSlug(cls)}/${it.name}`} aria-label={`${it.title} — ${cls} класс`} style={{ color: 'inherit' }}>
											<CheckCircleOutlineIcon
												sx={{ color: colorForClass(cls, theme.palette), cursor: 'pointer' }}
											/>
										</Link>
									) : null}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}


