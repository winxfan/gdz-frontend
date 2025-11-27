'use client';

import { Container, Typography, Box } from '@mui/material';

export default function PersonalDataPolicyPage() {
	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="md">
					<Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
						Политика обработки персональных данных
					</Typography>
					<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
						Дата вступления в силу: 27.11.2025
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						1. Назначение и правовые основания
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Настоящая Политика обработки персональных данных (далее — «Политика ПДн») разработана в соответствии с Федеральным законом № 152‑ФЗ «О персональных данных» и регулирует порядок обработки ПДн при использовании Сервиса https://гдз-по-фото.рф.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						2. Принципы обработки
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Законность и справедливость обработки.</Typography>
						<Typography component="li">Ограничение обработкой для конкретных, заранее определённых и законных целей.</Typography>
						<Typography component="li">Минимизация и актуальность обрабатываемых данных.</Typography>
						<Typography component="li">Обеспечение безопасности персональных данных.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						3. Состав ПДн
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Идентификаторы авторизации (на основе IP‑адреса).</Typography>
						<Typography component="li">Загружаемые изображения задач и сопутствующие метаданные.</Typography>
						<Typography component="li">Технические данные (cookies, данные браузера/устройства).</Typography>
						<Typography component="li">Платёжные метаданные (статус, сумма, идентификатор операции) — без платёжных реквизитов.</Typography>
						<Typography component="li">Данные о балансе и операциях с токенами/молниями.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						4. Цели обработки ПДн
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Оказание услуг Сервиса (получение и обработка изображений, генерация решений и объяснений).</Typography>
						<Typography component="li">Авторизация пользователя по IP и защита лимитов.</Typography>
						<Typography component="li">Расчёты и тарификация, обработка оплат.</Typography>
						<Typography component="li">Обеспечение стабильной и безопасной работы Сервиса, аналитика качества.</Typography>
						<Typography component="li">Исполнение требований законодательства РФ.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						5. Правовые основания
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">Согласие субъекта ПДн.</Typography>
						<Typography component="li">Исполнение договора (оказание услуг).</Typography>
						<Typography component="li">Исполнение требований закона.</Typography>
						<Typography component="li">Законные интересы Сервиса (функционирование и безопасность), при условии неумаления прав субъектов ПДн.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						6. Сроки обработки и хранение
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						ПДн обрабатываются не дольше, чем того требуют заявленные цели. Изображения задач хранятся ограниченно и удаляются/обезличиваются после достижения целей. Платёжные метаданные и учётные документы сохраняются в установленные законом сроки.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						7. Передача третьим лицам
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Передача ПДн допускается платёжным провайдерам, хостинг‑/облачным провайдерам и иным лицам, вовлечённым в оказание услуги, а также в случаях, предусмотренных законом. Передача осуществляется при наличии договорных и/или правовых гарантий конфиденциальности и безопасности.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						8. Трансграничная передача и локализация
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Базы данных граждан РФ располагаются на территории РФ. При необходимости трансграничной передачи Сервис обеспечивает соблюдение требований 152‑ФЗ и использование механизмов, гарантирующих надлежащую защиту.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						9. Права субъектов ПДн
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Субъект ПДн вправе: получать сведения об обработке ПДн; требовать уточнения, блокирования или уничтожения ПДн; отзывать согласие; обжаловать действия Сервиса. Контакт: hello@гдз-по-фото.рф. Срок ответа — до 30 календарных дней.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						10. Меры защиты ПДн
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Сервис применяет необходимые правовые, организационные и технические меры для защиты ПДн от неправомерных действий: ограничение доступа, шифрование при передаче, мониторинг инцидентов, управление уязвимостями, резервирование и др.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						11. Ответственность
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Сервис несёт ответственность за соблюдение требований законодательства о персональных данных в пределах своей компетенции. Пользователь несёт ответственность за правомерность и содержание загружаемых материалов.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						12. Контакты
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						Вопросы по обработке ПДн направляйте на hello@гдз-по-фото.рф.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						13. Изменения Политики ПДн
					</Typography>
					<Typography color="text.secondary">
						Сервис вправе обновлять Политику ПДн. Новая редакция вступает в силу с момента публикации на сайте.
					</Typography>
				</Container>
			</Box>
		</main>
	);
}


