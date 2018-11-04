((window["webpackJsonp"] = window["webpackJsonp"] || []).push([["static\\development\\pages\\calculator.js"],{

/***/ "../node_modules/event-lite/event-lite.js":
/*!************************************************!*\
  !*** ../node_modules/event-lite/event-lite.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */

function EventLite() {
  if (!(this instanceof EventLite)) return new EventLite();
}

(function(EventLite) {
  // export the class for node.js
  if (true) module.exports = EventLite;

  // property name to hold listeners
  var LISTENERS = "listeners";

  // methods to export
  var methods = {
    on: on,
    once: once,
    off: off,
    emit: emit
  };

  // mixin to self
  mixin(EventLite.prototype);

  // export mixin function
  EventLite.mixin = mixin;

  /**
   * Import on(), once(), off() and emit() methods into target object.
   *
   * @function EventLite.mixin
   * @param target {Prototype}
   */

  function mixin(target) {
    for (var key in methods) {
      target[key] = methods[key];
    }
    return target;
  }

  /**
   * Add an event listener.
   *
   * @function EventLite.prototype.on
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function on(type, func) {
    getListeners(this, type).push(func);
    return this;
  }

  /**
   * Add one-time event listener.
   *
   * @function EventLite.prototype.once
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function once(type, func) {
    var that = this;
    wrap.originalListener = func;
    getListeners(that, type).push(wrap);
    return that;

    function wrap() {
      off.call(that, type, wrap);
      func.apply(this, arguments);
    }
  }

  /**
   * Remove an event listener.
   *
   * @function EventLite.prototype.off
   * @param [type] {string}
   * @param [func] {Function}
   * @returns {EventLite} Self for method chaining
   */

  function off(type, func) {
    var that = this;
    var listners;
    if (!arguments.length) {
      delete that[LISTENERS];
    } else if (!func) {
      listners = that[LISTENERS];
      if (listners) {
        delete listners[type];
        if (!Object.keys(listners).length) return off.call(that);
      }
    } else {
      listners = getListeners(that, type, true);
      if (listners) {
        listners = listners.filter(ne);
        if (!listners.length) return off.call(that, type);
        that[LISTENERS][type] = listners;
      }
    }
    return that;

    function ne(test) {
      return test !== func && test.originalListener !== func;
    }
  }

  /**
   * Dispatch (trigger) an event.
   *
   * @function EventLite.prototype.emit
   * @param type {string}
   * @param [value] {*}
   * @returns {boolean} True when a listener received the event
   */

  function emit(type, value) {
    var that = this;
    var listeners = getListeners(that, type, true);
    if (!listeners) return false;
    var arglen = arguments.length;
    if (arglen === 1) {
      listeners.forEach(zeroarg);
    } else if (arglen === 2) {
      listeners.forEach(onearg);
    } else {
      var args = Array.prototype.slice.call(arguments, 1);
      listeners.forEach(moreargs);
    }
    return !!listeners.length;

    function zeroarg(func) {
      func.call(that);
    }

    function onearg(func) {
      func.call(that, value);
    }

    function moreargs(func) {
      func.apply(that, args);
    }
  }

  /**
   * @ignore
   */

  function getListeners(that, type, readonly) {
    if (readonly && !that[LISTENERS]) return;
    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
    return listeners[type] || (listeners[type] = []);
  }

})(EventLite);


/***/ }),

/***/ "../node_modules/ieee754/index.js":
/*!****************************************!*\
  !*** ../node_modules/ieee754/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "../node_modules/int64-buffer/int64-buffer.js":
/*!****************************************************!*\
  !*** ../node_modules/int64-buffer/int64-buffer.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

var Uint64BE, Int64BE, Uint64LE, Int64LE;

!function(exports) {
  // constants

  var UNDEFINED = "undefined";
  var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
  var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
  var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var isArray = Array.isArray || _isArray;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  // storage class

  var storage; // Array;

  // generate classes

  Uint64BE = factory("Uint64BE", true, true);
  Int64BE = factory("Int64BE", true, false);
  Uint64LE = factory("Uint64LE", false, true);
  Int64LE = factory("Int64LE", false, false);

  // class factory

  function factory(name, bigendian, unsigned) {
    var posH = bigendian ? 0 : 4;
    var posL = bigendian ? 4 : 0;
    var pos0 = bigendian ? 0 : 3;
    var pos1 = bigendian ? 1 : 2;
    var pos2 = bigendian ? 2 : 1;
    var pos3 = bigendian ? 3 : 0;
    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
    var proto = Int64.prototype;
    var isName = "is" + name;
    var _isInt64 = "_" + isName;

    // properties
    proto.buffer = void 0;
    proto.offset = 0;
    proto[_isInt64] = true;

    // methods
    proto.toNumber = toNumber;
    proto.toString = toString;
    proto.toJSON = toNumber;
    proto.toArray = toArray;

    // add .toBuffer() method only when Buffer available
    if (BUFFER) proto.toBuffer = toBuffer;

    // add .toArrayBuffer() method only when Uint8Array available
    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

    // isUint64BE, isInt64BE
    Int64[isName] = isInt64;

    // CommonJS
    exports[name] = Int64;

    return Int64;

    // constructor
    function Int64(buffer, offset, value, raddix) {
      if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
      return init(this, buffer, offset, value, raddix);
    }

    // isUint64BE, isInt64BE
    function isInt64(b) {
      return !!(b && b[_isInt64]);
    }

    // initializer
    function init(that, buffer, offset, value, raddix) {
      if (UINT8ARRAY && ARRAYBUFFER) {
        if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
        if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
      }

      // Int64BE() style
      if (!buffer && !offset && !value && !storage) {
        // shortcut to initialize with zero
        that.buffer = newArray(ZERO, 0);
        return;
      }

      // Int64BE(value, raddix) style
      if (!isValidBuffer(buffer, offset)) {
        var _storage = storage || Array;
        raddix = offset;
        value = buffer;
        offset = 0;
        buffer = new _storage(8);
      }

      that.buffer = buffer;
      that.offset = offset |= 0;

      // Int64BE(buffer, offset) style
      if (UNDEFINED === typeof value) return;

      // Int64BE(buffer, offset, value, raddix) style
      if ("string" === typeof value) {
        fromString(buffer, offset, value, raddix || 10);
      } else if (isValidBuffer(value, raddix)) {
        fromArray(buffer, offset, value, raddix);
      } else if ("number" === typeof raddix) {
        writeInt32(buffer, offset + posH, value); // high
        writeInt32(buffer, offset + posL, raddix); // low
      } else if (value > 0) {
        fromPositive(buffer, offset, value); // positive
      } else if (value < 0) {
        fromNegative(buffer, offset, value); // negative
      } else {
        fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
      }
    }

    function fromString(buffer, offset, str, raddix) {
      var pos = 0;
      var len = str.length;
      var high = 0;
      var low = 0;
      if (str[0] === "-") pos++;
      var sign = pos;
      while (pos < len) {
        var chr = parseInt(str[pos++], raddix);
        if (!(chr >= 0)) break; // NaN
        low = low * raddix + chr;
        high = high * raddix + Math.floor(low / BIT32);
        low %= BIT32;
      }
      if (sign) {
        high = ~high;
        if (low) {
          low = BIT32 - low;
        } else {
          high++;
        }
      }
      writeInt32(buffer, offset + posH, high);
      writeInt32(buffer, offset + posL, low);
    }

    function toNumber() {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      if (!unsigned) high |= 0; // a trick to get signed
      return high ? (high * BIT32 + low) : low;
    }

    function toString(radix) {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      var str = "";
      var sign = !unsigned && (high & 0x80000000);
      if (sign) {
        high = ~high;
        low = BIT32 - low;
      }
      radix = radix || 10;
      while (1) {
        var mod = (high % radix) * BIT32 + low;
        high = Math.floor(high / radix);
        low = Math.floor(mod / radix);
        str = (mod % radix).toString(radix) + str;
        if (!high && !low) break;
      }
      if (sign) {
        str = "-" + str;
      }
      return str;
    }

    function writeInt32(buffer, offset, value) {
      buffer[offset + pos3] = value & 255;
      value = value >> 8;
      buffer[offset + pos2] = value & 255;
      value = value >> 8;
      buffer[offset + pos1] = value & 255;
      value = value >> 8;
      buffer[offset + pos0] = value & 255;
    }

    function readInt32(buffer, offset) {
      return (buffer[offset + pos0] * BIT24) +
        (buffer[offset + pos1] << 16) +
        (buffer[offset + pos2] << 8) +
        buffer[offset + pos3];
    }
  }

  function toArray(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = null; // Array
    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
    return newArray(buffer, offset);
  }

  function toBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = BUFFER;
    if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
    var dest = new BUFFER(8);
    fromArray(dest, 0, buffer, offset);
    return dest;
  }

  function toArrayBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    var arrbuf = buffer.buffer;
    storage = UINT8ARRAY;
    if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
    var dest = new UINT8ARRAY(8);
    fromArray(dest, 0, buffer, offset);
    return dest.buffer;
  }

  function isValidBuffer(buffer, offset) {
    var len = buffer && buffer.length;
    offset |= 0;
    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
  }

  function fromArray(destbuf, destoff, srcbuf, srcoff) {
    destoff |= 0;
    srcoff |= 0;
    for (var i = 0; i < 8; i++) {
      destbuf[destoff++] = srcbuf[srcoff++] & 255;
    }
  }

  function newArray(buffer, offset) {
    return Array.prototype.slice.call(buffer, offset, offset + 8);
  }

  function fromPositiveBE(buffer, offset, value) {
    var pos = offset + 8;
    while (pos > offset) {
      buffer[--pos] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeBE(buffer, offset, value) {
    var pos = offset + 8;
    value++;
    while (pos > offset) {
      buffer[--pos] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  function fromPositiveLE(buffer, offset, value) {
    var end = offset + 8;
    while (offset < end) {
      buffer[offset++] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeLE(buffer, offset, value) {
    var end = offset + 8;
    value++;
    while (offset < end) {
      buffer[offset++] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  // https://github.com/retrofox/is-array
  function _isArray(val) {
    return !!val && "[object Array]" == Object.prototype.toString.call(val);
  }

}(typeof exports === 'object' && typeof exports.nodeName !== 'string' ? exports : (this || {}));


/***/ }),

/***/ "../node_modules/isarray/index.js":
/*!****************************************!*\
  !*** ../node_modules/isarray/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/browser.js":
/*!***************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// browser.js

exports.encode = __webpack_require__(/*! ./encode */ "../node_modules/msgpack-lite/lib/encode.js").encode;
exports.decode = __webpack_require__(/*! ./decode */ "../node_modules/msgpack-lite/lib/decode.js").decode;

exports.Encoder = __webpack_require__(/*! ./encoder */ "../node_modules/msgpack-lite/lib/encoder.js").Encoder;
exports.Decoder = __webpack_require__(/*! ./decoder */ "../node_modules/msgpack-lite/lib/decoder.js").Decoder;

exports.createCodec = __webpack_require__(/*! ./ext */ "../node_modules/msgpack-lite/lib/ext.js").createCodec;
exports.codec = __webpack_require__(/*! ./codec */ "../node_modules/msgpack-lite/lib/codec.js").codec;


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/buffer-global.js":
/*!*********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/buffer-global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals Buffer */

module.exports =
  c(("undefined" !== typeof Buffer) && Buffer) ||
  c(this.Buffer) ||
  c(("undefined" !== typeof window) && window.Buffer) ||
  this.Buffer;

function c(B) {
  return B && B.isBuffer && B;
}

/***/ }),

/***/ "../node_modules/msgpack-lite/lib/buffer-lite.js":
/*!*******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/buffer-lite.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// buffer-lite.js

var MAXBUFLEN = 8192;

exports.copy = copy;
exports.toString = toString;
exports.write = write;

/**
 * Buffer.prototype.write()
 *
 * @param string {String}
 * @param [offset] {Number}
 * @returns {Number}
 */

function write(string, offset) {
  var buffer = this;
  var index = offset || (offset |= 0);
  var length = string.length;
  var chr = 0;
  var i = 0;
  while (i < length) {
    chr = string.charCodeAt(i++);

    if (chr < 128) {
      buffer[index++] = chr;
    } else if (chr < 0x800) {
      // 2 bytes
      buffer[index++] = 0xC0 | (chr >>> 6);
      buffer[index++] = 0x80 | (chr & 0x3F);
    } else if (chr < 0xD800 || chr > 0xDFFF) {
      // 3 bytes
      buffer[index++] = 0xE0 | (chr  >>> 12);
      buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
      buffer[index++] = 0x80 | (chr          & 0x3F);
    } else {
      // 4 bytes - surrogate pair
      chr = (((chr - 0xD800) << 10) | (string.charCodeAt(i++) - 0xDC00)) + 0x10000;
      buffer[index++] = 0xF0 | (chr >>> 18);
      buffer[index++] = 0x80 | ((chr >>> 12) & 0x3F);
      buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
      buffer[index++] = 0x80 | (chr          & 0x3F);
    }
  }
  return index - offset;
}

/**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

function toString(encoding, start, end) {
  var buffer = this;
  var index = start|0;
  if (!end) end = buffer.length;
  var string = '';
  var chr = 0;

  while (index < end) {
    chr = buffer[index++];
    if (chr < 128) {
      string += String.fromCharCode(chr);
      continue;
    }

    if ((chr & 0xE0) === 0xC0) {
      // 2 bytes
      chr = (chr & 0x1F) << 6 |
            (buffer[index++] & 0x3F);

    } else if ((chr & 0xF0) === 0xE0) {
      // 3 bytes
      chr = (chr & 0x0F)             << 12 |
            (buffer[index++] & 0x3F) << 6  |
            (buffer[index++] & 0x3F);

    } else if ((chr & 0xF8) === 0xF0) {
      // 4 bytes
      chr = (chr & 0x07)             << 18 |
            (buffer[index++] & 0x3F) << 12 |
            (buffer[index++] & 0x3F) << 6  |
            (buffer[index++] & 0x3F);
    }

    if (chr >= 0x010000) {
      // A surrogate pair
      chr -= 0x010000;

      string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
    } else {
      string += String.fromCharCode(chr);
    }
  }

  return string;
}

/**
 * Buffer.prototype.copy()
 *
 * @param target {Buffer}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {number}
 */

function copy(target, targetStart, start, end) {
  var i;
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (!targetStart) targetStart = 0;
  var len = end - start;

  if (target === this && start < targetStart && targetStart < end) {
    // descending
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    // ascending
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start];
    }
  }

  return len;
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/bufferish-array.js":
/*!***********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/bufferish-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// bufferish-array.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");

var exports = module.exports = alloc(0);

exports.alloc = alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Array(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Array}
 */

