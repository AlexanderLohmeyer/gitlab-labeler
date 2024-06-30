import { getConfigByKey } from "./config/get-config";

interface Logger {
  log: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export const logger: Logger = {
  log: (message: string, ...args: any[]) => {
    if (!getConfigByKey("silence")) {
      console.log(`\x1b[32m${message}\x1b[0m`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`\x1b[33m${message}\x1b[0m`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`\x1b[31m${message}\x1b[0m`, ...args);
  },
};
