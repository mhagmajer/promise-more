/* @flow */
/* globals T: false */

import type { Task } from './types';

const invariant = require('./invariant');
const Queue = require('./queue');

type SchedulerOptions = {|
  limit: number,
|};

type TaskOptions = {|
  immediate: boolean,
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
 * @example
 * // runs two tasks sequentially
 * const schedule = scheduler();
 * schedule(async () => {
 *   delay(1000);
 *   console.log('A second has passed');
 * });
 *
 * schedule(async () => {
 *   delay(2000);
 *   console.log('Two more seconds have passed');
 * });
 * @example
 * // runs tasks in parallel with the limit provided
 * function parallelLimit(tasks, limit) {
 *   const schedule = scheduler({ limit });
 *   return Promise.all(tasks.map(t => schedule(t)));
 * }
 */
function scheduler(
  options?: SchedulerOptions
): <T>(task: Task<T>, options?: TaskOptions) => Promise<T> {
  const { limit } = (Object.assign({
    limit: 1,
  }, options): SchedulerOptions);

  type QueueElem<T> = {|
    task: Task<T>,
    resolve: (result: Promise<T> | T) => void,
    reject: (error: any) => void,
  |};

  const queue: Queue<QueueElem<any>> = new Queue();

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
    const { immediate } = (Object.assign({
      immediate: false,
    }, taskOptions): TaskOptions);

    if (immediate) {
      return Promise.resolve(task());
    }

    const promise = new Promise((resolve, reject) => queue.push({ task, resolve, reject }));
    runNextTask();
    return promise;
  };
}

module.exports = scheduler;
