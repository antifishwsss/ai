# Releases

## latest.apk

**Текущая версия:** 1.0.0

### Установка

```bash
# Через ADB
adb install latest.apk

# Или вручную
# 1. Скопируйте APK на устройство
# 2. Откройте файл
# 3. Разрешите установку из неизвестных источников
# 4. Установите
```

### Требования

- Android 8.0 (API 26) или выше
- Root доступ
- Magisk 24.0+
- LSPosed 1.8.0+

### Активация

1. Установите APK
2. Откройте LSPosed Manager
3. Modules → Включите AntifraudTester
4. Выберите целевые приложения в Scope
5. Перезагрузите устройство

### Что включено

- ✅ Device Info Spoofing
- ✅ Location Spoofing (базовый)
- ✅ Network Spoofing
- ✅ Dashboard UI
- ✅ Xposed Hooks

### Changelog

См. [CHANGELOG.md](../CHANGELOG.md) для полной истории изменений.

### Проверка подлинности

```bash
# Проверьте SHA256 hash
sha256sum latest.apk

# Сравните с официальным hash в releases notes
```

### Получение обновлений

Следите за новыми релизами:
- GitHub Releases: https://github.com/antifishwsss/ai/releases
- Этот каталог обновляется с каждым релизом

### Проблемы

Если APK не устанавливается:
1. Проверьте версию Android (минимум 8.0)
2. Разрешите установку из неизвестных источников
3. Проверьте наличие свободного места (минимум 50MB)
4. Попробуйте установить через ADB

### Поддержка

- Issues: https://github.com/antifishwsss/ai/issues
- Документация: [../docs/](../docs/)

---

**Важно:** Используйте только для легального тестирования!
