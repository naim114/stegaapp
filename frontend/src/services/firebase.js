import { auth, db } from './firebase';

const signIn = async (email, password) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log("Signed in!");
    } catch (error) {
        console.error("Error signing in: ", error);
    }
};
