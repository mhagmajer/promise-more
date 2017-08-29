/* @flow */

/**
 * Waits for given time and then resolves with the value specified.
 * @param ms The number of milliseconds to wait.
 * @example
 * await delay(1000); // wait one second
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = delay;
