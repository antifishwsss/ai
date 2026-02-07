/**
 * AntifraudTester - Frida Script для подмены GPS координат
 * 
 * Использование:
 * frida -U -f com.target.app -l location_spoof.js --no-pause
 */

console.log("[*] AntifraudTester: Location Spoofing активирован");

// Координаты для подмены (по умолчанию: Москва, Красная площадь)
var FAKE_LATITUDE = 55.753215;
var FAKE_LONGITUDE = 37.622504;
var FAKE_ALTITUDE = 156.0;

console.log("[*] Целевые координаты: " + FAKE_LATITUDE + ", " + FAKE_LONGITUDE);

// Hook Location класса
Java.perform(function() {
    console.log("[*] Hooking Location класса...");
    
    var Location = Java.use('android.location.Location');
    
    // Подмена getLatitude
    Location.getLatitude.implementation = function() {
        console.log("[+] Location.getLatitude() перехвачен!");
        return FAKE_LATITUDE;
    };
    
    // Подмена getLongitude
    Location.getLongitude.implementation = function() {
        console.log("[+] Location.getLongitude() перехвачен!");
        return FAKE_LONGITUDE;
    };
    
    // Подмена getAltitude
    Location.getAltitude.implementation = function() {
        console.log("[+] Location.getAltitude() перехвачен!");
        return FAKE_ALTITUDE;
    };
    
    // Подмена getAccuracy
    Location.getAccuracy.implementation = function() {
        console.log("[+] Location.getAccuracy() перехвачен!");
        return 5.0; // Хорошая точность
    };
    
    console.log("[+] Location hooks установлены");
});

// Hook LocationManager
Java.perform(function() {
    console.log("[*] Hooking LocationManager...");
    
    try {
        var LocationManager = Java.use('android.location.LocationManager');
        
        // Подмена getLastKnownLocation
        LocationManager.getLastKnownLocation.overload('java.lang.String').implementation = function(provider) {
            console.log("[+] LocationManager.getLastKnownLocation() перехвачен для " + provider);
            
            var Location = Java.use('android.location.Location');
            var location = Location.$new(provider);
            
            location.setLatitude(FAKE_LATITUDE);
            location.setLongitude(FAKE_LONGITUDE);
            location.setAltitude(FAKE_ALTITUDE);
            location.setAccuracy(5.0);
            location.setTime(Date.now());
            
            return location;
        };
        
        console.log("[+] LocationManager hooks установлены");
    } catch(e) {
        console.log("[-] Ошибка при hooking LocationManager: " + e);
    }
});

// Hook для Google Location Services (если используется)
Java.perform(function() {
    console.log("[*] Hooking Google Location Services...");
    
    try {
        var FusedLocationProviderClient = Java.use('com.google.android.gms.location.FusedLocationProviderClient');
        console.log("[+] Google Location Services обнаружены");
        
        // Здесь можно добавить hooks для Fused Location Provider
        
    } catch(e) {
        console.log("[-] Google Location Services не найдены или недоступны");
    }
});

// Функция для изменения координат во время выполнения
rpc.exports = {
    setLocation: function(lat, lon, alt) {
        FAKE_LATITUDE = parseFloat(lat);
        FAKE_LONGITUDE = parseFloat(lon);
        FAKE_ALTITUDE = parseFloat(alt || 0);
        
        console.log("[*] Координаты обновлены: " + FAKE_LATITUDE + ", " + FAKE_LONGITUDE);
        return "OK";
    },
    
    getLocation: function() {
        return {
            latitude: FAKE_LATITUDE,
            longitude: FAKE_LONGITUDE,
            altitude: FAKE_ALTITUDE
        };
    }
};

console.log("[*] Location spoofing активен. Используйте setLocation(lat, lon, alt) для изменения координат.");