function from(value) {
  if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
    // TypedArray to Uint8Array
    value = Bufferish.Uint8Array.from(value);
  } else if (Bufferish.isArrayBuffer(value)) {
    // ArrayBuffer to Uint8Array
    value = new Uint8Array(value);
  } else if (typeof value === "string") {
    // String to Array
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  // Array-like to Array
  return Array.prototype.slice.call(value);
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/bufferish-buffer.js":
/*!************************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/bufferish-buffer.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// bufferish-buffer.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var exports = module.exports = Bufferish.hasBuffer ? alloc(0) : [];

exports.alloc = Bufferish.hasBuffer && Buffer.alloc || alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Buffer(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer}
 */

function from(value) {
  if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
    // TypedArray to Uint8Array
    value = Bufferish.Uint8Array.from(value);
  } else if (Bufferish.isArrayBuffer(value)) {
    // ArrayBuffer to Uint8Array
    value = new Uint8Array(value);
  } else if (typeof value === "string") {
    // String to Buffer
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  // Array-like to Buffer
  if (Buffer.from && Buffer.from.length !== 1) {
    return Buffer.from(value); // node v6+
  } else {
    return new Buffer(value); // node v4
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/bufferish-proto.js":
/*!***********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/bufferish-proto.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// bufferish-proto.js

/* jshint eqnull:true */

var BufferLite = __webpack_require__(/*! ./buffer-lite */ "../node_modules/msgpack-lite/lib/buffer-lite.js");

exports.copy = copy;
exports.slice = slice;
exports.toString = toString;
exports.write = gen("write");

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var isBufferShim = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var brokenTypedArray = isBufferShim && !Buffer.TYPED_ARRAY_SUPPORT;

/**
 * @param target {Buffer|Uint8Array|Array}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function copy(target, targetStart, start, end) {
  var thisIsBuffer = Bufferish.isBuffer(this);
  var targetIsBuffer = Bufferish.isBuffer(target);
  if (thisIsBuffer && targetIsBuffer) {
    // Buffer to Buffer
    return this.copy(target, targetStart, start, end);
  } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer &&
    Bufferish.isView(this) && Bufferish.isView(target)) {
    // Uint8Array to Uint8Array (except for minor some browsers)
    var buffer = (start || end != null) ? slice.call(this, start, end) : this;
    target.set(buffer, targetStart);
    return buffer.length;
  } else {
    // other cases
    return BufferLite.copy.call(this, target, targetStart, start, end);
  }
}

/**
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function slice(start, end) {
  // for Buffer, Uint8Array (except for minor some browsers) and Array
  var f = this.slice || (!brokenTypedArray && this.subarray);
  if (f) return f.call(this, start, end);

  // Uint8Array (for minor some browsers)
  var target = Bufferish.alloc.call(this, end - start);
  copy.call(this, target, 0, start, end);
  return target;
}

/**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

function toString(encoding, start, end) {
  var f = (!isBufferShim && Bufferish.isBuffer(this)) ? this.toString : BufferLite.toString;
  return f.apply(this, arguments);
}

/**
 * @private
 */

function gen(method) {
  return wrap;

  function wrap() {
    var f = this[method] || BufferLite[method];
    return f.apply(this, arguments);
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/bufferish-uint8array.js":
/*!****************************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/bufferish-uint8array.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// bufferish-uint8array.js

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");

var exports = module.exports = Bufferish.hasArrayBuffer ? alloc(0) : [];

exports.alloc = alloc;
exports.concat = Bufferish.concat;
exports.from = from;

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return new Uint8Array(size);
}

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Uint8Array}
 */

function from(value) {
  if (Bufferish.isView(value)) {
    // TypedArray to ArrayBuffer
    var byteOffset = value.byteOffset;
    var byteLength = value.byteLength;
    value = value.buffer;
    if (value.byteLength !== byteLength) {
      if (value.slice) {
        value = value.slice(byteOffset, byteOffset + byteLength);
      } else {
        // Android 4.1 does not have ArrayBuffer.prototype.slice
        value = new Uint8Array(value);
        if (value.byteLength !== byteLength) {
          // TypedArray to ArrayBuffer to Uint8Array to Array
          value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
        }
      }
    }
  } else if (typeof value === "string") {
    // String to Uint8Array
    return Bufferish.from.call(exports, value);
  } else if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  return new Uint8Array(value);
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/bufferish.js":
/*!*****************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/bufferish.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// bufferish.js

var Buffer = exports.global = __webpack_require__(/*! ./buffer-global */ "../node_modules/msgpack-lite/lib/buffer-global.js");
var hasBuffer = exports.hasBuffer = Buffer && !!Buffer.isBuffer;
var hasArrayBuffer = exports.hasArrayBuffer = ("undefined" !== typeof ArrayBuffer);

var isArray = exports.isArray = __webpack_require__(/*! isarray */ "../node_modules/isarray/index.js");
exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
var isBuffer = exports.isBuffer = hasBuffer ? Buffer.isBuffer : _false;
var isView = exports.isView = hasArrayBuffer ? (ArrayBuffer.isView || _is("ArrayBuffer", "buffer")) : _false;

exports.alloc = alloc;
exports.concat = concat;
exports.from = from;

var BufferArray = exports.Array = __webpack_require__(/*! ./bufferish-array */ "../node_modules/msgpack-lite/lib/bufferish-array.js");
var BufferBuffer = exports.Buffer = __webpack_require__(/*! ./bufferish-buffer */ "../node_modules/msgpack-lite/lib/bufferish-buffer.js");
var BufferUint8Array = exports.Uint8Array = __webpack_require__(/*! ./bufferish-uint8array */ "../node_modules/msgpack-lite/lib/bufferish-uint8array.js");
var BufferProto = exports.prototype = __webpack_require__(/*! ./bufferish-proto */ "../node_modules/msgpack-lite/lib/bufferish-proto.js");

/**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer|Uint8Array|Array}
 */

function from(value) {
  if (typeof value === "string") {
    return fromString.call(this, value);
  } else {
    return auto(this).from(value);
  }
}

/**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

function alloc(size) {
  return auto(this).alloc(size);
}

/**
 * @param list {Array} array of (Buffer|Uint8Array|Array)s
 * @param [length]
 * @returns {Buffer|Uint8Array|Array}
 */

function concat(list, length) {
  if (!length) {
    length = 0;
    Array.prototype.forEach.call(list, dryrun);
  }
  var ref = (this !== exports) && this || list[0];
  var result = alloc.call(ref, length);
  var offset = 0;
  Array.prototype.forEach.call(list, append);
  return result;

  function dryrun(buffer) {
    length += buffer.length;
  }

  function append(buffer) {
    offset += BufferProto.copy.call(buffer, result, offset);
  }
}

var _isArrayBuffer = _is("ArrayBuffer");

function isArrayBuffer(value) {
  return (value instanceof ArrayBuffer) || _isArrayBuffer(value);
}

/**
 * @private
 */

function fromString(value) {
  var expected = value.length * 3;
  var that = alloc.call(this, expected);
  var actual = BufferProto.write.call(that, value);
  if (expected !== actual) {
    that = BufferProto.slice.call(that, 0, actual);
  }
  return that;
}

function auto(that) {
  return isBuffer(that) ? BufferBuffer
    : isView(that) ? BufferUint8Array
    : isArray(that) ? BufferArray
    : hasBuffer ? BufferBuffer
    : hasArrayBuffer ? BufferUint8Array
    : BufferArray;
}

function _false() {
  return false;
}

function _is(name, key) {
  /* jshint eqnull:true */
  name = "[object " + name + "]";
  return function(value) {
    return (value != null) && {}.toString.call(key ? value[key] : value) === name;
  };
}

/***/ }),

/***/ "../node_modules/msgpack-lite/lib/codec-base.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/codec-base.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// codec-base.js

var IS_ARRAY = __webpack_require__(/*! isarray */ "../node_modules/isarray/index.js");

exports.createCodec = createCodec;
exports.install = install;
exports.filter = filter;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");

function Codec(options) {
  if (!(this instanceof Codec)) return new Codec(options);
  this.options = options;
  this.init();
}

Codec.prototype.init = function() {
  var options = this.options;

  if (options && options.uint8array) {
    this.bufferish = Bufferish.Uint8Array;
  }

  return this;
};

function install(props) {
  for (var key in props) {
    Codec.prototype[key] = add(Codec.prototype[key], props[key]);
  }
}

function add(a, b) {
  return (a && b) ? ab : (a || b);

  function ab() {
    a.apply(this, arguments);
    return b.apply(this, arguments);
  }
}

function join(filters) {
  filters = filters.slice();

  return function(value) {
    return filters.reduce(iterator, value);
  };

  function iterator(value, filter) {
    return filter(value);
  }
}

function filter(filter) {
  return IS_ARRAY(filter) ? join(filter) : filter;
}

// @public
// msgpack.createCodec()

function createCodec(options) {
  return new Codec(options);
}

// default shared codec

exports.preset = createCodec({preset: true});


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/codec.js":
/*!*************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/codec.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// codec.js

// load both interfaces
__webpack_require__(/*! ./read-core */ "../node_modules/msgpack-lite/lib/read-core.js");
__webpack_require__(/*! ./write-core */ "../node_modules/msgpack-lite/lib/write-core.js");

// @public
// msgpack.codec.preset

exports.codec = {
  preset: __webpack_require__(/*! ./codec-base */ "../node_modules/msgpack-lite/lib/codec-base.js").preset
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/decode-buffer.js":
/*!*********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/decode-buffer.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// decode-buffer.js

exports.DecodeBuffer = DecodeBuffer;

var preset = __webpack_require__(/*! ./read-core */ "../node_modules/msgpack-lite/lib/read-core.js").preset;

var FlexDecoder = __webpack_require__(/*! ./flex-buffer */ "../node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder;

FlexDecoder.mixin(DecodeBuffer.prototype);

function DecodeBuffer(options) {
  if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);

  if (options) {
    this.options = options;
    if (options.codec) {
      var codec = this.codec = options.codec;
      if (codec.bufferish) this.bufferish = codec.bufferish;
    }
  }
}

DecodeBuffer.prototype.codec = preset;

DecodeBuffer.prototype.fetch = function() {
  return this.codec.decode(this);
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/decode.js":
/*!**************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/decode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// decode.js

exports.decode = decode;

var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "../node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function decode(input, options) {
  var decoder = new DecodeBuffer(options);
  decoder.write(input);
  return decoder.read();
}

/***/ }),

/***/ "../node_modules/msgpack-lite/lib/decoder.js":
/*!***************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/decoder.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// decoder.js

exports.Decoder = Decoder;

var EventLite = __webpack_require__(/*! event-lite */ "../node_modules/event-lite/event-lite.js");
var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "../node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function Decoder(options) {
  if (!(this instanceof Decoder)) return new Decoder(options);
  DecodeBuffer.call(this, options);
}

Decoder.prototype = new DecodeBuffer();

EventLite.mixin(Decoder.prototype);

Decoder.prototype.decode = function(chunk) {
  if (arguments.length) this.write(chunk);
  this.flush();
};

Decoder.prototype.push = function(chunk) {
  this.emit("data", chunk);
};

Decoder.prototype.end = function(chunk) {
  this.decode(chunk);
  this.emit("end");
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/encode-buffer.js":
/*!*********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/encode-buffer.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// encode-buffer.js

exports.EncodeBuffer = EncodeBuffer;

var preset = __webpack_require__(/*! ./write-core */ "../node_modules/msgpack-lite/lib/write-core.js").preset;

var FlexEncoder = __webpack_require__(/*! ./flex-buffer */ "../node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder;

FlexEncoder.mixin(EncodeBuffer.prototype);

function EncodeBuffer(options) {
  if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);

  if (options) {
    this.options = options;
    if (options.codec) {
      var codec = this.codec = options.codec;
      if (codec.bufferish) this.bufferish = codec.bufferish;
    }
  }
}

EncodeBuffer.prototype.codec = preset;

EncodeBuffer.prototype.write = function(input) {
  this.codec.encode(this, input);
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/encode.js":
/*!**************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/encode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// encode.js

exports.encode = encode;

var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "../node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function encode(input, options) {
  var encoder = new EncodeBuffer(options);
  encoder.write(input);
  return encoder.read();
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/encoder.js":
/*!***************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/encoder.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// encoder.js

exports.Encoder = Encoder;

var EventLite = __webpack_require__(/*! event-lite */ "../node_modules/event-lite/event-lite.js");
var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "../node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function Encoder(options) {
  if (!(this instanceof Encoder)) return new Encoder(options);
  EncodeBuffer.call(this, options);
}

Encoder.prototype = new EncodeBuffer();

EventLite.mixin(Encoder.prototype);

Encoder.prototype.encode = function(chunk) {
  this.write(chunk);
  this.emit("data", this.read());
};

Encoder.prototype.end = function(chunk) {
  if (arguments.length) this.encode(chunk);
  this.flush();
  this.emit("end");
};


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/ext-buffer.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/ext-buffer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ext-buffer.js

exports.ExtBuffer = ExtBuffer;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");

