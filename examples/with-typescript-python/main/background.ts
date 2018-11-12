import { app } from "electron";
import { join } from "path";
import { addPython } from "./addPython";
import { createWindow, enableHotReload } from "./helpers";

const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  enableHotReload();
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (development)`);
}

addPython();
app.on("ready", () => {
  const mainWindow = createWindow("main", {
    height: 600,
    width: 1000,
  });

  if (isProd) {
    const homeFile = join(app.getAppPath(), "app/home/index.html");
    mainWindow.loadFile(homeFile);
  } else {
    const homeUrl = "http://localhost:8888/home";
    mainWindow.loadURL(homeUrl);
    // mainWindow.webContents.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
