'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type User = {
	id?: string;
	name?: string; // Для авторизованного пользователя (ФИО/ник из OAuth)
	username?: string; // Детерминированное имя для анонима/или отображаемый ник
	email?: string;
	avatarUrl?: string;
	avatarId?: number; // 1..5
	isAuthorized?: boolean;
	// Токены
	tokens?: number;
	tokensUsedAsAnon?: number;
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

export const resetUserAtom = atom(null, (_get, set) => {
	set(userAtom, {});
});


