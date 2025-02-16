const vscode = acquireVsCodeApi();

let imageUris = {};

const emulatorsContainer = document.getElementById("android-emulators-container");

// On load, request the list of emulators
vscode.postMessage({ command: "getEmulators" });
// Get the images
vscode.postMessage({ command: "getImageUris" });

setInterval(() => {
  vscode.postMessage({ command: "getEmulators" });
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
        <button id="killEmulator${labelSuffix}" class="actionButton killEmulatorButton">◯</button>
        <button id="coldBootEmulator${labelSuffix}" class="actionButton coldBootEmulatorButton">⭮</button>
        <button id="startEmulator${labelSuffix}" class="actionButton startEmulatorButton">▷</button>
      </div>
  `;

    emulatorsContainer.appendChild(emulatorCard);

    const startEmulatorButton = document.getElementById(`startEmulator${labelSuffix}`);
    const killEmulatorButton = document.getElementById(`killEmulator${labelSuffix}`);
    const coldBootEmulatorButton = document.getElementById(`coldBootEmulator${labelSuffix}`);
    
    startEmulatorButton.addEventListener("click", () => startEmulator(emulator));
    killEmulatorButton.addEventListener("click", () => killEmulator(emulator));
    coldBootEmulatorButton.addEventListener("click", () => startEmulator(emulator, true));
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
    case "setEmulators":
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

const startEmulator = (emulator, isColdBoot = false) => {
  vscode.postMessage({ command: "startEmulator", emulator, isColdBoot });
};

const killEmulator = (emulator) => {
  vscode.postMessage({ command: "killEmulator", emulator });
};

const getLogs = (emulator) => {
  vscode.postMessage({ command: "getLogs", emulator });
};
