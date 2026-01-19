
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

export function minutesToDateTuple(minutes: number): [number, number, number] {
  let tempDuration = minutes;
  const days = Math.floor(tempDuration / (60 * 24));
  tempDuration -= days * (60 * 24);
  const hours = Math.floor(tempDuration / 60);
  const minute = tempDuration - hours * 60;

  return [days, hours, minute];
}
export function stringDuration(value: [number, number, number] | null) {
  let final = "";
  if (value === null) return final;

  const [days, hours, minutes] = value;
  if (days !== 0) {
    final += addZeroDate(days) + "d-"
  } if (hours !== 0 || days !== 0) {
    final += addZeroDate(hours) + "h-"
  }
  final += addZeroDate(minutes) + "m";

  return final
}
