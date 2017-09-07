/* @flow */

const { TimeoutError } = require('./errors');
const delayedReject = require('./delayed-reject');
const delayedResolve = require('./delayed-resolve');
const timeout = require('./timeout');

test('it resolves before timeout', () => {
  expect.assertions(3);

  const value = {};
  return Promise.all([
    expect(timeout(Promise.resolve(value), 0)).resolves.toBe(value),
    expect(timeout(delayedResolve(value, 0), 0)).resolves.toBe(value),
    expect(timeout(delayedResolve(value, 1), 1)).resolves.toBe(value),
  ]);
});

test('it rejects before timeout', () => {
  expect.assertions(3);

  const reason = {};
  return Promise.all([
    expect(timeout(Promise.reject(reason), 0)).rejects.toBe(reason),
    expect(timeout(delayedReject(reason, 0), 0)).rejects.toBe(reason),
    expect(timeout(delayedReject(reason, 1), 1)).rejects.toBe(reason),
  ]);
});

test('it rejects with TimeoutError after timeout', () => {
  expect.assertions(1);
  return expect(timeout(delayedResolve(null, 2), 1)).rejects.toBeInstanceOf(TimeoutError);
});
