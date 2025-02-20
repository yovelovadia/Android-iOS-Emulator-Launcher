import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getAndroidEmulators, killAndroidEmulator, runAndroidEmulator, streamAndroidLogs } from "./android";
import { IEmulator } from "./types";
import { getIOSSimulators } from "./ios";

export class EmulatorViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "emulatorView";

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    this.handleReceivedMessages(webviewView);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const htmlPath = path.join(this._extensionUri.fsPath, "src", "emulatorView.html");
    let htmlContent = fs.readFileSync(htmlPath, "utf8");

    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "emulatorView.css"));
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "emulatorView.js"));
    const resetCssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
    const vscodeCssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));

    // Vscode must accept the css and js files like this
    htmlContent = htmlContent.replace("emulatorView.css", cssUri.toString());
    htmlContent = htmlContent.replace("emulatorView.js", jsUri.toString());
    htmlContent = htmlContent.replace("../media/reset.css", resetCssUri.toString());
    htmlContent = htmlContent.replace("../media/vscode.css", vscodeCssUri.toString());

    return htmlContent;
  }

  private setImageUris(webviewView: vscode.WebviewView) {
    // Read the images directory and create the URIs object
    const imagesDir = path.join(this._extensionUri.fsPath, "images");
    const imageFiles = fs.readdirSync(imagesDir);
    const imageUris = imageFiles.reduce((uris: { [key: string]: string }, file: string) => {
      uris[file] = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "images", file)).toString();
      return uris;
    }, {});

    webviewView.webview.postMessage({ command: "setImageUris", imageUris });
  }

  private async sendEmulatorsSimulators(webviewView: vscode.WebviewView) {
    const androidEmulators = await getAndroidEmulators();
    webviewView.webview.postMessage({ command: "setEmulators", androidEmulators});
  }

  private sendLogs(webviewView: vscode.WebviewView, emulator: IEmulator) {
    streamAndroidLogs(emulator.instanceId, (logs) => {
      webviewView.webview.postMessage({ command: "setLogs", logs });
    });
  }

  private handleReceivedMessages(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.command) {
          case "getEmulatorsSimulators":
            this.sendEmulatorsSimulators(webviewView);
            break;
          case "startEmulator":
            runAndroidEmulator(message.emulator, message.isColdBoot);
            break;
          case "killEmulator":
            killAndroidEmulator(message.emulator);
            break;
          case "getLogs":
            this.sendLogs(webviewView, message.emulator);
            break;
          case "getImageUris":
            this.setImageUris(webviewView);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
