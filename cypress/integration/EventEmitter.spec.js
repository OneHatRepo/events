import EventEmitter from '../../src/EventEmitter.js';
import _ from 'lodash';

describe('EventEmitter', function() {
	beforeEach(function() {
		this.emitter = new EventEmitter();
	});

	it('registers one event', function() {
		const emitter = this.emitter;
		emitter.registerEvent('foo');
		expect(_.indexOf(emitter._registeredEvents, 'foo') !== -1).to.be.true;
	});

	it('registers multiple events', function() {
		const emitter = this.emitter;
		emitter.registerEvents(['foo', 'bar']);
		expect(_.indexOf(emitter._registeredEvents, 'bar') !== -1).to.be.true;
	});

	it('unregisters one event', function() {
		const emitter = this.emitter;
		emitter.registerEvents(['foo', 'bar']);
		emitter.unregisterEvent('foo');
		expect(_.indexOf(emitter._registeredEvents, 'foo') === -1).to.be.true;
	});

	it('unregisters multiple events', function() {
		const emitter = this.emitter;
		emitter.registerEvents(['foo', 'bar']);
		emitter.unregisterEvents(['foo', 'bar']);
		expect(_.indexOf(emitter._registeredEvents, 'foo') === -1).to.be.true;
	});

	it('denies unregistered events', function() {
		const emitter = this.emitter;
		let error = null;
		try {
			emitter.emit('bar');
		} catch(err) {
			error = err.message;
		}
		expect(error).to.eq('Event "bar" is not registered.');
	});

	it('fires registered events', function() {
		const emitter = this.emitter;
		let emitted = false;
		emitter.registerEvent('foo');
		emitter.on('foo', () => {
			emitted = true;
		});
		emitter.emit('foo');
		expect(emitted).to.be.true;
	});

	it('relayEventsFrom', function() {
		const emitter = this.emitter,
			origin = new EventEmitter();

		// Set up relaying
		origin.registerEvents(['foo', 'bar']);
		emitter.relayEventsFrom(origin, ['foo', 'bar'], 'baz_');

		let emitted = false,
			arg1 = null,
			arg2 = null;
		emitter.on('baz_foo', (a, b) => {
			emitted = true;
			arg1 = a;
			arg2 = b;
		});
		origin.emit('foo', true, false);

		expect(emitted).to.be.true;
		expect(arg1).to.be.true;
		expect(arg2).to.be.false;
	});

	it('"once" usage', function() {
		const emitter = this.emitter;

		let emitted = 0,
			caughtError = false;
		emitter.once('foo', () => {
			emitted++;
		});
		try {
			emitter.emit('foo');
		} catch(e) {
			// Event was not yet registered!
			caughtError = true;
		}

		// Now register it
		emitter.registerEvent('foo');

		// Emit two events
		emitter.emit('foo'); // increments
		emitter.emit('foo'); // ignores

		expect(caughtError).to.be.true;
		expect(emitted).to.be.eq(1);
	});

	it('pauses events', function() {
		const emitter = this.emitter;
		let emitted = false;
		emitter.registerEvent('foo');
		emitter.on('foo', () => {
			emitted = true;
		});
		emitter.pauseEvents();
		emitter.emit('foo');
		expect(emitted).to.be.false;
	});

	it('resumes events, ditching queue', function() {
		const emitter = this.emitter;
		let emitted = false;
		emitter.registerEvent('foo');
		emitter.on('foo', () => {
			emitted = true;
		});
		emitter.pauseEvents();
		emitter.emit('foo');
		emitter.resumeEvents();
		expect(emitted).to.be.false;
	});

	it('resumes events, replaying queue', function() {
		const emitter = this.emitter;
		let emitted = false;
		emitter.registerEvent('foo');
		emitter.on('foo', () => {
			emitted = true;
		});
		emitter.pauseEvents();
		emitter.emit('foo');
		emitter.resumeEvents(true);
		expect(emitted).to.be.true;
	});

	it('addListeners', function() {
		const emitter = this.emitter;
		let emitted = 0;
		emitter.registerEvents(['foo', 'bar']);
		emitter.addListeners(['foo', 'bar'], () => {
			emitted++;
		});
		emitter.emit('foo');
		emitter.emit('bar');
		expect(emitted).to.be.eq(2);
	});

	it.skip('cancels events', function() {
		// NOT YET IMPLEMENTED
		const emitter = this.emitter;
		let step = 0;
		emitter.registerEvent('foo');
		emitter.on('foo', () => {
			step = 1;
			return false;
		});
		emitter.on('foo', () => {
			step = 2;
		});
		emitter.emit('foo');
		expect(step).to.be.eq(1);
	});

});