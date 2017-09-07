/* @flow */

const after = require('./after');
const delay = require('./delay');

test('it is run after fulfilled promise', () => {
  expect.assertions(3);

  const value = {};
  const promise = delay(10).then(() => value);
  const cleanup = jest.fn();
  return Promise.all([
    promise.then(() => expect(cleanup).not.toHaveBeenCalled()),
    expect(after(promise, cleanup)).resolves.toBe(value),
    promise.then(() => expect(cleanup).toHaveBeenCalled()),
  ]);
});

test('it is run after rejected promise', () => {
  expect.assertions(3);

  const reason = {};
  const promise = delay(10).then(() => Promise.reject(reason));
  const cleanup = jest.fn();
  return Promise.all([
    promise.catch(() => expect(cleanup).not.toHaveBeenCalled()),
    expect(after(promise, cleanup)).rejects.toBe(reason),
    promise.catch(() => expect(cleanup).toHaveBeenCalled()),
  ]);
});

test('it propagates error from the task callback', () => {
  expect.assertions(2);

  const reason = {};
  return Promise.all([
    expect(after(delay(10), () => Promise.reject(reason))).rejects.toBe(reason),
    expect(after(delay(10), () => { throw reason; })).rejects.toBe(reason),
  ]);
});
