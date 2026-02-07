package com.antifraud.tester

import de.robv.android.xposed.IXposedHookLoadPackage
import de.robv.android.xposed.XC_MethodHook
import de.robv.android.xposed.XposedHelpers
import de.robv.android.xposed.callbacks.XC_LoadPackage

/**
 * Xposed Module Hook
 * 
 * Этот класс перехватывает системные вызовы Android для подмены
 * идентификаторов устройства и других параметров
 */
class XposedModule : IXposedHookLoadPackage {
    
    override fun handleLoadPackage(lpparam: XC_LoadPackage.LoadPackageParam) {
        // Hook только для целевых приложений
        if (lpparam.packageName == "android" || lpparam.packageName.startsWith("com.android")) {
            hookDeviceInfo(lpparam)
            hookLocationServices(lpparam)
        }
    }
    
    /**
     * Перехватывает вызовы получения информации об устройстве
     */
    private fun hookDeviceInfo(lpparam: XC_LoadPackage.LoadPackageParam) {
        try {
            // Hook Build.SERIAL
            XposedHelpers.findAndHookMethod(
                "android.os.Build",
                lpparam.classLoader,
                "getSerial",
                object : XC_MethodHook() {
                    override fun afterHookedMethod(param: MethodHookParam) {
                        // Подменяем серийный номер
                        param.result = "SPOOFED_SERIAL_12345"
                    }
                }
            )
            
            // Hook для Android ID
            XposedHelpers.findAndHookMethod(
                "android.provider.Settings.Secure",
                lpparam.classLoader,
                "getString",
                android.content.ContentResolver::class.java,
                String::class.java,
                object : XC_MethodHook() {
                    override fun afterHookedMethod(param: MethodHookParam) {
                        val name = param.args[1] as? String
                        if (name == "android_id") {
                            param.result = "spoofed_android_id_123"
                        }
                    }
                }
            )
            
        } catch (e: Exception) {
            // Log ошибки
        }
    }
    
    /**
     * Перехватывает вызовы службы геолокации
     */
    private fun hookLocationServices(lpparam: XC_LoadPackage.LoadPackageParam) {
        try {
            XposedHelpers.findAndHookMethod(
                "android.location.Location",
                lpparam.classLoader,
                "getLatitude",
                object : XC_MethodHook() {
                    override fun afterHookedMethod(param: MethodHookParam) {
                        // Подменяем широту (пример: Москва)
                        param.result = 55.7558
                    }
                }
            )
            
            XposedHelpers.findAndHookMethod(
                "android.location.Location",
                lpparam.classLoader,
                "getLongitude",
                object : XC_MethodHook() {
                    override fun afterHookedMethod(param: MethodHookParam) {
                        // Подменяем долготу (пример: Москва)
                        param.result = 37.6173
                    }
                }
            )
            
        } catch (e: Exception) {
            // Log ошибки
        }
    }
}
