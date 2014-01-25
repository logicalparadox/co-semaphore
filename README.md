# co-future 

[![Build Status](https://travis-ci.org/logicalparadox/co-future.png?branch=master)](https://travis-ci.org/logicalparadox/co-future)

> Wrap a generator function in a future for fine-grained resolution control.

## Installation

#### Node.js

`co-future` is available through [npm](http://npmjs.org):

    npm install co-future

## Example

```js
var co = require('co');
var future = require('co-future');

function *blk() {
  yield wait(100); // async stuff
  return { hello: 'universe' };
}

co(function *main() {
  var fut = future(blk);          // start calc

  yield wait(50);                 // do other things
  yield fut.wait();               // wait for resolution

  if (fut.err) {                  // check for error
    var msg = fut.err.message;
    console.error('error:', msg); 
  }

  console.log(fut.unwrap());      // unwrap val or throw error
})();
```

## Usage

Future implementation for generator functions. Wraps
and invokes generator using `co` on construction.
Will not throw error of resolved future until `.unwrap()`
so can be used as generator try/catch replacement.

* **@param** _{Generator}_ closure 
* **@param** _{Array}_ argv 
* **@param** _{Mixed}_ context for closure

```js
var future = require('co-future');

function*() {
  var res = yield future(do.something()).wait();
  return res.unwrap();
}
```

### .err

Get error or `false` of resolved future. Unlike
`.unwrap()`, will not throw.

* **@return** _{Mixed}_  error or `false`

```js
if (fut.err) console.error(fut.err.message);
```

### .res

Get result or `undefined` of resolved future.

* **@return** _{Boolean}_  resolved

```js
if (!fut.err) console.log(fut.res);
```

### .wait()

Wait for future to resolve. On resolution will
yield the future for further chaining. Use `.unwrap()`
to get actual value.

```js
// wait immediately on new future
var fut = yield future(do.something(req)).wait();

// wait for existing future
yield fut.wait();
```


### .unwrap()

Unwrap the value stored in the future after
resolution. If the future is currently storing
an error it will be thrown.

* **@return** _{Mixed}_  success result

```js
return res.unwrap();
````


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
