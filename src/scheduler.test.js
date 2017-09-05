/* @flow */

import type { Task } from './types';

const delay = require('./delay');
const scheduler = require('./scheduler');

test('it runs tasks sequentially', () => {
  expect.assertions(2);

  const schedule = scheduler();

  const cb = jest.fn();
  return Promise.all([
    () => delay(10).then(cb),
    () => expect(cb).toHaveBeenCalledTimes(1),
    () => delay(10).then(cb),
    () => delay(20).then(() => expect(cb).toHaveBeenCalledTimes(2)),
  ].map(task => schedule(task)));
});

test('it runs tasks independently', () => {
  expect.assertions(2);

  const schedule = scheduler();
  const reason = {};
  const value = {};

  return Promise.all([
    expect(schedule(() => delay(10).then(() => Promise.reject(reason)))).rejects.toBe(reason),
    expect(schedule(() => delay(10).then(() => value))).resolves.toBe(value),
  ]);
});

test('it respects the limit of tasks', () => {
  expect.assertions(1);

  const limit = 5;
  let running = 0;

  const task = () => {
    if (running === limit) {
      throw new Error('Task run over the limit');
    }

    running += 1;
    return delay(10).then(() => {
      running -= 1;
    });
  };

  const schedule = scheduler({ limit });
  return expect(
    Promise.all(Array(100).fill(null).map(() => schedule(task)))
  ).resolves.toBeDefined();
});

test('it can run a task immediately', () => {
  expect.assertions(1);

  const schedule = scheduler();
  schedule(() => new Promise(() => {})); // this task never resolves or rejects

  const value = {};
  return expect(schedule(() => value, { immediate: true })).resolves.toBe(value);
});

test('it runs tasks sequentially with respect to priority', () => {
  expect.assertions(1);

  const schedule = scheduler();
  const cb = jest.fn();

  type TaskWithPriority<T> = {
    task: Task<T, *>,
    priority?: number;
  };

  const items: Array<TaskWithPriority<any>> = [{
    task: () => delay(10).then(cb)
  }, {
    task: () => expect(cb).toHaveBeenCalledTimes(2),
  }, {
    task: () => delay(10).then(cb),
    priority: 1,
  }];

  return Promise.all(items.map(item => schedule(item.task, { priority: item.priority || 0 })));
});

test('it runs tasks with arguments', () => {
  expect.assertions(3);

  const schedule = scheduler();

  const task = jest.fn(() => delay(10));
  schedule(task);
  expect(task).toHaveBeenLastCalledWith({
    index: 1,
    pending: 1,
    waiting: 0,
    workerNr: 1,
    options: {
      immediate: false,
      priority: 0,
      context: undefined,
    },
    schedulerOptions: {
      limit: 1,
    },
  });

  const waitingTask = jest.fn(() => delay(10));
  schedule(waitingTask);

  const immediateTask = jest.fn();
  schedule(immediateTask, { immediate: true });
  expect(immediateTask).toHaveBeenLastCalledWith({
    index: 2,
    pending: 2,
    waiting: 1,
    workerNr: 0,
    options: {
      immediate: true,
      priority: 0,
      context: undefined,
    },
    schedulerOptions: {
      limit: 1,
    },
  });

  const context = {};

  const importantTask = jest.fn(() => delay(10));
  return expect(
    schedule(importantTask, { priority: 1, context }).then(() => importantTask)
  ).resolves.toHaveBeenLastCalledWith({
    index: 3,
    pending: 1,
    waiting: 1,
    workerNr: 1,
    options: {
      immediate: false,
      priority: 1,
      context,
    },
    schedulerOptions: {
      limit: 1,
    },
  });
});

test('it assign correct worker numbers', () => {
  expect.assertions(1);

  const schedule = scheduler({ limit: 2 });

  const task = ms => options => delay(ms).then(() => options.workerNr);

  return expect(Promise.all(
    [10, 5, 5].map(ms => schedule(task(ms)))
  )).resolves.toEqual([1, 2, 2]);
});
