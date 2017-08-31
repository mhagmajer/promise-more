/* @flow */

const { TimeoutError } = require('./errors');
const delay = require('./delay');
const timeout = require('./timeout');

test('it resolves before timeout', () => {
  expect.assertions(1);

  const value = {};
  return expect(timeout(
    delay(5).then(() => value),
    10
  )).resolves.toBe(value);
});

test('it rejects after timeout', () => {
  expect.assertions(1);

  const value = {};
  return expect(timeout(
    delay(10).then(() => value),
    5
  )).rejects.toBeInstanceOf(TimeoutError);
});
