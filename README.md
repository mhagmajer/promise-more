# promise-more

A well-tested library for handling Promises with Flow type declarations and carefully thought out API.

Compatible with Node v6.11.2 LTS or later.

Contributions welcome!

## Installation

`npm install --save promise-more`

## Usage examples

### With async/await - recommended

```javascript
const { delay } = require('promise-more');

async function main() {
  console.log('Hello...');
  await delay(500); // wait half a second
  console.log('...world!');  
}

main();
```

### Without async/await

```javascript
const { delay } = require('promise-more');

console.log('Hello...');
delay(500).then(() => { // wait half a second
  console.log('...world!');
});
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [CONTROL FLOW](#control-flow)
-   [Task](#task)
-   [scheduler](#scheduler)
-   [sequence](#sequence)
-   [UTILITIES](#utilities)
-   [delay](#delay)
-   [timeout](#timeout)
-   [ERRORS](#errors)
-   [TimeoutError](#timeouterror)
-   [BaseError](#baseerror)

## CONTROL FLOW

Functions to control how asynchronous tasks are executed.


## Task

Task is a function that returns a Promise of value (asynchronous execution) or the value itself
(synchronous execution).

This type definition is used by all the control flow functions.

Type: function (): ([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;T> | T)

**Examples**

```javascript
// once run, it waits 1s and then logs 'Hello!'
const task: Task<void> = () => delay(1000).then(() => console.log('Hello!'));
```

## scheduler

Scheduler enqueues tasks to be run in accordance with options passed.

Scheduler options (all optional):

-   `limit` [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) The limit of tasks that can be run simultaneously (default `1`)

Task execution options (all optional):

-   `immediate` [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Whether the task should be run immediately disregarding the queue
    (default `false`)

**Parameters**

-   `options` **SchedulerOptions** 

**Examples**

```javascript
const schedule = scheduler();
schedule(() => delay(1000).then(() => console.log('A second has passed')));
schedule(() => delay(2000).then(() => console.log('Two more seconds have passed')));
```

Returns **function (task: [Task](#task)&lt;T>, options: TaskOptions): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;T>** 

## sequence

Runs tasks sequentially. The next one is run only after previous was resolved.
Rejects immediately if any task rejects.

**Parameters**

-   `tasks` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Task](#task)&lt;void>>** Tasks to run

**Examples**

```javascript
// prints "Hello world" one letter at a time
sequence(
  'Hello world'.split('').map(c => () => delayedLog(c))
);

async function delayedLog(s) {
  await delay(50);
  console.log(s);
}
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## UTILITIES

Other utility functions.


## delay

Waits for given time and then resolves with [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).

**Parameters**

-   `ms` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of milliseconds to wait.

**Examples**

```javascript
async function main() {
  // ...
  await delay(1000); // halt execution for one second
  // ...
}
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** 

## timeout

Rejects with instance of [TimeoutError](#timeouterror) if promise doesn't resolve within the specified
time. Resolves with the value of promise otherwise.

**Parameters**

-   `promise` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;T>** The promise to put time constraint on
-   `ms` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of milliseconds to wait

**Examples**

```javascript
// rejects if npmjs.com isn't fetched within 100 ms
timeout(fetch('https://www.npmjs.com/'), 100);
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;T>** 

## ERRORS

Possible errors.


## TimeoutError

**Extends BaseError**

Timeout

## BaseError

**Extends Error**

**Parameters**

-   `message` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
