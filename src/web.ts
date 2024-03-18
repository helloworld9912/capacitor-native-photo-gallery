// src/web.ts
import { WebPlugin } from '@capacitor/core';
import type { CapacitorNativePhotoGalleryPlugin } from './definitions';
import { PictureInfo, AlbumInfo, PermissionStatus } from './definitions';

export class CapacitorNativePhotoGalleryWeb extends WebPlugin implements CapacitorNativePhotoGalleryPlugin {
  
  async checkPhotoLibraryPermission(): Promise<{ status: PermissionStatus }> {
    // Not applicable for web, so you can return a default or handle accordingly
    console.warn('Web platform does not require photo library permissions.');
    return { status: 'granted' }; // or 'notRequested' maybe more suitable
  }

  async requestPhotoLibraryPermission(): Promise<{ status: PermissionStatus }> {
    // Not applicable for web, so you can resolve immediately
    console.warn('Web platform cannot request photo library permissions.');
    return { status: 'granted' }; // or 'notRequested' maybe more suitable
  }

  async getRecentsPictures(): Promise<{ pictures: PictureInfo[] }> {
    // A web implementation could raise an unimplemented error or open a file picker
    throw this.unimplemented('This method is not available on the web. Consider implementing a file picker as an alternative.');
  }

  async getAllAlbumsWithLastPicture(): Promise<{ albums: AlbumInfo[] }> {
    // A web implementation could raise an unimplemented error or open a file picker
    throw this.unimplemented('This method is not available on the web. Consider implementing a file picker as an alternative.');
  }

  async getPhotosFromAlbum(): Promise<{ pictures: PictureInfo[] }> {
    // A web implementation could raise an unimplemented error or open a file picker
    throw this.unimplemented('This method is not available on the web. Consider implementing a file picker as an alternative.');
  }

  async getImageByIdentifier(): Promise<{ picture: PictureInfo }> {
      // A web implementation could raise an unimplemented error or open a file picker
      throw this.unimplemented('This method is not available on the web. Consider implementing a file picker as an alternative.');
  }

  // Any additional method stubs go here...
}

const CapacitorNativePhotoGallery = new CapacitorNativePhotoGalleryWeb();

export { CapacitorNativePhotoGallery };