function ExtBuffer(buffer, type) {
  if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
  this.buffer = Bufferish.from(buffer);
  this.type = type;
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/ext-packer.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/ext-packer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ext-packer.js

exports.setExtPackers = setExtPackers;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var packTypedArray = Bufferish.Uint8Array.from;
var _encode;

var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

function setExtPackers(codec) {
  codec.addExtPacker(0x0E, Error, [packError, encode]);
  codec.addExtPacker(0x01, EvalError, [packError, encode]);
  codec.addExtPacker(0x02, RangeError, [packError, encode]);
  codec.addExtPacker(0x03, ReferenceError, [packError, encode]);
  codec.addExtPacker(0x04, SyntaxError, [packError, encode]);
  codec.addExtPacker(0x05, TypeError, [packError, encode]);
  codec.addExtPacker(0x06, URIError, [packError, encode]);

  codec.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
  codec.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
  codec.addExtPacker(0x0C, String, [packValueOf, encode]);
  codec.addExtPacker(0x0D, Date, [Number, encode]);
  codec.addExtPacker(0x0F, Number, [packValueOf, encode]);

  if ("undefined" !== typeof Uint8Array) {
    codec.addExtPacker(0x11, Int8Array, packTypedArray);
    codec.addExtPacker(0x12, Uint8Array, packTypedArray);
    codec.addExtPacker(0x13, Int16Array, packTypedArray);
    codec.addExtPacker(0x14, Uint16Array, packTypedArray);
    codec.addExtPacker(0x15, Int32Array, packTypedArray);
    codec.addExtPacker(0x16, Uint32Array, packTypedArray);
    codec.addExtPacker(0x17, Float32Array, packTypedArray);

    // PhantomJS/1.9.7 doesn't have Float64Array
    if ("undefined" !== typeof Float64Array) {
      codec.addExtPacker(0x18, Float64Array, packTypedArray);
    }

    // IE10 doesn't have Uint8ClampedArray
    if ("undefined" !== typeof Uint8ClampedArray) {
      codec.addExtPacker(0x19, Uint8ClampedArray, packTypedArray);
    }

    codec.addExtPacker(0x1A, ArrayBuffer, packTypedArray);
    codec.addExtPacker(0x1D, DataView, packTypedArray);
  }

  if (Bufferish.hasBuffer) {
    codec.addExtPacker(0x1B, Buffer, Bufferish.from);
  }
}

function encode(input) {
  if (!_encode) _encode = __webpack_require__(/*! ./encode */ "../node_modules/msgpack-lite/lib/encode.js").encode; // lazy load
  return _encode(input);
}

function packValueOf(value) {
  return (value).valueOf();
}

function packRegExp(value) {
  value = RegExp.prototype.toString.call(value).split("/");
  value.shift();
  var out = [value.pop()];
  out.unshift(value.join("/"));
  return out;
}

function packError(value) {
  var out = {};
  for (var key in ERROR_COLUMNS) {
    out[key] = value[key];
  }
  return out;
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/ext-unpacker.js":
/*!********************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/ext-unpacker.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ext-unpacker.js

exports.setExtUnpackers = setExtUnpackers;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var _decode;

var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

function setExtUnpackers(codec) {
  codec.addExtUnpacker(0x0E, [decode, unpackError(Error)]);
  codec.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
  codec.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
  codec.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
  codec.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
  codec.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
  codec.addExtUnpacker(0x06, [decode, unpackError(URIError)]);

  codec.addExtUnpacker(0x0A, [decode, unpackRegExp]);
  codec.addExtUnpacker(0x0B, [decode, unpackClass(Boolean)]);
  codec.addExtUnpacker(0x0C, [decode, unpackClass(String)]);
  codec.addExtUnpacker(0x0D, [decode, unpackClass(Date)]);
  codec.addExtUnpacker(0x0F, [decode, unpackClass(Number)]);

  if ("undefined" !== typeof Uint8Array) {
    codec.addExtUnpacker(0x11, unpackClass(Int8Array));
    codec.addExtUnpacker(0x12, unpackClass(Uint8Array));
    codec.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array)]);
    codec.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array)]);
    codec.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array)]);
    codec.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array)]);
    codec.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array)]);

    // PhantomJS/1.9.7 doesn't have Float64Array
    if ("undefined" !== typeof Float64Array) {
      codec.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array)]);
    }

    // IE10 doesn't have Uint8ClampedArray
    if ("undefined" !== typeof Uint8ClampedArray) {
      codec.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
    }

    codec.addExtUnpacker(0x1A, unpackArrayBuffer);
    codec.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
  }

  if (Bufferish.hasBuffer) {
    codec.addExtUnpacker(0x1B, unpackClass(Buffer));
  }
}

function decode(input) {
  if (!_decode) _decode = __webpack_require__(/*! ./decode */ "../node_modules/msgpack-lite/lib/decode.js").decode; // lazy load
  return _decode(input);
}

function unpackRegExp(value) {
  return RegExp.apply(null, value);
}

function unpackError(Class) {
  return function(value) {
    var out = new Class();
    for (var key in ERROR_COLUMNS) {
      out[key] = value[key];
    }
    return out;
  };
}

function unpackClass(Class) {
  return function(value) {
    return new Class(value);
  };
}

function unpackArrayBuffer(value) {
  return (new Uint8Array(value)).buffer;
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/ext.js":
/*!***********************************************!*\
  !*** ../node_modules/msgpack-lite/lib/ext.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ext.js

// load both interfaces
__webpack_require__(/*! ./read-core */ "../node_modules/msgpack-lite/lib/read-core.js");
__webpack_require__(/*! ./write-core */ "../node_modules/msgpack-lite/lib/write-core.js");

exports.createCodec = __webpack_require__(/*! ./codec-base */ "../node_modules/msgpack-lite/lib/codec-base.js").createCodec;


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/flex-buffer.js":
/*!*******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/flex-buffer.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// flex-buffer.js

exports.FlexDecoder = FlexDecoder;
exports.FlexEncoder = FlexEncoder;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");

var MIN_BUFFER_SIZE = 2048;
var MAX_BUFFER_SIZE = 65536;
var BUFFER_SHORTAGE = "BUFFER_SHORTAGE";

function FlexDecoder() {
  if (!(this instanceof FlexDecoder)) return new FlexDecoder();
}

function FlexEncoder() {
  if (!(this instanceof FlexEncoder)) return new FlexEncoder();
}

FlexDecoder.mixin = mixinFactory(getDecoderMethods());
FlexDecoder.mixin(FlexDecoder.prototype);

FlexEncoder.mixin = mixinFactory(getEncoderMethods());
FlexEncoder.mixin(FlexEncoder.prototype);

function getDecoderMethods() {
  return {
    bufferish: Bufferish,
    write: write,
    fetch: fetch,
    flush: flush,
    push: push,
    pull: pull,
    read: read,
    reserve: reserve,
    offset: 0
  };

  function write(chunk) {
    var prev = this.offset ? Bufferish.prototype.slice.call(this.buffer, this.offset) : this.buffer;
    this.buffer = prev ? (chunk ? this.bufferish.concat([prev, chunk]) : prev) : chunk;
    this.offset = 0;
  }

  function flush() {
    while (this.offset < this.buffer.length) {
      var start = this.offset;
      var value;
      try {
        value = this.fetch();
      } catch (e) {
        if (e && e.message != BUFFER_SHORTAGE) throw e;
        // rollback
        this.offset = start;
        break;
      }
      this.push(value);
    }
  }

  function reserve(length) {
    var start = this.offset;
    var end = start + length;
    if (end > this.buffer.length) throw new Error(BUFFER_SHORTAGE);
    this.offset = end;
    return start;
  }
}

function getEncoderMethods() {
  return {
    bufferish: Bufferish,
    write: write,
    fetch: fetch,
    flush: flush,
    push: push,
    pull: pull,
    read: read,
    reserve: reserve,
    send: send,
    maxBufferSize: MAX_BUFFER_SIZE,
    minBufferSize: MIN_BUFFER_SIZE,
    offset: 0,
    start: 0
  };

  function fetch() {
    var start = this.start;
    if (start < this.offset) {
      var end = this.start = this.offset;
      return Bufferish.prototype.slice.call(this.buffer, start, end);
    }
  }

  function flush() {
    while (this.start < this.offset) {
      var value = this.fetch();
      if (value) this.push(value);
    }
  }

  function pull() {
    var buffers = this.buffers || (this.buffers = []);
    var chunk = buffers.length > 1 ? this.bufferish.concat(buffers) : buffers[0];
    buffers.length = 0; // buffer exhausted
    return chunk;
  }

  function reserve(length) {
    var req = length | 0;

    if (this.buffer) {
      var size = this.buffer.length;
      var start = this.offset | 0;
      var end = start + req;

      // is it long enough?
      if (end < size) {
        this.offset = end;
        return start;
      }

      // flush current buffer
      this.flush();

      // resize it to 2x current length
      length = Math.max(length, Math.min(size * 2, this.maxBufferSize));
    }

    // minimum buffer size
    length = Math.max(length, this.minBufferSize);

    // allocate new buffer
    this.buffer = this.bufferish.alloc(length);
    this.start = 0;
    this.offset = req;
    return 0;
  }

  function send(buffer) {
    var length = buffer.length;
    if (length > this.minBufferSize) {
      this.flush();
      this.push(buffer);
    } else {
      var offset = this.reserve(length);
      Bufferish.prototype.copy.call(buffer, this.buffer, offset);
    }
  }
}

// common methods

function write() {
  throw new Error("method not implemented: write()");
}

function fetch() {
  throw new Error("method not implemented: fetch()");
}

function read() {
  var length = this.buffers && this.buffers.length;

  // fetch the first result
  if (!length) return this.fetch();

  // flush current buffer
  this.flush();

  // read from the results
  return this.pull();
}

function push(chunk) {
  var buffers = this.buffers || (this.buffers = []);
  buffers.push(chunk);
}

function pull() {
  var buffers = this.buffers || (this.buffers = []);
  return buffers.shift();
}

function mixinFactory(source) {
  return mixin;

  function mixin(target) {
    for (var key in source) {
      target[key] = source[key];
    }
    return target;
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/read-core.js":
/*!*****************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/read-core.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// read-core.js

var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "../node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtUnpacker = __webpack_require__(/*! ./ext-unpacker */ "../node_modules/msgpack-lite/lib/ext-unpacker.js");
var readUint8 = __webpack_require__(/*! ./read-format */ "../node_modules/msgpack-lite/lib/read-format.js").readUint8;
var ReadToken = __webpack_require__(/*! ./read-token */ "../node_modules/msgpack-lite/lib/read-token.js");
var CodecBase = __webpack_require__(/*! ./codec-base */ "../node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
  addExtUnpacker: addExtUnpacker,
  getExtUnpacker: getExtUnpacker,
  init: init
});

exports.preset = init.call(CodecBase.preset);

function getDecoder(options) {
  var readToken = ReadToken.getReadToken(options);
  return decode;

  function decode(decoder) {
    var type = readUint8(decoder);
    var func = readToken[type];
    if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
    return func(decoder);
  }
}

function init() {
  var options = this.options;
  this.decode = getDecoder(options);

  if (options && options.preset) {
    ExtUnpacker.setExtUnpackers(this);
  }

  return this;
}

function addExtUnpacker(etype, unpacker) {
  var unpackers = this.extUnpackers || (this.extUnpackers = []);
  unpackers[etype] = CodecBase.filter(unpacker);
}

function getExtUnpacker(type) {
  var unpackers = this.extUnpackers || (this.extUnpackers = []);
  return unpackers[type] || extUnpacker;

  function extUnpacker(buffer) {
    return new ExtBuffer(buffer, type);
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/read-format.js":
/*!*******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/read-format.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// read-format.js

var ieee754 = __webpack_require__(/*! ieee754 */ "../node_modules/ieee754/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "../node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

exports.getReadFormat = getReadFormat;
exports.readUint8 = uint8;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "../node_modules/msgpack-lite/lib/bufferish-proto.js");

var HAS_MAP = ("undefined" !== typeof Map);
var NO_ASSERT = true;

function getReadFormat(options) {
  var binarraybuffer = Bufferish.hasArrayBuffer && options && options.binarraybuffer;
  var int64 = options && options.int64;
  var usemap = HAS_MAP && options && options.usemap;

  var readFormat = {
    map: (usemap ? map_to_map : map_to_obj),
    array: array,
    str: str,
    bin: (binarraybuffer ? bin_arraybuffer : bin_buffer),
    ext: ext,
    uint8: uint8,
    uint16: uint16,
    uint32: uint32,
    uint64: read(8, int64 ? readUInt64BE_int64 : readUInt64BE),
    int8: int8,
    int16: int16,
    int32: int32,
    int64: read(8, int64 ? readInt64BE_int64 : readInt64BE),
    float32: read(4, readFloatBE),
    float64: read(8, readDoubleBE)
  };

  return readFormat;
}

function map_to_obj(decoder, len) {
  var value = {};
  var i;
  var k = new Array(len);
  var v = new Array(len);

  var decode = decoder.codec.decode;
  for (i = 0; i < len; i++) {
    k[i] = decode(decoder);
    v[i] = decode(decoder);
  }
  for (i = 0; i < len; i++) {
    value[k[i]] = v[i];
  }
  return value;
}

function map_to_map(decoder, len) {
  var value = new Map();
  var i;
  var k = new Array(len);
  var v = new Array(len);

  var decode = decoder.codec.decode;
  for (i = 0; i < len; i++) {
    k[i] = decode(decoder);
    v[i] = decode(decoder);
  }
  for (i = 0; i < len; i++) {
    value.set(k[i], v[i]);
  }
  return value;
}

function array(decoder, len) {
  var value = new Array(len);
  var decode = decoder.codec.decode;
  for (var i = 0; i < len; i++) {
    value[i] = decode(decoder);
  }
  return value;
}

function str(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  return BufferProto.toString.call(decoder.buffer, "utf-8", start, end);
}

function bin_buffer(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return Bufferish.from(buf);
}

function bin_arraybuffer(decoder, len) {
  var start = decoder.reserve(len);
  var end = start + len;
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return Bufferish.Uint8Array.from(buf).buffer;
}

function ext(decoder, len) {
  var start = decoder.reserve(len+1);
  var type = decoder.buffer[start++];
  var end = start + len;
  var unpack = decoder.codec.getExtUnpacker(type);
  if (!unpack) throw new Error("Invalid ext type: " + (type ? ("0x" + type.toString(16)) : type));
  var buf = BufferProto.slice.call(decoder.buffer, start, end);
  return unpack(buf);
}

function uint8(decoder) {
  var start = decoder.reserve(1);
  return decoder.buffer[start];
}

function int8(decoder) {
  var start = decoder.reserve(1);
  var value = decoder.buffer[start];
  return (value & 0x80) ? value - 0x100 : value;
}

function uint16(decoder) {
  var start = decoder.reserve(2);
  var buffer = decoder.buffer;
  return (buffer[start++] << 8) | buffer[start];
}

function int16(decoder) {
  var start = decoder.reserve(2);
  var buffer = decoder.buffer;
  var value = (buffer[start++] << 8) | buffer[start];
  return (value & 0x8000) ? value - 0x10000 : value;
}

function uint32(decoder) {
  var start = decoder.reserve(4);
  var buffer = decoder.buffer;
  return (buffer[start++] * 16777216) + (buffer[start++] << 16) + (buffer[start++] << 8) + buffer[start];
}

function int32(decoder) {
  var start = decoder.reserve(4);
  var buffer = decoder.buffer;
  return (buffer[start++] << 24) | (buffer[start++] << 16) | (buffer[start++] << 8) | buffer[start];
}

function read(len, method) {
  return function(decoder) {
    var start = decoder.reserve(len);
    return method.call(decoder.buffer, start, NO_ASSERT);
  };
}

function readUInt64BE(start) {
  return new Uint64BE(this, start).toNumber();
}

function readInt64BE(start) {
  return new Int64BE(this, start).toNumber();
}

function readUInt64BE_int64(start) {
  return new Uint64BE(this, start);
}

function readInt64BE_int64(start) {
  return new Int64BE(this, start);
}

function readFloatBE(start) {
  return ieee754.read(this, start, false, 23, 4);
}

function readDoubleBE(start) {
  return ieee754.read(this, start, false, 52, 8);
}

/***/ }),

/***/ "../node_modules/msgpack-lite/lib/read-token.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/read-token.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// read-token.js

var ReadFormat = __webpack_require__(/*! ./read-format */ "../node_modules/msgpack-lite/lib/read-format.js");

exports.getReadToken = getReadToken;

