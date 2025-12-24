require("dotenv").config();
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Store = require("electron-store");

let overlayWindow = null;

// TRY LOADING robotjs (optional)
let robot;
try {
  robot = require("robotjs");
} catch {
  console.warn("robotjs not installed → auto-copy/paste will use fallback mode.");
}

/* -------------------------
   CREATE OVERLAY / MAIN WINDOW
------------------------- */
function createOverlayWindow() {
  if (overlayWindow) return;

  overlayWindow = new BrowserWindow({
    width: 520,
    height: 260,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const overlayPath = isDev
    ? "http://localhost:5173"                       // Single React app in dev
    : path.join(__dirname, "renderer", "dist", "index.html"); // Prod build

  overlayWindow.loadURL(overlayPath).catch(() => {
    overlayWindow.loadFile(overlayPath);
  });

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

/* -------------------------
   COPY SELECTED TEXT
------------------------- */
async function copySelectedText() {
  try {
    if (robot) {
      robot.keyTap("c", process.platform === "darwin" ? "command" : "control");
      await new Promise((r) => setTimeout(r, 80));
    }
    return clipboard.readText();
  } catch (err) {
    console.error("Copy error:", err);
    return "";
  }
}

/* -------------------------
   OPEN OVERLAY WITH TEXT
------------------------- */
async function openOverlayWithSelection() {
  const store = new Store();
  const token = store.get("token");

  if (!token) {
    // No token → app will show login automatically via React state
    createOverlayWindow();
    return;
  }

  if (!overlayWindow) createOverlayWindow();
  overlayWindow.show();
  overlayWindow.focus();

  const text = await copySelectedText();
  overlayWindow.webContents.send("selected-text", text || "");
}

/* -------------------------
   ELECTRON APP READY
------------------------- */
app.whenReady().then(() => {
  console.log("Electron app ready.");

  createOverlayWindow(); // Single window handles login/dashboard

  // Global hotkeys
  globalShortcut.register("Control+Alt+Super+S", openOverlayWithSelection);
  globalShortcut.register("Control+Alt+Super+H", () => overlayWindow?.hide());
  globalShortcut.register("Control+Alt+Super+O", () => {
    if (!overlayWindow) createOverlayWindow();
    overlayWindow.show();
    overlayWindow.focus();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createOverlayWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

/* -------------------------
   IPC HANDLERS
------------------------- */
ipcMain.handle("copy-selection", copySelectedText);

ipcMain.on("insert-text", (e, text) => {
  clipboard.writeText(text);
  if (robot) {
    robot.keyTap("v", process.platform === "darwin" ? "command" : "control");
  }
});

ipcMain.on("hide-overlay", () => overlayWindow?.hide());
ipcMain.on("close-overlay", () => {
  overlayWindow?.close();
  overlayWindow = null;
});

ipcMain.on("login-success", (e, token) => {
  const store = new Store();
  store.set("token", token);

  // App will react to token automatically
});
