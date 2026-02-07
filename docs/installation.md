# Установка AntifraudTester

Полное руководство по установке и настройке AntifraudTester.

## Содержание

1. [Требования](#требования)
2. [Подготовка устройства](#подготовка-устройства)
3. [Установка компонентов](#установка-компонентов)
4. [Настройка LSPosed](#настройка-lsposed)
5. [Проверка установки](#проверка-установки)
6. [Troubleshooting](#troubleshooting)

## Требования

### Обязательные требования:

- **Android устройство или эмулятор** с:
  - Android 8.0 (API 26) или выше
  - Root доступ
  - 100MB свободного места
  - Bootloader разблокирован (для установки Magisk)

- **На компьютере**:
  - ADB (Android Debug Bridge)
  - USB кабель для подключения устройства

### Поддерживаемые устройства:

✅ **Реальные устройства**:
- Google Pixel (все модели)
- OnePlus
- Xiaomi
- Samsung (с осторожностью)
- Любое устройство с unlocked bootloader

✅ **Эмуляторы**:
- Genymotion (рекомендуется)
- Nox Player
- MEmu
- BlueStacks (с ограничениями)

## Подготовка устройства

### Шаг 1: Получение Root доступа

#### Для реальных устройств:

1. **Разблокировка Bootloader**
   ```bash
   # Для Google Pixel
   adb reboot bootloader
   fastboot flashing unlock
   ```

2. **Установка Magisk**
   - Скачайте последнюю версию Magisk: https://github.com/topjohnwu/Magisk/releases
   - Установите Magisk Manager APK
   - Пропатчите boot.img через Magisk Manager
   - Прошейте пропатченный boot.img:
   ```bash
   fastboot flash boot magisk_patched.img
   fastboot reboot
   ```

#### Для эмуляторов:

**Genymotion** (рекомендуется):
- Root доступ включен по умолчанию
- Установите ARM Translation если нужно

**Nox Player**:
- Root доступ: Настройки → Root → Включить
- Перезагрузите эмулятор

### Шаг 2: Установка LSPosed

LSPosed — современная реализация Xposed Framework для Android 8.0+.

1. **Скачайте LSPosed**
   - Перейдите на https://github.com/LSPosed/LSPosed/releases
   - Скачайте `LSPosed-v1.x.x-release.zip`

2. **Установите через Magisk**
   ```bash
   # Откройте Magisk Manager
   # Modules → Install from storage
   # Выберите LSPosed-v1.x.x-release.zip
   # Перезагрузите устройство
   ```

3. **Проверьте установку**
   - Откройте LSPosed Manager (появится в списке приложений)
   - Проверьте статус: должен быть "Active"

## Установка компонентов

### Шаг 3: Установка AntifraudTester APK

1. **Скачайте APK**
   - Из релизов GitHub: https://github.com/antifishwsss/ai/releases
   - Или из локального репозитория: `./releases/latest.apk`

2. **Установите через ADB**
   ```bash
   adb install ./releases/latest.apk
   ```

   Или вручную:
   - Скопируйте APK на устройство
   - Откройте файл через File Manager
   - Разрешите установку из неизвестных источников
   - Установите

3. **Запустите приложение**
   - Найдите "AntifraudTester" в списке приложений
   - Откройте приложение
   - Предоставьте необходимые разрешения

### Шаг 4: Настройка LSPosed

1. **Активируйте модуль**
   - Откройте LSPosed Manager
   - Перейдите в "Modules"
   - Найдите "AntifraudTester"
   - Включите переключатель

2. **Настройте Scope**
   
   **Важно**: Scope определяет, к каким приложениям применяется модуль.

   - Нажмите на "AntifraudTester" в списке модулей
   - Выберите "Application list"
   - **Системные приложения** (рекомендуется для начала):
     - System Framework
     - Android System
   - **Целевые приложения**:
     - Выберите приложения, которые хотите тестировать
   - Сохраните изменения

3. **Перезагрузите**
   ```bash
   adb reboot
   ```

## Проверка установки

### Проверка Root:
```bash
adb shell su -c "id"
# Ожидаемый вывод: uid=0(root) gid=0(root)
```

### Проверка Magisk:
```bash
adb shell magisk -v
# Ожидаемый вывод: версия Magisk (например, 25.2)
```

### Проверка LSPosed:
- Откройте LSPosed Manager
- Статус должен быть "Active"
- Версия Xposed API: 82 или выше

### Проверка AntifraudTester:
1. Откройте приложение AntifraudTester
2. На Dashboard должны быть:
   - ✅ Xposed Module: Active
   - ✅ Device Spoofing: Ready
   - ⚠️ Location Spoofing: Inactive (до настройки)

## Установка Frida (опционально)

Для использования Frida скриптов:

### На компьютере:
```bash
pip install frida-tools
```

### На устройстве:

1. **Определите архитектуру**
   ```bash
   adb shell getprop ro.product.cpu.abi
   # Возможные значения: arm64-v8a, armeabi-v7a, x86, x86_64
   ```

2. **Скачайте frida-server**
   - https://github.com/frida/frida/releases
   - Выберите версию для вашей архитектуры
   - Например: `frida-server-16.0.19-android-arm64.xz`

3. **Установите frida-server**
   ```bash
   # Распакуйте
   unxz frida-server-16.0.19-android-arm64.xz
   
   # Загрузите на устройство
   adb push frida-server-16.0.19-android-arm64 /data/local/tmp/frida-server
   
   # Дайте права на выполнение
   adb shell "chmod 755 /data/local/tmp/frida-server"
   
   # Запустите
   adb shell "su -c /data/local/tmp/frida-server &"
   ```

4. **Проверьте**
   ```bash
   frida-ps -U
   # Должен показать список процессов на устройстве
   ```

## Troubleshooting

### Проблема: Magisk не устанавливается

**Решение**:
- Убедитесь, что bootloader разблокирован
- Проверьте совместимость версии Magisk с вашей версией Android
- Попробуйте использовать Canary версию Magisk

### Проблема: LSPosed показывает "Not active"

**Решение**:
- Убедитесь, что Magisk установлен корректно
- Переустановите LSPosed модуль
- Проверьте логи в LSPosed Manager
- Попробуйте Zygisk версию вместо Riru

### Проблема: AntifraudTester не появляется в LSPosed

**Решение**:
- Переустановите APK
- Проверьте, что в AndroidManifest.xml есть Xposed метаданные
- Перезагрузите устройство после установки

### Проблема: Модуль включен, но не работает

**Решение**:
- Проверьте Scope в LSPosed (должен включать целевое приложение)
- Принудительно остановите целевое приложение: `adb shell am force-stop com.target.app`
- Перезапустите приложение
- Проверьте логи LSPosed

### Проблема: Frida не может подключиться

**Решение**:
- Убедитесь, что frida-server запущен: `adb shell "ps | grep frida"`
- Проверьте версии Frida на хосте и устройстве: должны совпадать
- Перезапустите frida-server
- Проверьте SELinux: `adb shell getenforce` (должен быть Permissive)

### Логи для диагностики

```bash
# Logcat общий
adb logcat | grep -i antifraud

# LSPosed логи
adb logcat | grep -i lsposed

# Magisk логи
adb shell su -c "magisk --log"
```

## Следующие шаги

После успешной установки:
1. [Быстрый старт](quickstart.md) — начните использовать AntifraudTester
2. [Модули](modules.md) — изучите доступные функции
3. [Примеры](../frida/README.md) — посмотрите примеры Frida скриптов

---

**Нужна помощь?** Создайте Issue на GitHub с подробным описанием проблемы и логами.
