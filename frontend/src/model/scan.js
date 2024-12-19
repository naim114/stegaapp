import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const tbName = "scan_results";

export class ScanResult {
    constructor({ date = new Date().toISOString(), prediction, confidence, photoURL, user }) {
        this.date = date;
        this.prediction = prediction;
        this.confidence = confidence;
        this.photoURL = photoURL;
        this.user = user;
    }

    // Convert ScanResult instance to plain object for Firestore
    toObject() {
        return {
            date: this.date,
            prediction: this.prediction,
            confidence: this.confidence,
            photoURL: this.photoURL,
            user: this.user,
        };
    }

    // Method to display scan result information
    displayResult() {
        return `[${this.date}] Prediction: ${this.prediction}, Confidence: ${this.confidence}, PhotoURL: ${this.photoURL}, User: ${this.user}`;
    }

    // Static method to create a ScanResult instance from Firestore data
    static fromFirestore(doc) {
        if (!doc.exists()) {
            throw new Error('Scan Result document does not exist.');
        }

        const data = doc.data();
        return new ScanResult({
            date: data.date,
            prediction: data.prediction,
            confidence: data.confidence,
            photoURL: data.photoURL,
            user: data.user,
        });
    }
}

// Function to add a scan result to Firestore
export const addScanResult = async (prediction, confidence, file, userEmail) => {
    try {
        // Upload the file to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `scan_results/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(snapshot.ref);

        // Get a reference to the "scan_results" collection
        const scanResultCollection = collection(db, tbName);

        // Add a new document to the "scan_results" collection
        await addDoc(scanResultCollection, {
            date: new Date().toISOString(),
            prediction,
            confidence,
            photoURL,
            user: userEmail,
        });

        console.log("Scan result added!");
        toast(`Prediction: ${prediction}, Confidence: ${confidence}`);
    } catch (error) {
        console.error("Error adding scan result: ", error);
    }
};

// Function to get all scan results from Firestore
export const getAllScanResults = async () => {
    try {
        const scanResultCollection = collection(db, tbName);
        const scanResultSnapshot = await getDocs(scanResultCollection);

        const results = scanResultSnapshot.docs.map(doc => ScanResult.fromFirestore(doc));
        return results;
    } catch (error) {
        console.error('Error fetching scan results:', error);
        throw error;
    }
};

// Function to get scan results by user
export const getScanResultsByUser = async (userEmail) => {
    try {
        const scanResultCollection = collection(db, tbName);
        const userQuery = query(scanResultCollection, where("user", "==", userEmail));
        const scanResultSnapshot = await getDocs(userQuery);

        const results = scanResultSnapshot.docs.map(doc => ScanResult.fromFirestore(doc));
        return results;
    } catch (error) {
        console.error(`Error fetching scan results for user "${userEmail}":`, error);
        throw error;
    }
};
