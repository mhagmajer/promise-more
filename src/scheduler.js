/* @flow */
/* globals T: false */

import type { Task } from './types';

const invariant = require('./invariant');
const PriorityQueue = require('./priority-queue');

type SchedulerOptions = {|
  limit: number,
|};

type TaskOptions = {|
  immediate: boolean,
  priority: number,
|};

type RunParameters = {
  index: number,
  pending: number,
  waiting: number,
  options: TaskOptions,
  schedulerOptions: SchedulerOptions,
};

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
 *
 * Tasks are passed a single object argument with the following properties:
 * - `index` {@link number} Number of task in queue (`-1` for immediate tasks). If running tasks
 * in a process pool, you can use it to easily get the number of process:
 * `index % schedulerOptions.limit`.
 * Starts with `1`.
 * - `pending` {@link number} Number of tasks currently running. Always positive.
 * - `waiting` {@link number} Number of tasks still in the queue
 * - `options` Task options with default values
 * - `schedulerOptions` Scheduler options with default values
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
  schedulerOptionsInput?: $Shape<SchedulerOptions>
): <T>(task: Task<T, RunParameters>, options?: $Shape<TaskOptions>) => Promise<T> {
  const {
    limit = 1,
  } = schedulerOptionsInput || {};
  const schedulerOptions = { limit };

  type QueueElem<T> = {|
    task: Task<T, RunParameters>,
    resolve: (result: Promise<T> | T) => void,
    reject: (error: any) => void,
    options: TaskOptions,
  |};

  const queue: PriorityQueue<QueueElem<any>> = new PriorityQueue({
    comparePriority: (a, b) => a.options.priority - b.options.priority,
  });

  let index = 0;
  let pending = 0;
  const runNextTask = () => {
    if (queue.isEmpty() || pending >= limit) {
      return;
    }

    pending += 1;
    index += 1;
    const next = queue.pop();
    invariant(next != null, 'checked is not empty');
    Promise.resolve(next.task({
      index,
      pending,
      waiting: queue.size(),
      options: next.options,
      schedulerOptions,
    })).then(next.resolve, next.reject).then(() => {
      pending -= 1;
      runNextTask();
    });
  };

  return function taskRunner<T>(task: Task<T, RunParameters>, optionsInput?): Promise<T> {
    const {
      immediate = false,
      priority = 0,
    } = optionsInput || {};
    const options = { immediate, priority };

    if (immediate) {
      return Promise.resolve(task({
        index: -1,
        pending,
        waiting: queue.size(),
        options,
        schedulerOptions,
      }));
    }

    const promise = new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject, options });
    });
    runNextTask();
    return promise;
  };
}

module.exports = scheduler;
