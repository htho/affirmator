import { fail } from "./tools.js";

export const D_error = document.querySelector("code") ?? fail();
export const D_affirmation = document.querySelector("q") ?? fail();
export const D_enableNotifications = document.getElementById("enableNotifications") ?? fail();
export const D_disableNotifications = document.getElementById("disableNotifications") ?? fail();
export const D_state = document.getElementById("state") ?? fail();
export const D_nextAffirmation = document.getElementById("nextAffirmation") ?? fail();

