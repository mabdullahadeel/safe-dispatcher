# typesafe-emitter

A lightweight, type-safe event emitter for TypeScript projects.

## Features

- Fully type-safe events and listeners
- Simple and intuitive API
- Zero dependencies
- Tiny footprint
- TypeScript-first design

## Installation

```bash
# Using npm
npm install github:mabdullahadeel/typesafe-emitter

# Using yarn
yarn add github:mabdullahadeel/typesafe-emitter

# Using pnpm
pnpm add github:mabdullahadeel/typesafe-emitter
```

## Usage

### Basic Example

```typescript
import { EventDispatcher } from "typesafe-emitter";

// Create typed event dispatchers
const userLogin = new EventDispatcher<{ userId: string; timestamp: number }>();
const userLogout = new EventDispatcher<{ userId: string; timestamp: number }>();
const dataUpdate = new EventDispatcher<{ newData: any }>();

// Add event listeners with proper typing
userLogin.subscribe((event) => {
  console.log(`User ${event.userId} logged in at ${event.timestamp}`);
});

// Dispatch events with type checking
userLogin.dispatch({
  userId: "123",
  timestamp: Date.now(),
});

// Type errors if event data doesn't match defined structure
// This would cause a TypeScript error:
// userLogin.dispatch({ userId: '123' }); // Missing timestamp
```

### Using DispatcherPool

```typescript
import { EventDispatcher, DispatcherPool } from "typesafe-emitter";

// Define your event dispatchers
const dispatchers = {
  userLogin: new EventDispatcher<{ userId: string; timestamp: number }>(),
  userLogout: new EventDispatcher<{ userId: string; timestamp: number }>(),
  dataUpdate: new EventDispatcher<{ newData: any }>(),
} as const;

// Create a dispatcher pool
const events = new DispatcherPool(dispatchers);

// Subscribe to events
events.on("userLogin", (data) => {
  console.log(`User ${data.userId} logged in`);
});

// Dispatch events
events.dispatch("userLogin", {
  userId: "123",
  timestamp: Date.now(),
});
```

### API

#### EventDispatcher

```typescript
// Create a dispatcher
const dispatcher = new EventDispatcher<YourEventType>();

// Subscribe to events (returns unsubscribe function)
const unsubscribe = dispatcher.subscribe((data) => {
  /* ... */
});

// Unsubscribe using the returned function
unsubscribe();

// Or unsubscribe by passing the handler
dispatcher.unsubscribe(handler);

// Dispatch an event
dispatcher.dispatch(eventData);

// Remove all subscribers
dispatcher.clear();
```

#### DispatcherPool

```typescript
// Create a dispatcher pool
const pool = new DispatcherPool(dispatcherMap);

// Subscribe to an event
pool.on("eventName", (data) => {
  /* ... */
});

// Dispatch an event
pool.dispatch("eventName", eventData);

// Clean up all subscriptions
pool.destroy();
```

## License

MIT
