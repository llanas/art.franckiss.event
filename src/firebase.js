import 'firebase/database';
import 'firebase/firestore';

import firebase from 'firebase/app';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBAsZS1Q-NDWqn5eDoqHAV7DH-8axquOig",
    authDomain: "franckiss-89abe.firebaseapp.com",
    databaseURL: "https://franckiss-89abe.firebaseio.com",
    projectId: "franckiss-89abe",
    storageBucket: "franckiss-89abe.appspot.com",
    messagingSenderId: "308277959147",
    appId: "1:308277959147:web:46aa37fce66ddbb0cd21ae"
});

const firestore = firebaseApp.firestore();
const database = firebase.database();

export { firestore, database };
