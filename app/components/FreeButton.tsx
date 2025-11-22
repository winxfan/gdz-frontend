import { ChangeEvent, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';

export type FreeButtonProps = {
  onChange: (file: File) => void;
  accept?: string;
  label?: string;
  badgeText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

export default function FreeButton({
  onChange,
  accept = 'image/*',
  label = 'Загрузить изображение',
  badgeText = '100% бесплатно',
  fullWidth,
  disabled,
}: FreeButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', width: fullWidth ? '100%' : 'auto' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleInput}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        variant="contained"
        color="primary"
        disabled={disabled}
        fullWidth={fullWidth}
        startIcon={<AddIcon />}
        sx={{
          height: 56,
          borderRadius: 2,
          px: 3,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        {label}
      </Button>
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          bgcolor: 'transparent',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 1,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            boxShadow: 1,
            opacity: disabled ? 0.5 : 1,
            background: 'linear-gradient(90deg, #FFB347, #FF6B6B)',
          }}
        >
          {badgeText}
        </Box>
      </Box>
    </Box>
  );
}


