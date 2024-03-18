import Capacitor
import Foundation
import Photos

extension Date {
  var iso8601String: String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.string(from: self)
  }
}

@objc(CapacitorNativePhotoGalleryPlugin)
public class CapacitorNativePhotoGalleryPlugin: CAPPlugin {
  private let implementation = CapacitorNativePhotoGallery()

  @objc func checkPhotoLibraryPermission(_ call: CAPPluginCall) {
    let status = PHPhotoLibrary.authorizationStatus()

    switch status {
    case .notDetermined:
      // Permission has not been requested yet
      call.resolve(["status": "notRequested"])
    case .restricted, .denied:
      // Permission was either restricted by parental controls or explicitly denied by the user
      call.resolve(["status": "denied"])
    case .authorized:
      // Permission was granted
      call.resolve(["status": "granted"])
    case .limited:
      // Permission was granted for limited access (iOS 14+)
      call.resolve(["status": "limited"])
    @unknown default:
      // Handle any future cases
      call.reject("Unknown authorization status")
    }
  }

  @objc func requestPhotoLibraryPermission(_ call: CAPPluginCall) {
    PHPhotoLibrary.requestAuthorization { (status) in
      switch status {
      case .authorized:
        call.resolve(["status": "granted"])
      case .limited:
        call.resolve(["status": "limited"])
      case .denied, .restricted:
        call.resolve(["status": "denied"])
      case .notDetermined:
        call.resolve(["status": "notRequested"])
      @unknown default:
        call.reject("Unknown authorization status")
      }
    }
  }

  @objc(getImageByIdentifier:)
  func getImageByIdentifier(_ call: CAPPluginCall) {
    guard let assetIdentifier = call.getString("localIdentifier") else {
      call.reject("You must provide an asset identifier")
      return
    }

    let assetsFetchResult = PHAsset.fetchAssets(
      withLocalIdentifiers: [assetIdentifier], options: nil)
    guard let asset = assetsFetchResult.firstObject else {
      call.reject("Asset not found")
      return
    }

    let deliveryModeString = call.getString("deliveryMode") ?? "highQualityFormat"  // Default delivery mode
    let resizeModeString = call.getString("resizeMode") ?? "fast"  // Default resize mode

    let requestOptions = PHImageRequestOptions()
    requestOptions.isNetworkAccessAllowed = true  // Allows fetching from iCloud if necessary

    let deliveryMode: PHImageRequestOptionsDeliveryMode
    switch deliveryModeString.lowercased() {
    case "optimized":
      deliveryMode = .opportunistic
    case "fast":
      deliveryMode = .fastFormat
    default:
      deliveryMode = .highQualityFormat
    }

    let resizeMode: PHImageRequestOptionsResizeMode
    switch resizeModeString.lowercased() {
    case "exact":
      resizeMode = .exact
    case "none":
      resizeMode = .none
    case "fast":
      resizeMode = .fast
    default:
      resizeMode = .fast
    }

    requestOptions.deliveryMode = deliveryMode
    requestOptions.resizeMode = resizeMode

    PHImageManager.default().requestImageDataAndOrientation(for: asset, options: requestOptions) {
      imageData, dataUTI, _, info in
      if let imageData = imageData {
        let base64String = imageData.base64EncodedString()  // Convert image data to base64

        let dateFormatter = ISO8601DateFormatter()

        var pictureInfo: [String: Any] = [
          "localIdentifier": asset.localIdentifier,
          "base64": base64String,
          "creationDate": dateFormatter.string(from: asset.creationDate ?? Date()),
          "modificationDate": dateFormatter.string(from: asset.modificationDate ?? Date()),
          "width": asset.pixelWidth,
          "height": asset.pixelHeight,
        ]

        if let location = asset.location {
          pictureInfo["location"] = [
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude,
          ]
        }

        call.resolve(["picture": pictureInfo])
      } else {
        call.reject("Could not retrieve image data")
      }
    }
  }