function getReadToken(options) {
  var format = ReadFormat.getReadFormat(options);

  if (options && options.useraw) {
    return init_useraw(format);
  } else {
    return init_token(format);
  }
}

function init_token(format) {
  var i;
  var token = new Array(256);

  // positive fixint -- 0x00 - 0x7f
  for (i = 0x00; i <= 0x7f; i++) {
    token[i] = constant(i);
  }

  // fixmap -- 0x80 - 0x8f
  for (i = 0x80; i <= 0x8f; i++) {
    token[i] = fix(i - 0x80, format.map);
  }

  // fixarray -- 0x90 - 0x9f
  for (i = 0x90; i <= 0x9f; i++) {
    token[i] = fix(i - 0x90, format.array);
  }

  // fixstr -- 0xa0 - 0xbf
  for (i = 0xa0; i <= 0xbf; i++) {
    token[i] = fix(i - 0xa0, format.str);
  }

  // nil -- 0xc0
  token[0xc0] = constant(null);

  // (never used) -- 0xc1
  token[0xc1] = null;

  // false -- 0xc2
  // true -- 0xc3
  token[0xc2] = constant(false);
  token[0xc3] = constant(true);

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = flex(format.uint8, format.bin);
  token[0xc5] = flex(format.uint16, format.bin);
  token[0xc6] = flex(format.uint32, format.bin);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = flex(format.uint8, format.ext);
  token[0xc8] = flex(format.uint16, format.ext);
  token[0xc9] = flex(format.uint32, format.ext);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = format.float32;
  token[0xcb] = format.float64;

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = format.uint8;
  token[0xcd] = format.uint16;
  token[0xce] = format.uint32;
  token[0xcf] = format.uint64;

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = format.int8;
  token[0xd1] = format.int16;
  token[0xd2] = format.int32;
  token[0xd3] = format.int64;

  // fixext 1 -- 0xd4
  // fixext 2 -- 0xd5
  // fixext 4 -- 0xd6
  // fixext 8 -- 0xd7
  // fixext 16 -- 0xd8
  token[0xd4] = fix(1, format.ext);
  token[0xd5] = fix(2, format.ext);
  token[0xd6] = fix(4, format.ext);
  token[0xd7] = fix(8, format.ext);
  token[0xd8] = fix(16, format.ext);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = flex(format.uint8, format.str);
  token[0xda] = flex(format.uint16, format.str);
  token[0xdb] = flex(format.uint32, format.str);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = flex(format.uint16, format.array);
  token[0xdd] = flex(format.uint32, format.array);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = flex(format.uint16, format.map);
  token[0xdf] = flex(format.uint32, format.map);

  // negative fixint -- 0xe0 - 0xff
  for (i = 0xe0; i <= 0xff; i++) {
    token[i] = constant(i - 0x100);
  }

  return token;
}

function init_useraw(format) {
  var i;
  var token = init_token(format).slice();

  // raw 8 -- 0xd9
  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  token[0xd9] = token[0xc4];
  token[0xda] = token[0xc5];
  token[0xdb] = token[0xc6];

  // fixraw -- 0xa0 - 0xbf
  for (i = 0xa0; i <= 0xbf; i++) {
    token[i] = fix(i - 0xa0, format.bin);
  }

  return token;
}

function constant(value) {
  return function() {
    return value;
  };
}

function flex(lenFunc, decodeFunc) {
  return function(decoder) {
    var len = lenFunc(decoder);
    return decodeFunc(decoder, len);
  };
}

function fix(len, method) {
  return function(decoder) {
    return method(decoder, len);
  };
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/write-core.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/write-core.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// write-core.js

var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "../node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtPacker = __webpack_require__(/*! ./ext-packer */ "../node_modules/msgpack-lite/lib/ext-packer.js");
var WriteType = __webpack_require__(/*! ./write-type */ "../node_modules/msgpack-lite/lib/write-type.js");
var CodecBase = __webpack_require__(/*! ./codec-base */ "../node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
  addExtPacker: addExtPacker,
  getExtPacker: getExtPacker,
  init: init
});

exports.preset = init.call(CodecBase.preset);

function getEncoder(options) {
  var writeType = WriteType.getWriteType(options);
  return encode;

  function encode(encoder, value) {
    var func = writeType[typeof value];
    if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
    func(encoder, value);
  }
}

function init() {
  var options = this.options;
  this.encode = getEncoder(options);

  if (options && options.preset) {
    ExtPacker.setExtPackers(this);
  }

  return this;
}

function addExtPacker(etype, Class, packer) {
  packer = CodecBase.filter(packer);
  var name = Class.name;
  if (name && name !== "Object") {
    var packers = this.extPackers || (this.extPackers = {});
    packers[name] = extPacker;
  } else {
    // fallback for IE
    var list = this.extEncoderList || (this.extEncoderList = []);
    list.unshift([Class, extPacker]);
  }

  function extPacker(value) {
    if (packer) value = packer(value);
    return new ExtBuffer(value, etype);
  }
}

function getExtPacker(value) {
  var packers = this.extPackers || (this.extPackers = {});
  var c = value.constructor;
  var e = c && c.name && packers[c.name];
  if (e) return e;

  // fallback for IE
  var list = this.extEncoderList || (this.extEncoderList = []);
  var len = list.length;
  for (var i = 0; i < len; i++) {
    var pair = list[i];
    if (c === pair[0]) return pair[1];
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/write-token.js":
/*!*******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/write-token.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// write-token.js

var ieee754 = __webpack_require__(/*! ieee754 */ "../node_modules/ieee754/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "../node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

var uint8 = __webpack_require__(/*! ./write-uint8 */ "../node_modules/msgpack-lite/lib/write-uint8.js").uint8;
var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var IS_BUFFER_SHIM = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
var Buffer_prototype = Bufferish.hasBuffer && Buffer.prototype || {};

exports.getWriteToken = getWriteToken;

function getWriteToken(options) {
  if (options && options.uint8array) {
    return init_uint8array();
  } else if (NO_TYPED_ARRAY || (Bufferish.hasBuffer && options && options.safe)) {
    return init_safe();
  } else {
    return init_token();
  }
}

function init_uint8array() {
  var token = init_token();

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, writeFloatBE);
  token[0xcb] = writeN(0xcb, 8, writeDoubleBE);

  return token;
}

// Node.js and browsers with TypedArray

function init_token() {
  // (immediate values)
  // positive fixint -- 0x00 - 0x7f
  // nil -- 0xc0
  // false -- 0xc2
  // true -- 0xc3
  // negative fixint -- 0xe0 - 0xff
  var token = uint8.slice();

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = write1(0xc4);
  token[0xc5] = write2(0xc5);
  token[0xc6] = write4(0xc6);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = write1(0xc7);
  token[0xc8] = write2(0xc8);
  token[0xc9] = write4(0xc9);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, (Buffer_prototype.writeFloatBE || writeFloatBE), true);
  token[0xcb] = writeN(0xcb, 8, (Buffer_prototype.writeDoubleBE || writeDoubleBE), true);

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = write1(0xcc);
  token[0xcd] = write2(0xcd);
  token[0xce] = write4(0xce);
  token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = write1(0xd0);
  token[0xd1] = write2(0xd1);
  token[0xd2] = write4(0xd2);
  token[0xd3] = writeN(0xd3, 8, writeInt64BE);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = write1(0xd9);
  token[0xda] = write2(0xda);
  token[0xdb] = write4(0xdb);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = write2(0xdc);
  token[0xdd] = write4(0xdd);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = write2(0xde);
  token[0xdf] = write4(0xdf);

  return token;
}

// safe mode: for old browsers and who needs asserts

function init_safe() {
  // (immediate values)
  // positive fixint -- 0x00 - 0x7f
  // nil -- 0xc0
  // false -- 0xc2
  // true -- 0xc3
  // negative fixint -- 0xe0 - 0xff
  var token = uint8.slice();

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
  token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
  token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);

  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
  token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
  token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);

  // float 32 -- 0xca
  // float 64 -- 0xcb
  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf
  token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
  token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
  token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
  token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3
  token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
  token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
  token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
  token[0xd3] = writeN(0xd3, 8, writeInt64BE);

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
  token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
  token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
  token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);

  // map 16 -- 0xde
  // map 32 -- 0xdf
  token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
  token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);

  return token;
}

function write1(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(2);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset] = value;
  };
}

function write2(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(3);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset++] = value >>> 8;
    buffer[offset] = value;
  };
}

function write4(type) {
  return function(encoder, value) {
    var offset = encoder.reserve(5);
    var buffer = encoder.buffer;
    buffer[offset++] = type;
    buffer[offset++] = value >>> 24;
    buffer[offset++] = value >>> 16;
    buffer[offset++] = value >>> 8;
    buffer[offset] = value;
  };
}

function writeN(type, len, method, noAssert) {
  return function(encoder, value) {
    var offset = encoder.reserve(len + 1);
    encoder.buffer[offset++] = type;
    method.call(encoder.buffer, value, offset, noAssert);
  };
}

function writeUInt64BE(value, offset) {
  new Uint64BE(this, offset, value);
}

function writeInt64BE(value, offset) {
  new Int64BE(this, offset, value);
}

function writeFloatBE(value, offset) {
  ieee754.write(this, value, offset, false, 23, 4);
}

function writeDoubleBE(value, offset) {
  ieee754.write(this, value, offset, false, 52, 8);
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/write-type.js":
/*!******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/write-type.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// write-type.js

var IS_ARRAY = __webpack_require__(/*! isarray */ "../node_modules/isarray/index.js");
var Int64Buffer = __webpack_require__(/*! int64-buffer */ "../node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

var Bufferish = __webpack_require__(/*! ./bufferish */ "../node_modules/msgpack-lite/lib/bufferish.js");
var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "../node_modules/msgpack-lite/lib/bufferish-proto.js");
var WriteToken = __webpack_require__(/*! ./write-token */ "../node_modules/msgpack-lite/lib/write-token.js");
var uint8 = __webpack_require__(/*! ./write-uint8 */ "../node_modules/msgpack-lite/lib/write-uint8.js").uint8;
var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "../node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);
var HAS_MAP = ("undefined" !== typeof Map);

var extmap = [];
extmap[1] = 0xd4;
extmap[2] = 0xd5;
extmap[4] = 0xd6;
extmap[8] = 0xd7;
extmap[16] = 0xd8;

exports.getWriteType = getWriteType;

function getWriteType(options) {
  var token = WriteToken.getWriteToken(options);
  var useraw = options && options.useraw;
  var binarraybuffer = HAS_UINT8ARRAY && options && options.binarraybuffer;
  var isBuffer = binarraybuffer ? Bufferish.isArrayBuffer : Bufferish.isBuffer;
  var bin = binarraybuffer ? bin_arraybuffer : bin_buffer;
  var usemap = HAS_MAP && options && options.usemap;
  var map = usemap ? map_to_map : obj_to_map;

  var writeType = {
    "boolean": bool,
    "function": nil,
    "number": number,
    "object": (useraw ? object_raw : object),
    "string": _string(useraw ? raw_head_size : str_head_size),
    "symbol": nil,
    "undefined": nil
  };

  return writeType;

  // false -- 0xc2
  // true -- 0xc3
  function bool(encoder, value) {
    var type = value ? 0xc3 : 0xc2;
    token[type](encoder, value);
  }

  function number(encoder, value) {
    var ivalue = value | 0;
    var type;
    if (value !== ivalue) {
      // float 64 -- 0xcb
      type = 0xcb;
      token[type](encoder, value);
      return;
    } else if (-0x20 <= ivalue && ivalue <= 0x7F) {
      // positive fixint -- 0x00 - 0x7f
      // negative fixint -- 0xe0 - 0xff
      type = ivalue & 0xFF;
    } else if (0 <= ivalue) {
      // uint 8 -- 0xcc
      // uint 16 -- 0xcd
      // uint 32 -- 0xce
      type = (ivalue <= 0xFF) ? 0xcc : (ivalue <= 0xFFFF) ? 0xcd : 0xce;
    } else {
      // int 8 -- 0xd0
      // int 16 -- 0xd1
      // int 32 -- 0xd2
      type = (-0x80 <= ivalue) ? 0xd0 : (-0x8000 <= ivalue) ? 0xd1 : 0xd2;
    }
    token[type](encoder, ivalue);
  }

  // uint 64 -- 0xcf
  function uint64(encoder, value) {
    var type = 0xcf;
    token[type](encoder, value.toArray());
  }

  // int 64 -- 0xd3
  function int64(encoder, value) {
    var type = 0xd3;
    token[type](encoder, value.toArray());
  }

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  // fixstr -- 0xa0 - 0xbf
  function str_head_size(length) {
    return (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;
  }

  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  // fixraw -- 0xa0 - 0xbf
  function raw_head_size(length) {
    return (length < 32) ? 1 : (length <= 0xFFFF) ? 3 : 5;
  }

  function _string(head_size) {
    return string;

    function string(encoder, value) {
      // prepare buffer
      var length = value.length;
      var maxsize = 5 + length * 3;
      encoder.offset = encoder.reserve(maxsize);
      var buffer = encoder.buffer;

      // expected header size
      var expected = head_size(length);

      // expected start point
      var start = encoder.offset + expected;

      // write string
      length = BufferProto.write.call(buffer, value, start);

      // actual header size
      var actual = head_size(length);

      // move content when needed
      if (expected !== actual) {
        var targetStart = start + actual - expected;
        var end = start + length;
        BufferProto.copy.call(buffer, buffer, targetStart, start, end);
      }

      // write header
      var type = (actual === 1) ? (0xa0 + length) : (actual <= 3) ? (0xd7 + actual) : 0xdb;
      token[type](encoder, length);

      // move cursor
      encoder.offset += length;
    }
  }

  function object(encoder, value) {
    // null
    if (value === null) return nil(encoder, value);

    // Buffer
    if (isBuffer(value)) return bin(encoder, value);

    // Array
    if (IS_ARRAY(value)) return array(encoder, value);

    // int64-buffer objects
    if (Uint64BE.isUint64BE(value)) return uint64(encoder, value);
    if (Int64BE.isInt64BE(value)) return int64(encoder, value);

    // ext formats
    var packer = encoder.codec.getExtPacker(value);
    if (packer) value = packer(value);
    if (value instanceof ExtBuffer) return ext(encoder, value);

    // plain old Objects or Map
    map(encoder, value);
  }

  function object_raw(encoder, value) {
    // Buffer
    if (isBuffer(value)) return raw(encoder, value);

    // others
    object(encoder, value);
  }

  // nil -- 0xc0
  function nil(encoder, value) {
    var type = 0xc0;
    token[type](encoder, value);
  }

  // fixarray -- 0x90 - 0x9f
  // array 16 -- 0xdc
  // array 32 -- 0xdd
  function array(encoder, value) {
    var length = value.length;
    var type = (length < 16) ? (0x90 + length) : (length <= 0xFFFF) ? 0xdc : 0xdd;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    for (var i = 0; i < length; i++) {
      encode(encoder, value[i]);
    }
  }

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  function bin_buffer(encoder, value) {
    var length = value.length;
    var type = (length < 0xFF) ? 0xc4 : (length <= 0xFFFF) ? 0xc5 : 0xc6;
    token[type](encoder, length);
    encoder.send(value);
  }

  function bin_arraybuffer(encoder, value) {
    bin_buffer(encoder, new Uint8Array(value));
  }

  // fixext 1 -- 0xd4
  // fixext 2 -- 0xd5
  // fixext 4 -- 0xd6
  // fixext 8 -- 0xd7
  // fixext 16 -- 0xd8
  // ext 8 -- 0xc7
  // ext 16 -- 0xc8
  // ext 32 -- 0xc9
  function ext(encoder, value) {
    var buffer = value.buffer;
    var length = buffer.length;
    var type = extmap[length] || ((length < 0xFF) ? 0xc7 : (length <= 0xFFFF) ? 0xc8 : 0xc9);
    token[type](encoder, length);
    uint8[value.type](encoder);
    encoder.send(buffer);
  }

  // fixmap -- 0x80 - 0x8f
  // map 16 -- 0xde
  // map 32 -- 0xdf
  function obj_to_map(encoder, value) {
    var keys = Object.keys(value);
    var length = keys.length;
    var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    keys.forEach(function(key) {
      encode(encoder, key);
      encode(encoder, value[key]);
    });
  }

  // fixmap -- 0x80 - 0x8f
  // map 16 -- 0xde
  // map 32 -- 0xdf
  function map_to_map(encoder, value) {
    if (!(value instanceof Map)) return obj_to_map(encoder, value);

    var length = value.size;
    var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
    token[type](encoder, length);

    var encode = encoder.codec.encode;
    value.forEach(function(val, key, m) {
      encode(encoder, key);
      encode(encoder, val);
    });
  }

  // raw 16 -- 0xda
  // raw 32 -- 0xdb
  // fixraw -- 0xa0 - 0xbf
  function raw(encoder, value) {
    var length = value.length;
    var type = (length < 32) ? (0xa0 + length) : (length <= 0xFFFF) ? 0xda : 0xdb;
    token[type](encoder, length);
    encoder.send(value);
  }
}


/***/ }),

