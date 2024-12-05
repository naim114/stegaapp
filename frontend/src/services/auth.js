import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { addLog } from '../model/log';
import { User } from '../model/user';

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is authenticated:", user.uid);
    } else {
        console.error("User is not authenticated!");
    }
});

// Function to sign up a new user
export const signUp = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("uid: " + user.uid);

        const userData = new User({
            uid: user.uid,
            name,
            email,
            role: 'USER',
            createdAt: Date.now(),
            photoURL: null,
        });

        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), userData.toObject());

        console.log('User signed up and data stored:', user);

        addLog(email, `New user created: ${name} (${email})`);

        return userData;
    } catch (error) {
        console.error('Error signing up:', error);
        addLog(email, `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            throw new Error('User data not found in Firestore.');
        }

        // Convert Firestore data into a User instance
        const userData = User.fromFirestore(userDoc);

        console.log('User signed in:', userData.displayInfo());

        addLog(email, `${email} logged in`);

        return userData;
    } catch (error) {
        console.error('Error signing in:', error);
        addLog(email, `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};

// Logout function to sign out the current user
export const logout = async () => {
    try {
        const user = auth.currentUser;

        if (user) {
            await auth.signOut();
            console.log('User signed out successfully.');

            addLog(user.email, `${user.email} logged out.`);
        } else {
            console.log('No user is currently signed in.');
        }

        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        addLog('System', `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};


export const getCurrentUser = async () => {
    try {
        // Check if a user is authenticated
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }

        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (!userDoc.exists()) {
            throw new Error('User data not found in Firestore.');
        }

        // Convert Firestore data to a User instance
        const userData = User.fromFirestore(userDoc);

        console.log('Current user fetched:', userData.displayInfo());

        return userData;
    } catch (error) {
        console.error('Error getting current user:', error.message);
        throw error;
    }
};