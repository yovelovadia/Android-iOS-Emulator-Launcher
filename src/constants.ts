export const packagePrefix = "device-android-ios-launcher";

export const IOS_COMMANDS = {
  LIST_SIMULATORS: "xcrun simctl list --json devices",
  BOOT_SIMULATOR: "xcrun simctl boot ",
  SIMULATOR_APP_RUN: "open -a Simulator --args -CurrentDeviceUDID ",
  CHECK_SIMULATOR_RUNNING: "pgrep -x Simulator",
  SHUTDOWN_SIMULATOR: "xcrun simctl shutdown ",
};
