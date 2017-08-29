/* @flow */

/**
 * Waits for given time and then resolves with the value specified.
 * @param ms The number of milliseconds to wait.
 * @param value The value to resolve with.
 * @example
 * await delay(1000); // wait one second
 */
function delay<T>(ms: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, value));
}

module.exports = delay;
