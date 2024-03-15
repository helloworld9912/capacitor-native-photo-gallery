import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Tab4: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>Hello Tab 4</div>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
