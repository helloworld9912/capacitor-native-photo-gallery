# capacitor-native-photo-gallery

A native photo gallery integration for Ionic apps, providing seamless access and display of user photos within the app's UI.

## Install

```bash
npm install capacitor-native-photo-gallery
npx cap sync
```

## Usage (iOS)

```javascript
import { Plugins } from '@capacitor/core'

const { SignInWithApple } = Plugins

SignInWithApple.Authorize().then(response => {
  console.log(response)
}).catch(response => {
  console.error(response)
})
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

once you done your modification, increment the version in the package.json file and then run:

```bash
npm run build
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`showGallery(...)`](#showgallery)
* [`checkPhotoLibraryPermission()`](#checkphotolibrarypermission)
* [`requestPhotoLibraryPermission()`](#requestphotolibrarypermission)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### showGallery(...)

```typescript
showGallery(options?: ShowGalleryOptions | undefined) => Promise<GalleryResult>
```

| Param         | Type                                                              |
| ------------- | ----------------------------------------------------------------- |
| **`options`** | <code><a href="#showgalleryoptions">ShowGalleryOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#galleryresult">GalleryResult</a>&gt;</code>

--------------------


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


### Interfaces


#### GalleryResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`photos`** | <code>Photo[]</code> |


#### Photo

| Prop             | Type                |
| ---------------- | ------------------- |
| **`identifier`** | <code>string</code> |
| **`webPath`**    | <code>string</code> |


#### ShowGalleryOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`limit`** | <code>number</code> |

</docgen-api>
