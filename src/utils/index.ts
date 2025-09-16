import { useSelector } from "react-redux";

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export const UnitSystemName = () => {
  const unitSystemName = useSelector((state: any) => state.auth.unitSystemName);
  if (unitSystemName?.toLowerCase().trim() === "metric") {
    return "HA";
  } else return "AC"
}

export function removeKeysFromObject<T extends object>(obj: T, keysToRemove: (keyof T)[]): Partial<T> {
  const result = { ...obj };
  for (const key of keysToRemove) {
    delete result[key];
  }
  return result;
}