/* @flow */

const delay = require('./delay');

test('it is compatible with setTimeout', () => {
  expect.assertions(2);

  const cb = jest.fn();

  setTimeout(cb, 10);
  setTimeout(cb, 30);
  return Promise.all([
    delay(20).then(() => expect(cb).toHaveBeenCalledTimes(1)),
    delay(40).then(() => expect(cb).toHaveBeenCalledTimes(2)),
  ]);
});
