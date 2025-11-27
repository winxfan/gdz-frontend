import Providers from './providers';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import logoPng from '@/assets/гдз-по-фото.рф-logo.jpg';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';

export const metadata: Metadata = {
	title: {
		default: 'Гдз по фото бесплатно. Решение задач по фото с ИИ',
		template: '%s | гдз-по-фото.рф',
	},
	description:
		'Загружайте фото задания и получайте мгновенные решения с понятными объяснениями. Все предметы и классы. Умная нейросеть распознаёт, решает и объясняет.',
	keywords: [
		'ГДЗ по фото',
		'решебник по фото',
		'решение задач по фото',
		'ИИ решает задачи',
		'решить домашнее задание по фото',
		'решить уравнение по фото',
		'ответы на задачи по фото',
	],
	applicationName: 'гдз-по-фото.рф',
	metadataBase: new URL(SITE_URL),
	alternates: {
		canonical: '/',
	},
	openGraph: {
		type: 'website',
		url: '/',
		title: 'гдз-по-фото.рф — Решение задач по фото с ИИ',
		description:
			'Загрузите фото задачи — получите точное решение и понятное объяснение. Быстро, удобно, для всех предметов.',
		siteName: 'гдз-по-фото.рф',
		images: [
			{
				url: logoPng.src,
				width: 1200,
				height: 630,
				alt: 'гдз-по-фото.рф — Решение задач по фото с ИИ',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'гдз-по-фото.рф — Решение задач по фото с ИИ',
		description:
			'Фото задания → готовое решение с объяснением. Все предметы и классы.',
		images: [logoPng.src],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	icons: {
		icon: [{ url: logoPng.src, sizes: 'any', type: 'image/png' }],
	},
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="ru" className={inter.className}>
			<body>
				<Providers>
					<Header />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}


