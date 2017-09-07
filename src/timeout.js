/* @flow */

const { TimeoutError } = require('./errors');
const delayedReject = require('./delayed-reject');

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
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    delayedReject(new TimeoutError(
      `Timeout: Promise didn't resolve within the expected time of ${ms} milliseconds`
    ), ms).catch(reject);
  });
}

module.exports = timeout;
