

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

  checkPhotoLibraryPermission(): Promise<{ status: string }>;

  requestPhotoLibraryPermission(): Promise<{ status: string }>;

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
