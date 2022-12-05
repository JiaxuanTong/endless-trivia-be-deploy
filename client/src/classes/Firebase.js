import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCn2Ye8Wt0bHQepDriLAdkl03bUUagK1as",
    authDomain: "endless-trivia-1a75c.firebaseapp.com",
    databaseURL: "https://endless-trivia-1a75c.firebaseio.com",
    projectId: "endless-trivia-1a75c",
    storageBucket: "endless-trivia-1a75c.appspot.com",
    messagingSenderId: "575090040936",
    appId: "1:575090040936:web:ac133912a7d972ecab1bdd"
};

class Firebase {
    constructor() {
        app.initializeApp(FIREBASE_CONFIG);

        this.auth = app.auth();
        this.database = app.database();
    }

    getAuth = () => {
        return this.auth;
    }

    getDatabase = () => {
        return this.database;
    }
}

export default Firebase;