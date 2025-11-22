import { useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import FreeButton from '@/components/FreeButton';

export type UploadZoneWithChessProps = {
  onSelect: (file: File) => void;
  exampleImages: string[];
  buttonLabel?: string;
  backgroundOpacity?: number;
  disabled?: boolean;
};

async function urlToFile(url: string, name?: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const fileName = name || url.split('/').pop() || 'example.jpg';
  return new File([blob], fileName, { type: blob.type });
}

export default function UploadZoneWithChess({
  onSelect,
  exampleImages,
  buttonLabel = 'Сгенерируйте лицо с помощью ИИ',
  backgroundOpacity = 0.5,
  disabled,
}: UploadZoneWithChessProps) {
  const [isDrag, setIsDrag] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDrag(true);
  };
  const handleDragLeave = () => setIsDrag(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (disabled) return;
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
    if (disabled) return;
    const file = await urlToFile(url);
    onSelect(file);
  }, [disabled, onSelect]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        boxShadow: 2,
        border: '1px solid',
        borderColor: isDrag ? 'primary.main' : 'divider',
        transition: 'border-color .2s ease',
        ...chessBg,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FreeButton
        onChange={onSelect}
        label={buttonLabel}
        fullWidth
        disabled={disabled}
      />

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Или перетащите изображение сюда</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>Нет изображения? Попробуйте наше:</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {exampleImages.map((url, i) => (
            <Avatar
              key={i}
              src={url}
              variant="rounded"
              sx={{
                width: 56, height: 56,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'transform .15s ease',
                '&:hover': { transform: disabled ? 'none' : 'scale(1.06)' },
              }}
              onClick={() => selectExample(url)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}


