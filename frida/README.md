# Frida Scripts для AntifraudTester

Коллекция Frida скриптов для runtime-подмены параметров Android устройства.

## Доступные скрипты

### 1. device_spoof.js
Подмена идентификаторов устройства:
- Android ID
- IMEI
- Serial Number
- MAC Address
- Build информация
- UUID

**Использование:**
```bash
frida -U -f com.target.app -l device_spoof.js --no-pause
```

### 2. location_spoof.js
Подмена GPS координат:
- Latitude (широта)
- Longitude (долгота)
- Altitude (высота)
- Accuracy (точность)

**Использование:**
```bash
frida -U -f com.target.app -l location_spoof.js --no-pause
```

**Изменить координаты во время выполнения:**
```python
import frida

device = frida.get_usb_device()
session = device.attach("com.target.app")
script = session.create_script(open("location_spoof.js").read())
script.load()

# Изменить координаты
script.exports.set_location(55.7558, 37.6173, 156.0)  # Москва
```

### 3. network_spoof.js
Подмена сетевых параметров:
- IP адрес
- Network Carrier
- User-Agent
- WiFi SSID/BSSID

**Использование:**
```bash
frida -U -f com.target.app -l network_spoof.js --no-pause
```

## Требования

- Frida установлен на хост-машине
- frida-server запущен на Android устройстве
- USB Debugging включен
- Root доступ (опционально, но рекомендуется)

## Установка Frida

### На хост-машине:
```bash
pip install frida-tools
```

### На Android устройстве:
1. Скачайте frida-server для вашей архитектуры:
   https://github.com/frida/frida/releases

2. Загрузите на устройство:
   ```bash
   adb push frida-server /data/local/tmp/
   adb shell "chmod 755 /data/local/tmp/frida-server"
   ```

3. Запустите frida-server:
   ```bash
   adb shell "su -c /data/local/tmp/frida-server &"
   ```

## Примеры использования

### Базовое использование
```bash
# Список процессов
frida-ps -U

# Запуск с перехватом
frida -U -f com.target.app -l device_spoof.js --no-pause

# Подключение к работающему процессу
frida -U com.target.app -l device_spoof.js
```

### Комбинирование скриптов
```bash
frida -U -f com.target.app \
  -l device_spoof.js \
  -l location_spoof.js \
  -l network_spoof.js \
  --no-pause
```

### Python API
```python
import frida
import sys

device = frida.get_usb_device()
pid = device.spawn(["com.target.app"])
session = device.attach(pid)

with open("device_spoof.js") as f:
    script = session.create_script(f.read())
    script.load()

device.resume(pid)
sys.stdin.read()
```

## Разработка собственных скриптов

Смотрите официальную документацию Frida:
- https://frida.re/docs/javascript-api/
- https://frida.re/docs/examples/android/

## Лицензия

GPLv3 (в соответствии с лицензией Frida)
