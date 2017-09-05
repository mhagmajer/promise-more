/* @flow */

import type { Task } from './types';

/**
 * Runs task after promise was resolved or rejected (like `finally`).
 * @param promise The promise after which to run the task
 * @param task The task to run after the promise. Gets the fulfilled or rejected promise in the
 * first argument.
 * @example
 * const taskWithCleanup = () => after(task(), cleanup);
 *
 * // same as
 * const taskWithCleanup = async () => {
 *   try {
 *     return await task();
 *   } finally {
 *     await cleanup();
 *   }
 * }
 */
function after<T>(promise: Promise<T>, task: Task<void, Promise<T>>): Promise<T> {
  const onFulfilledOrRejected = () => Promise.resolve(task(promise)).then(() => promise);
  return promise.then(onFulfilledOrRejected, onFulfilledOrRejected);
}

module.exports = after;
