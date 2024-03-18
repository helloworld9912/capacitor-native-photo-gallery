/**
 * Represents the different delivery modes for fetching images from the photo library.
 *
 * - `fast`: use fastFormat method for delivery, provides only a fast-loading image, possibly sacrificing image quality.
 * - `optimized`: use opportunistic method for delivery, automatically provides one or more results in order to balance image quality and responsiveness
 * - `highQuality`: use opportunistic method for delivery, provides the highest quality image, sacrificing performance.
 *
 */
export type deliveryMode = 'fast' | 'optimized' | 'highQuality';

/**
 * Represents the different resize modes for fetching images from the photo library.
 *
 * - `none`: No resizing is performed.
 * - `exact`: Resizes the image to match the target size exactly.
 * - `fast`: Resizes the image to a size that provides a balance between image quality and performance, efficiently resizes the image to a size similar to, or slightly larger than, the target size.
 *
 */
export type resizeMode = 'none' | 'exact' | 'fast';

/**
 * Represents the different sort orders for fetching images from the photo library.
 *
 * - `ascending`: Sorts the images in ascending order. (oldest first)
 * - `descending`: Sorts the images in descending order. (newest first)
 *
 * @default `descending` (most recents elements first)
 */
export type sortOrder = 'ascending' | 'descending';

/**
 * Represents the different categories of Smart Albums that can be found in the photo library.
 *
 * - `allHidden`: A Smart Album that groups all assets hidden from the Moments view in the Photos app.
 * - `animated`: A Smart Album that groups all image animation assets.
 * - `bursts`: A Smart Album that groups all burst photo sequences in the photo library.
 * - `cinematic`: A Smart Album that groups all cinematic photo assets.
 * - `depthEffect`: A Smart Album that groups all images captured using the Depth Effect camera mode on compatible devices.
 * - `favorites`: A Smart Album that groups all assets that the user marks as favorites.
 * - `generic`: A Smart Album without a more-specific subtype.
 * - `livePhotos`: A Smart Album that groups all Live Photos assets.
 * - `longExposures`: A Smart Album that groups all Live Photos assets where the Long Exposure variation is in an enabled state.
 * - `panoramas`: A Smart Album that groups all panorama photos in the photo library.
 * - `raw`: A Smart Album that groups all RAW assets in the photo library.
 * - `recentlyAdded`: A Smart Album that groups all recently added assets in the photo library.
 * - `screenshots`: A Smart Album that groups all images captured using the device’s screenshot function.
 * - `selfPortraits`: A Smart Album that groups all photos and videos captured using the device’s front-facing camera.
 * - `slomoVideos`: A Smart Album that groups all Slow-Mo videos in the photo library.
 * - `timelapses`: A Smart Album that groups all time-lapse videos in the photo library.
 * - `unableToUpload`: A Smart Album that groups all assets that the system can’t upload to iCloud.
 * - `userLibrary`: A Smart Album that groups all assets that originate in the user’s own library (as opposed to assets from iCloud Shared Albums).
 * - `videos`: A Smart Album that groups all video assets in the photo library.
 */
export type smartAlbums =
  | 'allHidden'
  | 'animated'
  | 'bursts'
  | 'cinematic'
  | 'depthEffect'
  | 'favorites'
  | 'generic'
  | 'livePhotos'
  | 'longExposures'
  | 'panoramas'
  | 'raw'
  | 'recentlyAdded'
  | 'screenshots'
  | 'selfPortraits'
  | 'slomoVideos'
  | 'timelapses'
  | 'unableToUpload'
  | 'userLibrary'
  | 'videos';

/**
 *  Request options for retreiving Smart Albums
 *
 * - `all`: Include all smart albums except `allHidden` and `unableToUpload`.
 * - `essentials`: Includes essential smart albums (recentlyAdded and favorites).
 * - `extended`: Include All smart albums (including `allHidden` and `unableToUpload`).
 * - `specifics`: Include specifics smart albums. (use `smartAlbumsOptions` option to specify which smart albums to include)
 */
export type smartAlbumsRequestOptions =
  | 'all'
  | 'essentials'
  | 'extended'
  | 'specifics';

/**
 * Represents an array of individual Smart Albums that can be specified in a request if `smartAlbumsRequestOptions` is set to `specifics`
 * This enables selecting multiple Smart Albums by name.
 *
 * The available Smart Album options are the same as the `smartAlbums` type.
 *
 * Example usage: `['recentlyAdded', 'favorites']` to include both "recentlyAdded" and "favorites" Smart Albums.
 */
