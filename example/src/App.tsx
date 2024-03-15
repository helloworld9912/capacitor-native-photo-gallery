import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  imageOutline,
  personCircleOutline,
  addCircleOutline,
  cameraReverseOutline,
} from "ionicons/icons";

import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab4 from "./pages/Tab4";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Import Tailwind css Globaly */
import "./styles/global.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { NextUIProvider } from "@nextui-org/react";


setupIonicReact();

const App: React.FC  = () => {

  return (
  <NextUIProvider>
    <IonApp className="dark"> {/* Add dark class to force dark mode */}
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 />
            </Route>
            <Route exact path="/tab2">
              <Tab2 />
            </Route>
            <Route path="/tab3">
              <Tab3 />
            </Route>
            <Route path="/tab4">
              <Tab4 />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar translucent slot="bottom" className="pt-2 bg-black/80 backdrop-blur-xl">
            <IonTabButton tab="tab1" href="/tab1" className="transition duration-[100ms] transform hover:scale-105 focus:scale-95 active:scale-95">
              <IonIcon aria-hidden="true" icon={imageOutline} />
              <IonLabel>Tab1</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2" className="transition duration-[100ms] transform hover:scale-105 focus:scale-95 active:scale-95">
              <IonIcon aria-hidden="true" icon={cameraReverseOutline} />
              <IonLabel>Tab2</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3" className="transition duration-[100ms] transform hover:scale-105 focus:scale-95 active:scale-95">
              <IonIcon aria-hidden="true" icon={addCircleOutline} />
              <IonLabel>Tab3</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/tab4" className="transition duration-[100ms] transform hover:scale-105 focus:scale-95 active:scale-95">
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
              <IonLabel>Tab4</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </NextUIProvider>
)};

export default App;
