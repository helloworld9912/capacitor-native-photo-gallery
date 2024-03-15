import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { BRAND_NAME } from '../const/global';

import { CapacitorNativePhotoGallery } from 'capacitor-native-photo-gallery';

const Tab1: React.FC = () => {
  const checkPermissions = async () => {
    try {
      const result =
        await CapacitorNativePhotoGallery.checkPhotoLibraryPermission();
      console.log(`Photo library permission status: ${result.status}`);
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
  }

  const showGallery = async () => {
    try {
      const result = await CapacitorNativePhotoGallery.showGallery();
      console.log(result);
    } catch (error) {
      console.error;
    }
  }



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
        <IonButton onClick={showGallery}>Show Gallery</IonButton>


      </IonContent>
    </IonPage>
  );
};

export default Tab1;
