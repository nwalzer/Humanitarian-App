import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyANsDTPAi16_Bo2nBQM4FX1WWlLwVIGboI",
  authDomain: "humanitarian-app-development.firebaseapp.com",
  databaseURL: "https://humanitarian-app-development.firebaseio.com",
  projectId: "humanitarian-app-development",
  storageBucket: "humanitarian-app-development.appspot.com",
  messagingSenderId: "82772110458",
  appId: "1:82772110458:web:708a4080607257bd419fc3",
  measurementId: "G-63LLNC22GW"
};

firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
export { auth };
export default db;