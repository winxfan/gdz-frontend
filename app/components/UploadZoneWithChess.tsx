import { useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Chip, Typography, CircularProgress, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import FreeButton from '@/components/FreeButton';
import { normalizeImageFile } from '@/utils/imageConverter';

export type UploadZoneWithChessProps = {
  onSelect: (file: File) => void;
  exampleImages?: string[];
  buttonLabel?: string;
  backgroundOpacity?: number;
  disabled?: boolean;
  loading?: boolean;
};

type SubjectTag = {
  label: string;
  emoji: string;
  bg: string;
  color: string;
};

const SUBJECT_TAGS: ReadonlyArray<SubjectTag> = [
  { label: 'Английский язык', emoji: '🇬🇧', bg: '#E3F2FD', color: '#0D47A1' },
  { label: 'Математика', emoji: '➗', bg: '#FCE4EC', color: '#AD1457' },
  { label: 'Русский язык', emoji: '🇷🇺', bg: '#F3E5F5', color: '#6A1B9A' },
  { label: 'Алгебра', emoji: '🔢', bg: '#E8F5E9', color: '#1B5E20' },
  { label: 'Геометрия', emoji: '📐', bg: '#FFF3E0', color: '#E65100' },
  { label: 'История', emoji: '📜', bg: '#EFEBE9', color: '#4E342E' },  
  { label: 'География', emoji: '🌍', bg: '#E0F7FA', color: '#006064' },
  { label: 'Литература', emoji: '📖', bg: '#FFF8E1', color: '#5D4037' },
  { label: 'Химия', emoji: '👩‍🔬', bg: '#E8F5E9', color: '#1B5E20' },
  { label: 'Физика', emoji: '🔬', bg: '#FFF3E0', color: '#E65100' },
  { label: 'Биология', emoji: '🐛', bg: '#EFEBE9', color: '#4E342E' },
] as const;

async function urlToFile(url: string, name?: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const fileName = name || url.split('/').pop() || 'example.webp';
  return new File([blob], fileName, { type: blob.type });
}

export default function UploadZoneWithChess({
  onSelect,
  exampleImages,
  buttonLabel = 'Загрузить фото задачи ⚡️1',
  backgroundOpacity = 0.5,
  disabled,
  loading,
}: UploadZoneWithChessProps) {
  const [isDrag, setIsDrag] = useState(false);
  const isDisabled = Boolean(disabled || loading);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) setIsDrag(true);
  };
  const handleDragLeave = () => setIsDrag(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (isDisabled) return;
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
    if (file) onSelect(file);
  };

  const chessBg = useMemo(() => {
    const alpha = Math.min(1, Math.max(0, backgroundOpacity));
    const base = `rgba(0,0,0,${alpha * 0.04})`;
    return {
      backgroundImage:
        `linear-gradient(45deg, ${base} 25%, transparent 25%),` +
        `linear-gradient(-45deg, ${base} 25%, transparent 25%),` +
        `linear-gradient(45deg, transparent 75%, ${base} 75%),` +
        `linear-gradient(-45deg, transparent 75%, ${base} 75%)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    } as const;
  }, [backgroundOpacity]);

  const selectExample = useCallback(async (url: string) => {
    if (isDisabled) return;
    try {
      const file = await urlToFile(url);
      // Нормализуем файл: конвертируем WebP и другие неподдерживаемые форматы в JPEG
      const normalizedFile = await normalizeImageFile(file);
      onSelect(normalizedFile);
    } catch (error) {
      console.error('Ошибка при загрузке примера изображения:', error);
      // Пробрасываем ошибку дальше, чтобы родительский компонент мог её обработать
      throw error;
    }
  }, [isDisabled, onSelect]);

  return (
    <Box
      sx={{
        position: 'relative',
        p: { xs: 2, md: 3 },
        borderRadius: 1,
        boxShadow: 2,
        border: '1px solid',
        borderColor: isDrag ? 'primary.main' : 'divider',
        transition: 'border-color .2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...chessBg,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Решаем задачи по всем предметам:</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        {SUBJECT_TAGS.map((s, i) => (
          <Chip
            key={`${s.label}-${i}`}
            label={`${s.emoji} ${s.label}`}
            size="small"
            sx={{
              backgroundColor: s.bg,
              color: s.color,
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

      <FreeButton
        onChange={onSelect}
        label={buttonLabel}
        fullWidth
        disabled={isDisabled}
      />

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        Загружая фото, вы соглашаетесь с{' '}
        <MuiLink component={NextLink} href="/user-agreement" underline="hover">
          Пользовательским соглашением
        </MuiLink>
        ,{' '}
        <MuiLink component={NextLink} href="/privacy" underline="hover">
          Политикой конфиденциальности
        </MuiLink>{' '}
        и{' '}
        <MuiLink component={NextLink} href="/personal-data" underline="hover">
          Политикой обработки персональных данных
        </MuiLink>
        .
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 14  }}>Или перетащите изображение сюда</Typography>
        {exampleImages && (
          <Typography color="text.secondary" sx={{ mb: 1 }}>Нет изображения? Попробуйте наше:</Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {exampleImages?.map((url, i) => (
            <Avatar
              key={i}
              src={url}
              variant="rounded"
              sx={{
                width: 56, height: 56,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'transform .15s ease',
                '&:hover': { transform: isDisabled ? 'none' : 'scale(1.06)' },
              }}
              onClick={() => selectExample(url)}
              imgProps={{ loading: 'lazy' }}
            />
          ))}
        </Box>
      </Box>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(1px)',
            borderRadius: 1,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Загружаем фото…</Typography>
        </Box>
      )}
    </Box>
  );
}


