import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const tbName = "scan_results";

export class ScanResult {
    constructor({ date = new Date().toISOString(), prediction, confidence, photoURL }) {
        this.date = date;
        this.prediction = prediction;
        this.confidence = confidence;
        this.photoURL = photoURL;
    }

    // Convert ScanResult instance to plain object for Firestore
    toObject() {
        return {
            date: this.date,
            prediction: this.prediction,
            confidence: this.confidence,
            photoURL: this.photoURL,
        };
    }

    // Method to display scan result information
    displayResult() {
        return `[${this.date}] Prediction: ${this.prediction}, Confidence: ${this.confidence}, PhotoURL: ${this.photoURL}`;
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
        });
    }
}

// Function to add a scan result to Firestore
export const addScanResult = async (prediction, confidence, file) => {
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

// Function to get scan results by prediction
export const getScanResultsByPrediction = async (prediction) => {
    try {
        const scanResultCollection = collection(db, tbName);
        const predictionQuery = query(scanResultCollection, where("prediction", "==", prediction));
        const scanResultSnapshot = await getDocs(predictionQuery);

        const results = scanResultSnapshot.docs.map(doc => ScanResult.fromFirestore(doc));
        return results;
    } catch (error) {
        console.error(`Error fetching scan results for prediction "${prediction}":`, error);
        throw error;
    }
};