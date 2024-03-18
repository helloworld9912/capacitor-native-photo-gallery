import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CapacitorNativePhotoGallery,
  PictureInfo,
} from 'capacitor-native-photo-gallery';

import {
  IonContent,
  IonBackButton,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';

import { useAtomValue } from 'jotai';
import { previewPicture } from '../atom/global';

interface ImageLoaderProps {
  preview: string;
  full: string;
}
const ImageLoader = ({ preview, full }:ImageLoaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      {/* Image de basse qualité */}
      <img
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        src={`data:image/jpeg;base64,${preview}`}
        alt="Aperçu de la photo"
      />

      {/* Image en pleine qualité */}
      <img
        className={`w-full h-full object-contain transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        src={`data:image/jpeg;base64,${full}`}
        alt="Photo en pleine qualité"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};


type RouteParams = {
  id: string;
  title: string;
};

const PictureView: React.FC = () => {
  const [photo, setPhoto] = useState<PictureInfo>({} as PictureInfo);
  
  const atomPreviewPicture = useAtomValue(previewPicture);

  const { id } = useParams<RouteParams>();
  const decodedId = decodeURIComponent(id);

  const fetchPhoto = async () => {
    try {

      //first fetch the photo fast and optimized to display it quickly
      const quick_optimized_result = await CapacitorNativePhotoGallery.getImageByIdentifier({
        localIdentifier: decodedId,
        deliveryMode: 'fast',
        resizeMode: 'fast',
      });

      setPhoto(quick_optimized_result.picture);

    } catch (error) {
      console.error('Error fetching photos', error);
    }
  };


  useEffect(() => {
    //fetch photo on page load
    fetchPhoto();

  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton text={''} className="w-[40px]" />
          <IonTitle>{''}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-black pb-[100px]">

      <ImageLoader preview={atomPreviewPicture} full={photo?.base64} />

      </IonContent>
    </IonPage>
  );
};

export default PictureView;
