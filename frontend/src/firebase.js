import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuK5lDJr8ACNxD-Ty2yNZNbZeMaA72AZw",
    authDomain: "wsm-malaysian-tourism.firebaseapp.com",
    projectId: "wsm-malaysian-tourism",
    storageBucket: "wsm-malaysian-tourism.appspot.com",
    messagingSenderId: "236864653116",
    appId: "1:236864653116:web:165e01bb43e2b440798039",
    measurementId: "G-L9Q6ZW62HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);

auth.useDeviceLanguage();

const db = getFirestore(app);

export { auth, db };
export default app;
