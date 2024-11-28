import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { addLog } from './log';

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is authenticated:", user.uid);
    } else {
        console.error("User is not authenticated!");
    }
});

// Sign-up function to create a new user
export const signUp = async (email, password, name) => {
    try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("uid: " + user.uid);

        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            role: "USER",
            uid: user.uid,
            createdAt: Date.now(),
        });

        console.log('User signed up and data stored:', user);

        addLog(email, `New user created named ${name} (${email})`);

        return user;
    } catch (error) {
        console.error('Error signing up:', error);

        addLog(email, `ERROR: ${error.code} - ${error.message}`);

        throw error; // Propagate the error for UI handling
    }
};

// Sign-in function to authenticate an existing user
export const signIn = async (email, password) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);

        addLog(email, `${email} logged in`);

        return user;
    } catch (error) {
        console.error('Error signing in:', error.code, error.message);
        if (error.code === 'auth/user-not-found') {
            throw new Error('No user found with this email.');
        }

        addLog(email, `ERROR: ${error.code} - ${error.message}`);

        throw error;
    }

};
