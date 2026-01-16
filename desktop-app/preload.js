const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Overlay controls
  hideOverlay: () => ipcRenderer.send("hide-overlay"),

  // Clipboard
  insertText: (text) => ipcRenderer.send("insert-text", text),
  copySelection: () => ipcRenderer.invoke("copy-selection"),

  // Auth / token
  saveToken: (token) => ipcRenderer.send("save-token", token),
  getToken: () => ipcRenderer.invoke("get-token"),
  logout: () => ipcRenderer.send("logout"),

  // Utility: send custom IPC messages
  send: (channel, data) => ipcRenderer.send(channel, data),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  // Listen to messages from main
  on: (channel, listener) => ipcRenderer.on(channel, listener),
});
