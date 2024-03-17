#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorNativePhotoGalleryPlugin, "CapacitorNativePhotoGallery",

           // Register the checkPhotoLibraryPermission method
           CAP_PLUGIN_METHOD(checkPhotoLibraryPermission, CAPPluginReturnPromise);
           
           // Register the requestPhotoLibraryPermission method
           CAP_PLUGIN_METHOD(requestPhotoLibraryPermission, CAPPluginReturnPromise);

           //get recently added photos
           CAP_PLUGIN_METHOD(getRecentsPictures, CAPPluginReturnPromise);

           CAP_PLUGIN_METHOD(getAllAlbumsWithLastPicture, CAPPluginReturnPromise);

           CAP_PLUGIN_METHOD(getPhotosFromAlbum, CAPPluginReturnPromise);

           CAP_PLUGIN_METHOD(getImageByIdentifier, CAPPluginReturnPromise);
)
