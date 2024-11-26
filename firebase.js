const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wsm-malaysian-tourism.firebaseio.com',
});
const db = admin.firestore();

// Create the main Electron window
let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.loadURL('http://127.0.0.1:3000'); // Assuming React is running on 127.0.0.1:3000
};

// Handle log creation in Firestore
ipcMain.handle('add-log', async (event, log) => {
    try {
        const logsRef = db.collection('logs');
        await logsRef.add(log);
        return { success: true };
    } catch (error) {
        console.error('Error adding log:', error);
        return { success: false, error: error.message };
    }
});

// Electron app lifecycle
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
