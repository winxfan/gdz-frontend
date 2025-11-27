import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, borderTop: '1px solid', borderColor: 'divider', py: 4 }}>
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 3, color: 'text.secondary' }}>
        <Typography variant="body2">© 2025, гдз-по-фото.рф</Typography>
        <Typography variant="body2">ИП Резбаев Данил Эдуардович, ИНН 021904517407, ОГРНИП 325028002186815</Typography>
        <Typography variant="body2">Поддержка: <a href="mailto:hello@гдз-по-фото.рф">hello@гдз-по-фото.рф</a></Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <Typography component={Link as any} href="/privacy" color="text.secondary" sx={{ textDecoration: 'none' }}>Политика конфиденциальности</Typography>
          <Typography component={Link as any} href="/personal-data" color="text.secondary" sx={{ textDecoration: 'none' }}>Политика обработки персональных данных</Typography>
          <Typography component={Link as any} href="/user-agreement" color="text.secondary" sx={{ textDecoration: 'none' }}>Пользовательское соглашение</Typography>
        </Box>

      </Box>
    </Box>
  );
}


