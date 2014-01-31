# co-semaphore

[![Build Status](https://travis-ci.org/logicalparadox/co-semaphore.png?branch=master)](https://travis-ci.org/logicalparadox/co-semaphore)

> Count [semaphore](http://en.wikipedia.org/wiki/Semaphore_(programming)#Semantics_and_implementation) primitive for generator flow-control.

## Installation

#### Node.js

`co-semaphore` is available through [npm](http://npmjs.org):

    npm install co-semaphore

## Example

```js
"use strict";

var co = require('co');
var Semaphore = require('co-semaphore').Semaphore;

function rand() {
  return Math.floor(Math.random() * 10) * 100;
}

function *read(i, lock) {
  yield lock.acquire();
  console.log('start:', i);
  yield wait(rand());
  lock.release();
  console.log('end:', i);
  return i * 10;
}

co(function *main() {
  var lock = new Semaphore(3);
  var res = [];

  for (let i = 1; i < 11; i++) {
    res.push(read(i, lock));
  }

  console.log('res', yield res);
})();
```

## Usage

A low-level counted semaphore lock.

* **@param** _{Number}_ workers 

### .length

Get length of waiting queue.

* **@return** _{Number}_  length

### .acquired

Get the current number of workers; threads which
have acquired the lock but not yet released it.

* **@return** _{Number}_  acquisitions

### .available

Get the current number of unassigned workers;
count of threads which can immediately acquire
access without being put in the waiting queue.

* **@return** _{Number}_  available

### .count

Get count of semaphore state.

* **@return** _{Number}_  count

### .acquire()

Acquire permission to access shared resources.

```js
yield sem.acquire();
```

### .release()

Notify release of access to shared resources
to a single waiting `.acquire()`.

* **@return** _{Boolean}_  release signalled acquire

```js
var hadListener = sem.release();
```

### .flush()

Notify release of access to shared resources
to all waiting `.acquire()`s.

* **@return** _{Boolean}_  release signalled acquire

```js
var hadListeners = sem.flush();
```

### .lock()

Acquire access to shared resources with closure. Access will
be acquired prior to invoking the closure and unlocked as the 
closure unwinds.

* **@param** _{Generator}_ closure 

```js
var res = yield sem.lock(function*() {
  // do async work with lock owned
  yield wait(100);
  return { hello: 'universe' };
});
```


## License

(The MIT License)

Copyright (c) 2014 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