/***/ "../node_modules/msgpack-lite/lib/write-uint8.js":
/*!*******************************************************!*\
  !*** ../node_modules/msgpack-lite/lib/write-uint8.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// write-unit8.js

var constant = exports.uint8 = new Array(256);

for (var i = 0x00; i <= 0xFF; i++) {
  constant[i] = write0(i);
}

function write0(type) {
  return function(encoder) {
    var offset = encoder.reserve(1);
    encoder.buffer[offset] = type;
  };
}


/***/ }),

/***/ "../node_modules/next/node_modules/webpack/buildin/harmony-module.js":
/*!***************************************************************************!*\
  !*** ../node_modules/next/node_modules/webpack/buildin/harmony-module.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "../node_modules/next/node_modules/webpack/buildin/module.js":
/*!*******************************************************************!*\
  !*** ../node_modules/next/node_modules/webpack/buildin/module.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "../node_modules/react/index.js":
/*!********************************************************************************************!*\
  !*** delegated ../node_modules/react/index.js from dll-reference dll_95cc1c39b4ef6eb90c54 ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference dll_95cc1c39b4ef6eb90c54 */ "dll-reference dll_95cc1c39b4ef6eb90c54"))("../node_modules/react/index.js");

/***/ }),

/***/ "../node_modules/underscore/underscore.js":
/*!************************************************!*\
  !*** ../node_modules/underscore/underscore.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {}

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);


/***/ }),

/***/ "../node_modules/uuid/index.js":
/*!*************************************!*\
  !*** ../node_modules/uuid/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(/*! ./v1 */ "../node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "../node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "../node_modules/uuid/lib/bytesToUuid.js":
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/bytesToUuid.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "../node_modules/uuid/lib/rng-browser.js":
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/rng-browser.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "../node_modules/uuid/v1.js":
/*!**********************************!*\
  !*** ../node_modules/uuid/v1.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "../node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "../node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "../node_modules/uuid/v4.js":
/*!**********************************!*\
  !*** ../node_modules/uuid/v4.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "../node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "../node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "../node_modules/zeromq/build/Release/zmq.node":
/*!*****************************************************!*\
  !*** ../node_modules/zeromq/build/Release/zmq.node ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname, module) {const path = __webpack_require__(/*! path */ "path");const filePath = path.resolve(__dirname, "zmq.node");try { global.process.dlopen(module, filePath); } catch(exception) { throw new Error('Cannot open ' + filePath + ': ' + exception); };
/* WEBPACK VAR INJECTION */}.call(this, "/", __webpack_require__(/*! ./../../../next/node_modules/webpack/buildin/module.js */ "../node_modules/next/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/zeromq/index.js":
/*!***************************************!*\
  !*** ../node_modules/zeromq/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(/*! ./lib */ "../node_modules/zeromq/lib/index.js");

/***/ }),

/***/ "../node_modules/zeromq/lib/index.js":
/*!*******************************************!*\
  !*** ../node_modules/zeromq/lib/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(/*! events */ "events").EventEmitter
  , zmq = __webpack_require__(/*! ../build/Release/zmq.node */ "../node_modules/zeromq/build/Release/zmq.node")
  , util = __webpack_require__(/*! util */ "util");

/**
 * Expose bindings as the module.
 */

exports = module.exports = zmq;

/**
 * Expose zmq version.
 */

exports.version = zmq.zmqVersion();

/**
 * Expose zmq_curve_keypair
 */

exports.curveKeypair = zmq.zmqCurveKeypair;

/**
 * Map of socket types.
 */

var types = exports.types = {
    pub: zmq.ZMQ_PUB
  , xpub: zmq.ZMQ_XPUB
  , sub: zmq.ZMQ_SUB
  , xsub: zmq.ZMQ_XSUB
  , req: zmq.ZMQ_REQ
  , xreq: zmq.ZMQ_XREQ
  , rep: zmq.ZMQ_REP
  , xrep: zmq.ZMQ_XREP
  , push: zmq.ZMQ_PUSH
  , pull: zmq.ZMQ_PULL
  , dealer: zmq.ZMQ_DEALER
  , router: zmq.ZMQ_ROUTER
  , pair: zmq.ZMQ_PAIR
  , stream: zmq.ZMQ_STREAM
};

var longOptions = {
    ZMQ_HWM: 1
  , ZMQ_SWAP: 3
  , ZMQ_AFFINITY: 4
  , ZMQ_IDENTITY: 5
  , ZMQ_SUBSCRIBE: 6
  , ZMQ_UNSUBSCRIBE: 7
  , ZMQ_RATE: 8
  , ZMQ_RECOVERY_IVL: 9
  , ZMQ_MCAST_LOOP: 10
  , ZMQ_SNDBUF: 11
  , ZMQ_RCVBUF: 12
  , ZMQ_RCVMORE: 13
  , ZMQ_FD: 14
  , ZMQ_EVENTS: 15
  , ZMQ_TYPE: 16
  , ZMQ_LINGER: 17
  , ZMQ_RECONNECT_IVL: 18
  , ZMQ_BACKLOG: 19
  , ZMQ_RECOVERY_IVL_MSEC: 20
  , ZMQ_RECONNECT_IVL_MAX: 21
  , ZMQ_MAXMSGSIZE: 22
  , ZMQ_SNDHWM: 23
  , ZMQ_RCVHWM: 24
  , ZMQ_MULTICAST_HOPS: 25
  , ZMQ_RCVTIMEO: 27
  , ZMQ_SNDTIMEO: 28
  , ZMQ_IPV4ONLY: 31
  , ZMQ_LAST_ENDPOINT: 32
  , ZMQ_ROUTER_MANDATORY: 33
  , ZMQ_TCP_KEEPALIVE: 34
  , ZMQ_TCP_KEEPALIVE_CNT: 35
  , ZMQ_TCP_KEEPALIVE_IDLE: 36
  , ZMQ_TCP_KEEPALIVE_INTVL: 37
  , ZMQ_TCP_ACCEPT_FILTER: 38
  , ZMQ_DELAY_ATTACH_ON_CONNECT: 39
  , ZMQ_XPUB_VERBOSE: 40
  , ZMQ_ROUTER_RAW: 41
  , ZMQ_IPV6: 42
  , ZMQ_MECHANISM: 43
  , ZMQ_PLAIN_SERVER: 44
  , ZMQ_PLAIN_USERNAME: 45
  , ZMQ_PLAIN_PASSWORD: 46
  , ZMQ_CURVE_SERVER: 47
  , ZMQ_CURVE_PUBLICKEY: 48
  , ZMQ_CURVE_SECRETKEY: 49
  , ZMQ_CURVE_SERVERKEY: 50
  , ZMQ_ZAP_DOMAIN: 55
  , ZMQ_HEARTBEAT_IVL: 75
  , ZMQ_HEARTBEAT_TTL: 76
  , ZMQ_HEARTBEAT_TIMEOUT: 77
  , ZMQ_CONNECT_TIMEOUT: 79
  , ZMQ_IO_THREADS: 1
  , ZMQ_MAX_SOCKETS: 2
  , ZMQ_ROUTER_HANDOVER: 56
};

Object.keys(longOptions).forEach(function(name){
  Object.defineProperty(zmq, name, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: longOptions[name]
  });
});

/**
 * Map of socket options.
 */

var opts = exports.options = {
    _fd: zmq.ZMQ_FD
  , _ioevents: zmq.ZMQ_EVENTS
  , _receiveMore: zmq.ZMQ_RCVMORE
  , _subscribe: zmq.ZMQ_SUBSCRIBE
  , _unsubscribe: zmq.ZMQ_UNSUBSCRIBE
  , affinity: zmq.ZMQ_AFFINITY
  , backlog: zmq.ZMQ_BACKLOG
  , hwm: zmq.ZMQ_HWM
  , identity: zmq.ZMQ_IDENTITY
  , linger: zmq.ZMQ_LINGER
  , mcast_loop: zmq.ZMQ_MCAST_LOOP
  , rate: zmq.ZMQ_RATE
  , rcvbuf: zmq.ZMQ_RCVBUF
  , last_endpoint: zmq.ZMQ_LAST_ENDPOINT
  , reconnect_ivl: zmq.ZMQ_RECONNECT_IVL
  , recovery_ivl: zmq.ZMQ_RECOVERY_IVL
  , sndbuf: zmq.ZMQ_SNDBUF
  , swap: zmq.ZMQ_SWAP
  , mechanism: zmq.ZMQ_MECHANISM
  , plain_server: zmq.ZMQ_PLAIN_SERVER
  , plain_username: zmq.ZMQ_PLAIN_USERNAME
  , plain_password: zmq.ZMQ_PLAIN_PASSWORD
  , curve_server: zmq.ZMQ_CURVE_SERVER
  , curve_publickey: zmq.ZMQ_CURVE_PUBLICKEY
  , curve_secretkey: zmq.ZMQ_CURVE_SECRETKEY
  , curve_serverkey: zmq.ZMQ_CURVE_SERVERKEY
  , zap_domain: zmq.ZMQ_ZAP_DOMAIN
  , heartbeat_ivl: zmq.ZMQ_HEARTBEAT_IVL
  , heartbeat_ttl: zmq.ZMQ_HEARTBEAT_TTL
  , heartbeat_timeout: zmq.ZMQ_HEARTBEAT_TIMEOUT
  , connect_timeout: zmq.ZMQ_CONNECT_TIMEOUT
};

/**
 *  Monitor events
 */
var events = exports.events = {
    1:   "connect"       // zmq.ZMQ_EVENT_CONNECTED
  , 2:   "connect_delay" // zmq.ZMQ_EVENT_CONNECT_DELAYED
  , 4:   "connect_retry" // zmq.ZMQ_EVENT_CONNECT_RETRIED
  , 8:   "listen"        // zmq.ZMQ_EVENT_LISTENING
  , 16:  "bind_error"    // zmq.ZMQ_EVENT_BIND_FAILED
  , 32:  "accept"        // zmq.ZMQ_EVENT_ACCEPTED
  , 64:  "accept_error"  // zmq.ZMQ_EVENT_ACCEPT_FAILED
  , 128: "close"         // zmq.ZMQ_EVENT_CLOSED
  , 256: "close_error"   // zmq.ZMQ_EVENT_CLOSE_FAILED
  , 512: "disconnect"    // zmq.ZMQ_EVENT_DISCONNECTED
}

// Context management happens here. We lazily initialize a default context,
// and use that everywhere. Also cleans up on exit.
var ctx;
function defaultContext() {
  if (ctx) return ctx;

  var io_threads = 1;
  if (process.env.ZMQ_IO_THREADS) {
    io_threads = parseInt(process.env.ZMQ_IO_THREADS, 10);
    if (!io_threads || io_threads < 1) {
      console.warn('Invalid number in ZMQ_IO_THREADS, using 1 IO thread.');
      io_threads = 1;
    }
  }

  ctx = new zmq.Context(io_threads);
  process.on('exit', function(){
    // ctx.close();
    ctx = null;
  });

  return ctx;
};

/**
 * A batch consists of 1 or more message parts with their flags that need to be sent as one unit
 */

function OutBatch() {
  this.content = [];      // buf, flags, buf, flags, ...
  this.cbs = [];          // callbacks
  this.isClosed = false;  // true if the last message does not have SNDMORE in its flags, false otherwise
  this.next = null;       // next batch (for linked list of batches)
}

OutBatch.prototype.append = function (buf, flags, cb) {
  if (!Buffer.isBuffer(buf)) {
    buf = new Buffer(String(buf), 'utf8');
  }

  this.content.push(buf, flags);

  if (cb) {
    this.cbs.push(cb);
  }

  if ((flags & zmq.ZMQ_SNDMORE) === 0) {
    this.isClosed = true;
  }
};

OutBatch.prototype.invokeError = function (socket, error) {
  var returned = false;
  for (var i = 0; i < this.cbs.length; i += 1) {
    this.cbs[i].call(socket, error);
    returned = true;
  }

  if (!returned) {
    throw error;
  }
};

OutBatch.prototype.invokeSent = function (socket) {
  for (var i = 0; i < this.cbs.length; i += 1) {
    this.cbs[i].call(socket);
  }
};


function BatchList() {
  this.firstBatch = null;
  this.lastBatch = null;
  this.length = 0;
}

BatchList.prototype.canSend = function () {
  return this.firstBatch ? this.firstBatch.isClosed : false;
};

