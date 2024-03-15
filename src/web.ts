import { WebPlugin } from '@capacitor/core';

import type { CapacitorNativePhotoGalleryPlugin } from './definitions';

export class CapacitorNativePhotoGalleryWeb
  extends WebPlugin
  implements CapacitorNativePhotoGalleryPlugin
{
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
