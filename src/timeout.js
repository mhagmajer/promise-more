/* @flow */

const { TimeoutError } = require('./errors');
const delay = require('./delay');

/**
 * Rejects with instance of {@link TimeoutError} if promise doesn't resolve within the specified
 * time. Resolves with the value of promise otherwise.
 * @param promise The promise to put time constraint on
 * @param ms The number of milliseconds to wait
 * @example
 * // rejects if npmjs.com isn't fetched within 100 ms
 * timeout(fetch('https://www.npmjs.com/'), 100);
 */
function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    delay(ms).then(() => Promise.reject(
      new TimeoutError(`Promise didin't resolve within expected time of ${ms} ms`)
    ))
  ]);
}

module.exports = timeout;
