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

export type deliveryMode = 'fast' | 'optimized' | 'highQuality';

export type resizeMode = 'none' | 'exact' | 'fast'

export type sortOrder = 'ascending' | 'descending';

export interface PictureInfo {
  localIdentifier: string;
  base64: string;
  creationDate: string;
  modificationDate: string;
  width: number;
  height: number;
  location: { latitude: number; longitude: number };
}

export interface AlbumInfo {
  localIdentifier: string;
  title: string;
  count: number;
  lastPicture: string | null;
}

export interface CapacitorNativePhotoGalleryPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  showGallery(options?: ShowGalleryOptions): Promise<GalleryResult>;

  checkPhotoLibraryPermission(): Promise<{ status: string }>;

  requestPhotoLibraryPermission(): Promise<{ status: string }>;

  //getRecentPhotos
  getRecentPhotos(): Promise<{ pictures: string[] }>; // Add this line

  getRecentsPictures(options: {
    quality?: number;
    imageSize?: number;
    sortOrder?: sortOrder;
    fetchLimit?: number;
    deliveryMode?: deliveryMode;
    resizeMode?: resizeMode;
  }): Promise<{ pictures: PictureInfo[] }>;

  getAllAlbumsWithLastPicture: () => Promise<{ albums: AlbumInfo[] }>;

  getPhotosFromAlbum(options: {
    albumIdentifier: string,
    limit?: number, 
  }): Promise<{ pictures: PictureInfo[] }>;

  getImageByIdentifier(options: { 
    localIdentifier: string,
    deliveryMode?: deliveryMode,
    resizeMode?: resizeMode 
  }): Promise<{ picture: PictureInfo }>;

}
