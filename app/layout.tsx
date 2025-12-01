import Providers from './providers';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ReactNode } from 'react';
import logoPng from '@/assets/gdz-logo.webp';
import type { Metadata } from 'next';
import Script from 'next/script';
import 'katex/dist/katex.min.css';
import Toolbar from '@mui/material/Toolbar';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';
const YANDEX_METRIKA_ID = '105601470';

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
		icon: [{ url: logoPng.src, sizes: 'any', type: 'image/webp' }],
	},
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="ru">
			<body>
				<Script
					id="yandex-metrika"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
							(function(m,e,t,r,i,k,a){
								m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
								m[i].l=1*new Date();
								for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
								k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
							})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');
							ym(${YANDEX_METRIKA_ID}, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", accurateTrackBounce: true, trackLinks: true });
						`,
					}}
					async
				/>
				<noscript>
					<div>
						<img
							src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
							style={{ position: 'absolute', left: '-9999px' }}
							alt=""
						/>
					</div>
				</noscript>
				<Providers>
					<Header />
					<Toolbar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}


