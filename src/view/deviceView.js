const vscode = acquireVsCodeApi();

let imageUris = {};

const emulatorsContainer = document.getElementById("android-emulators-container");

// On load, request the list of emulators
vscode.postMessage({ command: "getDevices" });
// Get the images
vscode.postMessage({ command: "getImageUris" });

setInterval(() => {
  vscode.postMessage({ command: "getDevices" });
}, 3000);

const renderEmulatorCard = (emulator, index) => {
  const emulatorCard = document.createElement("div");
  const labelSuffix = `-${emulator.label.replace(/[\s_]/g, '-')}-${index}`;
  
  emulatorCard.classList.add("emulatorCard");
  
  if (emulator.isRunning) {
    emulatorCard.classList.add("running");
  }

  emulatorCard.innerHTML = `
      <div class="detailsContainer">
        <img class="deviceTypeImage" src="${imageUris["android.svg"]}" alt="android" />
        <span>${emulator.label.replaceAll('_',' ')}</span>
      </div>
      <div class="actionsContainer">
        <button id="killDevice${labelSuffix}" title="Kill" class="actionButton killDeviceButton">▢</button>
        <button id="coldBootEmulator${labelSuffix}" title="Cold Boot" class="actionButton coldBootEmulatorButton">⭮</button>
        <button id="startDevice${labelSuffix}" title="Start" class="actionButton startDeviceButton">▷</button>
      </div>
  `;

    emulatorsContainer.appendChild(emulatorCard);

    const startDeviceButton = document.getElementById(`startDevice${labelSuffix}`);
    const killDeviceButton = document.getElementById(`killDevice${labelSuffix}`);
    const coldBootEmulatorButton = document.getElementById(`coldBootEmulator${labelSuffix}`);
    
    startDeviceButton.addEventListener("click", () => startDevice(emulator));
    killDeviceButton.addEventListener("click", () => killDevice(emulator));
    coldBootEmulatorButton.addEventListener("click", () => startDevice(emulator, true));
};

const handleRenderEmulatorsCards = (emulators) => {
  emulatorsContainer.innerHTML = "";

  emulators.forEach((emulator, index) => {
    renderEmulatorCard(emulator, index);
  });
};

window.addEventListener("message", (event) => {
  const message = event.data;
  console.log("message happened", event.data);

  switch (message.command) {
    case "setAvailableDevices":
      handleRenderEmulatorsCards(message.androidEmulators);
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

const startDevice = (emulator, isColdBoot = false) => {
  vscode.postMessage({ command: "startDevice", emulator, isColdBoot });
};

const killDevice = (emulator) => {
  vscode.postMessage({ command: "killDevice", emulator });
};

const getLogs = (emulator) => {
  vscode.postMessage({ command: "getLogs", emulator });
};
