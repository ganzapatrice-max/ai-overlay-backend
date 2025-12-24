const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld("ai", {
  paste(text) {
    clipboard.writeText(text);
  }
});
