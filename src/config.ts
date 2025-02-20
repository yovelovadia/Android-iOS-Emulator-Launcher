import {workspace} from 'vscode';
import os from 'os';
import path from "path";

let config = workspace.getConfiguration('emulatorManage');

workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('emulatorManage')) {
    config = workspace.getConfiguration('emulatorManage');
  }
});

export const isWSL = () => {
  if (process.platform !== 'linux') {return false;}
  const release = os.release().toLowerCase();
  return release.includes('microsoft') || release.includes('wsl');
};

export const getEmulatorPath = () => {
  return config.get('emulatorPath') as string;
};

export const getIosPath = () => {
  return config.get('simulatorPath') as string;
};

export const getAdbPath = (): string => { 
  const androidSdkPath = process.env.ANDROID_SDK_ROOT || path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");
  return path.join(androidSdkPath, "platform-tools", "adb");
};