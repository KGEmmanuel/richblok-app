// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDb0TtvpGhQsFgK9suJejciyH3oWCCAUP8',
    authDomain: 'richblok-app.firebaseapp.com',
    databaseURL: 'https://richblok-app.firebaseio.com',
    projectId: 'richblok-app',
    storageBucket: 'richblok-app.firebasestorage.app',
    messagingSenderId: '818264648008',
    appId: '1:818264648008:web:acfdef4b41e7ae20082b7d',
    measurementId: 'G-SGSCGBB322',
    timestampsInSnapshots: true
  },
  googleKey : 'AIzaSyCD7cXCYuY2__P5Hlfvx28L-UiqO06uGmY',
  stripe: {
    publishableKey: 'pk_test_YOUR_STRIPE_KEY',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
