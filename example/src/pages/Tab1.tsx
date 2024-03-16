import React, {useState} from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { BRAND_NAME } from '../const/global';

import {
  CapacitorNativePhotoGallery,
  PictureInfo,
} from 'capacitor-native-photo-gallery';

const Tab1: React.FC = () => {
  const [photos, setPhotos] = useState<PictureInfo[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>('');

  const checkPermissions = async () => {
    try {
      const result =
        await CapacitorNativePhotoGallery.checkPhotoLibraryPermission();
      console.log(`Photo library permission status: ${result.status}`);
      setPermissionStatus(result.status);
    } catch (error) {
      console.error;
    }
  };

  const requestPermissions = async () => {
    try {
      const result =
        await CapacitorNativePhotoGallery.requestPhotoLibraryPermission();
      console.log(`Photo library permission status: ${result.status}`);
    } catch (error) {
      console.error;
    }
  };

  const showGallery = async () => {
    try {
      const result = await CapacitorNativePhotoGallery.showGallery();
      console.log(result);
    } catch (error) {
      console.error;
    }
  };

  const getRecentPhotos = async () => {
    try {
      const result = await CapacitorNativePhotoGallery.getRecentPhotos();
      console.log(result);
    } catch (error) {
      console.error;
    }
  };

  const getRecentsPictures = async () => {
    try {
      const result = await CapacitorNativePhotoGallery.getRecentsPictures({
        imageSize: 200,
        fetchLimit: 12,
        sortOrder: 'descending', //to get oldest pictures first, use 'ascending'
        deliveryMode: 'highQuality',
        resizeMode: 'none',
      });
      console.log(result);
      setPhotos(result.pictures);
    } catch (error) {
      console.error;
    }
  };

  const getLeastRecentPictures = async () => {
      try {
        const result = await CapacitorNativePhotoGallery.getRecentsPictures({
          imageSize: 200,
          fetchLimit: 12,
          sortOrder: 'ascending', //to get oldest pictures first, use 'ascending'
          deliveryMode: 'highQuality',
          resizeMode: 'none',
        });
        console.log(result);
        setPhotos(result.pictures);
      } catch (error) {
        console.error;
      }
    };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="text-start p-0 pl-4">photo gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="-mt-3 mb-0.5">
              Photo Gallery
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>Hello tab 1</div>

        <IonButton onClick={checkPermissions}>Check Permissions</IonButton>
        <IonButton onClick={requestPermissions}>Request Permissions</IonButton>
   
        <IonButton onClick={getRecentsPictures}>get Most Recents Pictures</IonButton>
        <IonButton onClick={getLeastRecentPictures}>get Least Recents Pictures</IonButton>

        {permissionStatus && (
          <p className="text-center">Permission Status: {permissionStatus}</p>
        )}
        <div className="">
          <h1 className=''>Recents</h1>
          {/*
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <>
              <img
                key={index}
                className="w-full rounded-lg object-cover"
                src={`data:image/jpeg;base64,${photo.base64}`}
                alt={`Photo ${index}`}
              />
             </>
            ))}
          </div>
            */}

          <div className="grid grid-cols-3 gap-[2px] mb-[200px]">
            {photos?.map((photo, index) => (
              <img
                key={index}
                className="w-full h-[7rem] object-cover"
                src={`data:image/jpeg;base64,${photo?.base64}`}
                alt={`Photo ${index}`}
              />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
