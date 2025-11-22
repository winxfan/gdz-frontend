import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: { main: '#9B6CFA' },
		secondary: { main: '#FF6F6F' },
		background: { default: '#FFFFFF', paper: '#F7F7F9' },
		text: { primary: '#2E2E52', secondary: '#6A6A8C' },
	},
	typography: {
		fontFamily: 'Inter, sans-serif',
		h1: { fontSize: '48px', fontWeight: 700 },
		h2: { fontSize: '32px', fontWeight: 700 },
		body1: { fontSize: '18px', lineHeight: 1.5 },
		button: { textTransform: 'none', fontWeight: 600, fontSize: '16px' },
	},
	shape: { borderRadius: 20 },
	components: {
		MuiButton: {
			styleOverrides: { root: { borderRadius: 16, padding: '12px 24px' } },
		},
		MuiTextField: {
			styleOverrides: {
				root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } },
			},
		},
		MuiPaper: {
			styleOverrides: { root: { borderRadius: 20 } },
		},
	},
});


