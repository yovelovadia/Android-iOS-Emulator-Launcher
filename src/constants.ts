export const packagePrefix = 'emulator-manage';

export const commands = {
  OPEN_EMULATOR_VIEW: `${packagePrefix}.openEmulatorView`,
};

export const IOS_COMMANDS = {
  LIST_SIMULATORS: 'xcrun simctl list --json devices',
  BOOT_SIMULATOR: 'xcrun simctl boot ',
  DEVELOPER_DIR: 'xcode-select -p',
  SIMULATOR_APP: '/Applications/Simulator.app ',
  SIMULATOR_ARGS: ' --args -CurrentDeviceUDID ',
};