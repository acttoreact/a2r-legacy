import out from '../../util/out';
import { watcher } from '../../util/terminalStyles';
import { WatcherEventInfo } from '../../model/watcher';

import settings from '../../config/settings';

const { taskConcurrency } = settings;

const taskQueue: WatcherEventInfo[] = [];
const runningPromises: Function[] = [];

export const processTask = (): void => {
  if (runningPromises.length < taskConcurrency) {
    const task = taskQueue.shift();
    if (task) {
      const samePathTasks = [task, ...taskQueue.filter((i): boolean => i.path === task.path)];
      const { handler, onError } = samePathTasks.pop() as WatcherEventInfo;
      for (let i = 0, l = samePathTasks.length; i < l; i += 1) {
        taskQueue.splice(taskQueue.indexOf(samePathTasks[i]), 1);
      }
      runningPromises.push(handler);
      out.verbose(`Running task (${runningPromises.length} / ${taskConcurrency})`);
      handler()
        .catch((ex: Error): void => {
          if (onError) {
            onError(ex);
          } else {
            out.error(
              `${watcher}: Error on task: ${ex.message}\n${ex.stack}`,
            );
          }
        })
        .finally((): void => {
          runningPromises.splice(runningPromises.indexOf(handler), 1);
          processTask();
        });
      processTask();
    }
  }
};

export const addTask = (info: WatcherEventInfo, unshift: boolean = false): void => {
  if (unshift) {
    taskQueue.unshift(info);
  } else {
    taskQueue.push(info);
  }
  processTask();
};
