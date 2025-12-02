/**
 * Утилита для конвертации изображений в поддерживаемые OCR форматы
 * Yandex Vision OCR поддерживает только: JPEG, PNG, PDF
 */

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'] as const;
const TARGET_FORMAT = 'image/jpeg';
const JPEG_QUALITY = 0.92; // Качество JPEG (0-1)

/**
 * Проверяет, поддерживается ли формат файла OCR сервисом
 */
export function isFormatSupported(mimeType: string): boolean {
  return SUPPORTED_FORMATS.includes(mimeType as any);
}

/**
 * Конвертирует изображение в JPEG через Canvas API
 * @param file - исходный файл изображения
 * @returns Promise с конвертированным File объектом в формате JPEG
 */
export async function convertImageToJpeg(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Не удалось создать контекст canvas'));
      return;
    }

    img.onload = () => {
      try {
        // Устанавливаем размеры canvas равными размерам изображения
        canvas.width = img.width;
        canvas.height = img.height;

        // Рисуем изображение на canvas
        ctx.drawImage(img, 0, 0);

        // Конвертируем в JPEG blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Не удалось конвертировать изображение'));
              return;
            }

            // Создаём новый File объект с правильным именем и MIME типом
            const fileName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            const jpegFile = new File([blob], fileName, {
              type: TARGET_FORMAT,
              lastModified: file.lastModified,
            });

            resolve(jpegFile);
          },
          TARGET_FORMAT,
          JPEG_QUALITY
        );
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Ошибка конвертации изображения'));
      }
    };

    img.onerror = () => {
      reject(new Error('Не удалось загрузить изображение для конвертации'));
    };

    // Загружаем изображение из файла
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Не удалось прочитать файл'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Нормализует файл изображения: конвертирует неподдерживаемые форматы в JPEG
 * @param file - исходный файл
 * @returns Promise с нормализованным File объектом (JPEG или PNG, если уже поддерживается)
 */
export async function normalizeImageFile(file: File): Promise<File> {
  // Если формат уже поддерживается, возвращаем как есть
  if (isFormatSupported(file.type)) {
    return file;
  }

  // Если это не изображение, выбрасываем ошибку
  if (!file.type.startsWith('image/')) {
    throw new Error(
      `Неподдерживаемый формат файла: ${file.type}. Поддерживаются только: JPEG, PNG, PDF`
    );
  }

  // Конвертируем неподдерживаемые форматы изображений (WebP, AVIF и т.д.) в JPEG
  return convertImageToJpeg(file);
}

