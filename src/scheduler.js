/* @flow */
/* globals T: false */

import type { Task } from './types';

const invariant = require('./invariant');
const PriorityQueue = require('./priority-queue');

type SchedulerOptions = {|
  limit?: number,
|};

type TaskOptions = {|
  immediate?: boolean,
  priority?: number,
|};

/**
 * Scheduler enqueues tasks to be run in accordance with options passed.
 *
 * Scheduler options (all optional):
 * - `limit` {@link number} The limit of tasks that can be run simultaneously (default `1`)
 *
 * Task execution options (all optional):
 * - `immediate` {@link boolean} Whether the task should be run immediately disregarding the queue
 * (default `false`)
 * - `priority` {@link number} Priority (the higher the value, the sooner task is run) (default `0`)
 * @example
 * // runs two given tasks sequentially
 * const schedule = scheduler();
 * schedule(async () => {
 *   await delay(1000);
 *   console.log('A second has passed');
 * });
 *
 * schedule(async () => {
 *   await delay(2000);
 *   console.log('Two more seconds have passed');
 * });
 * @example
 * // runs tasks in parallel with the limit provided
 * function parallelLimit(tasks, limit) {
 *   const schedule = scheduler({ limit });
 *   return Promise.all(tasks.map(t => schedule(t)));
 * }
 * @example
 * // runs tasks sequentially and resolves to an array of results
 * function series(tasks) {
 *   const schedule = scheduler();
 *   return Promise.all(tasks.map(t => schedule(t)));
 * }
 */
function scheduler(
  options?: SchedulerOptions
): <T>(task: Task<T>, options?: TaskOptions) => Promise<T> {
  const limit = options && options.limit ? options.limit : 1;

  type QueueElem<T> = {|
    task: Task<T>,
    resolve: (result: Promise<T> | T) => void,
    reject: (error: any) => void,
    priority: number,
  |};

  const queue: PriorityQueue<QueueElem<any>> = new PriorityQueue({
    comparePriority: (a, b) => a.priority - b.priority,
  });

  let running = 0;
  const runNextTask = () => {
    if (queue.isEmpty() || running >= limit) {
      return;
    }

    running += 1;
    const next = queue.pop();
    invariant(next != null, 'checked is not empty');
    Promise.resolve(next.task()).then(next.resolve, next.reject).then(() => {
      running -= 1;
      runNextTask();
    });
  };

  return function taskRunner<T>(task: Task<T>, taskOptions?): Promise<T> {
    const immediate = taskOptions && taskOptions.immediate ? taskOptions.immediate : false;
    const priority = taskOptions && taskOptions.priority ? taskOptions.priority : 0;

    if (immediate) {
      return Promise.resolve(task());
    }

    const promise = new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject, priority });
    });
    runNextTask();
    return promise;
  };
}

module.exports = scheduler;
