import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const tbName = "logs";

export class Log {
    constructor({ date = new Date().toISOString(), from, activity }) {
        this.date = date;
        this.from = from;
        this.activity = activity;
    }

    // Convert Log instance to plain object for Firestore
    toObject() {
        return {
            date: this.date,
            from: this.from,
            activity: this.activity,
        };
    }

    // Method to display log information
    displayLog() {
        return `[${this.date}] ${this.from}: ${this.activity}`;
    }

    // Static method to create a Log instance from Firestore data
    static fromFirestore(doc) {
        if (!doc.exists()) {
            throw new Error('Log document does not exist.');
        }

        const data = doc.data();
        return new Log({
            date: data.date,
            from: data.from,
            activity: data.activity,
        });
    }
}

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
        toast(activity);
    } catch (error) {
        console.error("Error adding log: ", error);
    }
};

// Function to get all logs from Firestore
export const getAllLogs = async () => {
    try {
        // Get a reference to the "logs" collection
        const logCollection = collection(db, tbName);

        // Get all the documents in the collection
        const logSnapshot = await getDocs(logCollection);

        // Map through the documents and convert them into Log instances
        const logs = logSnapshot.docs.map(doc => Log.fromFirestore(doc));

        console.log('All logs:', logs);

        return logs; // Return the array of Log instances
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error; // Propagate the error
    }
};