BatchList.prototype.append = function (buf, flags, cb) {
  var batch = this.lastBatch;

  if (!batch || batch.isClosed) {
    batch = new OutBatch();

    if (this.lastBatch) {
      this.lastBatch.next = batch;
    }

    this.lastBatch = batch;

    if (!this.firstBatch) {
      this.firstBatch = batch;
    }

    this.length += 1;
  }

  batch.append(buf, flags, cb);
};

BatchList.prototype.fetch = function () {
  var batch = this.firstBatch;
  if (batch && batch.isClosed) {
    this.firstBatch = batch.next;
    this.length -= 1;
    return batch;
  }
  return undefined;
};

BatchList.prototype.restore = function (batch) {
  this.firstBatch = batch;
  this.length += 1;
};


/**
 * Create a new socket of the given `type`.
 *
 * @constructor
 * @param {String|Number} type
 * @api public
 */

var Socket =
exports.Socket = function (type) {
  var self = this;
  EventEmitter.call(this);
  this.type = type;
  this._zmq = new zmq.SocketBinding(defaultContext(), types[type]);
  this._paused = false;
  this._isFlushingReads = false;
  this._isFlushingWrites = false;
  this._outgoing = new BatchList();

  this._zmq.onReadReady = function () {
    self._flushReads();
  };

  this._zmq.onSendReady = function () {
    self._flushWrites();
  };
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

util.inherits(Socket, EventEmitter);

/**
 * Set socket to pause mode
 * no data will be emit until resume() is called
 * all send() calls will be queued
 *
 * @api public
 */

Socket.prototype.pause = function() {
  this._paused = true;
}

/**
 * Set a socket back to normal work mode
 *
 * @api public
 */

Socket.prototype.resume = function() {
  this._paused = false;
  this._flushReads();
  this._flushWrites();
}

Socket.prototype.ref = function() {
  this._zmq.ref();
}

Socket.prototype.unref = function() {
  this._zmq.unref();
}

Socket.prototype.read = function() {
  var message = [], flags;

  if (this._zmq.state !== zmq.STATE_READY) {
    return null;
  }

  flags = this._zmq.getsockopt(zmq.ZMQ_EVENTS);

  if (flags & zmq.ZMQ_POLLIN) {
    do {
      message.push(this._zmq.recv());
    } while (this._zmq.getsockopt(zmq.ZMQ_RCVMORE));

    return message;
  }

  return null;
}


/**
 * Set `opt` to `val`.
 *
 * @param {String|Number} opt
 * @param {Mixed} val
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.setsockopt = function(opt, val){
  this._zmq.setsockopt(opts[opt] || opt, val);
  return this;
};

/**
 * Get socket `opt`.
 *
 * @param {String|Number} opt
 * @return {Mixed}
 * @api public
 */

Socket.prototype.getsockopt = function(opt){
  return this._zmq.getsockopt(opts[opt] || opt);
};

/**
 * Socket opt accessors allowing `sock.backlog = val`
 * instead of `sock.setsockopt('backlog', val)`.
 */

Object.keys(opts).forEach(function(name){
  Socket.prototype.__defineGetter__(name, function() {
    return this._zmq.getsockopt(opts[name]);
  });

  Socket.prototype.__defineSetter__(name, function(val) {
    if ('string' == typeof val) val = new Buffer(val, 'utf8');
    return this._zmq.setsockopt(opts[name], val);
  });
});

/**
 * Async bind.
 *
 * Emits the "bind" event.
 *
 * @param {String} addr
 * @param {Function} cb
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.bind = function(addr, cb) {
  var self = this;
  this._zmq.bind(addr, function(err) {
    if (err) {
      return cb && cb(err);
    }

    self._flushReads();
    self._flushWrites();

    self.emit('bind', addr);
    cb && cb();
  });
  return this;
};

/**
 * Sync bind.
 *
 * @param {String} addr
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.bindSync = function(addr) {
  this._zmq.bindSync(addr);

  return this;
};

/**
 * Async unbind.
 *
 * Emits the "unbind" event.
 *
 * @param {String} addr
 * @param {Function} cb
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.unbind = function(addr, cb) {
  if (zmq.ZMQ_CAN_UNBIND) {
    var self = this;
    this._zmq.unbind(addr, function(err) {
      if (err) {
        return cb && cb(err);
      }
      self.emit('unbind', addr);

      self._flushReads();
      self._flushWrites();
      cb && cb();
    });
  } else {
    cb && cb();
  }
  return this;
};

/**
 * Sync unbind.
 *
 * @param {String} addr
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.unbindSync = function(addr) {
  if (zmq.ZMQ_CAN_UNBIND) {
    this._zmq.unbindSync(addr);
  }
  return this;
}

/**
 * Connect to `addr`.
 *
 * @param {String} addr
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.connect = function(addr) {
  this._zmq.connect(addr);
  return this;
};

/**
 * Disconnect from `addr`.
 *
 * @param {String} addr
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.disconnect = function(addr) {
  if (zmq.ZMQ_CAN_DISCONNECT) {
    this._zmq.disconnect(addr);
  }
  return this;
};

/**
 * Enable monitoring of a Socket
 *
 * @param {Number} timer interval in ms > 0 or Undefined for default
 * @param {Number} The maximum number of events to read on each interval, default is 1, use 0 for reading all events
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.monitor = function(interval, numOfEvents) {
  if (zmq.ZMQ_CAN_MONITOR) {
    var self = this;

    self._zmq.onMonitorEvent = function(event_id, event_value, event_endpoint_addr, ex) {
      self.emit(events[event_id], event_value, event_endpoint_addr, ex);
    }

    self._zmq.onMonitorError = function(error) {
      self.emit('monitor_error', error);
    }

    this._zmq.monitor(interval, numOfEvents);
  } else {
    throw new Error('Monitoring support disabled check zmq version is > 3.2.1 and recompile this addon');
  }
  return this;
};

/**
 * Disable monitoring of a Socket release idle handler
 * and close the socket
 *
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.unmonitor = function() {
  if (zmq.ZMQ_CAN_MONITOR) {
    this._zmq.unmonitor();
  }
  return this;
};


/**
 * Subscribe with the given `filter`.
 *
 * @param {String} filter
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.subscribe = function(filter) {
  this._subscribe = filter;
  return this;
};

/**
 * Unsubscribe with the given `filter`.
 *
 * @param {String} filter
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.unsubscribe = function(filter) {
  this._unsubscribe = filter;
  return this;
};


/**
 * Send the given `msg`.
 *
 * @param {String|Buffer|Array} msg
 * @param {Number} [flags]
 * @param {Function} [cb]
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.send = function(msg, flags, cb) {
  flags = flags | 0;

  if (Array.isArray(msg)) {
    for (var i = 0, len = msg.length; i < len; i++) {
      var isLast = i === len - 1;
      var msgFlags = isLast ? flags : flags | zmq.ZMQ_SNDMORE;
      var callback = isLast ? cb : undefined;

      this._outgoing.append(msg[i], msgFlags, callback);
    }
  } else {
    this._outgoing.append(msg, flags, cb);
  }

  if (this._outgoing.canSend()) {
    this._zmq.pending = true;
    this._flushWrites();
  } else {
    this._zmq.pending = false;
  }

  return this;
};

Socket.prototype._emitMessage = function (message) {
  if (message.length === 1) {
    // hot path
    this.emit('message', message[0]);
  } else {
    this.emit.apply(this, ['message'].concat(message));
  }
}

Socket.prototype._flushRead = function () {
  try {
    var message = this._zmq.readv(); // can throw
    if (!message) {
      return false;
    }
    // Handle received message immediately to prevent memory leak in driver
    this._emitMessage(message)
  } catch (error) {
    this.emit('error', error); // can throw
  }
  return true;
};

Socket.prototype._flushWrite = function () {
  var batch = this._outgoing.fetch();
  if (!batch) {
    this._zmq.pending = false;
    return false;
  }

  try {
    if (this._zmq.sendv(batch.content)) {
      this._zmq.pending = this._outgoing.canSend();
      batch.invokeSent(this);
      return true;
    }

    this._outgoing.restore(batch);
    return false;
  } catch (sendError) {
    this._zmq.pending = this._outgoing.canSend();
    batch.invokeError(this, sendError); // can throw
    return false;
  }
};


Socket.prototype._flushReads = function() {
  if (this._paused || this._isFlushingReads) return;

  this._isFlushingReads = true;

  while (this._flushRead());

  this._isFlushingReads = false;

  // if many sends happened, but ended up in the queue (eg. in a req/rep scenario where each send must be followed by a
  // response), we can try to send again now

  this._flushWrites();
};

Socket.prototype._flushWrites = function() {
  if (this._paused || this._isFlushingWrites) return;

  this._isFlushingWrites = true;

  var sent;

  do {
    try {
      sent = this._flushWrite();
    } catch (error) {
      this._isFlushingWrites = false;
      this.emit('error', error); // can throw
      return;
    }
  } while (sent);

  this._isFlushingWrites = false;
};

/**
 * Close the socket.
 *
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.close = function() {
  this._zmq.close();
  return this;
};

/**
 * Create a `type` socket with the given `options`.
 *
 * @param {String} type
 * @param {Object} options
 * @return {Socket}
 * @api public
 */

exports.socket =
exports.createSocket = function(type, options) {
  var sock = new Socket(type);
  for (var key in options) sock[key] = options[key];
  return sock;
};

exports.Context.setMaxThreads = function(value) {
  if (!zmq.ZMQ_CAN_SET_CTX) {
    throw new Error('Setting of context options disabled, check zmq version is >= 3.2.1 and recompile this addon');
  }
  var defaultCtx = defaultContext();
  defaultCtx.setOpt(zmq.ZMQ_IO_THREADS, value);
};

exports.Context.getMaxThreads = function() {
  if (!zmq.ZMQ_CAN_SET_CTX) {
    throw new Error('Getting of context options disabled, check zmq version is >= 3.2.1 and recompile this addon');
  }
  var defaultCtx = defaultContext();
  return defaultCtx.getOpt(zmq.ZMQ_IO_THREADS);
};

exports.Context.setMaxSockets = function(value) {
  if (!zmq.ZMQ_CAN_SET_CTX) {
    throw new Error('Setting of context options disabled, check zmq version is >= 3.2.1 and recompile this addon');
  }
  var defaultCtx = defaultContext();
  defaultCtx.setOpt(zmq.ZMQ_MAX_SOCKETS, value);
};

exports.Context.getMaxSockets = function() {
  if (!zmq.ZMQ_CAN_SET_CTX) {
    throw new Error('Getting of context options disabled, check zmq version is >= 3.2.1 and recompile this addon');
  }
  var defaultCtx = defaultContext();
  return defaultCtx.getOpt(zmq.ZMQ_MAX_SOCKETS);
};

/**
 * JS based on API characteristics of the native zmq_proxy()
 */

function proxy (frontend, backend, capture){
  switch(frontend.type+'/'+backend.type){
    case 'push/pull':
    case 'pull/push':
    case 'xpub/xsub':
      if(capture){

        frontend.on('message',function (){
          backend.send([].slice.call(arguments));
        });

        backend.on('message',function (){
          frontend.send([].slice.call(arguments));

          //forwarding messages over capture socket
          capture.send([].slice.call(arguments));
        });

      } else {

        //no capture socket provided, just forwarding msgs to respective sockets
        frontend.on('message',function (){
          backend.send([].slice.call(arguments));
        });

        backend.on('message',function (){
          frontend.send([].slice.call(arguments));
        });

      }
      break;
    case 'router/dealer':
    case 'xrep/xreq':
      if(capture){

        //forwarding router/dealer pack signature: id, delimiter, msg
        frontend.on('message',function (id,delimiter,msg){
          backend.send([id,delimiter,msg]);
        });

        backend.on('message',function (id,delimiter,msg){
          frontend.send([id,delimiter,msg]);

          //forwarding message to the capture socket
          capture.send(msg);
        });

      } else {

        //forwarding router/dealer signatures without capture
        frontend.on('message',function (id,delimiter,msg){
          backend.send([id,delimiter,msg]);
        });

        backend.on('message',function (id,delimiter,msg){
          frontend.send([id,delimiter,msg]);
        });

      }
      break;
    default:
      throw new Error('wrong socket order to proxy');
  }
}

exports.proxy = proxy;


/***/ }),

/***/ "../node_modules/zerorpc/index.js":
/*!****************************************!*\
  !*** ../node_modules/zerorpc/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var server = __webpack_require__(/*! ./lib/server */ "../node_modules/zerorpc/lib/server.js"),
    client = __webpack_require__(/*! ./lib/client */ "../node_modules/zerorpc/lib/client.js");

exports.Server = server.Server;
exports.Client = client.Client;

/***/ }),

/***/ "../node_modules/zerorpc/lib/buffer.js":
/*!*********************************************!*\
  !*** ../node_modules/zerorpc/lib/buffer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

//Creates a new channel buffer
//capacity : number
//      The capacity of the buffer
function ChannelBuffer(capacity) {
    //Pre-allocate the buffer array to its capacity and set the length to 0.
    //This way, the length property is correct, but the array size equals
    //the maximum buffer size, so it doesn't have to be resized (as much).
    this._buffer = new Array(capacity);
    this._buffer.length = 0;
    this._capacity = capacity;
}

//Adds an item to the buffer
ChannelBuffer.prototype.add = function(item) {
    this._buffer.push(item);
};

//Removes an item from the buffer
ChannelBuffer.prototype.remove = function() {
    return this._buffer.shift();
}

//Gets the number of items in the buffer
ChannelBuffer.prototype.length = function() {
    return this._buffer.length;
};

//Gets the channel capacity
ChannelBuffer.prototype.getCapacity = function() {
    return this._capacity;
}

//Checks whether the buffer has capacity
ChannelBuffer.prototype.hasCapacity = function() {
    return this._capacity > 0;
};

//Updates the capacity
ChannelBuffer.prototype.setCapacity = function(capacity) {
    this._capacity = capacity;
};

//Decrements the capacity
ChannelBuffer.prototype.decrementCapacity = function() {
    this._capacity--;
};

exports.ChannelBuffer = ChannelBuffer;

/***/ }),

/***/ "../node_modules/zerorpc/lib/channel.js":
/*!**********************************************!*\
  !*** ../node_modules/zerorpc/lib/channel.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(/*! ./util */ "../node_modules/zerorpc/lib/util.js"),
    nodeUtil = __webpack_require__(/*! util */ "util"),
    nodeEvents = __webpack_require__(/*! events */ "events"),
    events = __webpack_require__(/*! ./events */ "../node_modules/zerorpc/lib/events.js"),
    buffer = __webpack_require__(/*! ./buffer */ "../node_modules/zerorpc/lib/buffer.js");

//The channel state when it is open
var CHANNEL_OPEN = "open";

//The channel state when it is closing
var CHANNEL_CLOSING = "closing";

//The channel state when it is closed
var CHANNEL_CLOSED = "closed";

