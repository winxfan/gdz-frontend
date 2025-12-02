'use client';

import { useQuery } from '@tanstack/react-query';
import type { AvatarInfo } from './constants';
import { avatarUrlById } from './images';
import { getAvatarInfo } from '@/utils/api';

const STORAGE_KEY = 'anonAvatarInfo';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 часа

type Cached<T> = {
	value: T;
	ts: number;
};

function readCache(): AvatarInfo | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Cached<AvatarInfo>;
		if (!parsed?.value || !parsed?.ts) return null;
		if (Date.now() - parsed.ts > TTL_MS) return null;
		return parsed.value;
	} catch {
		return null;
	}
}

function writeCache(value: AvatarInfo) {
	try {
		const payload: Cached<AvatarInfo> = { value, ts: Date.now() };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch {
		// ignore
	}
}

export function useAvatarInfo() {
	const cached = readCache();
	
	const { data, isLoading, error } = useQuery({
		queryKey: ['avatar-info'],
		queryFn: async () => {
			const json = await getAvatarInfo();
			const normalized: AvatarInfo = {
				...json,
				avatarUrl: avatarUrlById(json.animalId),
			};
			writeCache(normalized);
			return normalized;
		},
		initialData: cached || undefined,
		staleTime: TTL_MS,
		retry: false,
		refetchOnWindowFocus: false,
	});

	// Фолбэк при ошибке, только если нет кэша
	const fallback: AvatarInfo | null = error && !cached ? {
		animalId: 1,
		animalRu: 'лиса',
		displayName: 'Дружелюбная лиса',
		avatarUrl: avatarUrlById(1),
	} : null;

	return { 
		data: data || fallback, 
		loading: isLoading && !cached 
	};
}


