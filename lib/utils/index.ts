import { LinearTransition } from 'react-native-reanimated';

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function formatDurationWithCentiseconds(duration: number) {
  const ms = ((duration % 1000) / 10) | 0;
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  const hourString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');
  const msString = ms.toString().padStart(2, '0');

  return `${hourString}:${minutesString}:${secondsString}.${msString}`;
}

export function formatDurationWithUnits(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  const hourString = hours > 0 ? `${hours.toString().padStart(2, '0')}h` : '';
  const minutesString =
    minutes > 0 || hours ? `${minutes.toString().padStart(2, '0')}m` : '';
  const secondsString = `${seconds.toString().padStart(2, '0')}s`;
  return `${hourString} ${minutesString} ${secondsString}`.trim();
}

export function formatTimeOnly(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

export function cardSpringify() {
  return LinearTransition.springify()
    .damping(10)
    .mass(1)
    .stiffness(80)
    .restSpeedThreshold(3);
}
