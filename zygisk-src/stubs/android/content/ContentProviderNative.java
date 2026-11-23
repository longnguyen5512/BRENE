package android.content;
import android.os.Binder;
import android.os.IBinder;
public abstract class ContentProviderNative extends Binder implements IContentProvider {
    public ContentProviderNative() {}
    @Override
    public IBinder asBinder() { return this; }
}
