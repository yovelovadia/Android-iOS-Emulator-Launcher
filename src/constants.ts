export const packagePrefix = "device-android-ios-launcher";

export const IOS_COMMANDS = {
  LIST_SIMULATORS: "xcrun simctl list --json devices",
  BOOT_SIMULATOR: "xcrun simctl boot ",
  DEVELOPER_DIR: "xcode-select -p",
  SIMULATOR_APP: "/Applications/Simulator.app ",
  SIMULATOR_ARGS: " --args -CurrentDeviceUDID ",
  SHUTDOWN_SIMULATOR: "xcrun simctl shutdown ",
};
