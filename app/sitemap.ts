import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const routes = ['', 'privacy', 'personal-data', 'user-agreement', 'profile'];
	return routes.map((path) => ({
		url: `${SITE_URL}/${path}`,
		lastModified: now,
		changeFrequency: path === '' ? 'daily' : 'weekly',
		priority: path === '' ? 1 : 0.5,
	}));
}


