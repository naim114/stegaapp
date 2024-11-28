const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("node:path");
const waitOn = require("wait-on");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");

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
        // Wait for the React server to be ready
        await waitOn({ resources: ["http://localhost:3000"] });
        win.loadURL("http://localhost:3000");
    } catch (error) {
        console.error("Error: Failed to load React server", error);
        win.loadFile("fallback.html"); // Optionally load a fallback page
    }
}

app.whenReady().then(() => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const firebaseApiUrl = 'identitytoolkit.googleapis.com';
        if (details.url.includes(firebaseApiUrl)) {
            // Skip modifying headers for Firebase API
            callback({ responseHeaders: details.responseHeaders });
            return;
        }

        const allowedOrigin = 'http://127.0.0.1:3000';
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Access-Control-Allow-Origin': [allowedOrigin],
                'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'Access-Control-Allow-Headers': ['Content-Type', 'Authorization'],
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
    console.error("Error adding log: ", error);
});

// IPC Listener for Adding User
ipcMain.on("firebase:add-user", async (event, userData) => {
    try {
        await db.collection("users").add(userData);
        event.reply("firebase:data-received", "User added successfully!");
    } catch (error) {
        event.reply("firebase:data-received", `Error: ${error.message}`);
    }
});
