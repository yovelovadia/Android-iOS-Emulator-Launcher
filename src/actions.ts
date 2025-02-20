import * as vscode from "vscode";
import os from "os";
import { getAndroidEmulators, killAndroidEmulator, runAndroidEmulator } from "./android";
import { getIOSSimulators, runIOSSimulator } from "./ios";
import { IDevice } from "./types";

export class Actions {
  webviewView: vscode.WebviewView;
  device = os.platform();

  constructor(webview: vscode.WebviewView) {
    this.webviewView = webview;
  }

  public async sendAvailableDevices() {
    const androidEmulators = await getAndroidEmulators();
    const iosSimulators = this.device === "darwin" ? await getIOSSimulators() : [];

    this.webviewView.webview.postMessage({ command: "setAvailableDevices", androidEmulators, iosSimulators });
  }

  public async runDevice(device: IDevice, isColdBoot = false) {
    if (device.type === "android") {
      await runAndroidEmulator(device, isColdBoot);
    } else {
      await runIOSSimulator(device);
    }
  }

  public async killDevice(device: IDevice) {
    if (device.type === "android") {
      await killAndroidEmulator(device);
    } else {
      // await killIOSSimulator(device);
    }
  }
}
