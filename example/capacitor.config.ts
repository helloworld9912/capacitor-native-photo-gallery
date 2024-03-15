import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'photo-gallery-plugin-testing',
  webDir: 'dist',


  /* remove server and run "npx react-scripts build" for a static build
  let server for dynamic hot reload build */
  //hot reaload setup
  /*
  server: {
    url: "http://192.168.9.88:5173", //local ip + port (to get local ip on mac run "ipconfig getifaddr en0" in terminal)
    cleartext: true
  },
  */


  //Static build setup
  server: {
    androidScheme: 'https'
  }


};

export default config;
