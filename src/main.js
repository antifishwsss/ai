const path = require('path');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { capturePage } = require('./capture');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-output', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('start-capture', async (event, payload) => {
  const { url, outputDir } = payload || {};
  if (!url || !outputDir) {
    throw new Error('Нужно указать URL и папку для сохранения.');
  }

  const onLog = (message) => event.sender.send('log', message);
  await capturePage({ url, outputDir, onLog });
  return true;
});
