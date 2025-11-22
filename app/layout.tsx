import './globals.css';

export const metadata = {
	title: 'gdz-frontend',
	description: 'Next.js 14 App Router + TS + MUI baseline',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ru">
			<body>
				{children}
			</body>
		</html>
	);
}


