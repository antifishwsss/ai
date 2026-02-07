# Contributing to AntifraudTester

Спасибо за интерес к проекту AntifraudTester! Мы приветствуем contributions от сообщества.

## Как внести вклад

### Сообщение о проблемах

Если вы нашли баг или хотите предложить новую функцию:

1. Проверьте, что проблема еще не была создана в [Issues](https://github.com/antifishwsss/ai/issues)
2. Создайте новый Issue с подробным описанием
3. Используйте соответствующие labels (bug, enhancement, documentation и т.д.)

### Pull Requests

1. **Fork** репозитория
2. Создайте **feature branch** от `main`:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. Внесите изменения, следуя [Code Style](#code-style)
4. Добавьте или обновите тесты
5. Обновите документацию
6. Commit с понятным сообщением:
   ```bash
   git commit -m "feat: добавить подмену сенсоров акселерометра"
   ```
7. Push в ваш fork:
   ```bash
   git push origin feature/my-awesome-feature
   ```
8. Создайте Pull Request в основной репозиторий

### Требования к Pull Request

✅ Код следует существующему стилю  
✅ Все тесты проходят  
✅ Документация обновлена  
✅ Commit messages следуют [Conventional Commits](https://www.conventionalcommits.org/)  
✅ Нет конфликтов с main branch  
✅ Проверено на реальном устройстве  

## Code Style

### Kotlin
Следуйте [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html):

```kotlin
// Хорошо ✅
fun spoofDeviceId(deviceId: String): Boolean {
    return try {
        // Implementation
        true
    } catch (e: Exception) {
        Log.e(TAG, "Error spoofing device ID", e)
        false
    }
}

// Плохо ❌
fun spoofDeviceId(deviceId:String):Boolean{
    try{return true}catch(e:Exception){return false}
}
```

### Compose
```kotlin
@Composable
fun MyComponent(
    title: String,
    modifier: Modifier = Modifier,
    onAction: () -> Unit
) {
    Column(modifier = modifier.padding(16.dp)) {
        Text(text = title)
        Button(onClick = onAction) {
            Text("Action")
        }
    }
}
```

### JavaScript (Frida)
```javascript
Java.perform(function() {
    const TargetClass = Java.use('com.example.TargetClass');
    
    TargetClass.targetMethod.implementation = function(param) {
        console.log('[+] Method intercepted with param:', param);
        return this.targetMethod(param);
    };
});
```

## Commit Messages

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - новая функциональность
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование, пропущенные точки с запятой и т.д.
- `refactor:` - рефакторинг кода
- `test:` - добавление тестов
- `chore:` - обновление задач сборки, конфигураций и т.д.

Примеры:
```
feat: добавить подмену батареи
fix: исправить crash при подмене локации на Android 14
docs: обновить installation.md с новыми требованиями
refactor: улучшить структуру XposedModule
test: добавить unit тесты для DeviceSpoofing
```

## Разработка

### Настройка окружения

1. **Установите зависимости**:
   - JDK 17+
   - Android Studio Flamingo+
   - Android SDK (API 26-34)

2. **Клонируйте и откройте**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai.git
   cd ai
   # Откройте в Android Studio
   ```

3. **Запустите тесты**:
   ```bash
   ./gradlew test
   ./gradlew connectedAndroidTest  # на устройстве
   ```

### Тестирование

- Всегда добавляйте тесты для новой функциональности
- Unit тесты: `app/src/test/`
- Instrumentation тесты: `app/src/androidTest/`
- Тестируйте на реальном устройстве с LSPosed

### Документация

- Обновляйте README.md при изменении функциональности
- Добавляйте примеры использования в docs/
- Комментируйте сложный код
- Обновляйте CHANGELOG.md

## Вопросы?

Если у вас есть вопросы:
- Создайте [Discussion](https://github.com/antifishwsss/ai/discussions)
- Спросите в существующем Issue
- Прочитайте [документацию](docs/)

## Лицензия

Внося вклад в этот проект, вы соглашаетесь с тем, что ваш код будет лицензирован под [MIT License](LICENSE).

## Code of Conduct

Будьте уважительны и профессиональны. Мы стремимся создать открытое и дружелюбное сообщество.

---

**Спасибо за ваш вклад! 🙏**
