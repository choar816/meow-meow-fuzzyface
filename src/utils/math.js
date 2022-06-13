import Config from "../Config";

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

/**
 * (x, y)로부터 r만큼 랜덤하게 떨어진(각도랜덤) 좌표 반환
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 */
export function getRandomPosition(x, y, r) {
  const randRad = Math.random() * Math.PI * 2;
  const _r =
    Math.sqrt(Config.width * Config.width + Config.height * Config.height) / 2;
  const _x = x + _r * Math.cos(randRad);
  const _y = y + _r * Math.sin(randRad);
  return [_x, _y];
}
