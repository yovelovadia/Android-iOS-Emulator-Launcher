import {workspace} from 'vscode';
import os from 'os';
import path from "path";

let config = workspace.getConfiguration('devicesManage');

workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('devicesManage')) {
    config = workspace.getConfiguration('devicesManage');
  }
});

export const isWSL = () => {
  if (process.platform !== 'linux') {return false;}
  const release = os.release().toLowerCase();
  return release.includes('microsoft') || release.includes('wsl');
};

export const getEmulatorPath = () => {
  const pathMac = config.get('emulatorPathMac');
  const pathLinux = config.get('emulatorPathLinux');
  const pathWindows = config.get('emulatorPathWindows');
  const pathWSL = config.get('emulatorPathWSL');

  if (process.platform === 'darwin' && pathMac) {
    
    return pathMac;
  }
  if (process.platform === 'linux' && !isWSL() && pathLinux) {
    return pathLinux;
  }
  if (process.platform.startsWith('win') && pathWindows) {
    return pathWindows;
  }
  if (isWSL() && pathWSL) {
    return pathWSL;
  }
  return config.get('emulatorPath');
};

export const getIosPath = () => {
  return config.get('simulatorPath') as string;
};

export const getAdbPath = (): string => { 
  let androidSdkPath: string;

  if (process.env.ANDROID_SDK_ROOT) {
    androidSdkPath = process.env.ANDROID_SDK_ROOT;
  } else {
    const platform = os.platform();
    if (platform === 'win32') {
      androidSdkPath = path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");
    } else if (platform === 'darwin') {
      androidSdkPath = path.join(os.homedir(), "Library", "Android", "sdk");
    } else {
      androidSdkPath = path.join(os.homedir(), "Android", "Sdk");
    }
  }

  return path.join(androidSdkPath, "platform-tools", "adb");
};