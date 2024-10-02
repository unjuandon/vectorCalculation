// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

const testData = app
console.log('TEST DATA ==>', testData)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Cargar la aplicación de React Native
  win.loadURL('http://localhost:8081'); // Cambia el puerto si es necesario
}

try{
  app.whenReady().then(createWindow);
  console.log('Browser window loaded')
}
catch(e){
  console.log('Can not initialize the app', e)
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
