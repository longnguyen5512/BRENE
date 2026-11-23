package com.brene;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;

public final class AccessibilityBinderProxy extends Binder {
    private final IBinder orig;
    private final int txAddClient;
    private final int txGetEnabledServices;

    public AccessibilityBinderProxy(IBinder orig, int txAddClient, int txGetEnabledServices) {
        this.orig = orig;
        this.txAddClient = txAddClient;
        this.txGetEnabledServices = txGetEnabledServices;
    }

    @Override
    public String getInterfaceDescriptor() {
        try {
            return orig.getInterfaceDescriptor();
        } catch (RemoteException e) {
            return "android.view.accessibility.IAccessibilityManager";
        }
    }

    @Override
    public IInterface queryLocalInterface(String descriptor) {
        return orig.queryLocalInterface(descriptor);
    }

    @Override
    protected boolean onTransact(int code, Parcel data, Parcel reply, int flags) throws RemoteException {
        if (code == txGetEnabledServices && SettingsBinderProxy.nativeIsHideAccessibility()) {
            int uid = Binder.getCallingUid();
            if (uid >= 10000 && !SettingsBinderProxy.nativeIsUidAllowed(uid)) {
                data.enforceInterface(getInterfaceDescriptor());
                if (reply != null) {
                    reply.writeNoException();
                    reply.writeInt(0);
                }
                return true;
            }
        }

        if (code == txAddClient && SettingsBinderProxy.nativeIsHideAccessibility()) {
            int uid = Binder.getCallingUid();
            if (uid >= 10000 && !SettingsBinderProxy.nativeIsUidAllowed(uid)) {
                boolean ok = orig.transact(code, data, reply, flags);
                if (ok && reply != null) {
                    int pos = reply.dataPosition();
                    reply.setDataPosition(0);
                    int ex = reply.readInt();
                    if (ex == 0 && reply.dataAvail() >= 8) {
                        long state = reply.readLong();
                        reply.setDataPosition(4);
                        reply.writeLong(state & ~(0x3L << 32));
                    }
                    reply.setDataPosition(pos);
                }
                return ok;
            }
        }

        return orig.transact(code, data, reply, flags);
    }
}
