import { D_state, D_disableNotifications, D_enableNotifications, D_nextAffirmation } from "./elements.js";
import { fail, log } from "./tools.js";

void navigator.serviceWorker.register("./sw.js", { scope: "./", type: "module"});

/** @type {(ev: MessageEvent<import("./communication.js").MessageToClient>) => void} */
navigator.serviceWorker.onmessage = (ev) => {
    if(ev.data.type === "affirmationUpdate") D_nextAffirmation.textContent = ev.data.nextAffirmation ? new Date(ev.data.nextAffirmation).toLocaleString() : "-";
    if(ev.data.type === "stateUpdate") D_state.textContent = ev.data.state;
}

void sendMessageToServiceWorker({type: "init"});


D_enableNotifications.onclick = async () => void notificationPermission()
    .then(() => sendMessageToServiceWorker({type: "activate"}))
    .then(() => log("state", "activate"));
D_disableNotifications.onclick = () => void sendMessageToServiceWorker({type: "deactivate"})
    .then(() => log("state", "deactivate"));


/**
 * @param {import("./communication.js").MessageToServiceWorker} message 
 */
async function sendMessageToServiceWorker(message) {
    const registration = await navigator.serviceWorker.ready;
    if(!registration.active) fail("No active ServiceWorker");
    registration.active.postMessage(message);
}

async function notificationPermission() {
    const result = await Notification.requestPermission();
    if (result === "denied") throw new Error("Notifications denied!");
}