/* @flow */

const after = require('./after');
const delay = require('./delay');

test('it is run after fulfilled promise', () => {
  expect.assertions(3);

  const value = {};
  const cleanup = jest.fn();
  const promise = delay(10).then(() => value);
  const afterPromise = after(promise, cleanup);
  expect(cleanup).not.toHaveBeenCalled();
  return promise
    .then(() => expect(cleanup).toHaveBeenCalled())
    .then(() => expect(afterPromise).resolves.toBe(value));
});

test('it is run after rejected promise', () => {
  expect.assertions(3);

  const reason = {};
  const cleanup = jest.fn();
  const promise = delay(10).then(() => Promise.reject(reason));
  const afterPromise = after(promise, cleanup);
  expect(cleanup).not.toHaveBeenCalled();
  return promise
    .catch(() => expect(cleanup).toHaveBeenCalled())
    .then(() => expect(afterPromise).rejects.toBe(reason));
});

test('it propagates error from the task callback', () => {
  expect.assertions(2);

  const reason = {};
  return Promise.all([
    expect(after(delay(10), () => Promise.reject(reason))).rejects.toBe(reason),
    expect(after(delay(10), () => { throw reason; })).rejects.toBe(reason),
  ]);
});
