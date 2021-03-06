/* @flow */

const delay = require('./delay');
const state = require('./state');

test('it works for fulfilled promise', () => {
  expect.assertions(1);

  const value = {};
  return expect(state(Promise.resolve(value))).resolves.toEqual({
    name: 'fulfilled',
    value,
  });
});

test('it works for rejected promise', () => {
  expect.assertions(1);

  const reason = {};
  return expect(state(Promise.reject(reason))).resolves.toEqual({
    name: 'rejected',
    reason,
  });
});

test('it works for pending promise', () => {
  expect.assertions(1);

  return expect(state(delay(10))).resolves.toEqual({
    name: 'pending',
  });
});
