# Android/iOS Launcher

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/YovelOvadia.device-android-ios-launcher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A VS Code extension to launch Android and iOS emulators directly from the editor.

![Preview](./readmeVideo.gif)

## Features

- **List Available Emulators/Simulators**
- **Start, Kill, or Cold Boot Devices**
- **Supports Android Emulators & iOS Simulators**

## Installation

1. Install the extension from the VS Code Marketplace.
2. Configure the emulator/simulator paths in `settings.json` if needed.

## Configuration

Modify the settings under `devicesManage` in VS Code settings:

- `devicesManage.emulatorPath`: Path to the Android Emulator script (Windows/Linux/Mac).
- `devicesManage.emulatorPathMac`: Path to the Android Emulator script (Mac only).
- `devicesManage.devicesManage.emulatorPathLinux`: Path to the Android Emulator script (Linux only).
- `devicesManage.devicesManage.emulatorPathWindows`: Path to the Android Emulator script (Windows only).

## Inspiration

This extension is inspired by the [Emulate](https://marketplace.visualstudio.com/items?itemName=DiemasMichiels.emulate) extension by Diemas Michiels.