export type smartAlbumsOptions = smartAlbums[];

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

/**
 * Represents the different status of the photo library permission.
 *
 * - `notRequested`: The permission has not been requested yet.
 * - `denied`: The permission has been denied by the user.
 * - `granted`: The permission has been granted by the user.
 * - `limited`: The permission has been limited by the user.
 */
export type PermissionStatus =
  | 'notRequested'
  | 'denied'
  | 'granted'
  | 'limited';

export interface CapacitorNativePhotoGalleryPlugin {

  /**
   * Checks the permission status to access the photo library.
   *
   * @returns A promise that resolves to an object containing the status of the permission.
   *
   */
  checkPhotoLibraryPermission(): Promise<{ status: PermissionStatus }>;

  /**
   * Requests permission to access the photo library.
   *
   * @returns A promise that resolves to an object containing the status of the permission request.
   *
   */
  requestPhotoLibraryPermission(): Promise<{ status: PermissionStatus }>;

  /**
   * Retrieves the most recent pictures from the photo library.
   *
   * @params
   * - `quality`: The quality of the image to fetch. (default: 0.7 - 70% quality - 0.0 to 1.0)
   * - `imageSize`: The size of the image to fetch in pixels. (default: 150)
   * - `sortOrder`: The order in which to fetch the images. (default: 'ascending' - newest first)
   * - `fetchLimit`: The maximum number of images to fetch. (default: 12)
   * - `deliveryMode`: The delivery mode for fetching images. (default: 'highQuality')
   * - `resizeMode`: The resize mode for fetching images. (default: 'fast')
   *
   * @returns A promise that resolves to an object containing an array of the most recent pictures. @type {PictureInfo[]}
   */
  getRecentsPictures(options: {
    quality?: number;
    imageSize?: number;
    sortOrder?: sortOrder;
    fetchLimit?: number;
    deliveryMode?: deliveryMode;
    resizeMode?: resizeMode;
  }): Promise<{ pictures: PictureInfo[] }>;

  /**
   * Retrieves all requested albums, each with the last picture.
   *
   * @param includeRegularAlbums - Whether to include regular albums in the request (default: false).
   * @param includeSmartAlbums - Whether to include smart albums (ios) in the request (default: true).
   * @param smartAlbumsFilter - An array to specify which smart albums to include
   *
   * @returns A promise that resolves to an object containing an array of requested albums with their information.
   */
  getAllAlbumsWithLastPicture: (options: {
    includeRegularAlbums?: boolean;
    includeSmartAlbums?: boolean;
    smartAlbumsFilter?: smartAlbumsOptions;
  }) => Promise<{ albums: AlbumInfo[] }>;

  /**
   * Retrieves photos from a specific album
   *
   * @param albumIdentifier - The local identifier of the album to fetch photos from. (required)
   * @param limit - The maximum number of photos to fetch, for optimizing performance. (gets all photos if not specified)
   * @param alreadyFetchedIdentifiers - An array of local identifiers of photos that have already been fetched, for optimizing performance, and for creating pagination (optional)
   * @param deliveryMode - The delivery mode for fetching the images. (default: 'fast')
   * @param resizeMode - The resize mode for fetching the images. (default: 'fast')
   * @param imageSize - The size of the images to fetch in pixels. (default: 150) - images are fetched at 150x150 pixels square (thumbnail size)
   *
   * @returns A promise that resolves to an object containing an array of requested albums with their information.
   */
  getPhotosFromAlbum(options: {
    albumIdentifier: string;
    sortOrder?: sortOrder;
    limit?: number;
    deliveryMode?: deliveryMode;
    resizeMode?: resizeMode;
    imageSize?: number;
    alreadyFetchedIdentifiers?: string[]; //provide a way to paginate results (performance)
  }): Promise<{ pictures: PictureInfo[] }>;

  /**
   * Retrieves a specific image by its local identifier.
   *
   * @param localIdentifier - The local identifier of the image to fetch. (required)
   * @param deliveryMode - The delivery mode for fetching the image. (default: 'highQuality')
   * @param resizeMode - The resize mode for fetching the image. (default: 'fast')
   *
   * @returns A promise that resolves to an object containing the requested picture information.
   * 
   * @type {PictureInfo}
   */
  getImageByIdentifier(options: {
    localIdentifier: string;
    deliveryMode?: deliveryMode;
    resizeMode?: resizeMode;
  }): Promise<{ picture: PictureInfo }>;
}
