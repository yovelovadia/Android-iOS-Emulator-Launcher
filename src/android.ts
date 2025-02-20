import { window } from "vscode";
import { getAdbPath, getEmulatorPath, isWSL } from "./config";
import { runCmd, runCmdSpawn } from "./utils";
import os from "os";
import { IDevice } from "./types";

const getDeviceDetails = async (emulator:IDevice, runningDevices:string[]) => {
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


export const getAndroidEmulators = async (): Promise<IDevice[]> => {
  const allDevicesString = await runCmd(`${getEmulatorPath()} -list-avds`.replace("~", os.homedir()));
  const runningDevicesString = await runCmd(`${getAdbPath()} devices`);
  
  if (typeof allDevicesString === "string") {
    const allDevices = allDevicesString.trim().split("\r\n");

    const response:IDevice[] =  allDevices.map((emulator) => ({ label: emulator, isRunning: false, instanceId: '', type: "android" }));

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

export const runAndroidEmulator = async (emulator: IDevice, isColdBoot: boolean) => {
  if(emulator.isRunning && isColdBoot) {
    await killAndroidEmulator(emulator);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  const command = `${getEmulatorPath()} -avd ${emulator.label} ${isColdBoot ? "-no-snapshot-load" : ""}`.replace("~", os.homedir());
  await runCmd(command);
};

export const killAndroidEmulator = async (emulator: IDevice) => {
  const adbPath = getAdbPath();
  
  await runCmd(`${adbPath} -s ${emulator.instanceId} emu kill`);
};

export const streamAndroidLogs = async (emulator: string, onData: (data: string) => void) => {
  const adbPath = getAdbPath();

  runCmdSpawn(adbPath, ["-s", emulator, "logcat"], onData);
};
  
