/* @flow */

/**
 * Task is a function that returns a Promise of value (asynchronous execution) or the value itself
 * (synchronous execution).
 *
 * This type definition is used by all the control flow functions.
 *
 * @example
 * // once run, it waits 1s and then logs 'Hello!'
 * const task: Task<void> = () => delay(1000).then(() => console.log('Hello!'));
 */
export type Task<T> = () => Promise<T> | T;
