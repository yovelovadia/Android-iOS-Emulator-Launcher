export interface IEmulator {
  instanceId: string;
  label: string;
  isRunning: boolean;
}

export interface ISimulatorRaw {
  dataPath: string;
  dataPathSize: number;
  logPath: string;
  udid: string;
  isAvailable: boolean;
  deviceTypeIdentifier: string;
  state: "Booted" | "Shutdown" | "Creating" | "Booting" | "Shutting Down";
  name: string;
}

export interface IListSimulatorsResponse {
  devices: {
    [key: string]: ISimulatorRaw[];
  };
}