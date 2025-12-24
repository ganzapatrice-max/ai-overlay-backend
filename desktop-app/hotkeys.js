const { globalShortcut, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let overlayWindow = null;

function createOverlay() {
  overlayWindow = new BrowserWindow({
    width: 420,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: false, preload: path.join(__dirname, "preload.js") }
  });

  overlayWindow.loadURL(
    isDev
      ? "http://localhost:3000/overlay.html"
      : `file://${path.join(__dirname, "../src/windows/overlay.html")}`
  );
}

function registerHotkeys(mainWindow) {
  // OPEN OVERLAY
  globalShortcut.register("CommandOrControl+Alt+Super+S", () => {
    mainWindow.webContents.send("check-login");
  });

  // HIDE / SHOW
  globalShortcut.register("CommandOrControl+Alt+Super+H", () => {
    if (overlayWindow) overlayWindow.hide();
  });
  globalShortcut.register("CommandOrControl+Alt+Super+O", () => {
    if (overlayWindow) overlayWindow.show();
  });
}

module.exports = { registerHotkeys, createOverlay };
