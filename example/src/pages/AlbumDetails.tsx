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

type RouteParams = {
  id: string;
  title: string;
};

const AlbumDetails: React.FC = () => {
  const [photos, setPhotos] = useState<PictureInfo[]>([]);

  const { id, title } = useParams<RouteParams>();
  const decodedId = decodeURIComponent(id);
  const decodedTitle = decodeURIComponent(title);

  const fetchPhotos = async () => {
    try {
      const result = await CapacitorNativePhotoGallery.getPhotosFromAlbum({
        albumIdentifier: decodedId,
      });
      console.log(result);
      setPhotos(result.pictures);
    } catch (error) {
      console.error('Error fetching photos', error);
    }
  };

  console.log({
    id,
    title,
  });

  useEffect(() => {
    //fetch photos on page load
    fetchPhotos();
  }, []);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton text={'Albums'} className="w-[100px]" />
          <IonTitle>{decodedTitle ?? 'album title'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='bg-black'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className="ml-0 pl-0" size="large">
              {decodedTitle ?? 'album title'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="px-2">
          <p className='hidden'>Album Identifier: {decodedId ?? 'unknown'}</p>
          <IonButton className='hidden' onClick={fetchPhotos}>Get Photos</IonButton>
        </div>
        <div className="grid grid-cols-3 gap-[2px]">
          {photos?.map((photo, index) => (
            <img
              key={index}
              className="w-full h-[7rem] object-cover"
              src={`data:image/jpeg;base64,${photo?.base64}`}
              alt={`Photo ${index}`}
            />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlbumDetails;
