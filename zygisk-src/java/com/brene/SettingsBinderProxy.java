package com.brene;

import android.content.AttributionSource;
import android.content.ContentProviderOperation;
import android.content.ContentProviderResult;
import android.content.ContentValues;
import android.content.IContentProvider;
import android.content.OperationApplicationException;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.net.Uri;
import android.os.Binder;
import android.os.Bundle;
import android.os.ICancellationSignal;
import android.os.ParcelFileDescriptor;
import android.os.RemoteCallback;
import android.os.RemoteException;
import java.io.FileNotFoundException;
import java.util.ArrayList;

public final class SettingsBinderProxy extends android.content.ContentProviderNative {
    private final IContentProvider orig;

    public SettingsBinderProxy(IContentProvider orig) {
        this.orig = orig;
    }

    @Override
    public String getProviderName() {
        return "settings";
    }

    public static native boolean nativeIsUidAllowed(int uid);
    public static native boolean nativeIsAccUidAllowed(int uid);
    public static native boolean nativeIsHideAccessibility();

    private static boolean isHiddenAdbKey(String key) {
        return "adb_enabled".equals(key)
            || "adb_wifi_enabled".equals(key)
            || "development_settings_enabled".equals(key);
    }

    private static String getHiddenAccessibilityValue(String key) {
        if ("accessibility_enabled".equals(key)
                || "touch_exploration_enabled".equals(key)
                || "accessibility_display_magnification_enabled".equals(key)) {
            return "0";
        }
        if ("enabled_accessibility_services".equals(key)
                || "accessibility_shortcut_target_service".equals(key)
                || "accessibility_button_targets".equals(key)
                || "accessibility_qs_targets".equals(key)) {
            return "";
        }
        return null;
    }

    @Override
    public Bundle call(AttributionSource attributionSource, String authority, String method, String arg, Bundle extras) throws RemoteException {
        if ("GET_global".equals(method) && isHiddenAdbKey(arg)) {
            int uid = Binder.getCallingUid();
            if (uid >= 10000) {
                if (!nativeIsUidAllowed(uid)) {
                    Bundle b = new Bundle();
                    b.putString("value", "0");
                    return b;
                }
                long token = Binder.clearCallingIdentity();
                try {
                    AttributionSource sysAttr = new AttributionSource.Builder(1000)
                        .setPackageName("android")
                        .build();
                    return orig.call(sysAttr, authority, method, arg, extras);
                } finally {
                    Binder.restoreCallingIdentity(token);
                }
            }
        } else if ("GET_secure".equals(method) && nativeIsHideAccessibility()) {
            String fakeVal = getHiddenAccessibilityValue(arg);
            if (fakeVal != null) {
                int uid = Binder.getCallingUid();
                if (uid >= 10000 && !nativeIsAccUidAllowed(uid)) {
                    Bundle b = new Bundle();
                    b.putString("value", fakeVal);
                    return b;
                }
            }
        }
        return orig.call(attributionSource, authority, method, arg, extras);
    }

    @Override
    public ContentProviderResult[] applyBatch(AttributionSource a, String authority, ArrayList<ContentProviderOperation> ops) throws RemoteException, OperationApplicationException {
        return orig.applyBatch(a, authority, ops);
    }

    @Override
    public int bulkInsert(AttributionSource a, Uri url, ContentValues[] initialValues) throws RemoteException {
        return orig.bulkInsert(a, url, initialValues);
    }

    @Override
    public Uri canonicalize(AttributionSource a, Uri url) throws RemoteException {
        return orig.canonicalize(a, url);
    }

    @Override
    public void canonicalizeAsync(AttributionSource a, Uri url, RemoteCallback callback) throws RemoteException {
        orig.canonicalizeAsync(a, url, callback);
    }

    @Override
    public int checkUriPermission(AttributionSource a, Uri uri, int uid, int modeFlags) throws RemoteException {
        return orig.checkUriPermission(a, uri, uid, modeFlags);
    }

    @Override
    public ICancellationSignal createCancellationSignal() throws RemoteException {
        return orig.createCancellationSignal();
    }

    @Override
    public int delete(AttributionSource a, Uri url, Bundle extras) throws RemoteException {
        return orig.delete(a, url, extras);
    }

    @Override
    public String[] getStreamTypes(AttributionSource a, Uri url, String mimeTypeFilter) throws RemoteException {
        return orig.getStreamTypes(a, url, mimeTypeFilter);
    }

    @Override
    public String getType(AttributionSource a, Uri url) throws RemoteException {
        return orig.getType(a, url);
    }

    @Override
    public void getTypeAnonymousAsync(Uri uri, RemoteCallback callback) throws RemoteException {
        orig.getTypeAnonymousAsync(uri, callback);
    }

    @Override
    public void getTypeAsync(AttributionSource a, Uri uri, RemoteCallback callback) throws RemoteException {
        orig.getTypeAsync(a, uri, callback);
    }

    @Override
    public Uri insert(AttributionSource a, Uri url, ContentValues initialValues, Bundle extras) throws RemoteException {
        return orig.insert(a, url, initialValues, extras);
    }

    @Override
    public AssetFileDescriptor openAssetFile(AttributionSource a, Uri url, String mode, ICancellationSignal signal) throws RemoteException, FileNotFoundException {
        return orig.openAssetFile(a, url, mode, signal);
    }

    @Override
    public ParcelFileDescriptor openFile(AttributionSource a, Uri url, String mode, ICancellationSignal signal) throws RemoteException, FileNotFoundException {
        return orig.openFile(a, url, mode, signal);
    }

    @Override
    public AssetFileDescriptor openTypedAssetFile(AttributionSource a, Uri url, String mimeTypeFilter, Bundle opts, ICancellationSignal signal) throws RemoteException, FileNotFoundException {
        return orig.openTypedAssetFile(a, url, mimeTypeFilter, opts, signal);
    }

    @Override
    public Cursor query(AttributionSource a, Uri url, String[] projection, Bundle queryArgs, ICancellationSignal signal) throws RemoteException {
        return orig.query(a, url, projection, queryArgs, signal);
    }

    @Override
    public boolean refresh(AttributionSource a, Uri url, Bundle extras, ICancellationSignal signal) throws RemoteException {
        return orig.refresh(a, url, extras, signal);
    }

    @Override
    public Uri uncanonicalize(AttributionSource a, Uri url) throws RemoteException {
        return orig.uncanonicalize(a, url);
    }

    @Override
    public void uncanonicalizeAsync(AttributionSource a, Uri url, RemoteCallback callback) throws RemoteException {
        orig.uncanonicalizeAsync(a, url, callback);
    }

    @Override
    public int update(AttributionSource a, Uri url, ContentValues values, Bundle extras) throws RemoteException {
        return orig.update(a, url, values, extras);
    }
}
