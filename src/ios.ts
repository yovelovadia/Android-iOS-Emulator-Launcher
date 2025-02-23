import { window } from "vscode";
import { runCmd } from "./utils";
import { IOS_COMMANDS } from "./constants";
import { IDevice, IListSimulatorsResponse } from "./types";

export const getIOSSimulators = async () => {
  try {
    const res = (await runCmd(IOS_COMMANDS.LIST_SIMULATORS)) as string;
    const { devices } = JSON.parse(res) as IListSimulatorsResponse;

    let simulators: IDevice[] = [];

    for (const key in devices) {
      for (const device of devices[key]) {
        if (device.isAvailable) {
          simulators.push({
            instanceId: device.udid,
            label: device.name,
            isRunning: device.state === "Booted" || device.state === "Booting",
            type: "ios",
          });
        }
      }
    }

    return simulators;
  } catch (e) {
    window.showErrorMessage(
      `Error fetching your iOS simulators! Make sure you have Xcode installed. Try running this command: ${IOS_COMMANDS.LIST_SIMULATORS}`
    );
    return false;
  }
};

const getIsSimulatorAppRunning = async () => {
  try {
    await runCmd(IOS_COMMANDS.CHECK_SIMULATOR_RUNNING);
    return true;
  } catch (e) {
    return false;
  }
};

export const runIOSSimulator = async (
  simulator: IDevice,
  isColdBoot = false
) => {
  try {
    const isSimulatorAppRunning = await getIsSimulatorAppRunning();

    if (isColdBoot && isSimulatorAppRunning) {
      await killIOSSimulator(simulator);
    }

    if (isSimulatorAppRunning) {
      await runCmd(IOS_COMMANDS.BOOT_SIMULATOR + simulator.instanceId);
    } else {
      await runCmd(IOS_COMMANDS.SIMULATOR_APP_RUN + simulator.instanceId);
    }
  } catch (e) {
    return false;
  }
};

export const killIOSSimulator = async (simulator: IDevice) => {
  try {
    await runCmd(IOS_COMMANDS.SHUTDOWN_SIMULATOR + simulator.instanceId);
  } catch (e) {
    return false;
  }
};
