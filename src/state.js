/* @flow */

/**
 */
export type PromiseState<T> = {|
  state: 'pending',
|} | {|
  state: 'fulfilled',
  value: T,
|} | {|
  state: 'rejected',
  reason: any,
|};

/**
 * State
 * @param promise The promise to determine the state of.
 * @example
 */
function state<T>(promise: Promise<T>): Promise<PromiseState<T>> {
  return new Promise((resolve) => {
    promise.then(
      value => resolve({ state: 'fulfilled', value }),
      reason => resolve({ state: 'rejected', reason })
    );
    setTimeout(() => resolve({ state: 'pending' }));
  });
}

module.exports = state;
