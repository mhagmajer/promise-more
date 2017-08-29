/* @flow */

const delay = require('./delay');
const sequence = require('./sequence');

test('runs operations sequentially', () => {
  expect.assertions(2);

  const cb = jest.fn();
  return sequence([
    () => delay(10).then(cb),
    () => expect(cb).toHaveBeenCalledTimes(1),
    () => delay(10).then(cb),
    () => delay(20).then(() => expect(cb).toHaveBeenCalledTimes(2)),
  ]);
});
