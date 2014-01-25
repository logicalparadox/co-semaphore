"use strict";

/*!
 * Module dependencies
 */

var Future = require('co-future').Future;

/*!
 * Primary exports
 */

var exports = module.exports = function(n) {
  return new Semaphore(n);
};

/**
 * A low-level counted semaphore lock.
 *
 * @param {Number} workers
 * @api public
 */

var Semaphore = exports.Semaphore = function Semaphore(n) {
  this.state = {
    type: 'semaphore',
    baseline: arguments.length ? n : 1,
    count: arguments.length ? n : 1,
    waiting: []
  };
}

/*!
 * Prototype
 */

Semaphore.prototype = {

  constructor: Semaphore,

  /**
   * Get length of waiting queue.
   *
   * @return {Number} length
   * @api public
   */

  get length() {
    return this.state.waiting.length;
  },

  /**
   * Get the current number of workers; threads which
   * have acquired the lock but not yet released it.
   *
   * @return {Number} acquisitions
   */

  get acquired() {
    var self = this.state;
    return self.baseline - (self.count + this.length);
  },

  /**
   * Get the current number of unassigned workers;
   * count of threads which can immediately acquire
   * access without being put in the waiting queue.
   *
   * @return {Number} available
   */

  get available() {
    var self = this.state;
    return self.baseline - this.acquired;
  },

  /**
   * Get count of semaphore state.
   *
   * @return {Number} count
   * @api public
   */

  get count() {
    return this.state.count;
  },

  /**
   * Acquire permission to access shared resources.
   *
   * @yield {Boolean} acquired
   * @api public
   */

  acquire: function() {
    var self = this.state;
    return function(done) {
      if (--self.count < 0) self.waiting.push(done);
      else setImmediate(done);
    }
  },

  /**
   * Notify release of access to shared resources
   * to a single waiting `.acquire()`.
   *
   * @return {Boolean} release signalled acquire
   * @api public
   */

  release: function() {
    var self = this.state;

    if (self.count++ < 0 && this.length) {
      setImmediate(self.waiting.shift());
      return true;
    }

    return false;
  },

  /**
   * Notify release of access to shared resources
   * to all waiting `.acquire()`s.
   *
   *
   * @return {Boolean} release signalled acquire
   * @api public
   */

  flush: function() {
    var self = this.state;
    var flushed = false;

    while (self.count++ < 0 && this.length) {
      setImmediate(self.waiting.shift());
      flushed = true;
    }

    return flushed;
  },

  /**
   * Acquire access to shared resources with closure.
   *
   * @param {Generator} closure
   * @yield {Mixed} closure return value
   * @api public
   */

  lock: function*(blk) {
    yield this.acquire();
    var res = yield Future(blk).wait();
    this.release();
    return res.unwrap();
  }

}
