// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentInterface } from '../app/interfaces/environment-interface';

export const environment: EnvironmentInterface = {
  production: false,
  settings: {
    endpoint: 'http://localhost:5000',
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
    tracing_api: 'https://tracing.pickeasy.ca',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
