const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const waitOn = require('wait-on');

async function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    try {
        // Wait for the React server to be ready
        await waitOn({ resources: ['http://localhost:3000'] });
        win.loadURL('http://localhost:3000');
    } catch (error) {
        console.error('Error: Failed to load React server', error);
        win.loadFile('fallback.html'); // Optionally load a fallback page
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
