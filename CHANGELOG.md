# Changelog

Все важные изменения в проекте AntifraudTester документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-XX-XX

### Добавлено
- 🎉 Первый релиз AntifraudTester
- ✅ Android приложение с Material Design 3 UI
- ✅ Dashboard для мониторинга статуса подмен
- ✅ Xposed модуль для системной подмены параметров
- ✅ Device Info Spoofing:
  - Android ID
  - IMEI
  - Serial Number
  - MAC Address
  - Build информация
- ✅ Location Spoofing:
  - GPS координаты (Latitude, Longitude)
  - Altitude
  - Accuracy
- ✅ Network Spoofing:
  - IP Address
  - Network Carrier
  - User-Agent
  - WiFi информация
- ✅ Frida скрипты:
  - device_spoof.js — подмена идентификаторов
  - location_spoof.js — подмена GPS
  - network_spoof.js — подмена сети
- ✅ Полная документация:
  - Руководство по установке
  - Быстрый старт
  - Руководство разработчика
  - FAQ
- ✅ Примеры использования
- ✅ Шаблоны профилей (Emulator, VPN, Bot)

### Технические детали
- Минимальная версия Android: 8.0 (API 26)
- Целевая версия Android: 14 (API 34)
- Kotlin: 1.9.10
- Jetpack Compose: 2023.10.01
- LSPosed/Xposed API: 82
- Frida: 16.0.0+

### Зависимости
- androidx.core:core-ktx:1.12.0
- androidx.compose.material3:material3
- androidx.navigation:navigation-compose:2.7.5
- de.robv.android.xposed:api:82

## [Unreleased]

### Планируется
- [ ] Интерактивная карта для Location Spoofing
- [ ] Sensor spoofing (акселерометр, гироскоп)
- [ ] Battery spoofing
- [ ] Network traffic interception
- [ ] Поддержка импорт/экспорт профилей
- [ ] Cloud sync для конфигураций
- [ ] Advanced logging и analytics
- [ ] Интеграция с популярными antifraud системами
- [ ] Автоматические тестовые сценарии
- [ ] Web dashboard для удаленного управления

### В разработке
- Улучшение UI/UX
- Больше готовых профилей
- Расширенная документация
- Video tutorials

---

## Версионирование

- **MAJOR** версия - несовместимые изменения API
- **MINOR** версия - новая функциональность с обратной совместимостью
- **PATCH** версия - исправления ошибок с обратной совместимостью

## Типы изменений

- `Добавлено` - новые фичи
- `Изменено` - изменения в существующей функциональности
- `Устарело` - функции, которые скоро будут удалены
- `Удалено` - удаленные функции
- `Исправлено` - исправления багов
- `Безопасность` - исправления уязвимостей