//Current verison of the protocol
var PROTOCOL_VERSION = 3;


//Creates a new channel
//id : String
//      The channel ID
//envelope : Array of Buffers
//      The ZeroMQ envelope of the remote endpoint that caused the channel to
//      be opened
//socket : MultiplexingSocket
//      The socket that opened the channel
//capacity : Number
//      The channel buffer's capacity
//heartbeatInterval: Number
//      The heartbeat interval in ms
function Channel(id, envelope, socket, capacity, heartbeatInterval) {
    this.id                 = id;
    this._state             = CHANNEL_OPEN;
    this._envelope          = envelope;
    this._socket            = socket;
    this._capacity          = capacity;
    this._heartbeatInterval = heartbeatInterval

    //Setup heartbeating on the channel
    this._resetHeartbeat();
    this._heartbeatRunner = this._runHeartbeat();

    //Callbacks to call when the channel receives a message
    this._callbacks = [];

    //Buffers for sending & receiving messages
    this._inBuffer = new buffer.ChannelBuffer(capacity);
    this._inBuffer.setCapacity(1);
    this._outBuffer = new buffer.ChannelBuffer(1);
}

nodeUtil.inherits(Channel, nodeEvents.EventEmitter);

//Registers a new callback to be run when this channel receives a message
//callback : Function(event : Object, next : Function)
//      The callback to execute when a new event is received. Unless the
//      callback is the last in the chain, it should call its next argument
//      when its work is complete, so that the next callback can be run.
Channel.prototype.register = function(callback) {
    this._callbacks.push(callback);
};

//Called when the channel receives an event
//event : Object
//      The ZeroRPC event received
Channel.prototype.invoke = function(event) {
    var self = this;

    if(event.name == "_zpc_more") {
        //Update buffer data
        if(event.args.length > 0 && typeof(event.args[0]) == "number") {
            self._outBuffer.setCapacity(event.args[0]);
            self.flush();
        } else {
            self.emit("protocol-error", "Invalid event: Bad buffer message");
            self.destroy();
        }
    } else if(event.name == "_zpc_hb") {
        self._resetHeartbeat();
    } else if(self._state == CHANNEL_OPEN) {
        //Enqueue the message in the buffer
        self._inBuffer.add(event);
        self._inBuffer.decrementCapacity();

        //Call each callback one at a time, similar to connect middleware.
        //This is done asyncronously to take advantage of the buffer.
        setTimeout(function() {
            var event = self._inBuffer.remove();
            var i = -1;

            //Update the remote process with how much open capacity we have in
            //our buffer - but only if the event is not one that is going to
            //close the channel; otherwise we'll send a _zpc_more event, and
            //the server won't know how to route it
            if(event.name === "STREAM" && self._inBuffer.getCapacity() < self._capacity / 2) {
                self._resetCapacity();
            }

            var next = function() { 
                i++;

                if(i < self._callbacks.length) {
                    self._callbacks[i].call(self, event, next);
                }
            };

            next();
        }, 0);
    }
};

//Puts the channel in the closing state
Channel.prototype.close = function() {
    this._state = CHANNEL_CLOSING;
    this.emit("closing");
    this.flush();
};

//Close and destroy channel
Channel.prototype.destroy = function() {
    this._state = CHANNEL_CLOSED;
    this.emit("closed");
    clearTimeout(this._heartbeatRunner);
    delete this._socket.channels[this.id];
}

//Sends as many outbound messages as possible
Channel.prototype.flush = function() {
    while(this._outBuffer.length() > 0 && this._outBuffer.hasCapacity()) {
        this._socket.send(this._outBuffer.remove());
        this._outBuffer.decrementCapacity();
    }

    if(this._state == CHANNEL_CLOSING && this._outBuffer.length() == 0) {
        this.destroy();
    }
};

//Sends a message
//name : String
//      The event name
//args : Array
//      The event arguments
Channel.prototype.send = function(name, args) {
    if(this._state != CHANNEL_OPEN) {
        throw new Error("Cannot send on closed channel");
    }

    //Create & enqueue the event
    var event = events.create(this._envelope, this._createHeader(), name, args);

    //Send the message or enqueue it to be sent later
    if(this._outBuffer.hasCapacity()) {
        this._socket.send(event);
        this._outBuffer.decrementCapacity();
    } else {
        this._outBuffer.add(event);
    }
};

//Creates a header for an event
Channel.prototype._createHeader = function() {
    return { v: PROTOCOL_VERSION, message_id: events.fastUUID(), response_to: this.id };
};

//Runs the heartbeat on this channel
Channel.prototype._runHeartbeat = function() {
    var self = this;

    return setInterval(function() {
        if(util.curTime() > self._heartbeatExpirationTime) {
            //If we haven't received a response in 2 * heartbeat rate, send an
            //error
            self.emit("heartbeat-error", "Lost remote after " + (self._heartbeatInterval * 2) + "ms");
            self.destroy();
			return;
        }
        
        //Heartbeat on the channel
        try {
            var event = events.create(self._envelope, self._createHeader(), "_zpc_hb", [0]);
            self._socket.send(event);
        } catch(e) {
            console.error("Error occurred while sending heartbeat:", e);
        }
    }, self._heartbeatInterval);
};

//Resets the heartbeat expiration time
Channel.prototype._resetHeartbeat = function() {
    this._heartbeatExpirationTime = util.curTime() + this._heartbeatInterval * 2;
};

//Updates the capacity and sends a _zpc_more event
Channel.prototype._resetCapacity = function() {
    var newCapacity = this._capacity - this._inBuffer.length();
    
    if(newCapacity > 0) {
        this._inBuffer.setCapacity(newCapacity);
        var event = events.create(this._envelope, this._createHeader(), "_zpc_more", [newCapacity]);
        this._socket.send(event);
    }
};

//Creates a new server-side channel
//srcEvent : Object
//      The event that caused this channel to be opened
//socket : Object
//      The multiplexing socket instance that opened this channel
//capacity : Number
//      The capacity of the socket's input buffer
//heartbeatInterval: Number
//      The heartbeat interval in ms
function ServerChannel(srcEvent, socket, capacity, heartbeatInterval) {
    Channel.call(this, srcEvent.header.message_id, srcEvent.envelope, socket, capacity, heartbeatInterval);
}

nodeUtil.inherits(ServerChannel, Channel);

//Creates a new client-side buffer
//socket : Object
//      The multiplexing socket instance that opened this channel
//capacity : Number
//      The capacity of the socket's input buffer
//heartbeatInterval: Number
//      The heartbeat interval in ms
function ClientChannel(socket, capacity, heartbeatInterval) {
    Channel.call(this, events.fastUUID(), null, socket, capacity, heartbeatInterval);
    this._fresh = true;
    
}

nodeUtil.inherits(ClientChannel, Channel);

ClientChannel.prototype._createHeader = function(name, args) {
    if(this._fresh) {
        this._fresh = false;
        return { v: PROTOCOL_VERSION, message_id: this.id };
    } else {
        return Channel.prototype._createHeader.call(this);
    }
}

exports.ServerChannel = ServerChannel;
exports.ClientChannel = ClientChannel;


/***/ }),

/***/ "../node_modules/zerorpc/lib/client.js":
/*!*********************************************!*\
  !*** ../node_modules/zerorpc/lib/client.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var socket = __webpack_require__(/*! ./socket */ "../node_modules/zerorpc/lib/socket.js"),
    _ = __webpack_require__(/*! underscore */ "../node_modules/underscore/underscore.js"),
    nodeUtil = __webpack_require__(/*! util */ "util"),
    events = __webpack_require__(/*! events */ "events"),
    util = __webpack_require__(/*! ./util */ "../node_modules/zerorpc/lib/util.js"),
    middleware = __webpack_require__(/*! ./middleware */ "../node_modules/zerorpc/lib/middleware.js");

var DEFAULT_TIMEOUT = 30;

//Heartbeat rate in milliseconds
var DEFAULT_HEARTBEAT = 5000;

// Creates a new client
// options : Object
//      Options associated with the client. Allowed options:
//      * timeout (number): Seconds to wait for a response before it is
//        considered timed out (default 30s)
//      * heartbeatInterval (number): The heartbeat interval in ms.
//        (default 5000ms)
function Client(options) {
    options = options || {};
    var heartbeat = options.heartbeatInterval || DEFAULT_HEARTBEAT;
    this._timeout = options.timeout || DEFAULT_TIMEOUT;
	this._socket = socket.client(heartbeat);

	util.eventProxy(this._socket, this, "error");
}

nodeUtil.inherits(Client, events.EventEmitter);

//Binds to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Client.prototype.bind = function(endpoint) {
    this._socket.bind(endpoint);
};

//Connects to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Client.prototype.connect = function(endpoint) {
    this._socket.connect(endpoint);
};

//Closes the client
Client.prototype.close = function(linger) {
    this._socket.close(linger);
};

Client.prototype.closed = function() {
    return this._socket.closed();
};

//Calls a remote method
//options: Object
//      Optional options object to override the constructor options (currently only timeout)
//method : String
//      The method name
//args... : Varargs
//      The arguments to send with the invocation
//callback : Function
//      The callback to call on an update
Client.prototype.invoke = function(/*options, */method /*, args..., callback*/) {
    var self = this;
    var hasCallback = typeof arguments[arguments.length - 1] == 'function';
    var callback = hasCallback ? arguments[arguments.length - 1] : function() {};
    var options = typeof method === 'object' ?
        method :
        undefined;
    var offset = 1;
    if (options === method) {
        method = arguments[1];
        offset = 2;
    }
    var args = Array.prototype.slice.call(arguments, offset,
            hasCallback ? arguments.length - 1 : arguments.length);

    var alreadyCalled = false;

    var callbackErrorWrapper = function(error) {
        if(alreadyCalled === false) {
            callback(error, undefined, false);
            alreadyCalled = true;
        }
    };

    var ch = self._socket.openChannel();
    var timeout = parseInt(options && options.timeout, 10) || self._timeout;
    middleware.addTimeout(timeout * 1000, ch, callbackErrorWrapper);

    //Associated callbacks to execute for various events
    var handlers = {
        "ERR": function(event) {
            if(!(event.args instanceof Array) || event.args.length != 3) {
                return self.emit("error", "Invalid event: Bad error");
            }

            var error = util.createErrorResponse(event.args[0], event.args[1], event.args[2]);
            callbackErrorWrapper(error);
            ch.close();
        },

        "OK": function(event) {
            callback(undefined, event.args[0], false);
            ch.close();
        },

        "STREAM": function(event) {
            callback(undefined, event.args, true);
        },

        "STREAM_DONE": function() {
            callback(undefined, undefined, false);
            ch.close();
        }
    };

    ch.register(function(event) {
        var handler = handlers[event.name];

        if(handler) {
            handler(event);
        } else {
            //Send an error if the server sent a bad event - this should
            //never happen
            var error = util.createErrorResponse("ProtocolError", "Invalid event: Unknown event name");
            callbackErrorWrapper(error);
            ch.close();
        }
    });

    //Listen for protocol errors - this should never happen
    ch.on("protocol-error", function(error) {
        var error = util.createErrorResponse("ProtocolError", error);
        callbackErrorWrapper(error);
    });

    //Listen for heartbeat errors
    ch.on("heartbeat-error", function(error) {
        var error = util.createErrorResponse("HeartbeatError", error);
        callbackErrorWrapper(error);
    });

    ch.send(method, args);
};

exports.Client = Client;


/***/ }),

/***/ "../node_modules/zerorpc/lib/events.js":
/*!*********************************************!*\
  !*** ../node_modules/zerorpc/lib/events.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var msgpack = __webpack_require__(/*! msgpack-lite */ "../node_modules/msgpack-lite/lib/browser.js"),
    uuid = __webpack_require__(/*! uuid */ "../node_modules/uuid/index.js");

//Serializes an event into an array of buffers that can be transmitted
//through ZeroMQ.
//event : Object
//      The event to serialize
//return : Array of Buffers
//      The message to transmit across ZeroMQ
function serialize(event) {
    var payload = [event.header, event.name, event.args];
    var message = [];

    if(event.envelope) {
        message = message.concat(event.envelope);
    }

    message.push(new Buffer(0));
    message.push(msgpack.encode(payload));
    return message;
}

//Deserializes an event into an object.
//envelope : Array of Buffer
//      The ZeroMQ envelope
//payload : Buffer
//      The buffer containing the ZeroRPC event
//return : Object
//      The deserialized object
function deserialize(envelope, payload) {
    var event = msgpack.decode(arguments[arguments.length - 1]);

    if(!(event instanceof Array) || event.length != 3) {
        throw new Error("Expected array of size 3");
    } else if(!(event[0] instanceof Object) || !event[0].message_id) {
        throw new Error("Bad header");
    } else if(typeof(event[1]) != 'string') {
        throw new Error("Bad name");
    }

    return create(envelope, event[0], event[1], event[2]);
}

//Creates a new event
//envelope : Array of Buffers
//      The ZeroMQ envelope
//header : Object
//      The ZeroRPC header
//name : String
//      The ZeroRPC event name
//args : Array
//      The ZeroRPC event arguments
//return : Object
//      A ZeroRPC object
function create(envelope, header, name, args) {
    return {
        envelope: envelope,
        header: header,
        name: name,
        args: args
    };
}

var uuidBase = uuid.v4().substring(0, 24);
var uuidCounter = 0;

function fastUUID() {
    var counter = uuidCounter++;
    //Just in the case user sends over 281 trillion messages?
    if(uuidCounter > 0xFFFFFFFFFFFF) uuidCounter = 0;
    return uuidBase + ("000000000000" + counter.toString(16)).slice(-12);
}

exports.serialize = serialize;
exports.deserialize = deserialize;
exports.create = create;
exports.fastUUID = fastUUID;

/***/ }),

/***/ "../node_modules/zerorpc/lib/middleware.js":
/*!*************************************************!*\
  !*** ../node_modules/zerorpc/lib/middleware.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(/*! ./util */ "../node_modules/zerorpc/lib/util.js");

//Adds a timeout on a channel - if a response isn't received within a certain
//amount of time, we execute the callback with a timeout error.
function addTimeout(timeout, channel, callback) {
    var runner = setTimeout(function() {
        var error = util.createErrorResponse("TimeoutExpired", "Timeout after " + timeout + "ms");
        callback(error);
        channel.close();
    }, timeout);

    channel.register(function(event, next) {
        clearTimeout(runner);
        next();
    });

    //Clear the timeout when the channel is closed
    channel.on("closed", function() {
        clearTimeout(runner);
    });
}

exports.addTimeout = addTimeout;


/***/ }),

