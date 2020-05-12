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

    getFranckiss(franckissId) {
        return new Promise((resolve, reject) => {
            firebase.database().ref("downloads/" + franckissId).once('value',
                response => {
                    let value = response.val();
                    if (value) {
                        resolve(value);
                    } else {
                        reject();
                    }
                }, reject);
        })
    }

    setFranckissLabel(franckissId, franckissLabel) {
        return firebase.database().ref(`downloads/${franckissId}/franckissLabel`).set(franckissLabel);
    }

    async createNewFranckiss({ lat, lng }, index) {
        const newFranckiss = this.databaseDownloads.push();
        return newFranckiss.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            location: { lat, lng },
            number: index,
            franckissLabel: `Franckiss_${index}`
        })
            .then(() => {
                return newFranckiss;
            })
    }
}

export default new FirebaseService();