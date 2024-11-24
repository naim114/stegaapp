window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    firebase: {
        sendData: (data) => ipcRenderer.send("firebase:add-user", data),
        onDataReceived: (callback) => ipcRenderer.on("firebase:data-received", callback),
    },
});
