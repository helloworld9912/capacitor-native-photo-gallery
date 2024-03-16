import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { CapacitorNativePhotoGallery, AlbumInfo } from 'capacitor-native-photo-gallery';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";


const Tab2: React.FC = () => {

  const history = useHistory();

  const [albums, setAlbums] = useState<AlbumInfo[]>([]);

  const fetchAlbums = async () => {
    try {

      const result = await CapacitorNativePhotoGallery.getAllAlbumsWithLastPicture();
      console.log(result);
      setAlbums(result.albums);

    } catch (error) {
      console.error('Error fetching albums', error);
    }
  };

  const handleGoToAlbumPage = (id: string, title:string) => {
    const encodedId = encodeURIComponent(id);
    const encodedTitle = encodeURIComponent(title);
    console.log('Go to album page:', title);
    console.log('Navigate to:', `/album/${id}/${title}`)
    history.push(`/album/${encodedId}/${encodedTitle}`);
  }

  useEffect(() => {
    //fetch albums on page load
    fetchAlbums();
  }, []);

  return (
    <IonPage className=''>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Albums</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Albums</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="px-4">
          <IonButton className="hidden" onClick={fetchAlbums}>Get Albums</IonButton>
          <h1>My Albums</h1>
          <div className="grid grid-cols-1 mb-[100px]">
            {albums.map((album, index) => (
              <div 
              onClick={()=> handleGoToAlbumPage(album?.localIdentifier, album?.title)}
              className='flex space-x-3 mb-4'>
              <img
                key={index}
                className="w-[6rem] h-[6rem] rounded-xl object-cover"
                src={`data:image/jpeg;base64,${album?.lastPicture}`}
                alt={`Photo ${index}`}
              />
              <div className='pt-0'>
              <h2 className='text-white text-xl font-semibold p-0 -pt-2'>{album?.title}</h2>
              <p className='text-slate-300'>{album?.count} photos</p>
              </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;