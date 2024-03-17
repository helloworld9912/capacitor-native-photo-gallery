import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Photo {
  id: string;
  src: string;
}



const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.5 }
  },
};


//trying to mimic the ios photo gallery - WIP
const Tab3: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos: Photo[] = [
    {
      id: '1',
      src: 'https://picsum.photos/id/1/200/350',
    },
    {
      id: '2',
      src: 'https://picsum.photos/id/2/200/350',
    },
    {
      id: '3',
      src: 'https://picsum.photos/id/3/200/350',
    },
    {
      id: '4',
      src: 'https://picsum.photos/id/4/200/350',
    },
    {
      id: '5',
      src: 'https://picsum.photos/id/5/200/350',
    },
    {
      id: '6',
      src: 'https://picsum.photos/id/6/200/350',
    },
    {
      id: '7',
      src: 'https://picsum.photos/id/7/200/350',
    },
    {
      id: '8',
      src: 'https://picsum.photos/id/8/200/350',
    },
    {
      id: '9',
      src: 'https://picsum.photos/id/9/200/350',
    },
    {
      id: '10',
      src: 'https://picsum.photos/id/10/200/350',
    },
    {
      id: '11',
      src: 'https://picsum.photos/id/11/200/350',
    },
    {
      id: '12',
      src: 'https://picsum.photos/id/12/200/350',
    },
  ];

  const imageIds = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30,
  ];

  const openImage = (id:number) => {
    setSelectedImage(id);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>


        <motion.div className="grid grid-cols-3 gap-[2px]" layout>
          {photos.map((photo) => {
            return (
              <motion.div className="h-[7rem] object-cover" key={photo.id}>
              <div
                style={{ paddingTop: '100%' }} // Créer un div carrée
                onClick={() => openImage(parseInt(photo.id))}
              >
                <motion.img
                  layoutId={`img-${photo.id}`}
                  className="object-cover"
                  src={photo.src}
                  alt={`Photo ${photo.id}`}
                />
              </div>
            </motion.div>
            );
          })}
        </motion.div>


        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
              variants={backdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeModal} // Close modal when clicking on the backdrop
            >
              <motion.img
                layoutId={`img-${selectedImage}`}
                src={photos[selectedImage - 1]?.src}
                alt="Enlarged photo"
                variants={modal}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
