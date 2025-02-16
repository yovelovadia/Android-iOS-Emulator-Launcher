// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { commands } from "./constants";
import { EmulatorViewProvider } from "./EmulatorsViewProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const emulatorIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  emulatorIcon.command = commands.OPEN_EMULATOR_VIEW;
  emulatorIcon.text = "Android Emulator";
  emulatorIcon.show();

  const emulatorViewProvider = new EmulatorViewProvider(context.extensionUri);

  const webviewProvider = vscode.window.registerWebviewViewProvider(EmulatorViewProvider.viewType, emulatorViewProvider);

  context.subscriptions.push(webviewProvider);
  context.subscriptions.push(emulatorIcon);
}

// This method is called when your extension is deactivated
export function deactivate() {}
