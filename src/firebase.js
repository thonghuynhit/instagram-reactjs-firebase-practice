import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyCSUHZMdTv-OdyIUapcUYPN0QtnXRQ-i3o",
    authDomain: "instagram-reactjs-82d25.firebaseapp.com",
    databaseURL: "https://instagram-reactjs-82d25.firebaseio.com",
    projectId: "instagram-reactjs-82d25",
    storageBucket: "instagram-reactjs-82d25.appspot.com",
    messagingSenderId: "178283081942",
    appId: "1:178283081942:web:35a7aa633f1035dc255977",
    measurementId: "G-ZPCW5F559S"
})

const db = firebaseApp.firestore()
const auth = Firebase.auth()
const storage = Firebase.storage()


export { db, auth, storage }