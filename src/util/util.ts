import { COLOR } from "../type"

export function lerpColor(start: COLOR, end: COLOR, percent: number): COLOR {
  const red = start[0] * (1 - percent) + end[0] * (percent)
  const green = start[1] * (1 - percent) + end[1] * (percent)
  const blue = start[2] * (1 - percent) + end[2] * (percent)
  return [red, green, blue, 255]
}
