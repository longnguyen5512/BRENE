package android.content;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.net.Uri;
import android.os.*;
import java.io.FileNotFoundException;
import java.util.ArrayList;

public interface IContentProvider extends IInterface {
    ContentProviderResult[] applyBatch(AttributionSource attributionSource, String authority, ArrayList<ContentProviderOperation> operations) throws RemoteException, OperationApplicationException;
    int bulkInsert(AttributionSource attributionSource, Uri url, ContentValues[] initialValues) throws RemoteException;
    Bundle call(AttributionSource attributionSource, String authority, String method, String arg, Bundle extras) throws RemoteException;
    Uri canonicalize(AttributionSource attributionSource, Uri url) throws RemoteException;
    void canonicalizeAsync(AttributionSource attributionSource, Uri url, RemoteCallback callback) throws RemoteException;
    int checkUriPermission(AttributionSource attributionSource, Uri uri, int uid, int modeFlags) throws RemoteException;
    ICancellationSignal createCancellationSignal() throws RemoteException;
    int delete(AttributionSource attributionSource, Uri url, Bundle extras) throws RemoteException;
    String[] getStreamTypes(AttributionSource attributionSource, Uri url, String mimeTypeFilter) throws RemoteException;
    String getType(AttributionSource attributionSource, Uri url) throws RemoteException;
    void getTypeAnonymousAsync(Uri uri, RemoteCallback callback) throws RemoteException;
    void getTypeAsync(AttributionSource attributionSource, Uri uri, RemoteCallback callback) throws RemoteException;
    Uri insert(AttributionSource attributionSource, Uri url, ContentValues initialValues, Bundle extras) throws RemoteException;
    AssetFileDescriptor openAssetFile(AttributionSource attributionSource, Uri url, String mode, ICancellationSignal signal) throws RemoteException, FileNotFoundException;
    ParcelFileDescriptor openFile(AttributionSource attributionSource, Uri url, String mode, ICancellationSignal signal) throws RemoteException, FileNotFoundException;
    AssetFileDescriptor openTypedAssetFile(AttributionSource attributionSource, Uri url, String mimeTypeFilter, Bundle opts, ICancellationSignal signal) throws RemoteException, FileNotFoundException;
    Cursor query(AttributionSource attributionSource, Uri url, String[] projection, Bundle queryArgs, ICancellationSignal cancellationSignal) throws RemoteException;
    boolean refresh(AttributionSource attributionSource, Uri url, Bundle extras, ICancellationSignal cancellationSignal) throws RemoteException;
    Uri uncanonicalize(AttributionSource attributionSource, Uri url) throws RemoteException;
    void uncanonicalizeAsync(AttributionSource attributionSource, Uri url, RemoteCallback callback) throws RemoteException;
    int update(AttributionSource attributionSource, Uri url, ContentValues values, Bundle extras) throws RemoteException;
}
