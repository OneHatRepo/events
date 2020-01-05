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