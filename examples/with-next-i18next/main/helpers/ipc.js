import { ipcMain } from "electron"
import { userStore } from "./user-store"

ipcMain.handle("setLocale", (_event, locale) => {
  userStore.set("locale", locale)
})
