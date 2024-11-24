import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { addLog } from './log';

// Sign-up function to create a new user
export const signUp = async (email, password, name) => {
    try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
        });

        console.log('User signed up and data stored:', user);

        addLog(email, ("New user created named " + name + " (" + email + ")"));

        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;  // Propagate the error for UI handling
    }
};

// Sign-in function to authenticate an existing user
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        return user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;  // Propagate the error for UI handling
    }
};