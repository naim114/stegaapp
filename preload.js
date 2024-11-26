const { contextBridge, ipcRenderer } = require('electron');

// Expose safe Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
