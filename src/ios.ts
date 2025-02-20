import { window } from 'vscode';
import { runCmd } from './utils';
import { IOS_COMMANDS } from './constants';
import { IDevice, IListSimulatorsResponse } from './types';
import { getIosPath } from './config';

export const getIOSSimulators = async () => {
  try {
    const res = await runCmd(IOS_COMMANDS.LIST_SIMULATORS) as string;
    const { devices } = JSON.parse(res) as IListSimulatorsResponse;

    let simulators:IDevice[] = [];

    for (const key in devices) {
      for (const device of devices[key]) {
        if(device.isAvailable){
          simulators.push({
            instanceId: device.udid,
            label: device.name,
            isRunning: device.state === 'Booted' || device.state === 'Booting',
            type: 'ios'
          });
        }
        }
    }

    return simulators;
  } catch (e) {
    window.showErrorMessage(
      `Error fetching your iOS simulators! Make sure you have Xcode installed. Try running this command: ${IOS_COMMANDS.LIST_SIMULATORS}`,
    );
    return false;
  }
};

export const runIOSSimulator = async (simulator:IDevice) => {
  try {
    const xcodePath = await runCmd(IOS_COMMANDS.DEVELOPER_DIR) as string;

    const developerDir = getIosPath() || xcodePath.trim() + IOS_COMMANDS.SIMULATOR_APP;

    // if (simulator. !== 'Booted') {
    //   // If simulator isn't running, boot it up
    //   await runCmd(IOS_COMMANDS.BOOT_SIMULATOR + simulator.instanceId);
    // }

    await runCmd('open ' + developerDir + IOS_COMMANDS.SIMULATOR_ARGS + simulator.instanceId);
    
    return;
  } catch (e) {
    return false;
  }
};