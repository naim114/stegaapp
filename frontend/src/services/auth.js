import { auth, db } from '../firebase';
import {
    getAuth,
    updateEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';
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
        addLog('SYSTEM', `ERROR: ${error.code} - ${error.message}`);
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

export const forgotPassword = async (email) => {
    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        console.log(`Password reset email sent to: ${email}`);

        addLog(email, `Password reset email sent.`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        addLog(email, `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};

export const updateEmailAddress = async (newEmail, password) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in.');
        }

        // Reauthenticate the user using their current password
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // Update email in Firebase Authentication
        await updateEmail(user, newEmail);

        // Update email in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { email: newEmail }, { merge: true });

        console.log('Email address updated successfully.');
        addLog(newEmail, `Email address updated to ${newEmail}.`);
        return true;
    } catch (error) {
        console.error('Error updating email address:', error.message);
        addLog(newEmail, `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};

export const resendVerificationEmail = async (email) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in.');
        }

        await sendEmailVerification(user);

        console.log('Verification email sent successfully.');
        addLog(user.email, `Verification email resent.`);
    } catch (error) {
        console.error('Error resending verification email:', error.message);
        addLog(email, `ERROR: ${error.code} - ${error.message}`);
        throw error;
    }
};

// Update user's email
export const updateUser = async (userId, data) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, data, { merge: true });
        addLog(userId, `User data updated: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error('Error updating user data:', error.message);
        throw error;
    }
};