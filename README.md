# capacitor-native-photo-gallery

A native photo gallery integration for Ionic apps, providing seamless access and display of user photos within the app's UI.

## Install

```bash
npm install capacitor-native-photo-gallery
npx cap sync
```

## Usage (iOS)

```javascript
console.log('Hello World')
```

## Instructions (Android/Web)

The plugin currently works for iOS only. If someone wants to implement Android/Web as well - all pull requests will be well welcomed :-)

## IOS Permission 

iOS requires the following usage description be added and filled out for your app in Info.plist:

NSCameraUsageDescription (Privacy - Camera Usage Description)
NSPhotoLibraryAddUsageDescription (Privacy - Photo Library Additions Usage Description)
NSPhotoLibraryUsageDescription (Privacy - Photo Library Usage Description)

Read about Configuring Info.plist in the iOS Guide for more information on setting iOS permissions in Xcode: https://capacitorjs.com/docs/ios/configuration#configuring-infoplist

## Plugin Development

if you want to develop the plugin, you can use the following commands to build the plugin and test it in the example app.


If you modify only the .swift code, you dont need to increment the version of the plugin package (root package.json), and then you only need to run the following command inside the ./example folder:

```bash
yarn && yarn build && npx cap sync
```

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
checkPhotoLibraryPermission() => Promise<{ status: string; }>
```

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

--------------------


### requestPhotoLibraryPermission()

```typescript
requestPhotoLibraryPermission() => Promise<{ status: string; }>
```

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

--------------------


### getRecentsPictures(...)

```typescript
getRecentsPictures(options: { quality?: number; imageSize?: number; sortOrder?: sortOrder; fetchLimit?: number; deliveryMode?: deliveryMode; resizeMode?: resizeMode; }) => Promise<{ pictures: PictureInfo[]; }>
```

| Param         | Type                                                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ quality?: number; imageSize?: number; <a href="#sortorder">sortOrder</a>?: <a href="#sortorder">sortOrder</a>; fetchLimit?: number; <a href="#deliverymode">deliveryMode</a>?: <a href="#deliverymode">deliveryMode</a>; <a href="#resizemode">resizeMode</a>?: <a href="#resizemode">resizeMode</a>; }</code> |

**Returns:** <code>Promise&lt;{ pictures: PictureInfo[]; }&gt;</code>

--------------------


### getPhotosFromAlbum(...)

```typescript
getPhotosFromAlbum(options: { albumIdentifier: string; limit?: number; }) => Promise<{ pictures: PictureInfo[]; }>
```

| Param         | Type                                                      |
| ------------- | --------------------------------------------------------- |
| **`options`** | <code>{ albumIdentifier: string; limit?: number; }</code> |

**Returns:** <code>Promise&lt;{ pictures: PictureInfo[]; }&gt;</code>

--------------------


### getImageByIdentifier(...)

```typescript
getImageByIdentifier(options: { localIdentifier: string; deliveryMode?: deliveryMode; resizeMode?: resizeMode; }) => Promise<{ picture: PictureInfo; }>
```

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


#### sortOrder

<code>'ascending' | 'descending'</code>


#### deliveryMode

<code>'fast' | 'optimized' | 'highQuality'</code>


#### resizeMode

<code>'none' | 'exact' | 'fast'</code>

</docgen-api>
