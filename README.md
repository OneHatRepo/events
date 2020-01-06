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

## Usage
```javascript
import EventEmitter from '@onehat/events';
class Widget extends EventEmitter {
	constructor() {
		super(...arguments)
		this.registerEvents(['foo', 'bar']);
	}
}

const widget = new Widget();
widget.on('foo', () => {
	// do something
});
widget.emit('foo');
```

