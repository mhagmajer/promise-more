/* @flow */

const after = require('./after');

test('it is run after fulfilled promise', () => {
  expect.assertions(2);

  const value = {};
  const cleanup = jest.fn();
  const promise = after(Promise.resolve(value), cleanup);
  return Promise.all([
    promise.then(() => expect(cleanup).toHaveBeenCalled()),
    expect(promise).resolves.toBe(value),
  ]);
});

test('it is run after rejected promise', () => {
  expect.assertions(2);

  const reason = {};
  const cleanup = jest.fn();
  const promise = after(Promise.reject(reason), cleanup);
  return Promise.all([
    promise.catch(() => expect(cleanup).toHaveBeenCalled()),
    expect(promise).rejects.toBe(reason),
  ]);
});
