# HTML шаблонайзер

GUI-приложение для сохранения страницы **без внешних ссылок** и с автоматической вставкой модалки заказчика.

## Что делает
- Делает точную локальную копию страницы
- Удаляет/переписывает внешние ссылки и ресурсы
- Всем кликабельным элементам добавляет класс `interact-button`
- Вставляет в `<head>`:
  ```html
  <script charset=\"UTF-8\" type=\"text/javascript\" src=\"./bwluup.php\"></script>
  ```

## Запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Скачайте Chromium для Playwright:
   ```bash
   npm run setup
   ```
3. Запустите приложение:
   ```bash
   npm start
   ```

## Как пользоваться
1. Введите URL страницы
2. Выберите папку для сохранения
3. Нажмите **Сделать копию**
4. В выбранной папке появятся:
   - `index.html`
   - папка `assets/`

## Важно
- Положите файл `bwluup.php` рядом с `index.html` в папке результата.
- Все кнопки и ссылки будут открывать модалку (класс `interact-button`).
- Внешние ссылки и ресурсы удаляются/локализуются.

---

## 📨 Почему прерываются длинные сообщения

### Для обычных пользователей

Если вы заметили, что длинные ответы обрываются или не доходят полностью, вот основные причины:

**Что может идти не так:**

1. **Мессенджеры и приложения имеют лимиты**
   - Telegram: до 4096 символов в одном сообщении
   - WhatsApp: до ~65,000 символов, но могут быть проблемы с отображением
   - Viber: до 7000 символов
   - Discord: до 2000 символов
   - API многих сервисов: от 2000 до 10000 символов

2. **Плохое интернет-соединение**
   - Если связь нестабильна, сообщение может оборваться на середине
   - Мобильный интернет в метро, на даче или в дороге часто вызывает прерывания

3. **Защита от спама**
   - Системы могут подумать, что длинное сообщение — это спам
   - Срабатывают таймауты (время ожидания истекло)

**Что делать:**

✅ Попросите разбить ответ на несколько частей  
✅ Задавайте более конкретные вопросы  
✅ Проверьте интернет-соединение  
✅ Подождите несколько секунд и повторите запрос  

---

### Для инженеров и разработчиков

#### 1. Лимиты на размер сообщений

**Мессенджеры и API:**
- Telegram Bot API: `4096` символов на сообщение (UTF-8)
- Discord: `2000` символов
- WhatsApp Business API: `65536` символов (но практически ~4096 для надежности)
- Slack: `40000` символов (blocks API), `3000` для обычных сообщений
- VK API: `4096` символов
- Большинство REST API: обычно `2KB-10KB` на request/response

**Примеры:**
```javascript
// Telegram будет резать сообщения по 4096 символов
if (message.length > 4096) {
  const chunks = splitIntoChunks(message, 4096);
  for (const chunk of chunks) {
    await sendMessage(chunk);
  }
}
```

#### 2. Ограничения в коде

**Максимальная длина строки:**
- JavaScript (V8): ~`1GB` теоретически, но практически `268,435,456` символов (512MB)
- Python: зависит от RAM, практически до `2GB` на 64-bit системах
- Java: `Integer.MAX_VALUE` (`2,147,483,647`) символов
- C/C++: зависит от выделенной памяти

**Буферы:**
```javascript
// Node.js Buffer имеет ограничение
const maxBufferSize = Buffer.constants.MAX_LENGTH; // ~2GB на 64-bit
```

**Проблемы:**
- `RangeError: Maximum call stack size exceeded` — рекурсивная обработка больших строк
- `ENOMEM` / Out of Memory — недостаточно RAM
- `String concatenation` в циклах создает множество промежуточных объектов

**Решения:**
```javascript
// Используйте потоки для больших данных
const stream = require('stream');
// Используйте StringBuilder/Array.join вместо += в циклах
const parts = [];
parts.push(chunk1, chunk2, chunk3);
const result = parts.join('');
```

#### 3. Memory/Stack проблемы

**Stack Overflow:**
- Глубокая рекурсия при обработке вложенных структур
- Большие локальные переменные в функциях

**Memory Leaks:**
- Незакрытые потоки данных
- Циклические ссылки в объектах
- Кеширование без очистки

**Heap Exhaustion:**
- Обработка больших JSON/XML без streaming
- Загрузка всего файла в память

```javascript
// ❌ Плохо: загружаем весь файл
const data = fs.readFileSync('huge.json', 'utf-8');

// ✅ Хорошо: читаем по частям
const stream = fs.createReadStream('huge.json');
stream.on('data', chunk => processChunk(chunk));
```

