/* @flow */

/**
 * @private
 */
class Queue<T> {
  constructor() {
    this._array = [];
  }

  _array: Array<T>;

  /**
   * Inserts element at the end
   */
  push(x: T) {
    this._array.push(x);
  }

  /**
   * Removes the first element
   */
  pop(): ?T {
    const [x] = this._array.splice(0, 1);
    return x;
  }

  /**
   * Returns the number of elements
   */
  size() {
    return this._array.length;
  }

  /**
   * Checks whether the underlying container is empty
   */
  isEmpty() {
    return this._array.length === 0;
  }
}

module.exports = Queue;
