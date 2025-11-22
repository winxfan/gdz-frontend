import Providers from './providers';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import logoPng from '@/assets/gdz-logo.jpg';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
	title: 'gdz-frontend',
	description: 'Next.js 14 App Router + TS + MUI baseline',
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="ru" className={inter.className}>
			<head>
				<link rel="icon" href={logoPng.src} type="image/png" sizes="any" />
			</head>
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


