export interface Response {
    success: boolean;
    message: string;
  }
  
  export type Builtin =
      'ready' |
      'trayMenuItemClicked' |
      'windowClose' |
      'serverOffline' |
      'clientConnect' |
      'clientDisconnect' |
      'appClientConnect' |
      'appClientDisconnect' |
      'extClientConnect' |
      'extClientDisconnect' |
      'extensionReady' |
      'neuDev_reloadApp'