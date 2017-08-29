/* @flow */

/**
 * Waits for given time and then resolves with {@link undefined}.
 * @param ms The number of milliseconds to wait.
 * @example
 * async function main() {
 *   // ...
 *   await delay(1000); // halt execution for one second
 *   // ...
 * }
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = delay;
