console.log(Semaphore);

suite('.count', function() {
  test('get returns current count', function() {
    var sem1 = new Semaphore();
    var sem2 = new Semaphore(2);
    sem1.should.have.property('count', 1);
    sem2.should.have.property('count', 2);
  });
});

suite('.length', function() {
  test('gets length of internal waiting queue', function() {
    var sem = new Semaphore();
    sem.state.waiting.length.should.equal(0);
    sem.length.should.equal(0);

    sem.state.waiting.push(1);
    sem.state.waiting.length.should.equal(1);
    sem.length.should.equal(1);

    sem.state.waiting.push(1);
    sem.state.waiting.length.should.equal(2);
    sem.length.should.equal(2);
  });
});

suite('.acquire()', function() {
  test('reduces count by 1', co(function*() {
    var sem = new Semaphore();
    sem.count.should.equal(1);
    sem.acquired.should.equal(0);
    sem.available.should.equal(1);
    yield sem.acquire();
    sem.count.should.equal(0);
    sem.acquired.should.equal(1);
    sem.available.should.equal(0);
  }));

  test('queues waiting if count becomes < 0', co(function*() {
    var sem = new Semaphore();
    yield sem.acquire();
    sem.count.should.equal(0);
    co(function *acq() { yield sem.acquire(); })();
    sem.count.should.equal(-1);
    sem.length.should.equal(1);
  }));
});

suite('.release()', function() {
  test('increases count by 1', co(function*() {
    var sem = new Semaphore();
    yield sem.acquire();
    sem.count.should.equal(0);
    sem.release();
    sem.count.should.equal(1);
  }));

  test('invokes waiting if count was < 0', co(function*() {
    var called = false;
    var sem = new Semaphore();
    yield sem.acquire();
    sem.count.should.equal(0);

    co(function *acq() {
      yield sem.acquire();
      called = true;
    })();

    sem.count.should.equal(-1);
    sem.length.should.equal(1);
    sem.release();
    yield wait(10);
    sem.count.should.equal(0);
    sem.length.should.equal(0);
    called.should.be.true;
  }));
});

suite('.lock()', function() {
  test('invokes block on acquire', co(function*() {
    var called = false;
    var sem = new Semaphore();

    function *blk() {
      return yield sem.lock(function*() {
        called = true;
        return 'hello universe';
      });
    }

    yield sem.acquire();
    var fut = Future(blk);

    sem.count.should.equal(-1);
    sem.length.should.equal(1);
    called.should.be.false;

    sem.release();
    yield fut.wait();

    sem.count.should.equal(1);
    sem.length.should.equal(0);
    called.should.be.true;
    fut.unwrap().should.equal('hello universe');
  }));
});

suite('.flush()', function() {
  test('notify al of release', co(function*() {
    var calls = [];
    var sem = new Semaphore();

    for (var i = 0; i < 10; i++) {
      co(function *acq() {
        yield sem.acquire();
        calls.push(true);
      })();
    }

    sem.count.should.equal(-9);
    sem.length.should.equal(9);

    sem.flush();
    yield wait(10);

    sem.count.should.equal(1);
    sem.length.should.equal(0);
    calls.length.should.equal(10);
  }));
});
