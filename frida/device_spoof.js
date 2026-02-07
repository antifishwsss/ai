/**
 * AntifraudTester - Frida Script для подмены Device ID
 * 
 * Использование:
 * frida -U -f com.target.app -l device_spoof.js --no-pause
 */

console.log("[*] AntifraudTester: Device ID Spoofing активирован");

// Подмена Android ID
Java.perform(function() {
    console.log("[*] Hooking Android ID...");
    
    var Settings = Java.use('android.provider.Settings$Secure');
    Settings.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
        if (name === 'android_id') {
            console.log("[+] Android ID перехвачен!");
            return 'spoofed_android_id_frida_123456';
        }
        return this.getString(cr, name);
    };
});

// Подмена Build информации
Java.perform(function() {
    console.log("[*] Hooking Build информации...");
    
    var Build = Java.use('android.os.Build');
    
    // Подмена SERIAL
    Build.getSerial.implementation = function() {
        console.log("[+] Build.SERIAL перехвачен!");
        return 'FRIDA_SPOOFED_SERIAL_9999';
    };
    
    // Подмена других полей Build
    Build.MANUFACTURER.value = 'SpoofedManufacturer';
    Build.MODEL.value = 'SpoofedModel';
    Build.BRAND.value = 'SpoofedBrand';
    Build.DEVICE.value = 'SpoofedDevice';
    Build.PRODUCT.value = 'SpoofedProduct';
    
    console.log("[+] Build информация подменена");
});

// Подмена IMEI
Java.perform(function() {
    console.log("[*] Hooking IMEI...");
    
    try {
        var TelephonyManager = Java.use('android.telephony.TelephonyManager');
        
        // getDeviceId для старых версий Android
        TelephonyManager.getDeviceId.overload().implementation = function() {
            console.log("[+] IMEI (getDeviceId) перехвачен!");
            return '123456789012345';
        };
        
        // getImei для новых версий Android
        if (TelephonyManager.getImei) {
            TelephonyManager.getImei.overload().implementation = function() {
                console.log("[+] IMEI (getImei) перехвачен!");
                return '123456789012345';
            };
            
            TelephonyManager.getImei.overload('int').implementation = function(slot) {
                console.log("[+] IMEI (getImei slot " + slot + ") перехвачен!");
                return '123456789012345';
            };
        }
    } catch(e) {
        console.log("[-] Ошибка при hooking IMEI: " + e);
    }
});

// Подмена MAC адреса
Java.perform(function() {
    console.log("[*] Hooking MAC Address...");
    
    try {
        var NetworkInterface = Java.use('java.net.NetworkInterface');
        NetworkInterface.getHardwareAddress.implementation = function() {
            console.log("[+] MAC Address перехвачен!");
            // Возвращаем фейковый MAC: 02:00:00:00:00:00
            return Java.array('byte', [0x02, 0x00, 0x00, 0x00, 0x00, 0x00]);
        };
    } catch(e) {
        console.log("[-] Ошибка при hooking MAC: " + e);
    }
});

// Подмена UUID
Java.perform(function() {
    console.log("[*] Hooking UUID...");
    
    var UUID = Java.use('java.util.UUID');
    UUID.randomUUID.implementation = function() {
        console.log("[+] UUID.randomUUID перехвачен!");
        return UUID.$new('12345678-1234-5678-1234-567812345678');
    };
});

console.log("[*] Все hooks установлены. Device ID подмена активна!");
