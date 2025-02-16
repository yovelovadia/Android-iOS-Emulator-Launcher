import { window } from "vscode";
import { getPath, isWSL } from "./config";
import path from "path";
import { runCmd, runCmdSpawn } from "./utils";
import os from "os";
import { IEmulator } from "./types";

const getEmulatorPath = (androidPath: string) => {
  const emulatorPath = path.join(androidPath, "emulator");

  if (isWSL()) {
    return `${emulatorPath}.exe`;
  }

  if (process.platform.startsWith("win")) {
    return `${emulatorPath}`;
  }

  return `${emulatorPath}`;
};

const getAdbPath = (): string => { 
  const androidSdkPath = process.env.ANDROID_SDK_ROOT || path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");
  return path.join(androidSdkPath, "platform-tools", "adb");
};


const getDeviceDetails = async (emulator:IEmulator, runningDevices:string[]) => {
  const deviceDetails = {isRunning: false, instanceId: ''};
  
  for (const id of runningDevices) {
    const deviceString = await runCmd(`${getAdbPath()} -s ${id} emu avd name`);
    if (typeof deviceString === "string" && deviceString.split('\r')[0] === emulator.label) {
      deviceDetails.isRunning = true;
      deviceDetails.instanceId = id;
      break;
    }
  }

  return deviceDetails;
};


export const getAndroidEmulators = async (): Promise<IEmulator[]> => {
  const androidPath = getPath();

  const allDevicesString = await runCmd(`${getEmulatorPath(androidPath)} -list-avds`.replace("~", os.homedir()));
  const runningDevicesString = await runCmd(`${getAdbPath()} devices`);

  if (typeof allDevicesString === "string") {
    const allDevices = allDevicesString.trim().split("\r\n");

    const response:IEmulator[] =  allDevices.map((emulator) => ({ label: emulator, isRunning: false, instanceId: '' }));

    if (typeof runningDevicesString === "string") {
      const runningDevices = runningDevicesString.split("\n").slice(1).map((line) => line.split("\t")[0]).filter((id) => id.startsWith("emulator-"));

      for (const emulator of response) {
        const deviceDetails = await getDeviceDetails(emulator, runningDevices);
        emulator.isRunning = deviceDetails.isRunning;
        emulator.instanceId = deviceDetails.instanceId;
      }
    }

    return response;
  }

  window.showErrorMessage("No Android emulators found. Please check if you have any emulators installed.");

  return [];
};

export const runAndroidEmulator = async (emulator: IEmulator, isColdBoot: boolean) => {
  const androidPath = getPath();
  if(emulator.isRunning && isColdBoot) {
    await killAndroidEmulator(emulator);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  const command = `${getEmulatorPath(androidPath)} -avd ${emulator.label} ${isColdBoot ? "-no-snapshot-load" : ""}`.replace("~", os.homedir());
  await runCmd(command);
};

export const killAndroidEmulator = async (emulator: IEmulator) => {
  const adbPath = getAdbPath();
  
  await runCmd(`${adbPath} -s ${emulator.instanceId} emu kill`);
};

export const streamAndroidLogs = async (emulator: string, onData: (data: string) => void) => {
  const adbPath = getAdbPath();

  runCmdSpawn(adbPath, ["-s", emulator, "logcat"], onData);
};
  
