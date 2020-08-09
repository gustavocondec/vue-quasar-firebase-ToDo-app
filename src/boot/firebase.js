import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}
// Initialize Firebase

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { db, firebase }
