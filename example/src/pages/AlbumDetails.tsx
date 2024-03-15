import React from 'react';
import { useParams } from 'react-router-dom';

import { IonContent, IonBackButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

type RouteParams = {
  id: string;
  title: string;
};

const AlbumDetails: React.FC = () => {
  const { id, title } = useParams<RouteParams>();
  const decodedId = decodeURIComponent(id);
  const decodedTitle = decodeURIComponent(title);

  console.log({
    id,
    title
  })
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton text={'Albums'} className='w-[100px]' />
          <IonTitle>{decodedTitle ?? 'album title'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className='ml-0 pl-0' size="large">{decodedTitle ?? 'album title'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='px-2'>
          <p>Album Identifier: {decodedId ?? 'unknown'}</p>
          <p>Pictures goes here.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlbumDetails;
