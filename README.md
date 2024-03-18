# capacitor-native-photo-gallery

A native photo gallery integration for Ionic apps, providing seamless access and display of user photos within the app's UI.

## Install

```bash
npm install capacitor-native-photo-gallery
npx cap sync
```

## Usage (iOS)

### Show permission status

```javascript
const checkPermissions = async () => {
  try {
    const permission =
      await CapacitorNativePhotoGallery.checkPhotoLibraryPermission();
    console.log(`Photo library permission status: ${result.status}`);
    console.log(permission.status);
  } catch (error) {
    console.error;
  }
};
```

### Request permission

This will show a permission prompt to the user, asking for permission to access the photo library.

```javascript
const requestPermissions = async () => {
  try {
    const permission =
      await CapacitorNativePhotoGallery.requestPhotoLibraryPermission();
    console.log(`Photo library permission status: ${result.status}`);
    console.log(permission.status);
  } catch (error) {
    console.error;
  }
};
```

### Get recent pictures

```javascript
const getRecentPictures = async () => {
  try {
    const result = await CapacitorNativePhotoGallery.getRecentsPictures({
      imageSize: 200,
      fetchLimit: 12,
      sortOrder: 'descending', //to get oldest pictures first, use 'ascending'
      deliveryMode: 'highQuality',
      resizeMode: 'none',
    });
    console.log(result.pictures);
  } catch (error) {
    console.error;
  }
};
```

### Get ios album list

```javascript
const getAlbums = async () => {
  try {
    const result = await CapacitorNativePhotoGallery.getAlbums();
    console.log(result.albums);
  } catch (error) {
    console.error;
  }
};
```

### Get Smart Albums

```javascript
const getSmartAlbums = async () => {
  try {
    const result =
      await CapacitorNativePhotoGallery.getAllAlbumsWithLastPicture({
        includeRegularAlbums: true, //to include regular albums or not (default is true)
        includeSmartAlbums: true, //to include smart albums or not (default is false)
      });
    console.log(result.smartAlbums);
  } catch (error) {
    console.error;
  }
};
```

### Get photos in an album

```javascript
const getPhotosFromAlbum = async () => {
  try {
    const result = await CapacitorNativePhotoGallery.getPhotosFromAlbum({
      albumIdentifier: 'albumIdentifier',
      sortOrder: 'descending',
      limit: 12, // default is all photos (can be laggy if there are many photos)
    });
    console.log(result.pictures);
  } catch (error) {
    console.error;
  }
};
```

### Album pagination

Need to write the documentation for album pagination here...

### Get image by identifier

```javascript
const getImageByIdentifier = async () => {
  try {
    const result = await CapacitorNativePhotoGallery.getImageByIdentifier({
      localIdentifier: 'localIdentifier',
      deliveryMode: 'highQuality',
      resizeMode: 'none',
    });
    console.log(result.picture);
  } catch (error) {
    console.error;
  }
};
```

## Instructions (Android/Web)

The plugin currently works for iOS only. If someone wants to implement Android/Web as well - all pull requests will be well welcomed :-)

## IOS Permission

iOS requires the following usage description be added and filled out for your app in Info.plist:

NSCameraUsageDescription (Privacy - Camera Usage Description)
NSPhotoLibraryAddUsageDescription (Privacy - Photo Library Additions Usage Description)
NSPhotoLibraryUsageDescription (Privacy - Photo Library Usage Description)

Read about Configuring Info.plist in the iOS Guide for more information on setting iOS permissions in Xcode: https://capacitorjs.com/docs/ios/configuration#configuring-infoplist

## Ios Plugin Development Tips

if you want to develop the plugin, you can use the following commands to build the plugin and test it in the example app.

If you modify only the .swift code, you only need to rebuild the app inside Xcode.

If that dosent work, you dont need to increment the version of the plugin package (root package.json), and then you only need to run the following command inside the ./example folder:

```bash
yarn && yarn build && npx cap sync
```

You should see the new version of the plugin inside the terminal installed.

If you made changes to definitions, or other files, you need to increment the version of the plugin package (root package.json), and then you only need to run the following command inside the root folder:

```bash
npm run build
```

and then run the following command inside the ./example folder:

```bash
yarn && yarn build && npx cap sync
```

