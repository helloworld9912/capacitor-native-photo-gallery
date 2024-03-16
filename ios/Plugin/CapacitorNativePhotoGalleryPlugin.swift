import Foundation
import Capacitor
import Photos // Add this line to import the Photos framework


extension Date {
    var iso8601String: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: self)
    }
}

struct Photo {
    let fileURL: URL
    // Include other properties you need, such as mimeType, fileName, etc.
}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorNativePhotoGalleryPlugin)
public class CapacitorNativePhotoGalleryPlugin: CAPPlugin {
    private let implementation = CapacitorNativePhotoGallery()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }

    // Create a method that can be called from JavaScript to get the photos
        @objc func showGallery(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            let status = PHPhotoLibrary.authorizationStatus()

            switch status {
            case .authorized, .limited:
                // Fetch photos using Photos framework
                fetchPhotos { (result) in
                    switch result {
                    case .success(let photoArray):
                        // Convert the photos to a format that can be passed to JavaScript
                        let photoDataArray = photoArray.map { photo in
                            // Return relevant photo information, like the file path
                            return ["filePath": photo.fileURL.absoluteString]
                        }
                        call.resolve(["photos": photoDataArray])
                    case .failure(let error):
                        call.reject(error.localizedDescription)
                    }
                }
            default:
                // Request access
                PHPhotoLibrary.requestAuthorization { newStatus in
                    if newStatus == .authorized || newStatus == .limited {
                        self.showGallery(call)
                    } else {
                        call.reject("Access to photo library denied")
                    }
                }
            }
        } else {
            // Handle iOS 13 or lower - .limited is not available
            let status = PHPhotoLibrary.authorizationStatus()

            switch status {
            case .authorized:
                // Fetch photos using Photos framework
                fetchPhotos { (result) in
                    switch result {
                    case .success(let photoArray):
                        // Convert the photos to a format that can be passed to JavaScript
                        let photoDataArray = photoArray.map { photo in
                            // Return relevant photo information, like the file path
                            return ["filePath": photo.fileURL.absoluteString]
                        }
                        call.resolve(["photos": photoDataArray])
                    case .failure(let error):
                        call.reject(error.localizedDescription)
                    }
                }
            default:
                // Request access
                PHPhotoLibrary.requestAuthorization { newStatus in
                    if newStatus == .authorized {
                        self.showGallery(call)
                    } else {
                        call.reject("Access to photo library denied")
                    }
                }
            }
        }
    }


    private func fetchPhotos(completion: @escaping (Result<[Photo], Error>) -> Void) {
        var photoAssets = [PHAsset]()
        let fetchOptions = PHFetchOptions()
        
        // Sort by creation date, fetch only images and limit the number
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.predicate = NSPredicate(format: "mediaType = %d", PHAssetMediaType.image.rawValue)
        fetchOptions.fetchLimit = 25 // limit to the last 25 images
        
        // Perform the fetch
        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        fetchResult.enumerateObjects { (asset, _, _) in
            photoAssets.append(asset)
        }
        
        // Request image data for the fetched assets
        var photos = [Photo]()
        let imageManager = PHImageManager.default()
        let requestOptions = PHImageRequestOptions()
        requestOptions.isSynchronous = true
        requestOptions.deliveryMode = .highQualityFormat
        
        for asset in photoAssets {
            imageManager.requestImageData(for: asset, options: requestOptions) { (imageData, dataUTI, orientation, info) in
                // Check for a URL representing the image file
                if let fileURL = info?["PHImageFileURLKey"] as? URL {
                    photos.append(Photo(fileURL: fileURL))
                }
            }
        }

        // Once all images are fetched, call the completion with success
        completion(.success(photos))
    }


    //working !
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

    //working !
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

    
    //get 3 most recent photos from the gallery
    @objc func getRecentPhotos(_ call: CAPPluginCall) {
        let fetchOptions = PHFetchOptions()
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.fetchLimit = 3 // limit to the last 3 images
        
        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        var photoDataArray = [[String: String]]()
        
        fetchResult.enumerateObjects { (asset, _, _) in
            let imageManager = PHImageManager.default()
            let requestOptions = PHImageRequestOptions()
            requestOptions.isSynchronous = true
            requestOptions.deliveryMode = .highQualityFormat
            
            imageManager.requestImageData(for: asset, options: requestOptions) { (imageData, dataUTI, orientation, info) in
                // Check for a URL representing the image file
                if let fileURL = info?["PHImageFileURLKey"] as? URL {
                    photoDataArray.append(["filePath": fileURL.absoluteString])
                }
            }
        }
        
        call.resolve(["photos": photoDataArray])
    } 


