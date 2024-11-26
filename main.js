const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const http = require('http');

// Function to check if the React dev server is running
const isDevServerRunning = (url) =>
    new Promise((resolve) => {
        const request = http.get(url, () => {
            resolve(true);
            request.destroy();
        });

        request.on('error', () => resolve(false));
    });

// Function to wait for the React dev server to be ready
const waitForReactDevServer = async (url, retries = 10, interval = 1000) => {
    for (let i = 0; i < retries; i++) {
        if (await isDevServerRunning(url)) return true;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
};

// Function to create the main application window
const createWindow = async () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Keeps the context isolated for security
        },
    });

    const devServerUrl = 'http://127.0.0.1:3000';

    // Check if the React dev server is ready
    const serverReady = await waitForReactDevServer(devServerUrl);

    // Load React dev server or fallback to a local HTML file
    if (serverReady) {
        mainWindow.loadURL(devServerUrl);
    } else {
        mainWindow.loadFile(path.join(__dirname, 'fallback.html'));
    }

    // Open developer tools in a detached window
    mainWindow.webContents.openDevTools({ mode: 'detach' });
};

// Add CORS Headers using the Electron `session` module
app.on('ready', () => {
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

    // Create the main window
    createWindow();
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Recreate a window when the app is re-activated (macOS specific behavior)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
