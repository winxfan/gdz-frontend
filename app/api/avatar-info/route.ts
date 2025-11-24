import { NextRequest } from 'next/server';
import { getAvatarAndNameByIp } from '@/components/avatar/ip';

export async function GET(req: NextRequest) {
	// Извлекаем IP: сначала X-Forwarded-For, затем хедеры CF, затем fallback
	const url = new URL(req.url);
	const ipQuery = url.searchParams.get('ip');
	const xff = req.headers.get('x-forwarded-for');
	const cfConnectingIp = req.headers.get('cf-connecting-ip');
	const realIp = (process.env.NODE_ENV !== 'production' && ipQuery)
		? ipQuery
		: (xff?.split(',')[0]?.trim() || cfConnectingIp || '127.0.0.1');

	const info = getAvatarAndNameByIp(realIp);

	// Серверное логирование для отладки
	// В проде при необходимости замените на структурированный логгер (pino/winston) и маскирование IP.
	console.log('[avatar-info]', {
		ip: realIp,
		animalId: info.animalId,
		animalRu: info.animalRu,
		displayName: info.displayName,
	});

	return Response.json({
		animalId: info.animalId,
		animalRu: info.animalRu,
		displayName: info.displayName,
		avatarUrl: info.avatarUrl,
	});
}


