/* @flow */

/**
 * Waits for given time and then rejects with given reason.
 * @param reason The reason to reject
 * @param ms The number of milliseconds to wait (default `0`)
 */
function delayedReject(reason: any, ms: number = 0): Promise<any> {
  return new Promise((resolve, reject) => setTimeout(() => reject(reason), ms));
}

module.exports = delayedReject;
