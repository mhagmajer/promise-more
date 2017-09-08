/* @flow */

import type { Task } from './types';
import type { PromiseState } from './state';

/**
 * Runs task after promise was resolved or rejected (like `finally`).
 * @param promise The promise after which to run the task
 * @param task The task to run after the promise. Called with result of {@link state} of the promise
 * (`fulfilled` or `rejected`). If the task throws, the error is propagated to the promise returned
 * from `after`.
 * @example
 * const taskWithCleanup = () => after(operation(), cleanup);
 *
 * // same as
 * const taskWithCleanup = async () => {
 *   try {
 *     return await operation();
 *   } finally {
 *     await cleanup(); // no way to know if the task succeded
 *   }
 * }
 */
function after<T>(promise: Promise<T>, task: Task<void, PromiseState<T>>): Promise<T> {
  return promise.then(
    value => task({ name: 'fulfilled', value }),
    reason => task({ name: 'rejected', reason })
  ).then(() => promise);
}

module.exports = after;
