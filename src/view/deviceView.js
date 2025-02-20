const vscode = acquireVsCodeApi();

let imageUris = {};

const emulatorsContainer = document.getElementById("android-emulators-container");
const simulatorsContainer = document.getElementById("ios-simulators-container");

// On load, request the list of emulators
vscode.postMessage({ command: "getDevices" });
// Get the images
vscode.postMessage({ command: "getImageUris" });

setInterval(() => {
  vscode.postMessage({ command: "getDevices" });
}, 3000);

const renderDeviceCard = (device, index, container) => {
  const deviceCard = document.createElement("div");
  const labelSuffix = `-${device.label.replace(/[\s_]/g, '-')}-${index}`;

  deviceCard.classList.add("deviceCard");

  if (device.isRunning) {
    deviceCard.classList.add("running");
  }

  const image = device.type === "android" ? "android.svg" : "ios.svg";

  deviceCard.innerHTML = `
      <div class="detailsContainer">
        <img class="deviceTypeImage" src="${imageUris[image]}" alt=${device.type} />
        <span>${device.label.replaceAll('_', ' ')}</span>
      </div>
      <div class="actionsContainer">
        <button id="killDevice${labelSuffix}" title="Kill" class="actionButton">
        <img class="actionButtonImage" src="${imageUris["kill.svg"]}" alt="Kill" />
        </button>

        <button id="coldBootDevice${labelSuffix}" title="Cold Boot" class="actionButton">
        <img class="actionButtonImage" src="${imageUris["restart.svg"]}" alt="Cold Boot" />
        </button>
        
        <button id="startDevice${labelSuffix}" title="Start" class="actionButton">
        <img class="actionButtonImage" src="${imageUris["play.svg"]}" alt="Start" />
        </button>
      </div>
  `;

  container.appendChild(deviceCard);

  const startDeviceButton = document.getElementById(`startDevice${labelSuffix}`);
  const killDeviceButton = document.getElementById(`killDevice${labelSuffix}`);
  const coldBootDeviceButton = document.getElementById(`coldBootDevice${labelSuffix}`);

  startDeviceButton.addEventListener("click", () => startDevice(device));
  killDeviceButton.addEventListener("click", () => killDevice(device));
  coldBootDeviceButton.addEventListener("click", () => startDevice(device, true));
};

const handleRenderDevicesCards = ({ androidEmulators, iosSimulators }) => {
  emulatorsContainer.innerHTML = "";
  simulatorsContainer.innerHTML = "";

  androidEmulators.forEach((emulator, index) => {
    renderDeviceCard(emulator, index, emulatorsContainer);
  });

  iosSimulators.forEach((simulator, index) => {
    renderDeviceCard(simulator, index, simulatorsContainer);
  });
};

window.addEventListener("message", (event) => {
  const message = event.data;
  console.log("message happened", event.data);

  switch (message.command) {
    case "setAvailableDevices":
      handleRenderDevicesCards(message);
      break;
    case "setLogs":
      handleGetLogs(message.logs);
      break;
    case "setImageUris":
      imageUris = message.imageUris;
      break;
  }
});


const handleGetLogs = (logs) => {
  console.log("handleGetLogs", logs);
};

const startDevice = (device, isColdBoot = false) => {
  vscode.postMessage({ command: "startDevice", device, isColdBoot });
};

const killDevice = (device) => {
  vscode.postMessage({ command: "killDevice", device });
};

const getLogs = (device) => {
  vscode.postMessage({ command: "getLogs", device });
};
