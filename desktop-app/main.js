require("dotenv").config();

const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Store = require("electron-store");

let overlayWindow = null;
const store = new Store();

// -------------------------
// Disable GPU acceleration (fixes GPU crashes on Windows)
// -------------------------
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");

// -------------------------
// CREATE OVERLAY WINDOW
// -------------------------
function createOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) return overlayWindow;

  overlayWindow = new BrowserWindow({
    width: 520,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    show: false, // shown via shortcut
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Handle dynamic Vite port if dev server changed
  const vitePort = process.env.VITE_PORT || 5173;
  const startURL = isDev
    ? `http://localhost:${vitePort}`
    : `file://${path.join(__dirname, "renderer/dist/index.html")}`;

  overlayWindow.loadURL(startURL);

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });

  return overlayWindow;
}

// -------------------------
// APP READY
// -------------------------
app.whenReady().then(() => {
  console.log("✅ Electron ready");

  createOverlayWindow();

  // SHOW overlay
  globalShortcut.register("Control+Alt+O", () => {
    const win = createOverlayWindow();
    win.show();
    win.focus();
  });

  // HIDE overlay
  globalShortcut.register("Control+Alt+Y", () => {
    overlayWindow?.hide();
  });
});

// -------------------------
// APP LIFECYCLE
// -------------------------
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  // keep app running in background (overlay behavior)
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// -------------------------
// IPC HANDLERS
// -------------------------

// Read clipboard text
ipcMain.handle("copy-selection", () => clipboard.readText());

// Write clipboard text
ipcMain.on("insert-text", (_, text) => clipboard.writeText(text ?? ""));

// Hide overlay (from renderer UI)
ipcMain.on("hide-overlay", () => overlayWindow?.hide());

// Auth token storage
ipcMain.on("save-token", (_, token) => token && store.set("token", token));
ipcMain.handle("get-token", () => store.get("token"));
ipcMain.on("logout", () => {
  store.delete("token");
  overlayWindow?.hide();
});
