'use client';

import { Container, Typography, Box } from '@mui/material';

export default function PersonalDataPolicyPage() {
	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="md">
					<Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
						Политика обработки персональных данных
					</Typography>
					<Typography color="text.secondary">
						Здесь будет размещён текст политики обработки персональных данных.
					</Typography>
				</Container>
			</Box>
		</main>
	);
}


