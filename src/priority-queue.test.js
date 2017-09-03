/* @flow */

const PriorityQueue = require('./priority-queue');

test('it sorts stably', () => {
  const items = [15, 72, 41, 55, 51, 88, 35, 64, 69, 74, 98, 82, 18, 73, 31, 32, 26, 14, 64, 42];
  const expected = [98, 88, 82, 72, 74, 73, 64, 69, 64, 55, 51, 41, 42, 35, 31, 32, 26, 15, 18, 14];

  const queue: PriorityQueue<number> = new PriorityQueue({
    comparePriority: (a, b) => Math.floor(a / 10) - Math.floor(b / 10),
  });

  items.forEach(item => queue.push(item));

  const sorted = [];
  while (!queue.isEmpty()) {
    sorted.push(queue.pop());
  }

  expect(sorted).toEqual(expected);
});
