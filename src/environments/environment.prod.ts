export const environment = {
  production: true,
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
  googleKey: '',        // Inject at build time via CI env, or paste a restricted key
  metaPixelId: '',      // Meta Pixel ID for Facebook Ads tracking
  stripe: {
    publishableKey: 'pk_live_YOUR_STRIPE_KEY',
  }
};
