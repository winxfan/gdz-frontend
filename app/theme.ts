import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: { light: '#CDB6FF', main: '#9B6CFA', dark: '#6533C6', contrastText: '#FFFFFF' },
		secondary: { light: '#FFD6D6', main: '#FF6F6F', dark: '#C53B3B', contrastText: '#FFFFFF' },
		success: { light: '#E6F8F0', main: '#3CCB8B', dark: '#1B8B56', contrastText: '#0E2D1C' },
		background: { default: '#FFFFFF', paper: '#F7F7F9' },
		text: { primary: '#2E2E52', secondary: '#6A6A8C' },
	},
	typography: {
		fontFamily: `'Roboto', 'Helvetica', 'Arial', 'sans-serif'`,
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



