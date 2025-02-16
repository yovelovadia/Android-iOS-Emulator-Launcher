import {workspace} from 'vscode';
import os from 'os';

let config = workspace.getConfiguration('emulatorPreview');

workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('emulatorPreview')) {
    config = workspace.getConfiguration('emulatorPreview');
  }
});

export const isWSL = () => {
  if (process.platform !== 'linux') {return false;}
  const release = os.release().toLowerCase();
  return release.includes('microsoft') || release.includes('wsl');
};

export const getPath = () => {
  return config.get('emulatorPath') as string;
};