'use client';

import { Dialog, DialogContent, IconButton, Box, Typography, Stack, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export type ResultModalProps = {
	open: boolean;
	onClose: () => void;
	imageSrc?: string | null;
	markdown?: string;
	title?: string;
};

export default function ResultModal({
	open,
	onClose,
	imageSrc,
	markdown,
	title = 'Результат решения по фото',
}: ResultModalProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<Box sx={{ position: 'relative' }}>
				<IconButton
					onClick={onClose}
					aria-label="Закрыть"
					sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
					color="primary"
				>
					<CloseIcon />
				</IconButton>
				<Typography variant="h5" sx={{ fontWeight: 800, px: 3, pt: 3, pr: 7 }}>
					{title}
				</Typography>
				<DialogContent dividers>
					<Stack spacing={2}>
						{imageSrc ? (
							<Box>
								<Box
									component="img"
									src={imageSrc}
									alt="Загруженное изображение"
									loading="lazy"
									sx={{
										display: 'block',
										maxWidth: '100%',
										maxHeight: 260,
										objectFit: 'contain',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
										bgcolor: 'background.default',
									}}
								/>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
									Решение задачи
								</Typography>
							</Box>
						) : null}

						<Box>
							<Typography sx={{ fontWeight: 700, mb: 0.5 }}>Ответ</Typography>
							<Paper variant="outlined" sx={{ p: 2, overflowX: 'auto' }}>
								<ReactMarkdown
									remarkPlugins={[remarkMath]}
									rehypePlugins={[rehypeKatex]}
									components={{
										code(props) {
											const { children, className, ...rest } = props;
											return (
												<code className={className} {...rest}>
													{children}
												</code>
											);
										},
									}}
								>
									{markdown || ''}
								</ReactMarkdown>
							</Paper>
						</Box>
					</Stack>
				</DialogContent>
			</Box>
		</Dialog>
	);
}



