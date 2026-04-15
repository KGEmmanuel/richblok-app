// Copy this file to environment.ts and environment.prod.ts
// Fill in your actual Firebase and API credentials

export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    timestampsInSnapshots: true
  },
  googleKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  stripe: {
    publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
  }
};
