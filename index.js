// @ts-check
import { D_affirmation, D_error } from "./elements.js";
import {fetchData, getAffirmation, getRandomAffirmationIndex, log} from "./tools.js";

/** @type {(ev: string | Event) => void} */
window.onerror = (ev) => {
  console.error(ev);
  const str = JSON.stringify(ev);
  D_error.textContent = str;
  log("error", encodeURI(str))
};
/** @type {(ev: MessageEvent) => void} */
window.onmessageerror = (ev) => {
  console.error(ev);
  const str = JSON.stringify(ev);
  D_error.textContent = str;
  log("error", encodeURI(str))
};


const showAffirmation = async () => {
    const data = await fetchData("de-selbstliebe-100");
    const index = getRandomAffirmationIndex(data);
    const phrase = getAffirmation(data, index);
    
    D_affirmation.textContent = phrase;
};

void showAffirmation();

if(navigator.serviceWorker) import("./initNotifications.js");