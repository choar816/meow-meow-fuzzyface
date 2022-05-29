/***
 * @param {Number} value
 * @param {Number} lo
 * @param {Number} hi
 * @returns {number} A number in the range [lo, hi]
 * @type Number
 */
export function clamp(value, lo, hi) {
    return Math.min(Math.max(value, lo), hi);
}