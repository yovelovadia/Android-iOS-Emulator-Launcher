const vscode = acquireVsCodeApi();

let imageUris = {};

// On load, request the list of emulators
vscode.postMessage({ command: "getEmulators" });
// Get the images
vscode.postMessage({ command: "getImageUris" });

setInterval(() => {
  vscode.postMessage({ command: "getEmulators" });
}, 3000);

const renderEmulatorCard = (emulator) => {
  const emulatorCard = document.createElement("div");
  emulatorCard.classList.add("emulatorCard");
  if(emulator.isRunning) {
    emulatorCard.classList.add("running");
  }
  emulatorCard.innerHTML = `
      <div class="detailsContainer">
        <img class="deviceTypeImage" src="${imageUris['android.svg']}" alt="android" />
        <span>${emulator.label}</span>
      </div>
      <div class="actionsContainer">
        <button id="killEmulator-${emulator.label}" class="actionButton killEmulatorButton">◯</button>
        <button id="startEmulator-${emulator.label}" class="actionButton startEmulatorButton">▷</button>
      </div>
  `;


  const emulatorsContainer = document.getElementById("android-emulators-container");
  emulatorsContainer.appendChild(emulatorCard);

  const startEmulatorButton = document.getElementById(`startEmulator-${emulator.label}`);
  const killEmulatorButton = document.getElementById(`killEmulator-${emulator.label}`);

  startEmulatorButton.addEventListener("click", () => startEmulator(emulator));
  killEmulatorButton.addEventListener("click", () => getLogs(emulator));
};

const handleRenderEmulatorsCards = (emulators) => {
  const emulatorsContainer = document.getElementById("android-emulators-container");
  emulatorsContainer.innerHTML = "";

  emulators.forEach((emulator) => {
    renderEmulatorCard(emulator);
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

const startEmulator = (emulator) => {
  vscode.postMessage({ command: "startEmulator", emulator });
};

const getLogs = (emulator) => {
  vscode.postMessage({ command: "getLogs", emulator });
};
