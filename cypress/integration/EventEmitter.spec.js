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
		const origin = new EventEmitter(),
			relayer = new EventEmitter();
		
		// Register the events on origin object
		origin.registerEvents(['foo', 'bar']); // events can be registered direclty on emitter object, rather than in a constructor
		
		// Set up relaying from origin to relayer
		relayer.relayEventsFrom(origin, ['foo', 'bar'], 'baz_'); // third argument allows optionally prepending event name with a prefix
		
		// Assign event handler on the relayer object
		let emitted = false,
			arg1 = null,
			arg2 = null;
		relayer.on('baz_foo', (a, b) => {
			emitted = true;
			arg1 = a;
			arg2 = b;
		});

		// Now emit the event on the origin
		origin.emit('foo', true, false);
		
		// verify everything worked
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

		const emitter = new EventEmitter();

		// Register event
		emitter.registerEvent('foo');
		
		// Assign event handler
		let emitted = false;
		emitter.on('foo', () => {
			emitted = true;
		});
		
		// Pause the events
		emitter.pauseEvents();
		
		// No events will be emitted now
		// They are added to an internal queue
		emitter.emit('foo');
		expect(emitted).to.be.false;
		
		// Resume the events
		emitter.resumeEvents(true); // true to replay queued events in order. false to discard queued events
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

	it('event bubbles', function() {
		// Set up our classes
		class Child extends EventEmitter {
			constructor() {
				super(...arguments);
		
				this.registerEvent('foo');
			}
		}
		
		class Parent extends EventEmitter {
			constructor(child) {
				super(...arguments);
		
				this.child = child;
				this.relayEventsFrom(child, 'foo');
			}
		}
		
		// Instantiate a parent and a child in hierarchical relationship
		const child = new Child(),
			parent = new Parent(child);
		
		// Assign event handler for parent
		let parentCount = 0;
		parent.on('foo', () => {
			parentCount++;
		});

		// Emit the event on the child
		child.emit('foo'); // Event bubbles up to parent and is handled there!
		expect(parentCount).to.be.eq(1);
		

		// Now, let's push this a bit further, with another level of hierarchy.
		const grandparent = new Parent(parent);
		
		// Assign event handler for grandparent
		let grandparentCount = 0;
		grandparent.on('foo', () => {
			grandparentCount++;
		});

		// Emit the event on the child again
		child.emit('foo'); // Event bubbles up to *both parent and grandparent*
		expect(parentCount).to.be.eq(2);
		expect(grandparentCount).to.be.eq(1);

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