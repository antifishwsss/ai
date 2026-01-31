const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const mime = require('mime-types');
const cheerio = require('cheerio');

const CLICKABLE_SELECTORS = [
  'button',
  'a',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  '[role="button"]',
  '[onclick]'
];

function hashUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}

function getExtension(contentType, url) {
  const mimeExt = contentType ? mime.extension(contentType) : null;
  if (mimeExt) return mimeExt;
  try {
    const ext = path.extname(new URL(url).pathname).replace('.', '');
    return ext || 'bin';
  } catch {
    return 'bin';
  }
}

function resolveUrl(base, value) {
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

function rewriteCssUrls(cssText, baseUrl, urlToLocal) {
  if (!cssText) return cssText;
  let rewritten = cssText;

  rewritten = rewritten.replace(/@import\s+(?:url\()?['"]?([^'\)]+)['"]?\)?\s*;?/gi, (match, rawUrl) => {
    const absolute = resolveUrl(baseUrl, rawUrl);
    if (!absolute) return '';
    const local = urlToLocal.get(absolute);
    return local ? `@import url(${local});` : '';
  });

  rewritten = rewritten.replace(/url\((['"]?)([^'\)]+)\1\)/gi, (match, _q, rawUrl) => {
    if (rawUrl.startsWith('data:')) return match;
    const absolute = resolveUrl(baseUrl, rawUrl);
    if (!absolute) return match;
    const local = urlToLocal.get(absolute);
    return local ? `url(${local})` : 'url()';
  });

  return rewritten;
}

async function writeFileSafe(filePath, buffer) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
}

async function capturePage({ url, outputDir, onLog = () => {} }) {
  const assetsDir = path.join(outputDir, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });

  const responses = new Map();

  onLog('Запуск браузера...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  page.on('response', async (response) => {
    try {
      const req = response.request();
      if (req.method() !== 'GET') return;
      const resUrl = response.url();
      if (!resUrl.startsWith('http')) return;
      const body = await response.body();
      const contentType = response.headers()['content-type'] || '';
      responses.set(resUrl, { body, contentType });
    } catch {
      // ignore
    }
  });

  onLog('Загрузка страницы...');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(1500);

  const htmlContent = await page.content();
  await browser.close();

  onLog('Сбор ресурсов...');
  const urlToLocal = new Map();

  for (const [resUrl, { body, contentType }] of responses.entries()) {
    const ext = getExtension(contentType, resUrl);
    const fileName = `${hashUrl(resUrl)}.${ext}`;
    const localPath = `assets/${fileName}`;
    urlToLocal.set(resUrl, localPath);

    let outputBuffer = body;
    if (contentType.includes('text/css')) {
      const cssText = body.toString('utf-8');
      const rewrittenCss = rewriteCssUrls(cssText, resUrl, urlToLocal);
      outputBuffer = Buffer.from(rewrittenCss, 'utf-8');
    }

    await writeFileSafe(path.join(outputDir, localPath), outputBuffer);
  }

  onLog('Переписывание HTML...');
  const $ = cheerio.load(htmlContent);

  $('base, link[rel="preconnect"], link[rel="dns-prefetch"], link[rel="preload"], link[rel="modulepreload"], link[rel="prefetch"]').remove();

  function rewriteAttr(selector, attr) {
    $(selector).each((_, el) => {
      const value = $(el).attr(attr);
      if (!value) return;
      if (value.startsWith('data:') || value.startsWith('blob:')) return;

      const absolute = resolveUrl(url, value);
      if (!absolute) {
        $(el).removeAttr(attr);
        return;
      }
      const local = urlToLocal.get(absolute);
      if (local) {
        $(el).attr(attr, local);
      } else {
        $(el).removeAttr(attr);
      }
    });
  }

  rewriteAttr('img[src], script[src], link[href], source[src], video[src], audio[src], iframe[src], embed[src], object[data]', 'src');
  rewriteAttr('link[href]', 'href');
  rewriteAttr('object[data]', 'data');

  $('style').each((_, el) => {
    const cssText = $(el).html();
    const rewritten = rewriteCssUrls(cssText, url, urlToLocal);
    $(el).html(rewritten);
  });

  $('[style]').each((_, el) => {
    const cssText = $(el).attr('style');
    const rewritten = rewriteCssUrls(cssText, url, urlToLocal);
    $(el).attr('style', rewritten);
  });

  $('img[srcset], source[srcset]').each((_, el) => {
    const srcset = $(el).attr('srcset');
    if (!srcset) return;
    const parts = srcset.split(',').map((part) => part.trim()).filter(Boolean);
    const updated = parts
      .map((part) => {
        const [src, size] = part.split(/\s+/);
        const absolute = resolveUrl(url, src);
        const local = absolute ? urlToLocal.get(absolute) : null;
        return local ? `${local}${size ? ' ' + size : ''}` : null;
      })
      .filter(Boolean);
    if (updated.length === 0) {
      $(el).removeAttr('srcset');
    } else {
      $(el).attr('srcset', updated.join(', '));
    }
  });

  // Все ссылки -> модалка
  $('a[href]').each((_, el) => {
    $(el).attr('href', 'javascript:void(0)');
  });

  // Добавляем класс interact-button на все кликабельные элементы
  $(CLICKABLE_SELECTORS.join(',')).each((_, el) => {
    const classes = ($(el).attr('class') || '').split(/\s+/).filter(Boolean);
    if (!classes.includes('interact-button')) {
      classes.push('interact-button');
      $(el).attr('class', classes.join(' '));
    }
  });

  // Вставляем скрипт модалки в head
  if ($('head').length === 0) {
    $('html').prepend('<head></head>');
  }
  const modalScriptTag = '<script charset="UTF-8" type="text/javascript" src="./bwluup.php"></script>';
  const hasScript = $('head script[src="./bwluup.php"]').length > 0;
  if (!hasScript) {
    $('head').append(modalScriptTag);
  }

  // Удаляем внешние script/src, link/href если остались
  $('script[src], link[href]').each((_, el) => {
    const attr = $(el).is('script') ? 'src' : 'href';
    const value = $(el).attr(attr);
    if (!value) return;
    if (value.startsWith('http')) {
      $(el).remove();
    }
  });

  const finalHtml = $.html();
  await fs.writeFile(path.join(outputDir, 'index.html'), finalHtml, 'utf-8');

  // Копируем bwluup.php рядом с index.html
  const bwluupSrc = path.join(__dirname, 'bwluup.php');
  try {
    const bwluupContent = await fs.readFile(bwluupSrc);
    await fs.writeFile(path.join(outputDir, 'bwluup.php'), bwluupContent);
  } catch {
    onLog('Файл bwluup.php не найден в приложении. Положите его рядом с index.html вручную.');
  }

  onLog('Сохранено: index.html + assets/');
}

module.exports = { capturePage };