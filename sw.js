/// <reference lib="WebWorker" />
import { fail, fetchData, getAffirmation, getRandomAffirmationIndex, log } from "./tools.js";
export {};


const AFFIRMATION_TIMEOUT = 3600_000 * 8;

const _self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

const dataPromise = fetchData("de-selbstliebe-100");

/** @type {"deactivated" | "active"} */
let state = "deactivated";

/** @type {number | undefined} */
let nextAffirmation = undefined;

/** @type {number | undefined} */
let affirmationHandle = undefined;

/**
 * @param {number} [index] 
 * @param {number} [timeout] 
 */
const setupNextAffirmation = (index, timeout=0) => {
  clearTimeout(affirmationHandle);
  nextAffirmation = Date.now() + timeout;
  void sendToAllWindows({type: "affirmationUpdate", nextAffirmation});
  affirmationHandle = setTimeout(async () => {
    await showAffirmation(await dataPromise, index);
    setupNextAffirmation(undefined, AFFIRMATION_TIMEOUT);
  }, timeout);
}

const activate = () => {
  if(state === "active") return;

  state = "active";
  void sendToAllWindows({type: "stateUpdate", state});
  _self.registration.showNotification(
    "Affirmator", {
    body: `Aktiviert`,
    tag: "affirmator-state",
  });

  setupNextAffirmation(undefined, 0);
}

const deactivate = async () => {
  if(state === "deactivated") return;

  state = "deactivated";
  clearTimeout(affirmationHandle);
  affirmationHandle = undefined;
  void sendToAllWindows({type: "stateUpdate", state});
  nextAffirmation = undefined;
  void sendToAllWindows({type: "affirmationUpdate", nextAffirmation});
  await closeNotifications();

  _self.registration.showNotification(
    "Affirmator", {
      body: "Deaktiviert",
      tag: "affirmator-state",
  });
}

/** @type {(ev: NotificationEvent) => Promise<void>} */
const notificationHandler = async (event) => {
  if(event.notification.tag !== "affirmator-affirmation") return;
  if(state === "deactivated") return;

  if (event.action === "again") {
    showAffirmation(await dataPromise);
    log("action", "again");
  }
  else if (event.action === "stop") {
    event.notification.close();
    deactivate();
    log("action", "stop");
  }
};

_self.onnotificationclick = notificationHandler;  
_self.onnotificationclose = notificationHandler;


/** @type {(ev: ExtendableMessageEvent) => void} */
_self.onmessage = (ev) => {
  if(typeof ev.data !== "object" || ev.data === null) fail("Can not handle non-object or nullish message!");
  const data = /** @type {import("./communication.js").MessageToServiceWorker} */ (ev.data);
  
  if(data.type === "activate") activate();
  else if(data.type === "deactivate") deactivate();
  else if(data.type === "init") {
    sendToEventSender(ev, {"type": "affirmationUpdate", nextAffirmation});
    sendToEventSender(ev, {"type": "stateUpdate", state});
  }
  else fail(`Can not handle message with type ${/** @type {any} */ (data).type}`);
}

/** @type {(ev: ErrorEvent) => void} */
_self.onerror = (ev) => {
  console.error(ev);
  log("error", encodeURI(JSON.stringify(ev)))
};
/** @type {(ev: ExtendableMessageEvent) => void} */
_self.onmessageerror = (ev) => {
  console.error(ev);
  log("error", encodeURI(JSON.stringify(ev)))
};
/**
 * @param {import("./affirmation-data.js").AffirmationData} data 
 * @param {number} [index] 
*/
async function showAffirmation(data, index=getRandomAffirmationIndex(data)) {
  const phrase = getAffirmation(data, index);
  log("show", String(index));
  /** @satisfies {import("./communication.js").AffirmationAction[]} */
  const affirmationActions = [
    { action: "again", title: "Noch eine" },
    { action: "stop", title: "Stop" },
  ];
  _self.registration.showNotification(
    "Affirmator", {
      body: phrase,
      data: {index},
      // @ts-expect-error no typedef for actions yet!
      actions: affirmationActions,
      tag: "affirmator-affirmation",
  });
}

/**
 * @param {GetNotificationOptions | undefined} [filter]
 */
async function closeNotifications(filter) {
  const openNotifications = await _self.registration.getNotifications(filter);
  openNotifications.map(n => n.close());
}
/** @param {import("./communication.js").MessageToClient} message */
async function sendToAllWindows(message) {
  const clients = await _self.clients.matchAll({type: "window", includeUncontrolled: true});
  clients.map(c => c.postMessage(message));
}
/** 
 * @param {ExtendableMessageEvent} ev
 * @param {import("./communication.js").MessageToClient} message
 */
async function sendToEventSender(ev, message) {
  ev.source?.postMessage(message);
}