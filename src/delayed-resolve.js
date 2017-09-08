/* @flow */

/**
 * Waits for given time and then resolves with given value.
 * @param value The value to resolve to
 * @param ms The number of milliseconds to wait (default `0`)
 */
function delayedResolve<T>(value: Promise<T> | T, ms: number = 0): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

module.exports = delayedResolve;
