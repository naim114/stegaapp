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
