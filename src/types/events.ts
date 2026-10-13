export interface Response {
    success: boolean;
    message: string;
  }
  
export type Builtin =
    'ready' |
    'trayMenuItemClicked' |
    'windowClose' |
    'windowFocus' |
    'windowBlur' |
    'windowFullScreenEnter' |
    'windowFullScreenExit' |
    'windowMinimize' |
    'windowRestore' |
    'windowShow' |
    'windowHide' |
    'windowMaximize' |
    'newWindowRequest' |
    'filesDropped' |
    'mainMenuItemClicked' |
    'openedFile' |
    'spawnedProcess' |
    'watchFile' |
    'serverOffline' |
    'clientConnect' |
    'clientDisconnect' |
    'appClientConnect' |
    'appClientDisconnect' |
    'extClientConnect' |
    'extClientDisconnect' |
    'extensionReady' |
    'neuDev_reloadApp'
