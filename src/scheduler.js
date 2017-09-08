/* @flow */
/* globals T: false, C: false */

import type { Task } from './types';

const after = require('./after');
const invariant = require('./invariant');
const PriorityQueue = require('./priority-queue');

type SchedulerOptions = {|
  limit: number,
|};

type TaskOptions<C> = {|
  immediate: boolean,
  priority: number,
  context: C,
|};

export type RunParameters<C> = {
  index: number,
  workerNr: number,
  fulfilled: number,
  rejected: number,
  pending: number,
  waiting: number,
  options: TaskOptions<C>,
  schedulerOptions: SchedulerOptions,
};

type QueueElem<T, C> = {|
  task: Task<T, RunParameters<C>>,
  resolve: (result: Promise<T> | T) => void,
  reject: (error: any) => void,
  options: TaskOptions<C>,
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
 * - `context` any data you want make available to the task at the time of execution (default
 * `undefined`)
 *
 * Tasks are passed as a single object argument with the following properties:
 * - `index` {@link number} The sequence number of the task being run (starts with `0`)
 * - `fulfilled` {@link number} Number of fulfilled tasks
 * - `rejected` {@link number} Number of rejected tasks
 * - `pending` {@link number} Number of tasks currently running (including immediate ones). Always
 * positive.
 * - `waiting` {@link number} Number of tasks still in the queue
 * For immediate tasks it is equal to `-1` - they are assumed to be handled by some extra resources
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
  schedulerOptions?: $Shape<SchedulerOptions>
): <T, C>(task: Task<T, RunParameters<C>>, options?: $Shape<TaskOptions<C>>) => Promise<T> {
  const {
    limit = 1,
  } = schedulerOptions || {};
  const schedulerOptionsWithDefaults = { limit };

  const queue: PriorityQueue<QueueElem<any, any>> = new PriorityQueue({
    comparePriority: (a, b) => a.options.priority - b.options.priority,
  });

  let index = -1;
  const workers = Array(limit).fill(false);

  let fulfilled = 0;
  let rejected = 0;
  let pending = 0;
  let pendingImmediate = 0;

  function runTask<T, C>(task: Task<T, RunParameters<C>>, options: TaskOptions<C>): Promise<T> {
    const { immediate } = options;

    index += 1;

    let workerNr;
    if (immediate) {
      workerNr = -1;
      pendingImmediate += 1;
    } else {
      workerNr = workers.indexOf(false);
      workers[workerNr] = true;
      pending += 1;
    }

    return after(Promise.resolve(task({
      index,
      workerNr,
      fulfilled,
      rejected,
      pending: pending + pendingImmediate,
      waiting: queue.size(),
      options,
      schedulerOptions: schedulerOptionsWithDefaults,
    })), (state) => {
      if (state.name === 'fulfilled') {
        fulfilled += 1;
      } else if (state.name === 'rejected') {
        rejected += 1;
      }

      if (immediate) {
        pendingImmediate -= 1;
      } else {
        pending -= 1;
        workers[workerNr] = false;
      }
    });
  }

  function runNextTask() {
    if (queue.isEmpty() || pending >= limit) {
      return;
    }

    const next = queue.pop();
    invariant(next != null, 'queue is not empty');
    runTask(next.task, next.options).then(next.resolve, next.reject).then(runNextTask);
  }

  return function taskRunner<T, C>(
    task: Task<T, RunParameters<C>>,
    options?: $Shape<TaskOptions<C>>
  ): Promise<T> {
    const {
      immediate = false,
      priority = 0,
      context,
    } = options || {};
    const optionsWithDefaults = { immediate, priority, context };

    if (immediate) {
      return runTask(task, optionsWithDefaults);
    }

    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject, options: optionsWithDefaults });
      runNextTask();
    });
  };
}

module.exports = scheduler;
