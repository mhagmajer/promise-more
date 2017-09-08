/* @flow */

const delayedResolve = require('./delayed-resolve');

/**
 */
export type PromiseState<T> = {|
  name: 'pending',
|} | {|
  name: 'fulfilled',
  value: T,
|} | {|
  name: 'rejected',
  reason: any,
|};

/**
 * Asynchronous API for checking state of the promise. The returned promise is fulfilled as soon as
 * possible.
 *
 * Note: there is no public synchronous API for this.
 * @param promise The promise to determine the state of.
 * @example
 */
function state<T>(promise: Promise<T>): Promise<PromiseState<T>> {
  return new Promise((resolve) => {
    promise.then(
      value => resolve({ name: 'fulfilled', value }),
      reason => resolve({ name: 'rejected', reason })
    );
    delayedResolve({ name: 'pending' }).then(resolve);
  });
}

module.exports = state;
