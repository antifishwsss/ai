/**
 * AntifraudTester - Frida Script для подмены сетевых параметров
 * 
 * Использование:
 * frida -U -f com.target.app -l network_spoof.js --no-pause
 */

console.log("[*] AntifraudTester: Network Spoofing активирован");

// Параметры для подмены
var FAKE_IP = "8.8.8.8";
var FAKE_CARRIER = "Spoofed Carrier";
var FAKE_USER_AGENT = "Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36";

// Подмена сетевой информации
Java.perform(function() {
    console.log("[*] Hooking Network информации...");
    
    try {
        var TelephonyManager = Java.use('android.telephony.TelephonyManager');
        
        // Подмена оператора сети
        TelephonyManager.getNetworkOperatorName.implementation = function() {
            console.log("[+] Network Operator Name перехвачен!");
            return FAKE_CARRIER;
        };
        
        TelephonyManager.getSimOperatorName.implementation = function() {
            console.log("[+] SIM Operator Name перехвачен!");
            return FAKE_CARRIER;
        };
        
        TelephonyManager.getNetworkOperator.implementation = function() {
            console.log("[+] Network Operator перехвачен!");
            return "99999"; // Фейковый MCC+MNC
        };
        
        console.log("[+] TelephonyManager hooks установлены");
    } catch(e) {
        console.log("[-] Ошибка при hooking TelephonyManager: " + e);
    }
});

// Подмена User-Agent в WebView
Java.perform(function() {
    console.log("[*] Hooking WebView User-Agent...");
    
    try {
        var WebSettings = Java.use('android.webkit.WebSettings');
        
        WebSettings.getUserAgentString.implementation = function() {
            console.log("[+] User-Agent перехвачен!");
            return FAKE_USER_AGENT;
        };
        
        console.log("[+] WebView User-Agent hooks установлены");
    } catch(e) {
        console.log("[-] Ошибка при hooking WebView: " + e);
    }
});

// Подмена IP адреса через NetworkInterface
Java.perform(function() {
    console.log("[*] Hooking IP адреса...");
    
    try {
        var InetAddress = Java.use('java.net.InetAddress');
        
        InetAddress.getHostAddress.implementation = function() {
            console.log("[+] IP Address перехвачен!");
            return FAKE_IP;
        };
        
        console.log("[+] IP Address hooks установлены");
    } catch(e) {
        console.log("[-] Ошибка при hooking IP: " + e);
    }
});

// Подмена WiFi информации
Java.perform(function() {
    console.log("[*] Hooking WiFi информации...");
    
    try {
        var WifiInfo = Java.use('android.net.wifi.WifiInfo');
        
        // Подмена SSID
        WifiInfo.getSSID.implementation = function() {
            console.log("[+] WiFi SSID перехвачен!");
            return "SpoofedWiFi";
        };
        
        // Подмена BSSID
        WifiInfo.getBSSID.implementation = function() {
            console.log("[+] WiFi BSSID перехвачен!");
            return "02:00:00:00:00:00";
        };
        
        console.log("[+] WiFi hooks установлены");
    } catch(e) {
        console.log("[-] Ошибка при hooking WiFi: " + e);
    }
});

// RPC функции для управления
rpc.exports = {
    setIP: function(ip) {
        FAKE_IP = ip;
        console.log("[*] IP обновлен: " + FAKE_IP);
        return "OK";
    },
    
    setCarrier: function(carrier) {
        FAKE_CARRIER = carrier;
        console.log("[*] Carrier обновлен: " + FAKE_CARRIER);
        return "OK";
    },
    
    setUserAgent: function(ua) {
        FAKE_USER_AGENT = ua;
        console.log("[*] User-Agent обновлен");
        return "OK";
    },
    
    getNetworkInfo: function() {
        return {
            ip: FAKE_IP,
            carrier: FAKE_CARRIER,
            userAgent: FAKE_USER_AGENT
        };
    }
};

console.log("[*] Network spoofing активен!");
