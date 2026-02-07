# Руководство по разработке

Руководство для разработчиков, желающих расширить или модифицировать AntifraudTester.

## Содержание

1. [Настройка окружения](#настройка-окружения)
2. [Структура проекта](#структура-проекта)
3. [Сборка приложения](#сборка-приложения)
4. [Разработка модулей](#разработка-модулей)
5. [Тестирование](#тестирование)
6. [Contribution Guidelines](#contribution-guidelines)

## Настройка окружения

### Требования

- **JDK**: OpenJDK 17 или выше
- **Android Studio**: Flamingo (2022.2.1) или новее
- **Android SDK**: API 26 - API 34
- **Kotlin**: 1.9.10+
- **Gradle**: 8.1+

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/antifishwsss/ai.git
   cd ai
   ```

2. **Откройте в Android Studio**
   - File → Open → выберите папку проекта
   - Дождитесь синхронизации Gradle

3. **Установите Android SDK**
   - Tools → SDK Manager
   - Установите SDK Platform 26-34
   - Установите Build Tools 34.0.0

4. **Настройте устройство для тестирования**
   - Реальное устройство с root или эмулятор
   - LSPosed установлен и активен

## Структура проекта

```
ai/
├── app/                          # Android приложение
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/antifraud/tester/
│   │   │   │   ├── MainActivity.kt        # Главная Activity
│   │   │   │   ├── XposedModule.kt        # Xposed hooks
│   │   │   │   └── ui/                    # UI компоненты
│   │   │   │       └── theme/
│   │   │   ├── res/                       # Ресурсы
│   │   │   └── AndroidManifest.xml
│   │   └── test/                          # Unit тесты
│   └── build.gradle                       # Конфигурация модуля
│
├── frida/                        # Frida скрипты
│   ├── device_spoof.js
│   ├── location_spoof.js
│   ├── network_spoof.js
│   └── README.md
│
├── docs/                         # Документация
│   ├── README.md
│   ├── installation.md
│   ├── quickstart.md
│   ├── modules.md
│   └── development.md (этот файл)
│
├── releases/                     # Релизы APK
│   └── latest.apk
│
├── build.gradle                  # Root Gradle
├── settings.gradle
├── gradle.properties
├── .gitignore
├── LICENSE
└── README.md
```

## Сборка приложения

### Debug сборка

```bash
# Через Gradle
./gradlew assembleDebug

# Результат в app/build/outputs/apk/debug/app-debug.apk
```

### Release сборка

1. **Создайте keystore** (первый раз):
   ```bash
   keytool -genkey -v -keystore antifraud-release.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias antifraud-key
   ```

2. **Настройте signing config** в `app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("../antifraud-release.jks")
               storePassword "your_password"
               keyAlias "antifraud-key"
               keyPassword "your_password"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               // ...
           }
       }
   }
   ```

3. **Соберите**:
   ```bash
   ./gradlew assembleRelease
   # Результат в app/build/outputs/apk/release/app-release.apk
   ```

### Установка на устройство

```bash
# Debug версия
./gradlew installDebug

# Release версия
./gradlew installRelease

# Или вручную через adb
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Разработка модулей

### Добавление нового Xposed hook

1. **Откройте XposedModule.kt**

2. **Создайте новую функцию hook**:
   ```kotlin
   private fun hookNewFeature(lpparam: XC_LoadPackage.LoadPackageParam) {
       try {
           XposedHelpers.findAndHookMethod(
               "com.example.TargetClass",
               lpparam.classLoader,
               "targetMethod",
               String::class.java,  // параметры метода
               object : XC_MethodHook() {
                   override fun beforeHookedMethod(param: MethodHookParam) {
                       // Код до выполнения оригинального метода
                   }
                   
                   override fun afterHookedMethod(param: MethodHookParam) {
                       // Код после выполнения
                       param.result = "spoofed_value"
                   }
               }
           )
       } catch (e: Exception) {
           // Обработка ошибок
       }
   }
   ```

3. **Зарегистрируйте в handleLoadPackage**:
   ```kotlin
   override fun handleLoadPackage(lpparam: XC_LoadPackage.LoadPackageParam) {
       if (shouldHook(lpparam)) {
           hookDeviceInfo(lpparam)
           hookLocationServices(lpparam)
           hookNewFeature(lpparam)  // Добавьте ваш hook
       }
   }
   ```

### Добавление UI компонента

1. **Создайте Composable функцию**:
   ```kotlin
   @Composable
   fun NewFeatureScreen() {
       Column(
           modifier = Modifier
               .fillMaxSize()
               .padding(16.dp)
       ) {
           Text("New Feature", style = MaterialTheme.typography.headlineMedium)
           // Ваш UI
       }
   }
   ```

2. **Добавьте в навигацию** в MainActivity.kt:
   ```kotlin
   when (selectedTab) {
       0 -> DashboardContent()
       1 -> DeviceInfoContent()
       2 -> LocationContent()
       3 -> SettingsContent()
       4 -> NewFeatureScreen()  // Новый экран
   }
   ```

### Создание Frida скрипта

1. **Создайте новый JS файл** в `frida/`:
   ```javascript
   // frida/my_feature.js
   console.log("[*] My Feature активирован");
   
   Java.perform(function() {
       var TargetClass = Java.use('com.example.TargetClass');
       
       TargetClass.targetMethod.implementation = function(param) {
           console.log("[+] targetMethod перехвачен!");
           // Ваша логика
           return "spoofed_value";
       };
   });
   ```

2. **Добавьте документацию** в `frida/README.md`

3. **Тестируйте**:
   ```bash
   frida -U -f com.target.app -l frida/my_feature.js --no-pause
   ```

## Тестирование

### Unit тесты

```bash
# Запуск всех тестов
./gradlew test

# Запуск с отчетом
./gradlew test --info

# Результаты в app/build/reports/tests/
```

### Instrumentation тесты

```bash
# На подключенном устройстве
./gradlew connectedAndroidTest
```

### Ручное тестирование

1. **Установите debug версию**
2. **Активируйте в LSPosed**
3. **Добавьте тестовое приложение в scope**
4. **Перезагрузите устройство**
5. **Запустите и проверьте логи**:
   ```bash
   adb logcat | grep -E "AntifraudTester|LSPosed"
   ```

### Тестирование Xposed hooks

Создайте простое тестовое приложение:

```kotlin
class TestActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Тест Android ID
        val androidId = Settings.Secure.getString(
            contentResolver,
            Settings.Secure.ANDROID_ID
        )
        Log.d("TEST", "Android ID: $androidId")
        
        // Тест Location
        val locationManager = getSystemService(LocationManager::class.java)
        val location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
        Log.d("TEST", "Location: ${location?.latitude}, ${location?.longitude}")
    }
}
```

## Отладка

### LSPosed логи

```bash
# Все логи LSPosed
adb logcat | grep LSPosed

# Логи конкретного модуля
adb logcat | grep AntifraudTester
```

### Android Studio Debugger

1. **Attach к процессу**:
   - Run → Attach Debugger to Android Process
   - Выберите процесс приложения

2. **Установите breakpoints** в коде

3. **Используйте Logcat** для просмотра логов

### Frida отладка

```bash
# Запуск с подробными логами
frida -U -f com.target.app -l script.js --debug

# Интерактивная консоль
frida -U com.target.app
```

В консоли Frida:
```javascript
Java.perform(function() {
    console.log("Debugging...");
    // Ваш код
});
```

## Code Style

### Kotlin

Следуйте [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html):

```kotlin
// Хорошо ✅
fun hookDeviceInfo(lpparam: XC_LoadPackage.LoadPackageParam) {
    try {
        // Код
    } catch (e: Exception) {
        Log.e(TAG, "Error hooking device info", e)
    }
}

// Плохо ❌
fun hookDeviceInfo(lpparam:XC_LoadPackage.LoadPackageParam){
    try{
        //Код
    }catch(e:Exception){}
}
```

### Compose

```kotlin
// Хорошо ✅
@Composable
fun MyComponent(
    title: String,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(text = title)
    }
}

// Плохо ❌
@Composable
fun MyComponent(title: String) {
    Column() {
        Text(title)
    }
}
```

### JavaScript (Frida)

```javascript
// Хорошо ✅
Java.perform(function() {
    const TargetClass = Java.use('com.example.TargetClass');
    
    TargetClass.targetMethod.implementation = function(param) {
        console.log('[+] Method intercepted');
        return this.targetMethod(param);
    };
});

// Плохо ❌
Java.perform(function(){
    var tc=Java.use('com.example.TargetClass')
    tc.targetMethod.implementation=function(p){
        console.log('intercepted')
        return this.targetMethod(p)
    }
})
```

## Contribution Guidelines

### Процесс внесения изменений

1. **Fork репозиторий**
2. **Создайте feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Внесите изменения**
4. **Commit**:
   ```bash
   git commit -m "Add: новая фича для подмены сенсоров"
   ```
5. **Push**:
   ```bash
   git push origin feature/my-new-feature
   ```
6. **Создайте Pull Request** на GitHub

### Commit messages

Используйте conventional commits:

- `feat: добавить подмену сенсоров`
- `fix: исправить crash при подмене локации`
- `docs: обновить README`
- `refactor: улучшить структуру XposedModule`
- `test: добавить тесты для device spoofing`

### Pull Request checklist

- [ ] Код следует code style
- [ ] Добавлены тесты (если применимо)
- [ ] Документация обновлена
- [ ] Нет breaking changes (или они документированы)
- [ ] Проверено на реальном устройстве
- [ ] Логи чистые, нет ошибок

## Полезные ресурсы

### Xposed Development
- [Xposed Framework Wiki](https://github.com/rovo89/XposedBridge/wiki)
- [LSPosed Documentation](https://github.com/LSPosed/LSPosed/wiki)

### Frida
- [Frida Documentation](https://frida.re/docs/)
- [Frida CodeShare](https://codeshare.frida.re/)

### Android Development
- [Android Developer Guide](https://developer.android.com/guide)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Kotlin Documentation](https://kotlinlang.org/docs/)

### Antifraud Research
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Android Security Research](https://source.android.com/security)

---

**Удачи в разработке! 🚀**
