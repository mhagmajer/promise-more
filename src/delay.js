/* @flow */

const delayedResolve = require('./delayed-resolve');

/**
 * Waits for given time and then resolves with {@link undefined}.
 * @param ms The number of milliseconds to wait (default `0`)
 * @example
 * async function main() {
 *   // ...
 *   await delay(1000); // halt execution for one second
 *   // ...
 * }
 */
function delay(ms: number = 0): Promise<void> {
  return delayedResolve(undefined, ms);
}

module.exports = delay;
