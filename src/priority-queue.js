/* @flow */

function parentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

function leftChildIndex(index: number): number {
  return (index * 2) + 1;
}

function rightChildIndex(index: number): number {
  return (index * 2) + 2;
}

type CompareFunction<T> = (a: T, b: T) => number;

/**
 * @private
 */
class PriorityQueue<T> {
  constructor({ comparePriority }: {
    comparePriority: CompareFunction<T>,
  }) {
    this._comparePriority = comparePriority;
    this._heap = [];
  }

  _comparePriority: CompareFunction<T>;
  _heap: Array<T>;

  push(item: T) {
    this._heap.push(item);

    let index = this._heap.length - 1;
    while (this._hasHigherPriority(this._heap[index], this._parent(index))) {
      index = this._swap(index, parentIndex(index));
    }
  }

  pop(): ?T {
    if (this.size() < 2) {
      return this._heap.pop();
    }

    const item = this._heap[0];
    this._heap[0] = this._heap.pop();

    let index = 0;
    while (
      this._hasHigherPriority(this._rightChild(index), this._heap[index])
      || this._hasHigherPriority(this._leftChild(index), this._heap[index])
    ) {
      if (this._hasHigherPriority(this._rightChild(index), this._leftChild(index))) {
        index = this._swap(index, rightChildIndex(index));
      } else {
        index = this._swap(index, leftChildIndex(index));
      }
    }

    return item;
  }

  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  _parent(index: number): ?T {
    return this._heap[parentIndex(index)];
  }

  _leftChild(index: number): ?T {
    return this._heap[leftChildIndex(index)];
  }

  _rightChild(index: number): ?T {
    return this._heap[rightChildIndex(index)];
  }

  _hasHigherPriority(a: ?T, b: ?T) {
    if (a == null || b == null) {
      return false;
    }

    return this._comparePriority(a, b) > 0;
  }

  _swap(i: number, j: number) {
    const tmp = this._heap[i];
    this._heap[i] = this._heap[j];
    this._heap[j] = tmp;
    return j;
  }
}

/**
 * @private
 */
class StablePriorityQueue<T> {
  constructor(options: {
    comparePriority: CompareFunction<T>,
  }) {
    const { comparePriority } = options;

    this._order = 0;
    this._queue = new PriorityQueue({
      comparePriority: ([a, aOrder], [b, bOrder]) => {
        const result = comparePriority(a, b);
        if (result !== 0) {
          return result;
        }

        if (aOrder < bOrder) {
          return 1;
        } else if (aOrder > bOrder) {
          return -1;
        }

        return 0;
      },
    });
  }

  _order: number;
  _queue: PriorityQueue<[T, number]>;

  push(item: T) {
    this._queue.push([item, this._order]);
    this._order += 1;
  }

  pop(): ?T {
    const item = this._queue.pop();
    return item && item[0];
  }

  /**
   * Returns the number of elements
   */
  size() {
    return this._queue.size();
  }

  /**
   * Checks whether the underlying container is empty
   */
  isEmpty() {
    return this._queue.isEmpty();
  }
}

module.exports = StablePriorityQueue;
