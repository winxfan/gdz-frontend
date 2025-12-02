import axiosInstance from './request';
import { API_BASE } from '../config';

// Типы для API ответов
export type UserResponse = {
	id: string;
	username: string;
	avatarId: number;
	tokens?: number;
	tokensUsedAsAnon?: number;
	isAuthorized?: boolean;
	isHaveEmail?: boolean;
	name?: string;
};

export type AvatarInfo = {
	animalId: number;
	animalRu: string;
	displayName: string;
	avatarUrl?: string;
};

export type JobInfo = {
	id: string;
	status: 'queued' | 'processing' | 'done' | 'failed';
	inputS3Url?: string;
	detectedText?: string;
	generatedText?: string;
	errorMessage?: string | null;
};

export type PaymentIntentResponse = {
	id: string;
	provider: string;
	amountRub: number;
	currency: string;
	paymentUrl?: string | null;
	payment_url?: string | null;
	reference: string;
	paymentId?: string | null;
	tariffId: string;
	tokens: number;
};

// API функции

/**
 * Авторизация анонимного пользователя
 */
export const authUser = async (): Promise<UserResponse> => {
	const { data } = await axiosInstance.post<UserResponse>('/api/v1/auth-user');
	return data;
};

/**
 * Обмен кода VK ID на токены
 */
export const exchangeVkIdCode = async (params: {
	code: string;
	deviceId: string;
	codeVerifier: string;
	marketingConsent?: boolean;
}): Promise<UserResponse> => {
	const { data } = await axiosInstance.post<UserResponse>('/api/v1/auth/oauth/vk-id/exchange', {
		code: params.code,
		deviceId: params.deviceId,
		codeVerifier: params.codeVerifier,
		marketingConsent: params.marketingConsent,
	});
	return data;
};

/**
 * Привязка email к пользователю
 */
export const bindEmail = async (params: {
	userId: string;
	email: string;
	isAcceptedPromo?: boolean;
}): Promise<UserResponse> => {
	const { data } = await axiosInstance.post<UserResponse>(
		`/api/v1/users/${params.userId}/email`,
		{
			email: params.email.trim(),
			is_accepted_promo: params.isAcceptedPromo || undefined,
		}
	);
	return data;
};

/**
 * Получение информации об аватаре
 */
export const getAvatarInfo = async (): Promise<AvatarInfo> => {
	// Используем fetch для локального API route, так как это Next.js route handler
	const res = await fetch('/api/avatar-info', { cache: 'no-store' });
	if (!res.ok) {
		throw new Error('Failed to fetch avatar info');
	}
	return res.json();
};

/**
 * Создание задачи на обработку изображения
 */
export const createJob = async (params: {
	image: File;
	userId?: string;
}): Promise<{ jobId: string; status: string; tokensLeft?: number }> => {
	const formData = new FormData();
	formData.append('image', params.image, params.image.name);
	if (params.userId) {
		formData.append('userId', params.userId);
	}

	const { data } = await axiosInstance.post<{ jobId: string; status: string; tokensLeft?: number }>(
		'/api/v1/job',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
	return data;
};

/**
 * Получение статуса задачи
 */
export const getJobStatus = async (jobId: string): Promise<JobInfo> => {
	const { data } = await axiosInstance.get<JobInfo>(`/api/v1/job/${jobId}`);
	return data;
};

/**
 * Создание payment intent
 */
export const createPaymentIntent = async (params: {
	userId: string;
	tariffId: string;
	description?: string;
	idempotencyKey?: string;
}): Promise<PaymentIntentResponse> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (params.idempotencyKey) {
		headers['Idempotency-Key'] = params.idempotencyKey;
	}

	const { data } = await axiosInstance.post<PaymentIntentResponse>(
		'/api/v1/payments/intents',
		{
			user_id: params.userId,
			tariff_id: params.tariffId,
			provider: 'yookassa',
			description: params.description,
		},
		{ headers }
	);
	return data;
};

