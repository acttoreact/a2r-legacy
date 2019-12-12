/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import os from 'os';
import winston from 'winston';
import { MESSAGE } from 'triple-beam';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

interface CustomConsoleTransportOptions extends ConsoleTransportOptions {
  name?: string;
}

const stringArrayToSet = (
  strArray: any[] | undefined,
  errMsg?: string,
): any => {
  if (!strArray) {
    return {};
  }

  const errorMessage =
    errMsg || 'Cannot make set from type other than Array of string elements';

  if (!Array.isArray(strArray)) {
    throw new Error(errorMessage);
  }

  return strArray.reduce((set, el): object => {
    if (typeof el !== 'string') {
      throw new Error(errorMessage);
    }
    return {
      ...set,
      [el]: true,
    };
  }, {});
};

class CustomConsoleTransport extends winston.transports.Console {
  public constructor(options: CustomConsoleTransportOptions = {}) {
    super(options);

    this.name = options.name || 'console';
    this.stderrLevels = stringArrayToSet(options.stderrLevels);
    this.eol = options.eol || os.EOL;

    this.setMaxListeners(30);
  }

  public log(info: any, callback: () => void): void {
    setImmediate((): void => {
      this.emit('logged', info);
    });

    console.log(`customConsoleTransport log: ${info[MESSAGE]}`);

    if (callback) {
      callback();
    }
  }
}

export default CustomConsoleTransport;
