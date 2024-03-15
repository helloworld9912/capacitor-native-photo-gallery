#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorNativePhotoGalleryPlugin, "CapacitorNativePhotoGallery",

           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           // Register the showGallery method
           CAP_PLUGIN_METHOD(showGallery, CAPPluginReturnPromise);

           // Register the checkPhotoLibraryPermission method
           CAP_PLUGIN_METHOD(checkPhotoLibraryPermission, CAPPluginReturnPromise);
           
           // Register the requestPhotoLibraryPermission method
           CAP_PLUGIN_METHOD(requestPhotoLibraryPermission, CAPPluginReturnPromise);
)