/*
//pagination Function to Load Images in Batches
@objc func loadGalleryPage(_ call: CAPPluginCall) {
    let offset = call.getInt("offset") ?? 0
    let limit = call.getInt("limit") ?? 20 // Default batch size

    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    fetchOptions.fetchLimit = limit
    fetchOptions.fetchOffset = offset // iOS 13 and later

    let result = PHAsset.fetchAssets(with: PHAssetMediaType.image, options: fetchOptions)
    // Continue to fetch and prepare the image data for return...
}

@objc func getFullQualityImage(_ call: CAPPluginCall) {
    let assetId = call.getString("assetId") ?? ""

    if let asset = PHAsset.fetchAssets(withLocalIdentifiers: [assetId], options: nil).firstObject {
        let options = PHImageRequestOptions()
        options.isNetworkAccessAllowed = true // Allows fetching from iCloud
        options.deliveryMode = .highQualityFormat // Request full quality
        options.isSynchronous = true

        PHImageManager.default().requestImageData(for: asset, options: options) { imageData, dataUTI, orientation, info in
            if let data = imageData {
                let base64String = data.base64EncodedString()
                call.resolve(["picture": base64String])
            } else {
                call.reject("Unable to fetch full quality image")
            }
        }
    } else {
        call.reject("Invalid asset identifier")
    }
}
*/

@objc(getPhotosFromAlbum:)
func getPhotosFromAlbum(_ call: CAPPluginCall) {
    guard let albumIdentifier = call.getString("albumIdentifier") else {
        call.reject("You must provide an album identifier")
        return
    }

    // Fetch the album with the given identifier
    guard let album = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumIdentifier], options: nil).firstObject else {
        call.reject("Album not found")
        return
    }
    
    // Use PHFetchOptions if you want to apply filters or sorting to the photos
    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: true)]
    let assetsFetchResult = PHAsset.fetchAssets(in: album, options: fetchOptions)
    
    var images = [[String: Any]]() // To hold the image info dictionaries
    let dispatchGroup = DispatchGroup()
    let imageManager = PHCachingImageManager.default()
    
    // Use requestOptions for requesting image data
    let requestOptions = PHImageRequestOptions()
    requestOptions.isNetworkAccessAllowed = true // Allows photos to be fetched from iCloud if necessary
    requestOptions.deliveryMode = .highQualityFormat // Request high-quality images
    requestOptions.resizeMode = .exact // Resize images to the specified targetSize

    let targetSize = CGSize(width: 150, height: 150) // Desired image size (width x height)

    // Enumerate all photos in the selected album
    assetsFetchResult.enumerateObjects { (asset, _, _) in
        dispatchGroup.enter() // Start of asynchronous operation
        
        // Request image for the asset
        imageManager.requestImage(for: asset, targetSize: targetSize, contentMode: .aspectFill, options: requestOptions) { image, _ in
            
            if let image = image, let data = image.jpegData(compressionQuality: 0.8) {
                let base64String = data.base64EncodedString() // Convert image to base64
                
                // Add image data dictionary to the array
                images.append([
                    "localIdentifier": asset.localIdentifier,
                    "base64": base64String
                ])
            }
            
            dispatchGroup.leave() // End of asynchronous operation
        }
    }
    
    // Once all asynchronous image fetch operations are completed resolve the Capacitor call
    dispatchGroup.notify(queue: .main) {
        call.resolve(["pictures": images])
    }
}



