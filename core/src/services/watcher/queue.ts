import out from '../../util/out';
import { watcher } from '../../util/terminalStyles';
import { WatcherEventInfo } from '../../model/watcher';

import settings from '../../config/settings';

const { taskConcurrency } = settings;

let adding = false;
const taskQueue: WatcherEventInfo[] = [];
const runningPromises: Function[] = [];

/**
 * Processes task queue, running a maximum of `n` (`settings.taskConcurrency`) parallel tasks
 * @returns {void}
 */
export const processTasks = (): void => {
  if (adding) {
    setTimeout(processTasks, 32);
    return;
  }
  if (runningPromises.length < taskConcurrency) {
    const task = taskQueue.shift();
    if (task) {
      const { handler, onError } = task;
      runningPromises.push(handler);
      out.verbose(
        `Running task (${runningPromises.length} / ${taskConcurrency}). ${taskQueue.length} pending`,
      );
      handler()
        .catch((ex: Error): void => {
          if (onError) {
            onError(ex);
          } else {
            out.error(`${watcher}: Error on task: ${ex.message}\n${ex.stack}`);
          }
        })
        .finally((): void => {
          runningPromises.splice(runningPromises.indexOf(handler), 1);
          processTasks();
        });
      processTasks();
    }
  }
};

/**
 * Adds one task to queue, ordered by priority. Also removes existing tasks about same path.
 * @param {WatcherEventInfo} info
 * @param {boolean} process
 */
export const addTask = (info: WatcherEventInfo, process: boolean): void => {
  adding = true;
  const priority = info.priority || Infinity;
  const indexesToRemove = [];
  let index = null;
  for (let i = 0, l = taskQueue.length; i < l; i += 1) {
    const task = taskQueue[i];
    const { path } = task;
    const taskPriority = task.priority || -1;
    if (!index && priority < taskPriority) {
      index = i;
    }
    if (path === info.path) {
      indexesToRemove.push(i + (index ? 1 : 0));
    }
  }
  if (index) {
    taskQueue.splice(index, 0, info);
  } else {
    taskQueue.push(info);
  }
  for (let i = 0, l = indexesToRemove.length; i < l; i += 1) {
    taskQueue.splice(indexesToRemove[i], 1);
  }
  adding = false;
  if (process) {
    processTasks();
  }
};
