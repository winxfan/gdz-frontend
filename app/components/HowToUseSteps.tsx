import { Box, Divider, Paper, Typography } from '@mui/material';

export type StepItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export type HowToUseStepsProps = {
  title?: string;
  steps: StepItem[];
};

export default function HowToUseSteps({ title = 'Как работает гдз по фото', steps }: HowToUseStepsProps) {
  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 4 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
        {steps.map((s, idx) => (
          <Box key={idx}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'inline-block', mb: 2, px: 2, py: 0.5, borderRadius: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{`Шаг ${idx + 1}`}</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {s.title}
              </Typography>
              <Typography color="text.secondary">{s.description}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