/***/ "../node_modules/zerorpc/lib/server.js":
/*!*********************************************!*\
  !*** ../node_modules/zerorpc/lib/server.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var socket = __webpack_require__(/*! ./socket */ "../node_modules/zerorpc/lib/socket.js"),
    _ = __webpack_require__(/*! underscore */ "../node_modules/underscore/underscore.js"),
    nodeUtil = __webpack_require__(/*! util */ "util"),
    events = __webpack_require__(/*! events */ "events"),
    util = __webpack_require__(/*! ./util */ "../node_modules/zerorpc/lib/util.js"),
    middleware = __webpack_require__(/*! ./middleware */ "../node_modules/zerorpc/lib/middleware.js");

// Heartbeat rate in ms
var DEFAULT_HEARTBEAT = 5000;

//Gets the arguments associated with a function as an array
//fun : Function
//      The function to get the arguments from.
//return : Array of Strings
//      The function's arguments
function getArguments(fun) {
    var m1 = /^[\s\(]*function[^(]*\(([^)]*)\)/;
    var m2 = /\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g;
    var m3 = /\s+/g;

    var names = fun.toString().match(m1)[1].replace(m2, '').replace(m3, '').split(',');
    var args = names.length == 1 && !names[0] ? [] : names;

    //Remove the last argument from the args becase it is the callback
    args.pop();

    return args;
}

//Extracts the public methods (and their arguments) of a context.
//context : Object
//      The object to be exposed
//return : Object of String => Array
//      A map where they key is the method name and the value are the method
//      arguments, not including the callback argument.
function publicMethods(context) {
    var methods = {};

    //Ignore members that start with an underscore or are not functions
    for(var name in context) {
        if(!/^_/.test(name) && typeof(context[name]) == 'function') {
            methods[name] = getArguments(context[name]);
        }
    }

    return methods;
}

// Creates a new server
// context : Object
//      The object to expose
function Server(context, heartbeat) {
    var self = this;
    var heartbeat = heartbeat || DEFAULT_HEARTBEAT;


    self._socket = socket.server(heartbeat);
    util.eventProxy(self._socket, self, "error");

    self._methods = publicMethods(context);

    context._zerorpc_ping = function(reply) { reply(null, ["pong",""]); };
    self._methods._zerorpc_ping = [];

    var newInspector = self._createIntrospector(context.constructor.name || "Object");

    context._zerorpc_inspect = newInspector;
    self._methods._zerorpc_inspect = getArguments(newInspector);

    self._socket.on("multiplexing-socket/receive", function(event) {
        if(event.name in self._methods) self._recv(event, context);
    });
}

nodeUtil.inherits(Server, events.EventEmitter);

//Creates the new-school introspector
Server.prototype._createIntrospector = function(contextName) {
    var methods = {};
    var results = { name: contextName, methods: methods };

    for(var name in this._methods) {
		if (name.indexOf('_') === 0) {
			continue;
		}
        methods[name] = {
            doc: "",

            args: _.map(this._methods[name], function(arg) {
                return { name: arg };
            })
        };
    }

    return function(reply) {
        reply(null, results);  
    };
}

//Called when a method call event is received
//event : Object
//      The ZeroRPC event
//context : Object
//      The object to expose.
Server.prototype._recv = function(event, context) {
    var self = this;
    var ch = self._socket.openChannel(event);
    var isFirst = true;

    //Sends an error
    var sendError = function(error) {
        var args = [error.name || "Error", error.message, error.stack];
        ch.send("ERR", args);
        ch.close();
    };

    //Listen for protocol errors - this should never happen
    ch.on("protocol-error", function(error) {
        self.emit("error", error);
    });

    //Listen for heartbeat errors
    ch.on("heartbeat-error", function(error) {
        self.emit("error", error);
    });

    //This is passed to RPC methods to call when they finish, or have a stream
    //update
    var result = function(error, item, more) {
        more = more || false;

        if(error) {
            //Create an error object if we were passed a string
            sendError(typeof(error) == 'string' ? new Error(error) : error);
        } else {
            if(isFirst && !more) {
                //Wrap item in an array for backwards compatibility issues
                //with ZeroRPC
                ch.send("OK", [item]);
            } else if(item !== undefined) {
                //Stream is a newer method that does not require item to be
                //wrapped in an array
                ch.send("STREAM", item);
            }

            if(!more) {
                if(!isFirst) ch.send("STREAM_DONE", []);
                ch.close();
            }
        }
        
        isFirst = false;
    };

    //The arguments should be an array
    if(!(event.args instanceof Array)) {
        self.emit("error", "Invalid event: Bad args");
        return ch.close();
    }

    //Call the method
    event.args.push(result);
    
    //Catch any errors and send them back to the client
    try {
        context[event.name].apply(context, event.args);
    } catch(e) {
        sendError(e);
    }
}

//Binds to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Server.prototype.bind = function(endpoint) {
    this._socket.bind(endpoint);
};

//Connects to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Server.prototype.connect = function(endpoint) {
    this._socket.connect(endpoint);
};

//Closes the server
Server.prototype.close = function() {
    this._socket.close();
};

Server.prototype.closed = function() {
	return this._socket.closed();
};

exports.Server = Server;


/***/ }),

/***/ "../node_modules/zerorpc/lib/socket.js":
/*!*********************************************!*\
  !*** ../node_modules/zerorpc/lib/socket.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var nodeUtil = __webpack_require__(/*! util */ "util"),
    zmq = __webpack_require__(/*! zeromq */ "../node_modules/zeromq/index.js"),
    nodeEvents = __webpack_require__(/*! events */ "events"),
    events = __webpack_require__(/*! ./events */ "../node_modules/zerorpc/lib/events.js"),
    util = __webpack_require__(/*! ./util */ "../node_modules/zerorpc/lib/util.js"),
    channel = __webpack_require__(/*! ./channel */ "../node_modules/zerorpc/lib/channel.js");

//The default channel capacity
var CHANNEL_CAPACITY = 100;

//Creates a new socket
//zmqSocket : Object
//      The underlying ZeroMQ socket to use
function Socket(zmqSocket) {
    var self = this;
    self._zmqSocket = zmqSocket;
    util.eventProxy(self._zmqSocket, self, "error");

    var error = function(message) {
        self.emit("error", message);
    };

    self._zmqSocket.on("message", function() {
        //Deserialize the object and perform some sanity checks
        if(arguments[arguments.length - 2].length != 0) {
            return error("Expected second to last argument to be an empty buffer, but it is not");
        }

        var envelope = Array.prototype.slice.call(arguments, 0, arguments.length - 2);

        try {
            var event = events.deserialize(envelope, arguments[arguments.length - 1]);
        } catch(e) {
            return error("Invalid event: " + e);
        }

        //Emit the event
        self.emit("socket/receive", event);
    });
}

nodeUtil.inherits(Socket, nodeEvents.EventEmitter);

//Sends a message on the socket
//event : Object
//      The ZeroRPC event to send
Socket.prototype.send = function(event) {
    var message = events.serialize(event);
    this._zmqSocket.send.call(this._zmqSocket, message);
};

//Binds to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Socket.prototype.bind = function(endpoint) {
    this._zmqSocket.bindSync(endpoint);
}

//Connects to a ZeroMQ endpoint
//endpoint : String
//      The ZeroMQ endpoint
Socket.prototype.connect = function(endpoint) {
    this._zmqSocket.connect(endpoint);
}

//Creates a new multiplexing socket
//zmqSocket : Object
//      The underlying ZeroMQ socket to use
function MultiplexingSocket(zmqSocket, heartbeat) {
    Socket.call(this, zmqSocket);
    var self = this;

    //Map of open channel IDs => channel objects
    self.channels = {};
    self._heartbeatInterval = heartbeat;
	self._closed = false;

    //Route events to a channel if possible; otherwise emit the event
    self.on("socket/receive", function(event) {
        var ch = self.channels[event.header.response_to || ""];

        if(ch) {
            ch.invoke(event);
        } else {
            self.emit("multiplexing-socket/receive", event);
        }
    });
}

nodeUtil.inherits(MultiplexingSocket, Socket);

//Opens a new channel
//srcEvent : Object or null
//      The ZeroRPC event that caused the channel to be opened, or null if
//      this is a locally opened channel.
MultiplexingSocket.prototype.openChannel = function(srcEvent) {
    if(srcEvent) {
        var ch = new channel.ServerChannel(srcEvent, this, CHANNEL_CAPACITY, this._heartbeatInterval);
    } else {
        var ch = new channel.ClientChannel(this, CHANNEL_CAPACITY, this._heartbeatInterval);
    }

    this.channels[ch.id] = ch;
    return ch;
};

//Closes the socket
MultiplexingSocket.prototype.close = function(linger) {
	if (this.closed()) {
		throw Error("Socket already closed");
	}
    if (linger !== undefined) {
        this._zmqSocket.setsockopt(zmq.options.linger, linger);
    }

    this._zmqSocket.close();
    for(var id in this.channels) this.channels[id].destroy();
	this._closed = true;
};

MultiplexingSocket.prototype.closed = function() {
	return this._closed;
};

MultiplexingSocket.prototype.setTimeout = function(timeout) {
};

//Creates a new multiplexing socket server
function server(heartbeat) {
    return new MultiplexingSocket(zmq.socket("xrep"), heartbeat);
}

//Creates a new multiplexing socket client
function client(heartbeat) {
    return new MultiplexingSocket(zmq.socket("xreq"), heartbeat);
}

exports.server = server;
exports.client = client;


/***/ }),

/***/ "../node_modules/zerorpc/lib/util.js":
/*!*******************************************!*\
  !*** ../node_modules/zerorpc/lib/util.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2015 François-Xavier Bourlet (bombela+zerorpc@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

//Proxies event from one object to another
//from : EventEmitter
//      The object to proxy events from
//to : EventEmitter
//      The object to proxy events to
function eventProxy(from, to, name) {
    from.on(name, function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(name);
        to.emit.apply(to, args);
    });
}

//Gets the current time in milliseconds since epoch
//return : Number
function curTime() {
    return Date.now();
}

//Creates an error object
//name : String
//      The error name
//message : String
//      The error message
//traceback : String
//      The exception stack trace as a string
//return : Object
//      An error object
function createErrorResponse(name, message, stack) {
	var e = Error(message);
	e.name = name;
	if (stack !== undefined) {
		e.stack = stack;
	}
	return e;
}

exports.eventProxy = eventProxy;
exports.curTime = curTime;
exports.createErrorResponse = createErrorResponse;


/***/ }),

/***/ "./helpers/index.ts":
/*!**************************!*\
  !*** ./helpers/index.ts ***!
  \**************************/
/*! exports provided: resolve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _resolve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resolve */ "./helpers/resolve.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return _resolve__WEBPACK_IMPORTED_MODULE_0__["resolve"]; });




/***/ }),

/***/ "./helpers/resolve.ts":
/*!****************************!*\
  !*** ./helpers/resolve.ts ***!
  \****************************/
/*! exports provided: resolve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return resolve; });
var resolve = function resolve(pathname) {
  if (false) {}

  return "/" + pathname;
};



/***/ }),

/***/ "./pages/calculator/index.tsx":
/*!************************************!*\
  !*** ./pages/calculator/index.tsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var zerorpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! zerorpc */ "../node_modules/zerorpc/index.js");
/* harmony import */ var zerorpc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(zerorpc__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./helpers/index.ts");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.css */ "./pages/calculator/styles.css.ts");
var _jsxFileName = "D:\\Websites\\Tahiti\\nextron-don\\examples\\with-typescript-python\\renderer\\pages\\calculator\\index.tsx";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


console.log("TODO DEBUG if I import zerorpc here the client code fails silently (server is fine)");
 // tslint:disable-line

console.log("TODO DEBUG Past import of zerorpc");



var CalculatorPage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CalculatorPage, _React$Component);

  function CalculatorPage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CalculatorPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CalculatorPage)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.resultDiv = void 0;
    _this.client = void 0;

    _this.handleKeyDown = function (event) {
      if (event.key === "Enter") {
        _this.client.invoke("calc", event.currentTarget.value, function (error, res) {
          if (error) {
            console.error(error);
          } else {
            _this.resultDiv.textContent = res;
          }
        });
      }
    };

    return _this;
  }

  _createClass(CalculatorPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //
      // NOTE componentDidMount is only called on the client
      //
      console.log("TODO DEBUG in calc componentDidMount");
      console.log(zerorpc__WEBPACK_IMPORTED_MODULE_1__);
      console.log("TODO DEBUG uncomment the following code once zerorpc runs on the client"); // client = new zerorpc.Client();
      // client.connect("tcp://127.0.0.1:4242");
      // client.invoke("echo", "server is ready", (error, res) => {
      //   if (error) {
      //     console.error(error);
      //   } else {
      //     console.log(res);
      //   }
      // });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("style", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 34
        },
        __self: this
      }, _styles_css__WEBPACK_IMPORTED_MODULE_3__["css"]), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", {
        className: "container",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 35
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 36
        },
        __self: this
      }, "Calculator"), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("ol", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 37
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("li", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("a", {
        href: Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["resolve"])("home"),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, "Home"))), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, "Hello Calculator!"), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, "Input something like ", react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("code", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, "1 + 1"), "."), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        },
        __self: this
      }, "This calculator supports ", react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("code", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      }, "+-*/^()"), ", whitespaces, and integers and floating numbers."), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", {
        style: {
          color: "black"
        },
        onKeyDown: this.handleKeyDown,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", {
        ref: function ref(elem) {
          return _this2.resultDiv = elem;
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        },
        __self: this
      })));
    }
  }]);

  return CalculatorPage;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (CalculatorPage);
    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/calculator\\index")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/next/node_modules/webpack/buildin/harmony-module.js */ "../node_modules/next/node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./pages/calculator/styles.css.ts":
/*!****************************************!*\
  !*** ./pages/calculator/styles.css.ts ***!
  \****************************************/
/*! exports provided: css */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css", function() { return css; });
var css = "\n  .container {\n    position: absolute;\n    top: 30%;\n    left: 10px;\n  }\n\n  .container h2 {\n    font-size: 5rem;\n  }\n\n  .container a {\n    font-size: 1.4rem;\n  }\n\n  .container ol {\n    padding-left: 20px;\n  }\n";

    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/calculator\\styles.css")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/next/node_modules/webpack/buildin/harmony-module.js */ "../node_modules/next/node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ 4:
/*!******************************************!*\
  !*** multi ./pages/calculator/index.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__NEXT_REGISTER_PAGE('/calculator', function() {
module.exports = __webpack_require__(/*! ./pages/calculator/index.tsx */"./pages/calculator/index.tsx");

return { page: module.exports.default }});

/***/ }),

/***/ "dll-reference dll_95cc1c39b4ef6eb90c54":
/*!*******************************************!*\
  !*** external "dll_95cc1c39b4ef6eb90c54" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dll_95cc1c39b4ef6eb90c54;

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

},[[4,"static/runtime/webpack.js"]]]));;
//# sourceMappingURL=calculator.js.map