/* @flow */

function invariant(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}

module.exports = invariant;
