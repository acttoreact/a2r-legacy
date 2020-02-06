/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicContext } from "../../model/data";

export const pathCache = new Map<string, string>();
export const moduleCache = new Map<string, (a2rContext: BasicContext) => any>();

export const removeModuleCacheFromFilePath = (filePath: string): void => {
  const moduleEntry = Array.from(pathCache.entries()).find((entry) => entry.slice().pop() === filePath);
  if (moduleEntry) {
    const [pathname] = moduleEntry;
    moduleCache.delete(pathname);
  }
};
