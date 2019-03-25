import { ipcMain, BrowserWindow } from 'electron';

const getResponseChannels = channel => ({
  sendChannel: `%nextron-send-channel-${channel}`,
  dataChannel: `%nextron-response-data-channel-${channel}`,
  errorChannel: `%nextron-response-error-channel-${channel}`,
});

const getRendererResponseChannels = (windowId, channel) => ({
  sendChannel: `%nextron-send-channel-${windowId}-${channel}`,
  dataChannel: `%nextron-response-data-channel-${windowId}-${channel}`,
  errorChannel: `%nextron-response-error-channel-${windowId}-${channel}`,
});

export default class ipc {
  static callRenderer(window, channel, data) {
    return new Promise((resolve, reject) => {
      const { sendChannel, dataChannel, errorChannel } = getRendererResponseChannels(window.id, channel);

      const cleanup = () => {
        ipcMain.removeAllListeners(dataChannel);
        ipcMain.removeAllListeners(errorChannel);
      };

      ipcMain.on(dataChannel, (event, result) => {
        cleanup();
        resolve(result);
      });

      ipcMain.on(errorChannel, (event, error) => {
        cleanup();
        reject(error);
      });

      if (window.webContents) {
        window.webContents.send(sendChannel, data);
      }
    });
  }

  static answerRenderer(channel, callback) {
    const { sendChannel, dataChannel, errorChannel } = getResponseChannels(channel);

    ipcMain.on(sendChannel, async (event, data) => {
      const window = BrowserWindow.fromWebContents(event.sender);

      const send = (channel, data) => {
        if (!(window && window.isDestroyed())) {
          event.sender.send(channel, data);
        }
      };

      try {
        send(dataChannel, await callback(data, window));
      } catch (error) {
        send(errorChannel, error);
      }
    });
  }

  static sendToRenderers(channel, data) {
    for (const window of BrowserWindow.getAllWindows()) {
      if (window.webContents) {
        window.webContents.send(channel, data);
      }
    }
  }
};
