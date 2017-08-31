/* @flow */

/**
 */
class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

/**
 * Timeout
 */
class TimeoutError extends BaseError {}

module.exports.TimeoutError = TimeoutError;