## API

<docgen-index>

* [`checkPhotoLibraryPermission()`](#checkphotolibrarypermission)
* [`requestPhotoLibraryPermission()`](#requestphotolibrarypermission)
* [`getRecentsPictures(...)`](#getrecentspictures)
* [`getPhotosFromAlbum(...)`](#getphotosfromalbum)
* [`getImageByIdentifier(...)`](#getimagebyidentifier)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### checkPhotoLibraryPermission()

```typescript
checkPhotoLibraryPermission() => Promise<{ status: PermissionStatus; }>
```

Checks the permission status to access the photo library.

**Returns:** <code>Promise&lt;{ status: <a href="#permissionstatus">PermissionStatus</a>; }&gt;</code>

--------------------


### requestPhotoLibraryPermission()

```typescript
requestPhotoLibraryPermission() => Promise<{ status: PermissionStatus; }>
```

Requests permission to access the photo library.

**Returns:** <code>Promise&lt;{ status: <a href="#permissionstatus">PermissionStatus</a>; }&gt;</code>

--------------------


### getRecentsPictures(...)

```typescript
getRecentsPictures(options: { quality?: number; imageSize?: number; sortOrder?: sortOrder; fetchLimit?: number; deliveryMode?: deliveryMode; resizeMode?: resizeMode; }) => Promise<{ pictures: PictureInfo[]; }>
```

Retrieves the most recent pictures from the photo library.

| Param         | Type                                                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ quality?: number; imageSize?: number; <a href="#sortorder">sortOrder</a>?: <a href="#sortorder">sortOrder</a>; fetchLimit?: number; <a href="#deliverymode">deliveryMode</a>?: <a href="#deliverymode">deliveryMode</a>; <a href="#resizemode">resizeMode</a>?: <a href="#resizemode">resizeMode</a>; }</code> |

**Returns:** <code>Promise&lt;{ pictures: PictureInfo[]; }&gt;</code>

--------------------


### getPhotosFromAlbum(...)

```typescript
getPhotosFromAlbum(options: { albumIdentifier: string; sortOrder?: sortOrder; limit?: number; deliveryMode?: deliveryMode; resizeMode?: resizeMode; imageSize?: number; alreadyFetchedIdentifiers?: string[]; }) => Promise<{ pictures: PictureInfo[]; }>
```

Retrieves photos from a specific album

| Param         | Type                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ albumIdentifier: string; <a href="#sortorder">sortOrder</a>?: <a href="#sortorder">sortOrder</a>; limit?: number; <a href="#deliverymode">deliveryMode</a>?: <a href="#deliverymode">deliveryMode</a>; <a href="#resizemode">resizeMode</a>?: <a href="#resizemode">resizeMode</a>; imageSize?: number; alreadyFetchedIdentifiers?: string[]; }</code> |

**Returns:** <code>Promise&lt;{ pictures: PictureInfo[]; }&gt;</code>

--------------------


### getImageByIdentifier(...)

```typescript
getImageByIdentifier(options: { localIdentifier: string; deliveryMode?: deliveryMode; resizeMode?: resizeMode; }) => Promise<{ picture: PictureInfo; }>
```

Retrieves a specific image by its local identifier.

| Param         | Type                                                                                                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ localIdentifier: string; <a href="#deliverymode">deliveryMode</a>?: <a href="#deliverymode">deliveryMode</a>; <a href="#resizemode">resizeMode</a>?: <a href="#resizemode">resizeMode</a>; }</code> |

**Returns:** <code>Promise&lt;{ picture: <a href="#pictureinfo">PictureInfo</a>; }&gt;</code>

--------------------


### Interfaces


#### PictureInfo

| Prop                   | Type                                                  |
| ---------------------- | ----------------------------------------------------- |
| **`localIdentifier`**  | <code>string</code>                                   |
| **`base64`**           | <code>string</code>                                   |
| **`creationDate`**     | <code>string</code>                                   |
| **`modificationDate`** | <code>string</code>                                   |
| **`width`**            | <code>number</code>                                   |
| **`height`**           | <code>number</code>                                   |
| **`location`**         | <code>{ latitude: number; longitude: number; }</code> |


#### AlbumInfo

| Prop                  | Type                        |
| --------------------- | --------------------------- |
| **`localIdentifier`** | <code>string</code>         |
| **`title`**           | <code>string</code>         |
| **`count`**           | <code>number</code>         |
| **`lastPicture`**     | <code>string \| null</code> |


### Type Aliases


#### PermissionStatus

Represents the different status of the photo library permission.

- `notRequested`: The permission has not been requested yet.
- `denied`: The permission has been denied by the user.
- `granted`: The permission has been granted by the user.
- `limited`: The permission has been limited by the user.

<code>'notRequested' | 'denied' | 'granted' | 'limited'</code>


#### sortOrder

Represents the different sort orders for fetching images from the photo library.

- `ascending`: Sorts the images in ascending order. (oldest first)
- `descending`: Sorts the images in descending order. (newest first)

<code>'ascending' | 'descending'</code>


#### deliveryMode

Represents the different delivery modes for fetching images from the photo library.

- `fast`: use fastFormat method for delivery, provides only a fast-loading image, possibly sacrificing image quality.
- `optimized`: use opportunistic method for delivery, automatically provides one or more results in order to balance image quality and responsiveness
- `highQuality`: use opportunistic method for delivery, provides the highest quality image, sacrificing performance.

<code>'fast' | 'optimized' | 'highQuality'</code>


#### resizeMode

Represents the different resize modes for fetching images from the photo library.

- `none`: No resizing is performed.
- `exact`: Resizes the image to match the target size exactly.
- `fast`: Resizes the image to a size that provides a balance between image quality and performance, efficiently resizes the image to a size similar to, or slightly larger than, the target size.

<code>'none' | 'exact' | 'fast'</code>


#### smartAlbumsOptions

Represents an array of individual Smart Albums that can be specified in a request if `smartAlbumsRequestOptions` is set to `specifics`
This enables selecting multiple Smart Albums by name.

The available Smart Album options are the same as the <a href="#smartalbums">`smartAlbums`</a> type.

Example usage: `['recentlyAdded', 'favorites']` to include both "recentlyAdded" and "favorites" Smart Albums.

<code>smartAlbums[]</code>


#### smartAlbums

Represents the different categories of Smart Albums that can be found in the photo library.

- `allHidden`: A Smart Album that groups all assets hidden from the Moments view in the Photos app.
- `animated`: A Smart Album that groups all image animation assets.
- `bursts`: A Smart Album that groups all burst photo sequences in the photo library.
- `cinematic`: A Smart Album that groups all cinematic photo assets.
- `depthEffect`: A Smart Album that groups all images captured using the Depth Effect camera mode on compatible devices.
- `favorites`: A Smart Album that groups all assets that the user marks as favorites.
- `generic`: A Smart Album without a more-specific subtype.
- `livePhotos`: A Smart Album that groups all Live Photos assets.
- `longExposures`: A Smart Album that groups all Live Photos assets where the Long Exposure variation is in an enabled state.
- `panoramas`: A Smart Album that groups all panorama photos in the photo library.
- `raw`: A Smart Album that groups all RAW assets in the photo library.
- `recentlyAdded`: A Smart Album that groups all recently added assets in the photo library.
- `screenshots`: A Smart Album that groups all images captured using the device’s screenshot function.
- `selfPortraits`: A Smart Album that groups all photos and videos captured using the device’s front-facing camera.
- `slomoVideos`: A Smart Album that groups all Slow-Mo videos in the photo library.
- `timelapses`: A Smart Album that groups all time-lapse videos in the photo library.
- `unableToUpload`: A Smart Album that groups all assets that the system can’t upload to iCloud.
- `userLibrary`: A Smart Album that groups all assets that originate in the user’s own library (as opposed to assets from iCloud Shared Albums).
- `videos`: A Smart Album that groups all video assets in the photo library.

<code>'allHidden' | 'animated' | 'bursts' | 'cinematic' | 'depthEffect' | 'favorites' | 'generic' | 'livePhotos' | 'longExposures' | 'panoramas' | 'raw' | 'recentlyAdded' | 'screenshots' | 'selfPortraits' | 'slomoVideos' | 'timelapses' | 'unableToUpload' | 'userLibrary' | 'videos'</code>

</docgen-api>
