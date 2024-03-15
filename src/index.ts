import { registerPlugin } from '@capacitor/core';

import type { CapacitorNativePhotoGalleryPlugin } from './definitions';

const CapacitorNativePhotoGallery =
  registerPlugin<CapacitorNativePhotoGalleryPlugin>(
    'CapacitorNativePhotoGallery',
    {
      web: () =>
        import('./web').then(m => new m.CapacitorNativePhotoGalleryWeb()),
    },
  );

export * from './definitions';
export { CapacitorNativePhotoGallery };
