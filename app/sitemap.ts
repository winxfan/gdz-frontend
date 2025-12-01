import type { MetadataRoute } from 'next';
import lessonsData from '../lessons.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';
const CLASS_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] as const;

type ClassKey = (typeof CLASS_KEYS)[number];

type Lesson = {
	name: string;
	title: string;
	classes: Record<ClassKey, boolean>;
};

type SitemapEntry = MetadataRoute.Sitemap[number];

function formatUrl(path: string): string {
	if (!path) {
		return SITE_URL;
	}
	const normalized = path.replace(/^\/+/, '');
	return `${SITE_URL}/${normalized}`;
}

function createEntry(
	path: string,
	now: Date,
	changeFrequency: SitemapEntry['changeFrequency'] = 'weekly',
	priority = 0.5,
): SitemapEntry {
	return {
		url: formatUrl(path),
		lastModified: now,
		changeFrequency,
		priority,
	};
}

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const lessons = lessonsData as Lesson[];
	const staticRoutes = ['', 'privacy', 'personal-data', 'user-agreement', 'profile'].map((path) =>
		createEntry(path, now, path === '' ? 'daily' : 'weekly', path === '' ? 1 : 0.5),
	);

	const classRoutes = CLASS_KEYS.map((key) => createEntry(`${key}-class`, now, 'weekly', 0.8));
	const subjectRoutes = lessons.map((lesson) => createEntry(lesson.name, now, 'weekly', 0.7));

	const subjectClassRoutes = lessons.flatMap((lesson) =>
		CLASS_KEYS.filter((key) => lesson.classes[key]).map((key) =>
			createEntry(`${key}-class/${lesson.name}`, now, 'weekly', 0.6),
		),
	);

	return [...staticRoutes, ...classRoutes, ...subjectRoutes, ...subjectClassRoutes];
}



