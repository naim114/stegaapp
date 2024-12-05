import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { addLog } from './log.js';

export class User {
    constructor({ uid, name, email, role = 'USER', createdAt = Date.now() }) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    // Converts a Firestore document into a User instance
    static fromFirestore(doc) {
        if (!doc.exists()) {
            throw new Error('Document does not exist.');
        }

        const data = doc.data();
        return new User({
            uid: doc.id,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
        });
    }

    // Converts a User instance into a plain object
    toObject() {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
        };
    }

    // Method to display user information
    displayInfo() {
        return `${this.name} (${this.email}) - Role: ${this.role}`;
    }
}

export const getAllUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


// Function to get a user by ID from Firestore
export const getUser = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const user = User.fromFirestore(userDoc);
            console.log(user.displayInfo());
            return user;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        addLog('System', `ERROR: Unable to fetch user ${userId} - ${error.message}`);
        throw error;
    }
};

export const updateUser = async (userId, updatedData) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, updatedData);
        console.log(`User ${userId} updated successfully.`);
        addLog('System', `User ${userId} updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
        addLog('System', `ERROR: Unable to update user ${userId} - ${error.message}`);
        throw error;
    }
};