// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2HLHn0ZPdJUuuteuvcWcRExiLqCJSRHg",
  authDomain: "fire-homes-course-8a316.firebaseapp.com",
  projectId: "fire-homes-course-8a316",
  storageBucket: "fire-homes-course-8a316.firebasestorage.app",
  messagingSenderId: "772099479472",
  appId: "1:772099479472:web:f83778cebdffa2b226a875"
};

// Initialize Firebase
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage };