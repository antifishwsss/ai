const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectOutput: () => ipcRenderer.invoke('select-output'),
  startCapture: (payload) => ipcRenderer.invoke('start-capture', payload),
  onLog: (callback) => ipcRenderer.on('log', (_, message) => callback(message))
});
