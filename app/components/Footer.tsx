import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TelegramIcon from '@mui/icons-material/Telegram';
import PublicIcon from '@mui/icons-material/Public';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, borderTop: '1px solid', borderColor: 'divider', py: 4 }}>
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 3, color: 'text.secondary' }}>
        <Typography variant="body2">© 2025, Neurolibrary</Typography>
        <Typography variant="body2">ИП Резбаев Данил Эдуардович, ИНН 021904517407, ОГРНИП 325028000186815</Typography>
        <Typography variant="body2">Поддержка: <a href="mailto:hello@Neurolibrary">hello@Neurolibrary</a></Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <Typography component={Link as any} href="/privacy" color="text.secondary" sx={{ textDecoration: 'none' }}>Политика конфиденциальности</Typography>
          <Typography component={Link as any} href="/personal-data" color="text.secondary" sx={{ textDecoration: 'none' }}>Политика обработки персональных данных</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <IconButton component="a" href="https://vk.com" target="_blank" rel="noreferrer" size="small" color="inherit" aria-label="VK">
            <PublicIcon fontSize="small" />
          </IconButton>
          <IconButton component="a" href="https://t.me" target="_blank" rel="noreferrer" size="small" color="inherit" aria-label="Telegram">
            <TelegramIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}


