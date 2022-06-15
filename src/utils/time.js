export function getTimeString(time) {
  // time : 초 단위
  const hour = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor(time / 60 % 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${hour}:${minute}:${second}`;
}