#### 4. Сетевые сбои и разрывы

**Типичные проблемы:**
- `ECONNRESET` — соединение разорвано
- `ETIMEDOUT` — превышен таймаут
- `EPIPE` — попытка записи в закрытый сокет
- Unstable WebSocket connections

**HTTP Timeouts:**
```javascript
// Настройте адекватные таймауты
const response = await fetch(url, {
  timeout: 30000, // 30 секунд
  signal: AbortSignal.timeout(30000)
});
```

**WebSocket reconnection:**
```javascript
ws.on('close', () => {
  setTimeout(() => reconnect(), 1000); // retry после 1 сек
});
```

#### 5. Механизмы защиты от спама, Rate Limits, Timeouts

**Rate Limiting:**
- Telegram: 30 сообщений/секунду на бота
- Discord: 5 запросов/секунду (burst)
- OpenAI API: зависит от тарифа (TPM/RPM limits)

**Timeout механизмы:**
```javascript
// Серверный таймаут (например, nginx)
proxy_read_timeout 60s;

// Клиентский таймаут
axios.get(url, { timeout: 30000 });
```

**HTTP 429 Too Many Requests:**
```javascript
if (response.status === 429) {
  const retryAfter = response.headers['retry-after'];
  await sleep(retryAfter * 1000);
  return retry();
}
```

#### 6. Рекомендации

**Как уменьшить частоту прерываний:**

1. **Chunking (разбивка на части):**
   ```javascript
   function splitMessage(text, maxLength = 4000) {
     const chunks = [];
     for (let i = 0; i < text.length; i += maxLength) {
       chunks.push(text.slice(i, i + maxLength));
     }
     return chunks;
   }
   ```

2. **Умная разбивка по границам:**
   ```javascript
   function smartSplit(text, maxLength = 4000) {
     const chunks = [];
     let start = 0;
     
     while (start < text.length) {
       let end = start + maxLength;
       
       if (end < text.length) {
         // Ищем ближайший перенос строки или точку
         const lastNewline = text.lastIndexOf('\n', end);
         const lastPeriod = text.lastIndexOf('. ', end);
         end = Math.max(lastNewline, lastPeriod) || end;
       }
       
       chunks.push(text.slice(start, end).trim());
       start = end;
     }
     
     return chunks;
   }
   ```

3. **Streaming для длинных ответов:**
   ```javascript
   // SSE (Server-Sent Events)
   response.writeHead(200, {
     'Content-Type': 'text/event-stream',
     'Cache-Control': 'no-cache',
     'Connection': 'keep-alive'
   });
   
   for (const chunk of generateLongResponse()) {
     response.write(`data: ${chunk}\n\n`);
   }
   ```

4. **Retry логика с exponential backoff:**
   ```javascript
   async function retryWithBackoff(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
       }
     }
   }
   ```

5. **Pagination для больших данных:**
   ```javascript
   // Вместо одного большого ответа
   GET /api/data?page=1&limit=50
   GET /api/data?page=2&limit=50
   ```

6. **Сжатие данных:**
   ```javascript
   // gzip compression
   app.use(compression());
   
   // Или на уровне клиента
   const compressed = zlib.gzipSync(largeString);
   ```

**Настройка таймаутов и лимитов:**

```javascript
// Express.js
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Node.js HTTP
const server = http.createServer();
server.timeout = 120000; // 2 минуты
server.keepAliveTimeout = 65000;

// Nginx
client_max_body_size 10M;
client_body_timeout 60s;
```

**Мониторинг и логирование:**

```javascript
// Отслеживайте размеры сообщений
console.log(`Message size: ${message.length} chars, ${Buffer.byteLength(message, 'utf-8')} bytes`);

// Логируйте ошибки
if (message.length > MAX_LENGTH) {
  logger.warn(`Message too long: ${message.length} > ${MAX_LENGTH}`);
}
```

---

### Краткая памятка

| Платформа | Лимит | Рекомендация |
|-----------|-------|--------------|
| Telegram | 4096 символов | Разбивайте по 4000 |
| Discord | 2000 символов | Разбивайте по 1900 |
| WhatsApp | ~4096 безопасно | Используйте 4000 |
| API (общие) | 2-10 KB | Используйте пагинацию |
| WebSocket | Зависит от сервера | Настройте max_message_size |

**Золотое правило:** Если сообщение больше 2000 символов — разбивайте на части или используйте streaming.
