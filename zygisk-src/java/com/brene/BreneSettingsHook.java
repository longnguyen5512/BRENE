package com.brene;

import android.content.ContentProvider;
import android.content.IContentProvider;
import android.os.IBinder;
import android.util.ArrayMap;
import android.util.Log;
import android.util.SparseArray;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;

public final class BreneSettingsHook {
    private static final String TAG = "BRENE-Zygisk";

    public static boolean tryInstall() {
        try {
            Class<?> smClass = Class.forName("android.os.ServiceManager");
            Method getService = smClass.getMethod("getService", String.class);
            Object ams = getService.invoke(null, "activity");
            if (ams == null) return false;

            Field cpHelperField = ams.getClass().getDeclaredField("mCpHelper");
            cpHelperField.setAccessible(true);
            Object cpHelper = cpHelperField.get(ams);
            if (cpHelper == null) return false;

            Field pMapField = cpHelper.getClass().getDeclaredField("mProviderMap");
            pMapField.setAccessible(true);
            Object pMap = pMapField.get(cpHelper);
            if (pMap == null) return false;

            Field singletonField = pMap.getClass().getDeclaredField("mSingletonByName");
            singletonField.setAccessible(true);
            HashMap<?, ?> singletonByName = (HashMap<?, ?>) singletonField.get(pMap);

            Object cpr = singletonByName != null ? singletonByName.get("settings") : null;
            if (cpr == null) {
                Field perUserField = pMap.getClass().getDeclaredField("mProvidersByNamePerUser");
                perUserField.setAccessible(true);
                SparseArray<?> perUser = (SparseArray<?>) perUserField.get(pMap);
                if (perUser != null) {
                    for (int i = 0; i < perUser.size(); i++) {
                        HashMap<?, ?> map = (HashMap<?, ?>) perUser.valueAt(i);
                        if (map != null && map.get("settings") != null) {
                            cpr = map.get("settings");
                            break;
                        }
                    }
                }
            }
            if (cpr == null) return false;

            Field cprProvField = cpr.getClass().getDeclaredField("mProvider");
            cprProvField.setAccessible(true);
            IContentProvider orig = (IContentProvider) cprProvField.get(cpr);
            if (orig == null) return false;
            if (orig instanceof SettingsBinderProxy) return true;

            SettingsBinderProxy proxy = new SettingsBinderProxy(orig);
            cprProvField.set(cpr, proxy);

            // Also update ActivityThread's local provider map/mTransport if present
            try {
                Class<?> atClass = Class.forName("android.app.ActivityThread");
                Object at = atClass.getMethod("currentActivityThread").invoke(null);
                if (at != null) {
                    Field atProvMapField = atClass.getDeclaredField("mProviderMap");
                    atProvMapField.setAccessible(true);
                    ArrayMap<?, ?> atProvMap = (ArrayMap<?, ?>) atProvMapField.get(at);
                    if (atProvMap != null) {
                        for (int i = 0; i < atProvMap.size(); i++) {
                            Object pcr = atProvMap.valueAt(i);
                            if (pcr == null) continue;
                            Field mProvField = pcr.getClass().getDeclaredField("mProvider");
                            mProvField.setAccessible(true);
                            if (mProvField.get(pcr) == orig) {
                                mProvField.set(pcr, proxy);
                                try {
                                    Field mHolderField = pcr.getClass().getDeclaredField("mHolder");
                                    mHolderField.setAccessible(true);
                                    Object holder = mHolderField.get(pcr);
                                    if (holder != null) {
                                        Field hProv = holder.getClass().getField("provider");
                                        hProv.set(holder, proxy);
                                    }
                                } catch (Throwable ignored) {}
                                try {
                                    Field mLocalField = pcr.getClass().getDeclaredField("mLocalProvider");
                                    mLocalField.setAccessible(true);
                                    Object localProv = mLocalField.get(pcr);
                                    if (localProv instanceof ContentProvider) {
                                        Field mTransportField = ContentProvider.class.getDeclaredField("mTransport");
                                        mTransportField.setAccessible(true);
                                        mTransportField.set(localProv, proxy);
                                    }
                                } catch (Throwable ignored) {}
                            }
                        }
                    }
                }
            } catch (Throwable t) {
                Log.w(TAG, "ActivityThread update warning: " + t);
            }

            Log.i(TAG, "Installed SettingsBinderProxy for SettingsProvider in system_server");

            // Wrap IAccessibilityManager ("accessibility") in ServiceManager
            try {
                IBinder accOrig = (IBinder) getService.invoke(null, "accessibility");
                if (accOrig != null && !(accOrig instanceof AccessibilityBinderProxy)) {
                    Class<?> stubClass = Class.forName("android.view.accessibility.IAccessibilityManager$Stub");
                    Field fAddClient = stubClass.getDeclaredField("TRANSACTION_addClient");
                    fAddClient.setAccessible(true);
                    Field fGetEnabled = stubClass.getDeclaredField("TRANSACTION_getEnabledAccessibilityServiceList");
                    fGetEnabled.setAccessible(true);
                    int txAddClient = fAddClient.getInt(null);
                    int txGetEnabled = fGetEnabled.getInt(null);
                    AccessibilityBinderProxy accProxy = new AccessibilityBinderProxy(accOrig, txAddClient, txGetEnabled);
                    Method addService = smClass.getMethod("addService", String.class, IBinder.class);
                    addService.invoke(null, "accessibility", accProxy);
                    Log.i(TAG, "Installed AccessibilityBinderProxy in system_server");
                }
            } catch (Throwable t) {
                Log.w(TAG, "AccessibilityBinderProxy install warning: " + t);
            }

            return true;
        } catch (Throwable t) {
            Log.e(TAG, "tryInstall error", t);
            return false;
        }
    }
}
