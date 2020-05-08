import 'firebase/database';
import 'firebase/firestore';

import firebase from 'firebase/app';

class FirebaseService {

    constructor() {
        this._init();
        this.databaseDownloads = firebase.database().ref("downloads");
    }

    _init() {
        firebase.initializeApp({
            apiKey: "AIzaSyBAsZS1Q-NDWqn5eDoqHAV7DH-8axquOig",
            authDomain: "franckiss-89abe.firebaseapp.com",
            databaseURL: "https://franckiss-89abe.firebaseio.com",
            projectId: "franckiss-89abe",
            storageBucket: "franckiss-89abe.appspot.com",
            messagingSenderId: "308277959147",
            appId: "1:308277959147:web:46aa37fce66ddbb0cd21ae"
        });
    }

    getAllFranckiss(callback) {
        this.databaseDownloads.on("child_added", callback);
    }

    async createNewFranckiss({ lat, lng }) {
        const newFranckiss = this.databaseDownloads.push();
        return newFranckiss.set({
            date: new Date().getTime(),
            location: { lat, lng }
        })
            .then(() => {
                return newFranckiss;
            })
    }
}

export default new FirebaseService();