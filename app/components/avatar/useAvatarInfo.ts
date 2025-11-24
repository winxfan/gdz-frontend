'use client';

import { useEffect, useState } from 'react';
import type { AvatarInfo } from './constants';
import { avatarUrlById } from './images';

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
	const [data, setData] = useState<AvatarInfo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const cached = readCache();
		if (cached) {
			setData(cached);
			// Не выходим: делаем SWR — фоновой рефетч для актуализации и серверных логов
		}

		(async () => {
			try {
				const res = await fetch('/api/avatar-info', { cache: 'no-store' });
				const json = (await res.json()) as AvatarInfo;
				if (!cancelled) {
					const normalized: AvatarInfo = {
						...json,
						avatarUrl: avatarUrlById(json.animalId),
					};
					setData(normalized);
					writeCache(normalized);
				}
			} catch {
				if (!cancelled) {
					// Фолбэк (совместим с ТЗ)
					const fallback: AvatarInfo = {
						animalId: 1,
						animalRu: 'лиса',
						displayName: 'Дружелюбная лиса',
						avatarUrl: avatarUrlById(1),
					};
					// Показываем фолбэк, только если до этого не было кэша
					if (!cached) setData(fallback);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	return { data, loading };
}


