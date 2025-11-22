'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type User = {
	id?: string;
	name?: string;
	email?: string;
	avatarUrl?: string;
	// Баланс молний
	lightningBalance?: number;
	// IP адрес пользователя
	ip?: string;
};

// Храним все данные о пользователе в localStorage
export const userAtom = atomWithStorage<User>('user', {});

// Удобные производные атомы
export const userIpAtom = atom(
	(get) => get(userAtom).ip,
	(get, set, ip: string | undefined) => {
		const current = get(userAtom);
		set(userAtom, { ...current, ip });
	},
);

export const userLightningBalanceAtom = atom(
	(get) => get(userAtom).lightningBalance ?? 0,
	(get, set, value: number) => {
		const current = get(userAtom);
		set(userAtom, { ...current, lightningBalance: value });
	},
);

export const resetUserAtom = atom(null, (_get, set) => {
	set(userAtom, {});
});


