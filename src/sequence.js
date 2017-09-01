/* @flow */

import type { Task } from './types';

/**
 * Runs tasks sequentially. The next one is run only after previous was resolved.
 * Rejects immediately if any task rejects.
 * @param tasks Tasks to run
 * @example
 * // prints "Hello world" one letter at a time
 * sequence(
 *   'Hello world'.split('').map(c => () => delayedLog(c))
 * );
 *
 * async function delayedLog(s) {
 *   await delay(50);
 *   console.log(s);
 * }
 */
function sequence(tasks: Array<Task<void>>): Promise<void> {
  return tasks.reduce((a, task) => a.then(task), Promise.resolve());
}

module.exports = sequence;
