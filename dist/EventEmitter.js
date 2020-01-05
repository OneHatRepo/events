"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require("events");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var EventEmitter =
  /*#__PURE__*/
  (function(_EE) {
    _inherits(EventEmitter, _EE);

    function EventEmitter() {
      var _this;

      _classCallCheck(this, EventEmitter);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EventEmitter).apply(this, arguments)
      );

      _defineProperty(_assertThisInitialized(_this), "registerEvent", function(
        name
      ) {
        return _this.registerEvents([name]);
      });

      _defineProperty(_assertThisInitialized(_this), "registerEvents", function(
        names
      ) {
        var count = _this._registeredEvents.length;
        _this._registeredEvents = _lodash.default.uniq(
          _lodash.default.concat(_this._registeredEvents, names)
        );
        return _this._registeredEvents.length !== count;
      });

      _defineProperty(
        _assertThisInitialized(_this),
        "unregisterEvent",
        function(name) {
          return _this.unregisterEvents([name]);
        }
      );

      _defineProperty(
        _assertThisInitialized(_this),
        "unregisterEvents",
        function(names) {
          var count = _this._registeredEvents.length;

          _lodash.default.pullAll(_this._registeredEvents, names);

          return _this._registeredEvents.length !== count;
        }
      );

      _defineProperty(_assertThisInitialized(_this), "pauseEvents", function() {
        _this.eventsPaused = true;
      });

      _defineProperty(
        _assertThisInitialized(_this),
        "resumeEvents",
        function() {
          var emitQueuedEvents =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : false;
          _this.eventsPaused = false;

          if (emitQueuedEvents) {
            _lodash.default.forEach(_this._eventQueue, function(args) {
              var _this2;

              (_this2 = _this).emit.apply(_this2, _toConsumableArray(args));
            });
          }

          _this._eventQueue = [];
        }
      );

      _this._registeredEvents = [];
      _this._eventQueue = [];
      return _this;
    }
    /**
     * Decorates the standard emit() with the following functionality:
     * - Checks that event has been registered
     * - Checks that events are not currently paused. If so, adds the event to a queue
     * @param {array} name - Event name
     * @param {[params]} - Variable number of additional params
     */

    _createClass(EventEmitter, [
      {
        key: "emit",
        value: function emit(name) {
          // NOTE: Purposefully did not use an arrow-function, so we have access to arguments
          if (_lodash.default.indexOf(this._registeredEvents, name) === -1) {
            throw new Error('Event "' + name + '" is not registered.');
          }

          if (this.eventsPaused) {
            // Add to _eventQueue
            this._eventQueue.push(arguments);

            return;
          }

          return _get(
            _getPrototypeOf(EventEmitter.prototype),
            "emit",
            this
          ).apply(this, arguments);
        }
        /**
         * Registers a single event type to be used by this Class.
         * Events must be registered before they can be emitted.
         * @param {string} name - Event name
         * @return {boolean} isChanged - Whether event was successfully added
         */
      }
    ]);

    return EventEmitter;
  })(_events.EventEmitter);

exports.default = EventEmitter;
