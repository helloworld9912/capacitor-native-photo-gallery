// src/web.ts
import { WebPlugin } from '@capacitor/core';
import type { CapacitorNativePhotoGalleryPlugin, GalleryResult } from './definitions';
import { PictureInfo, AlbumInfo } from './definitions';

export class CapacitorNativePhotoGalleryWeb extends WebPlugin implements CapacitorNativePhotoGalleryPlugin {
  
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async showGallery(options?: { limit?: number }): Promise<GalleryResult> {
    console.log('showGallery', options);
    // Typically, you might throw a 'Not Implemented' error for web
    // Or provide some basic web functionality if applicable
    throw this.unimplemented('showGallery is not implemented on web.');
  }

  async checkPhotoLibraryPermission(): Promise<{ status: string }> {
    // Not applicable for web, so you can return a default or handle accordingly
    console.warn('Web platform does not require photo library permissions.');
    return { status: 'granted' }; // or 'notRequested' maybe more suitable
  }

  async requestPhotoLibraryPermission(): Promise<{ status: string }> {
    // Not applicable for web, so you can resolve immediately
    console.warn('Web platform cannot request photo library permissions.');
    return { status: 'granted' }; // or 'notRequested' maybe more suitable
  }

  //getRecentPhotos
  async getRecentPhotos(): Promise<{ pictures: string[] }> {
    // A web implementation could raise an unimplemented error or open a file picker
    throw this.unimplemented('This method is not available on the web. Consider implementing a file picker as an alternative.');
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

  // Any additional method stubs go here...
}

const CapacitorNativePhotoGallery = new CapacitorNativePhotoGalleryWeb();

export { CapacitorNativePhotoGallery };

