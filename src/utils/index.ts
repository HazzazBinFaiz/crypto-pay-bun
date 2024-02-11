import type { UUID } from 'node:crypto';

export function lerp(points: [number, number][], x: number): number {
    const lastPointIndex = points.length - 1;
  
    if (x <= points[0][0]) {
      return points[0][1];
    } else if (x >= points[lastPointIndex][0]) {
      const x0 = points[lastPointIndex - 1][0];
      const y0 = points[lastPointIndex - 1][1];
      const x1 = points[lastPointIndex][0];
      const y1 = points[lastPointIndex][1];
      return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
    }
  
    let i = 1;
    while (i < points.length && points[i][0] < x) {
      i++;
    }
  
    const x0 = points[i - 1][0];
    const y0 = points[i - 1][1];
    const x1 = points[i][0];
    const y1 = points[i][1];
  
    return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
  }

export function dayToMS(day : number) {
    return day * 24 * 60 * 60 * 1000;
}

export function secondToMS(seconds: number) {
    return seconds * 1000;
}

export function minuteToMS(minutes: number) {
    return minutes * 60 * 1000;
}

export function houreToMS(houres: number) {
    return houres * 60 * 60 * 1000;
}

export function getNextMS(age: number)
{
    if (age >= dayToMS(1)) return null;

    const points: [number, number][] = [
        [0, secondToMS(1)],
        [minuteToMS(15), secondToMS(3)],
        [minuteToMS(30), secondToMS(5)],
        [houreToMS(1), secondToMS(10)],
        [houreToMS(3), secondToMS(15)],
        [houreToMS(6), secondToMS(30)],
        [houreToMS(12), secondToMS(45)],
        [dayToMS(1), minuteToMS(1)],
        // [dayToMS(2), minuteToMS(5)],
        // [dayToMS(3), minuteToMS(10)],
    ];

    return lerp(points, age);
}

export function uuidTopathable(uuid: UUID)
{
  const [s_8_char, s_4_char, s_4_char_2, s_4_char_3, s_12_char] = uuid.split('-');
  return [
    parseInt((BigInt('0x'+s_8_char) & BigInt('0x7FFFFFFF')).toString(10)),
    parseInt('0x'+s_4_char),
    parseInt('0x'+s_4_char_2),
    parseInt('0x'+s_4_char_3),
    parseInt('0x'+s_12_char.slice(0, 6)),
    parseInt('0x'+s_12_char.slice(6)),
  ]
}

export function pathableToPath(segments: number[])
{
  return `m/44'/60'/${segments.map((n, i) => i === 0 ? n+'\'' : n.toString()).join('/')}`.toString() as `m/44'/60'/${string}`;
}

export function uuidToPath(uuid: UUID)
{
  return pathableToPath(uuidTopathable(uuid));
}