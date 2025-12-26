const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  hideOverlay: () => ipcRenderer.send("hide-overlay"),
});

contextBridge.exposeInMainWorld("electron", {
  hideOverlay: () => ipcRenderer.send("hide-overlay"),
  saveToken: (token) => ipcRenderer.send("save-token", token),
  getToken: () => ipcRenderer.invoke("get-token"),
  logout: () => ipcRenderer.send("logout"),
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  insertText: text => ipcRenderer.send("insert-text", text),
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  insertText: (text) => ipcRenderer.send("insert-text", text),
  saveToken: (token) => ipcRenderer.send("save-token", token),
  onSelectedText: (callback) =>
    ipcRenderer.on("selected-text", (_, text) => callback(text)),
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  hide: () => ipcRenderer.send("hide-overlay"),
});
