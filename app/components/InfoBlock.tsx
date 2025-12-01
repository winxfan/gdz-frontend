import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';

export type InfoBlockProps = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  onButtonClick?: () => void;
  buttonHref?: string;
  imagePosition?: 'left' | 'right';
  sx?: SxProps;
  imageAlt?: string;
};

export default function InfoBlock({
  title,
  description,
  image,
  buttonText,
  onButtonClick,
  buttonHref,
  imagePosition = 'left',
  sx,
  imageAlt,
}: InfoBlockProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: imagePosition === 'right' ? 'row-reverse' : 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
          <Box
            component="img"
            src={image}
            alt={imageAlt || title}
            sx={{ width: '100%', height: { xs: 220, md: '100%' }, objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, px: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={buttonHref ? undefined : onButtonClick}
              href={buttonHref}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}


