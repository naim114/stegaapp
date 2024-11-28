const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("node:path");
const waitOn = require("wait-on");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");
const { error } = require("node:console");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wsm-malaysian-tourism.firebaseio.com"
});

const db = admin.firestore();

async function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    try {
        await waitOn({ resources: ["http://127.0.0.1:3000"] });
        win.loadURL("http://127.0.0.1:3000");

        win.webContents.openDevTools({ mode: 'detach' });
    } catch (error) {
        console.error("Error: Failed to load React server", error);
        win.loadFile("fallback.html");
    }


}

app.whenReady().then(() => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const firebaseApiPatterns = ['identitytoolkit.googleapis.com', 'firestore.googleapis.com'];

        // Skip modifying headers for Firebase API calls
        if (firebaseApiPatterns.some((pattern) => details.url.includes(pattern))) {
            callback({ responseHeaders: details.responseHeaders });
            return;
        }

        const allowedOrigin = 'http://127.0.0.1:3000';
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Access-Control-Allow-Origin': [allowedOrigin],
                'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, OPTIONS'],
                'Access-Control-Allow-Headers': ['Content-Type, Authorization'],
            },
        });
    });

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

console.log("Firebase Admin initialized:", db ? "Success" : "Failure");

// Test Firebase Admin SDK Initialization
db.collection("logs").add({
    date: new Date().toISOString(),
    from: "SYSTEM",
    activity: "Start project. Firebase Admin initialized: " + (db ? "Success" : "Failure"),
}).then(() => {
    console.log("Log added!");
}).catch((error) => {
    console.error("Error adding log (main): ", error);
});

// ipcMain.handle("firebase:add-user", async (_, userData) => {
//     try {
//         await db.collection("users").doc(userData.uid).set({
//             uid: userData.uid,
//             name: userData.name,
//             email: userData.email,
//             role: "USER",
//             createdAt: new Date().toISOString(),
//         });
//         return { success: true, message: "User added successfully" };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// });