@objc(getAllAlbumsWithLastPicture:)
func getAllAlbumsWithLastPicture(_ call: CAPPluginCall) {
    // Define fetch options to sort by creation date
    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    
    let albumsFetchResult = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumRegular, options: nil)
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
    
    // Enumerate each album
    albumsFetchResult.enumerateObjects { (collection, index, stop) in
        dispatchGroup.enter()  // Enter dispatch group for each album
        
        let albumTitle = collection.localizedTitle ?? "Unknown"
        let assetsFetchResult = PHAsset.fetchAssets(in: collection, options: fetchOptions)
        
        // Check for last asset in the album
        if let lastAsset = assetsFetchResult.firstObject {
            // Use requestOptions that were created above
            imageManager.requestImage(for: lastAsset, targetSize: CGSize(width: 150, height: 150), contentMode: .aspectFill, options: requestOptions) { image, _ in
                var albumInfo: [String: Any] = [
                    "localIdentifier": collection.localIdentifier,
                    "title": albumTitle,
                    "count": assetsFetchResult.count,
                    "lastPicture": NSNull()  // In case the image does not exist
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
            // If there are no assets in the album, leave the group immediately
            dispatchGroup.leave()
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

    let quality = call.getDouble("quality") ?? 0.7 // Fallback to 70% quality if not provided
    let imageSize = call.getInt("imageSize") ?? 150 // Fallback to 150px if not provided
    let rawFetchOrder = call.getString("sortOrder")
    let fetchOrder = call.getString("sortOrder") ?? "false" // Fallback to "false" if not provided
    let fetchOrderFormatted = fetchOrder.lowercased() == "ascending" // This will be true if fetchOrder is "true", otherwise false
    let fetchLimit = call.getInt("fetchLimit") ?? 6 // Fallback to 6 images if not provided
    let deliveryModeString = call.getString("deliveryMode") ?? "highQualityFormat" // Default delivery mode
    let resizeModeString = call.getString("resizeMode") ?? "fast" // Default resize mode

    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: fetchOrderFormatted)]
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

    options.isNetworkAccessAllowed = true // Allows the manager to fetch images from the network
    
    let scale = UIScreen.main.scale
    let targetSize = CGSize(width: CGFloat(imageSize) * scale, height: CGFloat(imageSize) * scale)
    
    var imageResults = [[String: Any]]() // Array to hold image data objects

    for asset in result.objects(at: IndexSet(integersIn: 0..<result.count)) {

            var imageInfo = [
            "localIdentifier": asset.localIdentifier,
            "creationDate": dateFormatter.string(from: asset.creationDate ?? Date()),
            "modificationDate": dateFormatter.string(from: asset.modificationDate ?? Date()),
            "width": asset.pixelWidth,
            "height": asset.pixelHeight,
        ] as [String : Any]

          // Optionally add location data
        if let location = asset.location {
            imageInfo["location"] = [
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude
            ]
        }

        manager.requestImage(for: asset, targetSize: targetSize,
                             contentMode: .aspectFill, options: options) { image, _ in
            
            guard let image = image, let data = image.jpegData(compressionQuality: CGFloat(quality)) else { return }
           
            imageInfo["base64"] = data.base64EncodedString()
            imageResults.append(imageInfo)


            let base64String = data.base64EncodedString()
            encodedImages.append(base64String)
            
            /*
            if encodedImages.count == result.count {
                call.resolve(["pictures": encodedImages])
            }
            */
            if imageResults.count == result.count {
                    call.resolve(["pictures": imageResults])
            }
        }
    }
}
}