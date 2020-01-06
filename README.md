# OneHat Events
[@onehat/events](https://www.npmjs.com/package/@onehat/events)
Takes the node.js [events](https://www.npmjs.com/package/events) package and adds the following functionality:
- Registration/Unregistration of events. Events cannot be emitted until registered.
- Pausing / Resuming event emission. Paused events will be added to a queue, and can be optionally emitted when events are resumed.
- Relaying of events from one object to another. A relayed event will appear to be emitted from the relaying object, not from the origin object.

# Install
```
npm i @onehat/events
```

# Usage

## Instantiate & Register Events
```javascript
import EventEmitter from '@onehat/events';
class Widget extends EventEmitter {
	constructor() {
		super(...arguments)

		// Typically, events are registered in constructor
		this.registerEvents(['foo', 'bar']);
	}
}

const widget = new Widget();
widget.on('foo', () => {
	// do something
});
widget.emit('foo');
```


## Pause Events
```javascript
import EventEmitter from '@onehat/events';

const emitter = new EventEmitter();
let emitted = false;
emitter.registerEvent('foo');
emitter.on('foo', () => {
	emitted = true;
});
emitter.pauseEvents();
emitter.emit('foo');
expect(emitted).to.be.false;
```


## Resume Events
```javascript
import EventEmitter from '@onehat/events';

const emitter = new EventEmitter();
let emitted = false;
emitter.registerEvent('foo');
emitter.on('foo', () => {
	emitted = true;
});
emitter.pauseEvents();
emitter.emit('foo');
emitter.resumeEvents(true); // true to replay queued events. false to discard queued events
expect(emitted).to.be.true;
```


## Relay Events
```javascript
import EventEmitter from '@onehat/events';

const origin = new EventEmitter(),
	relayer = new EventEmitter();

// Set up relaying
origin.registerEvents(['foo', 'bar']); // events can also be registered on object directly
relayer.relayEventsFrom(origin, ['foo', 'bar'], 'baz_'); // third argument allows optionally prepending event name with a prefix

let emitted = false,
	arg1 = null,
	arg2 = null;
relayer.on('baz_foo', (a, b) => {
	emitted = true;
	arg1 = a;
	arg2 = b;
});
origin.emit('foo', true, false);

expect(emitted).to.be.true;
expect(arg1).to.be.true;
expect(arg2).to.be.false;
```
