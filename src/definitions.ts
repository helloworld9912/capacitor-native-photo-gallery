export interface ShowGalleryOptions {
  limit?: number; // Maybe you want to limit the number of photos retrieved
  // ... any other options relevant to your plugin
}

// Define the structure of the object returned by the gallery function.
// This structure should align with what your native code will produce.
export interface GalleryResult {
  photos: Photo[]; // An array of photos
}


// Define the information available for each photo.
// For example, you might have a webPath for use in the webview, and maybe an identifier.
export interface Photo {
  identifier: string; // A unique identifier for the photo
  webPath: string; // A URL that can be set as the src of an <img> element
  // Add any additional photo metadata you wish to expose:
  // fileName?: string;
  // width?: number;
  // height?: number;
  // mimeType?: string;
  // size?: number;
  // creationDate?: string; // ISO date string
  // location?: { latitude: number; longitude: number }; // If geotagged
  // ... and so on
}

export interface CapacitorNativePhotoGalleryPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  showGallery(options?: ShowGalleryOptions): Promise<GalleryResult>;

  checkPhotoLibraryPermission(): Promise<{ status: string }>;

  requestPhotoLibraryPermission(): Promise<{ status: string }>;

}