  @objc(getPhotosFromAlbum:)
  func getPhotosFromAlbum(_ call: CAPPluginCall) {
    guard let albumIdentifier = call.getString("albumIdentifier") else {
      call.reject("You must provide an album identifier")
      return
    }

    // Fetch the album with the given identifier
    guard
      let album = PHAssetCollection.fetchAssetCollections(
        withLocalIdentifiers: [albumIdentifier], options: nil
      ).firstObject
    else {
      call.reject("Album not found")
      return
    }

    // Use PHFetchOptions if you want to apply filters or sorting to the photos
    let fetchOptions = PHFetchOptions()
    let fetchOrder = call.getString("sortOrder") ?? "descending"  // Fallback to "ascending"
    let isAscending = fetchOrder == "ascending"
    let limit = call.getInt("limit") ?? 0  // Limit for pagination
    let deliveryModeString = call.getString("deliveryMode") ?? "highQualityFormat"  // Default delivery mode
    let resizeModeString = call.getString("resizeMode") ?? "fast"  // Default resize mode
    let imageSize = call.getInt("imageSize") ?? 150  // Fallback to 150px if not provided

    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: isAscending)]

    let alreadyFetchedIdentifiers =
      call.getArray("alreadyFetchedIdentifiers", String.self) ?? []

    if !alreadyFetchedIdentifiers.isEmpty {
      fetchOptions.predicate = NSPredicate(
        format: "NOT (localIdentifier IN %@)", alreadyFetchedIdentifiers)
    }

    if limit > 0 {
      fetchOptions.fetchLimit = limit
    }

    let assetsFetchResult = PHAsset.fetchAssets(in: album, options: fetchOptions)

    //var images = [[String: Any]]() // To hold the image info dictionaries
    var images = Array(repeating: [String: Any](), count: assetsFetchResult.count)
    let dispatchGroup = DispatchGroup()
    let imageManager = PHCachingImageManager.default()

    // Use requestOptions for requesting image data
    let requestOptions = PHImageRequestOptions()
    requestOptions.isNetworkAccessAllowed = true  // Allows photos to be fetched from iCloud if necessary

    let deliveryMode: PHImageRequestOptionsDeliveryMode
    switch deliveryModeString.lowercased() {
    case "optimized":
      deliveryMode = .opportunistic
    case "fast":
      deliveryMode = .fastFormat
    case "highQuality":
      deliveryMode = .highQualityFormat
    default:
      deliveryMode = .fastFormat
    }

    let resizeMode: PHImageRequestOptionsResizeMode
    switch resizeModeString.lowercased() {
    case "exact":
      resizeMode = .exact
    case "none":
      resizeMode = .none
    case "fast":
      resizeMode = .fast
    default:
      resizeMode = .fast
    }

    requestOptions.deliveryMode = deliveryMode
    requestOptions.resizeMode = resizeMode

    let scale = UIScreen.main.scale
    let targetSize = CGSize(width: CGFloat(imageSize) * scale, height: CGFloat(imageSize) * scale)

    // Enumerate (limited or all) photos in the selected album
    assetsFetchResult.enumerateObjects { (asset, index, stop) in
      dispatchGroup.enter()
      imageManager.requestImage(
        for: asset, targetSize: targetSize, contentMode: .aspectFit, options: requestOptions
      ) { image, _ in
        if let image = image, let data = image.jpegData(compressionQuality: 1) {
          let base64String = data.base64EncodedString()  // Convert image to base64
          // Add image data dictionary at the correct index to maintain order
          images[index] = [
            "localIdentifier": asset.localIdentifier,
            "base64": base64String,
          ]
        } else {
          // If the image is not available, maintain placeholder to keep correct order
          images[index] = [:]
        }
        dispatchGroup.leave()
      }
    }

    // Once all asynchronous image fetch operations are completed, resolve the Capacitor call
    dispatchGroup.notify(queue: .main) {
      // Filter out any empty dictionaries that may exist if an image was not available
      let nonEmptyImages = images.filter { !$0.isEmpty }
      call.resolve(["pictures": images])
    }
  }

  @objc(getAllAlbumsWithLastPicture:)
  func getAllAlbumsWithLastPicture(_ call: CAPPluginCall) {

    let includeRegularAlbums = call.getBool("includeRegularAlbums") ?? true
    let includeSmartAlbums = call.getBool("includeSmartAlbums") ?? false
    let includeEmptyAlbums = call.getBool("includeEmptyAlbums") ?? false

    // Check if both includeRegularAlbums and includeSmartAlbums are false
    guard includeRegularAlbums || includeSmartAlbums else {
      call.reject("At least one type of album must be included")
      return
    }

    // Define fetch options to sort by creation date
    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]

    var albumInfoList = [[String: Any]]()

    // Dispatch group to wait for all image requests to finish
    let dispatchGroup = DispatchGroup()

    // Request images manager with synchronous option turned off
    let imageManager = PHCachingImageManager.default()
    let requestOptions = PHImageRequestOptions()
    requestOptions.isSynchronous = false
    requestOptions.deliveryMode = .highQualityFormat
    requestOptions.resizeMode = .exact
    requestOptions.isNetworkAccessAllowed = true

    // Fetching both types might include Regular and Smart Albums
    var fetchResultTypes: [PHAssetCollectionType] = []
    if includeSmartAlbums {
      fetchResultTypes.append(.smartAlbum)
    }
    if includeRegularAlbums {
      fetchResultTypes.append(.album)
    }

    // Enumerate each album type
    for fetchResultType in fetchResultTypes {
      let albumsFetchResult = PHAssetCollection.fetchAssetCollections(
        with: fetchResultType, subtype: .any, options: nil)

      // Enumerate each album within type
      albumsFetchResult.enumerateObjects { (collection, index, stop) in
        dispatchGroup.enter()  // Enter dispatch group for each album

        let albumTitle = collection.localizedTitle ?? "Unknown"
        let assetsFetchResult = PHAsset.fetchAssets(in: collection, options: fetchOptions)

        // Check for last asset in the album
        if let lastAsset = assetsFetchResult.firstObject {
          // Use requestOptions that were created above
          imageManager.requestImage(
            for: lastAsset, targetSize: CGSize(width: 150, height: 150), contentMode: .aspectFill,
            options: requestOptions
          ) { image, _ in
            var albumInfo: [String: Any] = [
              "localIdentifier": collection.localIdentifier,
              "title": albumTitle,
              "count": assetsFetchResult.count,
              "lastPicture": NSNull(),  // In case the image does not exist
            ]

            // If an image is found, encode it to base64 and add it to the album info
            if let image = image, let data = image.jpegData(compressionQuality: 0.8) {
              albumInfo["lastPicture"] = data.base64EncodedString()
            }

            // Append our album information to the list
            albumInfoList.append(albumInfo)

            dispatchGroup.leave()  // Leave the group upon finishing the image request
          }
        } else {
          if(includeEmptyAlbums){
            // If there are no assets in the album, add the album to the list with no image
            albumInfoList.append([
              "localIdentifier": collection.localIdentifier,
              "title": albumTitle,
              "count": assetsFetchResult.count,
              "lastPicture": NSNull(),
            ])
          }
          // If there are no assets in the album, leave the group immediately
          dispatchGroup.leave()
        }
      }
    }

    // Notify once all dispatch groups are completed
    dispatchGroup.notify(queue: .main) {
      // Resolve the Capacitor call with the album information
      call.resolve(["albums": albumInfoList])
    }
  }

  @objc func getRecentsPictures(_ call: CAPPluginCall) {

    let dateFormatter = ISO8601DateFormatter()
    dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

    let quality = call.getDouble("quality") ?? 0.7  // Fallback to 70% quality if not provided
    let imageSize = call.getInt("imageSize") ?? 150  // Fallback to 150px if not provided
    let fetchOrder = call.getString("sortOrder") ?? "ascending"  // Fallback to "ascending"
    let isAscending = fetchOrder == "ascending"
    let fetchLimit = call.getInt("fetchLimit") ?? 12  // Fallback to 12 images if not provided
    let deliveryModeString = call.getString("deliveryMode") ?? "highQualityFormat"  // Default delivery mode
    let resizeModeString = call.getString("resizeMode") ?? "fast"  // Default resize mode

    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [
      NSSortDescriptor(key: "creationDate", ascending: isAscending)
    ]
    fetchOptions.fetchLimit = fetchLimit

    let result = PHAsset.fetchAssets(with: PHAssetMediaType.image, options: fetchOptions)
    var encodedImages = [String]()

    let manager = PHCachingImageManager.default()
    let options = PHImageRequestOptions()

    let deliveryMode: PHImageRequestOptionsDeliveryMode
    switch deliveryModeString.lowercased() {
    case "optimized":
      deliveryMode = .opportunistic
    case "fast":
      deliveryMode = .fastFormat
    default:
      deliveryMode = .highQualityFormat
    }

    let resizeMode: PHImageRequestOptionsResizeMode
    switch resizeModeString.lowercased() {
    case "exact":
      resizeMode = .exact
    case "none":
      resizeMode = .none
    case "fast":
      resizeMode = .fast
    default:
      resizeMode = .fast
    }

    options.deliveryMode = deliveryMode
    options.resizeMode = resizeMode

    options.isNetworkAccessAllowed = true  // Allows the manager to fetch images from the network

    let scale = UIScreen.main.scale
    let targetSize = CGSize(width: CGFloat(imageSize) * scale, height: CGFloat(imageSize) * scale)

    var imageResults = [[String: Any]]()  // Array to hold image data objects

    for asset in result.objects(at: IndexSet(integersIn: 0..<result.count)) {

      var imageInfo =
        [
          "localIdentifier": asset.localIdentifier,
          "creationDate": dateFormatter.string(from: asset.creationDate ?? Date()),
          "modificationDate": dateFormatter.string(from: asset.modificationDate ?? Date()),
          "width": asset.pixelWidth,
          "height": asset.pixelHeight,
        ] as [String: Any]

      // Optionally add location data
      if let location = asset.location {
        imageInfo["location"] = [
          "latitude": location.coordinate.latitude,
          "longitude": location.coordinate.longitude,
        ]
      }

      manager.requestImage(
        for: asset, targetSize: targetSize,
        contentMode: .aspectFill, options: options
      ) { image, _ in

        guard let image = image, let data = image.jpegData(compressionQuality: CGFloat(quality))
        else { return }

        imageInfo["base64"] = data.base64EncodedString()
        imageResults.append(imageInfo)

        if imageResults.count == result.count {
          call.resolve(["pictures": imageResults])
        }
      }
    }
  }
}
