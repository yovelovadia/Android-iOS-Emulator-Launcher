import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { Actions } from "./actions";

export class DeviceViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "deviceView";
  private actions!: Actions;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    this.actions = new Actions(webviewView);
    this.handleReceivedMessages(webviewView);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const htmlPath = vscode.Uri.file(
      path.join(this._extensionUri.fsPath, "src", "view", "deviceView.html")
    );

    let htmlContent = fs.readFileSync(htmlPath.fsPath, "utf8");

    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "view", "deviceView.css")
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "view", "deviceView.js")
    );
    const resetCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const vscodeCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Vscode must accept the css and js files like this
    htmlContent = htmlContent.replace("deviceView.css", cssUri.toString());
    htmlContent = htmlContent.replace("deviceView.js", jsUri.toString());
    htmlContent = htmlContent.replace(
      "../media/reset.css",
      resetCssUri.toString()
    );
    htmlContent = htmlContent.replace(
      "../media/vscode.css",
      vscodeCssUri.toString()
    );

    return htmlContent;
  }

  private setImageUris(webviewView: vscode.WebviewView) {
    // Read the images directory and create the URIs object
    const imagesDir = path.join(this._extensionUri.fsPath, "images");
    const imageFiles = fs.readdirSync(imagesDir);
    const imageUris = imageFiles.reduce(
      (uris: { [key: string]: string }, file: string) => {
        uris[file] = webviewView.webview
          .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "images", file))
          .toString();
        return uris;
      },
      {}
    );

    webviewView.webview.postMessage({ command: "setImageUris", imageUris });
  }

  private handleReceivedMessages(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.command) {
          case "getDevices":
            this.actions.sendAvailableDevices();
            break;
          case "startDevice":
            this.actions.runDevice(message.device, message.isColdBoot);
            break;
          case "killDevice":
            this.actions.killDevice(message.device);
            break;
          // case "getLogs":
          //   this.sendLogs(webviewView, message.emulator);
          //   break;
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
