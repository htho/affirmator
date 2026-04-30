// @ts-check
/** @returns {never} */
export function fail(message="unexpected nullish value!") {
    throw new Error(message);
}
export function randomIntFromInterval(min=0, max=10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchData(dataset="") {
    /** @type {import("./affirmation-data").AffirmationData} */
    const data = await fetch(`./data/${dataset}.json`).then(response => response.json());
    // const data = await import(`./data/${dataset}.json`, {with: {type: "json"}}).then(m => m.default);
    
    if(data.type !== "affirmator-data") fail("Data not affirmator-data!");
    if(data.version !== 0) fail("Data not version 0!");
    
    return data;
}

/**
 * @param {import("./affirmation-data").AffirmationData} data 
 * @param {number} index
 */
export function getAffirmation(data, index) {
    return data.phrases[index] ?? fail();
}
/**
 * @param {import("./affirmation-data").AffirmationData} data 
 */
export function getRandomAffirmationIndex(data) {
    return randomIntFromInterval(0, data.phrases.length-1);
}

/** @type {(type: string, value: string) => void} */
export const log = (type, value) => {
    setTimeout(() => void fetch(`log?${type}=${value}`, {keepalive: false, priority: "low"}));
};
