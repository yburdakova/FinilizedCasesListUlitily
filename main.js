import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { scanAndCollectCases, exportToCSV } from './scanAndExport.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const folderPath = result.filePaths[0];
  const caseData = await scanAndCollectCases(folderPath);
  const folderName = path.basename(folderPath);
  const firstWord = folderName.split(' ')[0].toLowerCase();
  const caseTypeId = firstWord === 'criminal' ? 1 : 2;

  const csvPath = exportToCSV(caseData, folderPath, caseTypeId);

  return csvPath;
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
