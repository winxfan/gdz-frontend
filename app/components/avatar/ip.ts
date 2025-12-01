import { animals, adjectives, AvatarInfo } from './constants';

export function ipToNumber(ip: string): number {
	if (!ip || typeof ip !== 'string') return 0;
	const parts = ip.trim().split('.');
	if (parts.length !== 4) return 0;
	return parts.reduce((acc, part) => {
		const n = Number(part);
		if (!Number.isFinite(n) || n < 0) return acc;
		return acc * 257 + Math.floor(n);
	}, 0);
}

// Простой хэш для строк (для IPv6 и нестандартных значений)
function hashStringToNumber(s: string): number {
	let hash = 5381;
	for (let i = 0; i < s.length; i++) {
		hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
	}
	// Приводим к положительному 32-битному числу
	return hash >>> 0;
}

function ipToSeedNumber(ip: string): number {
	if (!ip) return 0;
	const trimmed = ip.trim();
	if (trimmed.includes('.')) {
		return ipToNumber(trimmed);
	}
	// IPv6 или иные строки — используем детерминированный хэш строки
	return hashStringToNumber(trimmed);
}

export function getAvatarAndNameByIp(ip: string): AvatarInfo {
	const n = ipToSeedNumber(ip);
	const animalIndex = Math.abs(n) % animals.length; // 0..4
	const adjIndex = Math.abs(n >> 3) % adjectives.length; // 0..14
	const animal = animals[animalIndex];
	const adj = adjectives[adjIndex];
	const adjectiveForm = animal.gender === 'f' ? adj.fem : adj.masc;
	const displayName = `${adjectiveForm} ${animal.ru}`;
	const avatarUrl = `/assets/avatars/avatar${animal.id}.webp`;
	return {
		animalId: animal.id,
		animalRu: animal.ru,
		displayName,
		avatarUrl,
	};
}


