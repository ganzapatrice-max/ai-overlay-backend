require("dotenv").config();
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Store = require("electron-store");

let overlayWindow;

/* -------------------------
   CREATE OVERLAY WINDOW
------------------------- */
function createOverlayWindow() {
  if (overlayWindow) return;

  overlayWindow = new BrowserWindow({
    width: 520,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const url = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "renderer/dist/index.html")}`;

  overlayWindow.loadURL(url);
  overlayWindow.hide();
}

/* -------------------------
   APP READY
------------------------- */
app.whenReady().then(() => {
  createOverlayWindow();

  globalShortcut.register("Control+Shift+A", () => {
    overlayWindow.isVisible()
      ? overlayWindow.hide()
      : overlayWindow.show();
  });
});

/* -------------------------
   IPC
------------------------- */
ipcMain.on("hide-overlay", () => overlayWindow.hide());
