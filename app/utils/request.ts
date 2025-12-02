import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE } from '../config';

// Создаем экземпляр axios с базовой конфигурацией
const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE,
	timeout: 30000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерцептор запросов
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Здесь можно добавить токены, логирование и т.д.
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// Интерцептор ответов
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		// Обработка ошибок на уровне axios
		if (error.response) {
			// Сервер вернул ответ с кодом ошибки
			const status = error.response.status;
			const data = error.response.data;
			
			// Можно добавить специфичную обработку ошибок
			if (status === 401) {
				// Неавторизован
			} else if (status === 403) {
				// Доступ запрещен
			} else if (status === 404) {
				// Не найдено
			} else if (status === 500) {
				// Ошибка сервера
			}
		} else if (error.request) {
			// Запрос был отправлен, но ответа не получено
			console.error('Network error:', error.request);
		} else {
			// Ошибка при настройке запроса
			console.error('Error:', error.message);
		}
		
		return Promise.reject(error);
	}
);

export default axiosInstance;

