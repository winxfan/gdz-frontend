'use client';

import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { userLightningBalanceAtom } from '@/state/user';
import { ReactNode } from 'react';

export type BalanceButtonProps = {
	onClick?: () => void;
	size?: 'small' | 'medium' | 'large';
	startIcon?: ReactNode;
};

/**
 * Кнопка показа текущего баланса. Валюта — молнии.
 */
export default function BalanceButton(props: BalanceButtonProps) {
	const [balance] = useAtom(userLightningBalanceAtom);
	const { onClick, size = 'medium' } = props;

	return (
		<Button
			variant="outlined"
			color="primary"
			onClick={onClick}
			size={size}
			aria-label="Открыть пополнение баланса"
			sx={{ whiteSpace: 'nowrap' }}
		>
			Баланс: ⚡ {balance}
		</Button>
	);
}


