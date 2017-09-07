/* @flow */

/**
 * Waits for given time and then rejects with given reason.
 * @param reason The reason to reject.
 * @param ms The number of milliseconds to wait.
 */
function delayedReject(reason: any, ms: number): Promise<any> {
  return new Promise((resolve, reject) => setTimeout(() => reject(reason), ms));
}

module.exports = delayedReject;
