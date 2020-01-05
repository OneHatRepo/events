import { EventEmitter as EE } from 'events';
import _ from 'lodash';

export default class EventEmitter extends EE {
	
	constructor() {
		super(...arguments);

		this._registeredEvents = [];
		this._eventQueue = [];
	}

	/**
	 * Decorates the standard emit() with the following functionality:
	 * - Checks that event has been registered
	 * - Checks that events are not currently paused. If so, adds the event to a queue
	 * @param {array} name - Event name
	 * @param {[params]} - Variable number of additional params
	 */
	emit(name) { // NOTE: Purposefully did not use an arrow-function, so we have access to arguments

		if (_.indexOf(this._registeredEvents, name) === -1) {
			throw new Error('Event "' + name + '" is not registered.');
		}

		if (this.eventsPaused) {
			// Add to _eventQueue
			this._eventQueue.push(arguments);
			return;
		}

		return super.emit(...arguments);
	}

	/**
	 * Registers a single event type to be used by this Class.
	 * Events must be registered before they can be emitted.
	 * @param {string} name - Event name
	 * @return {boolean} isChanged - Whether event was successfully added
	 */
	registerEvent = (name) => {
		return this.registerEvents([name]);
	}

	/**
	 * Registers multiple event types to be used by this Class.
	 * Events must be registered before they can be emitted.
	 * @param {array} names - Event names
	 * @return {boolean} isChanged - Whether (any) events were successfully added
	 */
	registerEvents = (names) => {
		const count = this._registeredEvents.length;
		this._registeredEvents = _.uniq(_.concat(this._registeredEvents, names));
		return this._registeredEvents.length !== count;
	}

	/**
	 * Unregisters a single event type from use in this Class.
	 * @param {string} name - Event name
	 * @return {boolean} isChanged - Whether event was successfully removed
	 */
	unregisterEvent = (name) => {
		return this.unregisterEvents([name]);
	}

	/**
	 * Unregisters multiple event types from use in this Class.
	 * Events must be registered before they can be emitted.
	 * @param {array} names - Event names
	 * @return {boolean} isChanged - Whether (any) events were successfully removed
	 */
	unregisterEvents = (names) => {
		const count = this._registeredEvents.length;
		_.pullAll(this._registeredEvents, names);
		return this._registeredEvents.length !== count;
	}

	/**
	 * Pauses all events. 
	 * Any events emitted while paused will be added to a queue.
	 */
	pauseEvents = () => {
		this.eventsPaused = true;
	}

	/**
	 * Resumes all events. 
	 * @param {boolean} emitQueuedEvents - Emit the events in queue? 
	 * If false, then queued events will be discarded. Defaults to false. 
	 */
	resumeEvents = (emitQueuedEvents = false) => {
		this.eventsPaused = false;
		if (emitQueuedEvents) {
			_.forEach(this._eventQueue, (args) => {
				this.emit(...args);
			})
		}
		this._eventQueue = [];
	}

}