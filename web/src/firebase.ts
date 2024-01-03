// import * as firebase from "firebase/app";
// import "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "starseg-7a8f4.firebaseapp.com",
  projectId: "starseg-7a8f4",
  storageBucket: "starseg-7a8f4.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// // Initialize Firebase
// export const fire = firebase.initializeApp(firebaseConfig);
// export const analytics = getAnalytics(fire);
