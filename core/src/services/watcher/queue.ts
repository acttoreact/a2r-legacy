import out from '../../util/out';
import { watcher } from '../../util/terminalStyles';

let promiseRunning = false;

export const promisesQueue: Function[] = [];

export const processPromisesQueue = (): void => {
  if (!promiseRunning) {
    const promiseProvider = promisesQueue.shift();
    if (promiseProvider) {
      promiseRunning = true;
      promiseProvider()
        .catch((ex: Error): void => {
          out.error(
            `${watcher}: Error removing path: ${ex.message}\n${ex.stack}`,
          );
        })
        .finally((): void => {
          promiseRunning = false;
          processPromisesQueue();
        });
    }
  }
};
