import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const tbName = "logs";

// Function to add a log entry to Firestore
export const addLog = async (from, activity) => {
    try {
        // Get a reference to the "log" collection
        const logCollection = collection(db, tbName);

        // Add a new document to the "log" collection
        await addDoc(logCollection, {
            date: new Date().toISOString(),
            from: from,
            activity: activity,
        });

        console.log("Log added!");
    } catch (error) {
        console.error("Error adding log: ", error);
    }
};
