'use client';

import { useState, useCallback, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type ConsentState = {
	privacy: boolean;
	personalData: boolean;
	userAgreement: boolean;
	marketing: boolean;
};

export type ConsentCheckboxesProps = {
	onChange?: (state: ConsentState) => void;
	value?: ConsentState;
};

const REQUIRED_CONSENTS: (keyof ConsentState)[] = ['privacy', 'personalData', 'userAgreement'];

export default function ConsentCheckboxes({ onChange, value }: ConsentCheckboxesProps) {
	const [state, setState] = useState<ConsentState>(
		value ?? {
			privacy: false,
			personalData: false,
			userAgreement: false,
			marketing: false,
		}
	);

	useEffect(() => {
		if (value) {
			setState(value);
		}
	}, [value]);

	const updateState = useCallback(
		(newState: ConsentState) => {
			setState(newState);
			onChange?.(newState);
		},
		[onChange]
	);

	const handleParentChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const checked = event.target.checked;
			const newState: ConsentState = {
				privacy: checked,
				personalData: checked,
				userAgreement: checked,
				marketing: checked,
			};
			updateState(newState);
		},
		[updateState]
	);

	const handleChildChange = useCallback(
		(key: keyof ConsentState) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newState = { ...state, [key]: event.target.checked };
			updateState(newState);
		},
		[state, updateState]
	);

	const allRequiredChecked = REQUIRED_CONSENTS.every((key) => state[key]);
	const allChecked = Object.values(state).every((v) => v);
	const isIndeterminate = !allChecked && allRequiredChecked;

	return (
		<Box>
			<FormControlLabel
				control={
					<Checkbox
						checked={allChecked}
						indeterminate={isIndeterminate}
						onChange={handleParentChange}
						sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
					/>
				}
				label={
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Согласен со всем
					</Typography>
				}
			/>

			<Box sx={{ pl: 4.5, display: 'flex', flexDirection: 'column' }}>
				<FormControlLabel
					control={
						<Checkbox
							checked={state.privacy}
							onChange={handleChildChange('privacy')}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
						/>
					}
					label={
						<Typography variant="body2" color="text.secondary" component="span">
							Согласен с{' '}
							<Link 
								href="/privacy" 
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: 'inherit', textDecoration: 'underline' }}
							>
								Политикой конфиденциальности
							</Link>
							<Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
								*
							</Typography>
						</Typography>
					}
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={state.personalData}
							onChange={handleChildChange('personalData')}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
						/>
					}
					label={
						<Typography variant="body2" color="text.secondary" component="span">
							Согласен с{' '}
							<Link 
								href="/personal-data" 
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: 'inherit', textDecoration: 'underline' }}
							>
								Политикой обработки персональных данных
							</Link>
							<Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
								*
							</Typography>
						</Typography>
					}
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={state.userAgreement}
							onChange={handleChildChange('userAgreement')}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
						/>
					}
					label={
						<Typography variant="body2" color="text.secondary" component="span">
							Согласен с{' '}
							<Link 
								href="/user-agreement" 
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: 'inherit', textDecoration: 'underline' }}
							>
								Пользовательским соглашением
							</Link>
							<Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
								*
							</Typography>
						</Typography>
					}
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={state.marketing}
							onChange={handleChildChange('marketing')}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
						/>
					}
					label={
						<Typography variant="body2" color="text.secondary">
							Согласен получать рекламную рассылку
						</Typography>
					}
				/>
			</Box>
		</Box>
	);
}

