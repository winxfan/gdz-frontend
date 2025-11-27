'use client';

import { Container, Typography, Box } from '@mui/material';

export default function UserAgreementPage() {
	return (
		<main>
			<Box sx={{ py: { xs: 5, md: 8 } }}>
				<Container maxWidth="md">
					<Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
						Пользовательское соглашение
					</Typography>

					<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
						Дата вступления в силу: 27.11.2025
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						1. Общие положения
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между пользователем Сервиса https://гдз-по-фото.рф (далее — «Пользователь») и владельцем Сервиса «гдз‑по‑фото.рф» (далее — «Сервис») по поводу использования функционала Сервиса.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						1.2. Используя Сервис, Пользователь подтверждает, что ознакомлен и принимает условия настоящего Соглашения, Политики конфиденциальности, Политики обработки персональных данных и Согласия на обработку персональных данных.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						1.3. Если Пользователь не согласен с условиями, он обязан прекратить использование Сервиса.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						2. Термины и описание Сервиса
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						2.1. Сервис — веб‑ресурс https://гдз-по-фото.рф, который позволяет загрузить фото задачи и получить решение, а также подробное объяснение решения.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						2.2. Авторизация — идентификация Пользователя для учёта лимитов и валюты Сервиса. Авторизация осуществляется на основе IP‑адреса Пользователя.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						2.3. «Молнии»/токены — внутренняя единица учёта, списываемая за операции (получение решения, объяснения).
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						3. Регистрация и авторизация
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						3.1. Для базового использования допускается анонимный доступ с ограниченными лимитами.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						3.2. Для расширенного доступа используется авторизация на основе IP‑адреса. Данный механизм необходим для предотвращения сброса лимитов путём очистки браузера или иных махинаций.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						3.3. На сервер направляется POST‑запрос, содержащий IP‑адрес; сервер возвращает количество доступных токенов/«молний» и иные параметры лимитов.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						3.4. Телеграм‑боты и телеграм‑сервисы не используются.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						4. Услуги и функционал
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						4.1. Пользователь делает фото задачи, загружает его на сайт и получает мгновенное решение.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						4.2. Доступно до 3 бесплатных решений: 1 — для анонимных пользователей, 2 — для авторизованных пользователей.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						4.3. Пользователь может дополнительно получить подробное объяснение решения за «молнии»/токены.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						4.4. Сервис вправе изменять состав функционала, лимиты и правила списаний, публикуя обновления на сайте.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						5. Валюта Сервиса («молнии») и тарифы
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						5.1. По умолчанию новому Пользователю начисляется 5 «молний».
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						5.2. «Молнии» списываются за операции (получение решения, объяснения). Стоимость в «молниях» может меняться; актуальные значения публикуются в интерфейсе Сервиса.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						5.3. Покупка токенов за рубли:
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 1 }}>
						<Typography component="li">10 токенов — 76 рублей;</Typography>
						<Typography component="li">31 токен — 173 рубля;</Typography>
						<Typography component="li">150 токенов — 705 рублей.</Typography>
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						5.4. Условия акций и бонусов (если действуют) доводятся до сведения Пользователя в интерфейсе.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						6. Оплата и возвраты
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						6.1. Оплата осуществляется в российских рублях через платёжного провайдера. Сервис не хранит платёжные реквизиты Пользователя (номера карт и т. п.).
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						6.2. Денежные средства за уже оказанные услуги и использованные токены не возвращаются.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						6.3. В случае технической ошибки по вине Сервиса (например, списание «молний» без предоставления результата и невозможность повторной доставки) Сервис может по своему усмотрению: (а) восстановить «молнии»; и/или (б) повторно предоставить доступ к результату; и/или (в) произвести возврат стоимости соответствующей операции. 6.4. По вопросам платежей и инцидентов обращайтесь в поддержку: hello@гдз-по-фото.рф.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						7. Права и обязанности Пользователя
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						7.1. Пользователь обязуется:
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 1 }}>
						<Typography component="li">загружать только правомерные материалы, не нарушающие права третьих лиц;</Typography>
						<Typography component="li">не предпринимать действий, направленных на обход авторизации, лимитов и механик Сервиса;</Typography>
						<Typography component="li">не осуществлять автоматизированный массовый доступ без согласия Сервиса;</Typography>
						<Typography component="li">не пытаться вмешиваться в работу Сервиса, его инфраструктуры и безопасности;</Typography>
						<Typography component="li">предоставлять корректные данные и соблюдать условия Соглашения и политик.</Typography>
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						7.2. Пользователь имеет право:
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
						<Typography component="li">получать услуги Сервиса в пределах действующих лимитов и тарифов;</Typography>
						<Typography component="li">обращаться в поддержку по вопросам качества, списаний и доступности услуг;</Typography>
						<Typography component="li">в порядке и объёме, предусмотренных законом и Политиками, управлять своими персональными данными.</Typography>
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						8. Права и обязанности Сервиса
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						8.1. Сервис вправе:
					</Typography>
					<Typography component="ul" color="text.secondary" sx={{ pl: 3, mb: 1 }}>
						<Typography component="li">временно ограничивать доступ для проведения работ по поддержанию и развитию Сервиса;</Typography>
						<Typography component="li">изменять функционал, правила списаний и лимитов с публикацией на сайте;</Typography>
						<Typography component="li">блокировать или ограничивать доступ Пользователя при нарушении Соглашения, политик или законодательства;</Typography>
						<Typography component="li">применять анти‑фрод‑механизмы для предотвращения злоупотреблений.</Typography>
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						8.2. Сервис обязуется оказывать услуги добросовестно и в пределах технических возможностей.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						9. Права на загруженные материалы и лицензия
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						9.1. Права на загруженные Пользователем материалы (изображения задач) сохраняются за Пользователем/правообладателем.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						9.2. Предоставляя материалы, Пользователь гарантирует наличие прав на использование этих материалов и предоставляет Сервису неисключительную, безвозмездную, ограниченную по цели лицензию на обработку материалов исключительно для оказания услуг (распознавание/решение/генерация объяснений), а также для устранения инцидентов качества.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						9.3. Сервис не приобретает исключительных прав на материалы Пользователя.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						10. Ограничения и запреты
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						10.1. Запрещена загрузка материалов, нарушающих законодательство РФ, права третьих лиц, содержащих персональные данные третьих лиц без их согласия, а также противоправный или вредоносный контент.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						10.2. Запрещён обход технических ограничений, вмешательство в работу Сервиса, повторное использование внутренних API без разрешения.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						11. Отказ от гарантий и ограничение ответственности
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 1 }}>
						11.1. Сервис предоставляется «как есть». Сервис стремится обеспечивать корректность решений, но не гарантирует их абсолютную точность/полноту для любых задач и контекстов.
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						11.2. Сервис не несёт ответственности за косвенные убытки, упущенную выгоду и последствия использования предоставленных решений. 11.3. Совокупная ответственность Сервиса ограничивается стоимостью спорной операции либо количеством спорно списанных «молний».
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						12. Интеллектуальная собственность Сервиса
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						12.1. Программное обеспечение, дизайн, базы данных, наименования и иные объекты исключительных прав, используемые в Сервисе, принадлежат Сервису и/или его правообладателям. Любое их использование вне условий Соглашения запрещено.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						13. Коммуникации и поддержка
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						13.1. Связь с Сервисом: hello@гдз-по-фото.рф. 13.2. Транзакционные сообщения могут направляться в рамках оказания услуг и информирования о статусе операций.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						14. Персональные данные и документы
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						14.1. Порядок обработки персональных данных установлен Политикой конфиденциальности, Политикой обработки персональных данных и Согласием на обработку персональных данных, опубликованными Сервисом. 14.2. Продолжая использование Сервиса, Пользователь подтверждает ознакомление с указанными документами.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						15. Срок действия, изменения Соглашения
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						15.1. Настоящее Соглашение действует с момента публикации и применяется к отношениям, возникающим после его вступления в силу. 15.2. Сервис вправе вносить изменения в Соглашение, публикуя обновлённую версию на сайте. Новая редакция вступает в силу с момента публикации, если не указано иное.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						16. Применимое право и споры
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						16.1. К отношениям сторон применяется действующее законодательство Российской Федерации. 16.2. Претензионный порядок: перед обращением в суд стороны принимают меры для урегулирования спора посредством переговоров. Срок ответа на претензию — до 30 календарных дней. 16.3. Подсудность споров определяется по месту нахождения Сервиса в соответствии с нормами процессуального законодательства.
					</Typography>

					<Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
						17. Реквизиты и контактная информация
					</Typography>
					<Typography color="text.secondary">
						Сайт: https://гдз-по-фото.рф
						<br />
						Поддержка: hello@гдз-по-фото.рф
					</Typography>
				</Container>
			</Box>
		</main>
	);
}
