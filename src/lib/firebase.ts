import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAamAvwSSNauDUGOMk1YLrPOqCyN4OR-oU",
  authDomain: "saviour-2556.firebaseapp.com",
  projectId: "saviour-2556",
  storageBucket: "saviour-2556.appspot.com",
  messagingSenderId: "1012376360740",
  appId: "1:1012376360740:android:3c8d4b13fdc6a8226c05b1",
  measurementId: "G-XXXXXXXXXX",
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)