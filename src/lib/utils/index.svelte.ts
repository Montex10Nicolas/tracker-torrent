
export function uptimeNeeded(size: number) {
  let hours = 0;
  if (size === null || size === undefined) {
    return null;
  }
  if (size <= 1) {
    hours = 72;
  }
  if (size > 1 && size < 50) {
    hours = 72 + 2 * size;
  }
  if (size >= 50) {
    hours = 100 * Math.log(size) - 219.2023;
  }
  return Math.ceil(hours * 60);
}
export function addZeroDate(value: number) {
  return String(value).padStart(2, "0");
}
