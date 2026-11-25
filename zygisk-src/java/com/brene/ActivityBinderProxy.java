package com.brene;

import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.Parcelable;
import android.os.RemoteException;

public final class ActivityBinderProxy extends Binder {
    private static final String USB_STATE_ACTION = "android.hardware.usb.action.USB_STATE";

    private final IBinder orig;
    private final int txRegisterReceiverWithFeature;

    public ActivityBinderProxy(IBinder orig, int txRegisterReceiverWithFeature) {
        this.orig = orig;
        this.txRegisterReceiverWithFeature = txRegisterReceiverWithFeature;
    }

    @Override
    public String getInterfaceDescriptor() {
        try {
            return orig.getInterfaceDescriptor();
        } catch (RemoteException e) {
            return "android.app.IActivityManager";
        }
    }

    @Override
    public IInterface queryLocalInterface(String descriptor) {
        return orig.queryLocalInterface(descriptor);
    }

    @Override
    protected boolean onTransact(int code, Parcel data, Parcel reply, int flags) throws RemoteException {
        if (code == txRegisterReceiverWithFeature && reply != null) {
            int uid = Binder.getCallingUid();
            if (uid >= 10000 && !SettingsBinderProxy.nativeIsUidAllowed(uid)) {
                boolean ok = orig.transact(code, data, reply, flags);
                if (ok) {
                    int pos = reply.dataPosition();
                    try {
                        reply.setDataPosition(0);
                        int ex = reply.readInt();
                        if (ex == 0) {
                            Intent res = reply.readTypedObject(Intent.CREATOR);
                            if (res != null && USB_STATE_ACTION.equals(res.getAction())
                                    && res.getBooleanExtra("adb", false)) {
                                Intent clean = new Intent(res);
                                clean.removeExtra("adb");
                                reply.setDataSize(0);
                                reply.setDataPosition(0);
                                reply.writeNoException();
                                reply.writeTypedObject(clean, Parcelable.PARCELABLE_WRITE_RETURN_VALUE);
                                return true;
                            }
                        }
                    } catch (Throwable ignored) {
                    }
                    reply.setDataPosition(pos);
                }
                return ok;
            }
        }

        return orig.transact(code, data, reply, flags);
    }
}
