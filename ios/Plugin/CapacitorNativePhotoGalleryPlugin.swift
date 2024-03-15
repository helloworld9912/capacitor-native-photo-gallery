import Foundation
import Capacitor
import Photos // Add this line to import the Photos framework


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


}
