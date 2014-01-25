module.exports = function(config) {
  config.set({
    globals: {
      co: require('co'),
      Future: require('co-future').Future,
      Semaphore: require('./index').Semaphore,
      wait: function(ms) {
        return function(done) {
          setTimeout(done, ms);
        }
      }
    },
    tests: [
      'test/*.js'
    ]
  });
}
