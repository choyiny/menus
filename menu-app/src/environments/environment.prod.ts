import { EnvironmentInterface } from '../app/interfaces/environment-interface';

export const environment: EnvironmentInterface = {
  production: true,
  settings: {
    endpoint: 'https://menu.pickeasy.ca/api',
    firebase: {
      apiKey: 'AIzaSyB03cZwKu07MHfTat2CHSSLhpVtezJ0s7g',
      authDomain: 'pickeasy-app.firebaseapp.com',
      databaseURL: 'https://pickeasy-app.firebaseio.com',
      projectId: 'pickeasy-app',
      storageBucket: 'pickeasy-app.appspot.com',
      messagingSenderId: '331541131061',
      appId: '1:331541131061:web:dde6e1cf8b621c660be67c',
      measurementId: 'G-EVH6ZBYNS4',
    },
  },
};
