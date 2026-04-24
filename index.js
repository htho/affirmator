// @ts-check
import {fail, randomIntFromInterval} from "./tools.js";

const D_error = document.querySelector("code") ?? fail();
const D_affirmation = document.querySelector("q") ?? fail();

try {
    const data = await fetchData("de-selbstliebe-100");
    const index = randomIntFromInterval(0, data.phrases.length);
    const phrase = data.phrases[index] ?? fail();
    D_affirmation.textContent = phrase;
} catch (error) {
    D_error.textContent = String(error);
}

async function fetchData(dataset="") {
    /** @type {{type: "affirmator-data", version: 0, name: string, phrases: string[], sources: string[]}} */
    const data = await import(`./data/${dataset}.json`, {with: {type: "json"}}).then(m => m.default);
    if(data.type !== "affirmator-data") fail("Data not affirmator-data!");
    if(data.version !== 0) fail("Data not version 0!");
    return data;
}