// @ts-check
/** @returns {never} */
export function fail(message="unexpected nullish value!") {
    throw new Error(message);
}
export function randomIntFromInterval(min=0, max=10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}