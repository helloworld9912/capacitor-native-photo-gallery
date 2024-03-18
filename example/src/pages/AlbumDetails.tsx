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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';

import { useHistory } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { previewPicture } from '../atom/global';

type RouteParams = {
  id: string;
  title: string;
  count: string;
};

const PAGE_SIZE = 24;

const AlbumDetails: React.FC = () => {
  const [photos, setPhotos] = useState<PictureInfo[]>([]);
  const [alreadyFetchedIdentifiers, setAlreadyFetchedIdentifiers] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const setSelectedPreviewPhoto = useSetAtom(previewPicture);

  const { id, title, count } = useParams<RouteParams>();
  const decodedId = decodeURIComponent(id);
  const decodedTitle = decodeURIComponent(title);
  const decodedCount = decodeURIComponent(count);
  const countNumber = parseInt(decodedCount); //convert to number

  const history = useHistory();

  const fetchPhotos = async (limit:number) => {
    try {
      const initialResults = await CapacitorNativePhotoGallery.getPhotosFromAlbum({
        albumIdentifier: decodedId,
        limit: limit,
      });
  
      setPhotos(initialResults.pictures);
      setAlreadyFetchedIdentifiers(initialResults.pictures.map(p => p.localIdentifier));
      if (initialResults.pictures.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching photos', error);
    }
  };
  
  const loadMoreItems = async () => {
    if (hasMore) {
      const more_results = await CapacitorNativePhotoGallery.getPhotosFromAlbum(
        {
          albumIdentifier: decodedId,
          alreadyFetchedIdentifiers: alreadyFetchedIdentifiers,
          limit: PAGE_SIZE,
        },
      );
      if (more_results.pictures.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setPhotos([...photos, ...more_results.pictures]);
      setAlreadyFetchedIdentifiers([
        ...alreadyFetchedIdentifiers,
        ...more_results.pictures.map(p => p.localIdentifier),
      ]);
      return true
    }
    return true
  }

  useEffect(() => {
    //fetch photos on page load
    fetchPhotos(PAGE_SIZE);
  }, []);

  const handleGoToPicturePage = (id: string, base64: string) => {
    setSelectedPreviewPhoto(base64);
    const encodedId = encodeURIComponent(id);
    history.push(`/picture/${encodedId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton text={'Albums'} className="w-[100px]" />
          <IonTitle>{decodedTitle ?? 'album title'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-black">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className="ml-0 pl-0" size="large">
              {decodedTitle ?? 'album title'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="px-2">      
        </div>
        <div className="grid grid-cols-3 gap-[2px] mb-[95px]">
          {photos?.length === 0 ||
            (countNumber === 0 && (
              <p className="text-center">No photos found</p>
            ))}

          {photos && photos.length > 0 ? (
            <>
              {photos?.map((photo, index) => (
                <img
                  onClick={() =>
                    handleGoToPicturePage(photo?.localIdentifier, photo?.base64)
                  }
                  key={index}
                  className="w-full h-[7rem] object-cover"
                  src={`data:image/jpeg;base64,${photo?.base64}`}
                  alt={`Photo ${index}`}
                />
              ))}
            </>
          ) : (
            <>
              {Array.from(
                { length: Math.min(countNumber, 300) }, //performace optimization
                (_, index) => (
                  <div key={index} className="w-full h-[7rem] bg-gray-800" />
                ),
              )}
            </>
          )}
        </div>
        <IonInfiniteScroll
        threshold='200px'
        disabled={!hasMore}
        onIonInfinite={async (ev) => {
          await loadMoreItems();
          ev.target.complete();
        }}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default AlbumDetails;
