"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require("events");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This takes the node.js 'events' package and adds the following functionality:
 * - Registration/unregistration of events. Events cannot be emitted until registered.
 * - Pausing / Resuming event emission. Paused events will be added to a queue, and
 * can be optionally emitted at resumption of events.
 * - Relaying of events from one object to another. A relayed event will appear to be emitted
 * from the relaying object, not from the origin object.
 * 
 */
var EventEmitter = /*#__PURE__*/function (_EE) {
  _inherits(EventEmitter, _EE);

  var _super = _createSuper(EventEmitter);

  function EventEmitter() {
    var _this;

    _classCallCheck(this, EventEmitter);

    _this = _super.apply(this, arguments);

    _defineProperty(_assertThisInitialized(_this), "registerEvent", function (name) {
      return _this.registerEvents([name]);
    });

    _defineProperty(_assertThisInitialized(_this), "registerEvents", function (names) {
      var count = _this._registeredEvents.length;
      _this._registeredEvents = _lodash.default.uniq(_lodash.default.concat(_this._registeredEvents, names));
      return _this._registeredEvents.length !== count;
    });

    _defineProperty(_assertThisInitialized(_this), "unregisterEvent", function (name) {
      return _this.unregisterEvents([name]);
    });

    _defineProperty(_assertThisInitialized(_this), "unregisterEvents", function (names) {
      var count = _this._registeredEvents.length;

      _lodash.default.pullAll(_this._registeredEvents, names);

      return _this._registeredEvents.length !== count;
    });

    _defineProperty(_assertThisInitialized(_this), "getRegisteredEvents", function () {
      return _this._registeredEvents;
    });

    _defineProperty(_assertThisInitialized(_this), "pauseEvents", function () {
      _this.eventsPaused = true;
      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "resumeEvents", function () {
      var emitQueuedEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      _this.eventsPaused = false;

      if (emitQueuedEvents) {
        _lodash.default.forEach(_this._eventQueue, function (args) {
          var _this2;

          (_this2 = _this).emit.apply(_this2, _toConsumableArray(args));
        });
      }

      _this._eventQueue = [];
      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "relayEventsFrom", function (origin, events) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      if (_lodash.default.isString(events)) {
        events = [events];
      }

      _lodash.default.each(events, function (event) {
        var fullEventName = prefix + event,
            oThis = _assertThisInitialized(_this); // Register the event in this object, so it can be fired


        _this.registerEvent(fullEventName); // Add a listener to the origin


        origin.on(event, function () {
          // NOTE: Purposefully do not use an arrow-function, so we have access to arguments
          // Emit the event from this object, passing on any arguments
          oThis.emit.apply(oThis, [fullEventName].concat(Array.prototype.slice.call(arguments)));
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "addListeners", function (events, listener) {
      _lodash.default.each(events, function (event) {
        _this.on(event, listener);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "ons", function (events, listener) {
      return _this.addListeners(events, listener);
    });

    _this._registeredEvents = [];
    _this._eventQueue = [];
    return _this;
  }
  /**
   * Decorates the standard emit() with the following functionality:
   * - Checks that event has been registered
   * - Checks that events are not currently paused. If so, adds the event to a queue
   * @param {array} name - Event name
   * @param {...params} - Variable number of additional params
   */


  _createClass(EventEmitter, [{
    key: "emit",
    value: function emit(name) {
      // NOTE: Purposefully do not use an arrow-function, so we have access to arguments
      if (_lodash.default.indexOf(this._registeredEvents, name) === -1) {
        throw new Error('Event "' + name + '" is not registered.');
      }

      if (this.eventsPaused) {
        // Add to _eventQueue
        this._eventQueue.push(arguments);

        return;
      }

      return _get(_getPrototypeOf(EventEmitter.prototype), "emit", this).apply(this, arguments);
    }
    /**
     * Registers a single event type to be used by this Class.
     * Events must be registered before they can be emitted.
     * @param {string} name - Event name
     * @return {boolean} isChanged - Whether event was successfully added
     */

  }]);

  return EventEmitter;
}(_events.EventEmitter);

exports.default = EventEmitter;