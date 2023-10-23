# Welcome to Wamya

***the smallest state management system***

Wamya library provides a simple and flexible way to manage and maintain application state in JavaScript or TypeScript applications. It allows you to create and manage isolated state namespaces, subscribe to state changes, and dispatch updates to those states.

## Installation

You can install the StateManager library via npm or yarn:

```bash
npm install wamya
# or
yarn add wamya
```

## Usage

To get started with the StateManager library, import the library.

```js
import stateManager, { StateNamespace, AppState } from 'wamya';
```

### Creating a State Namespace

You can connect to a specific state namespace using the connect method. A state namespace is a way to isolate and manage state for different parts of your application.

```js
const namespace: StateNamespace = 'user';
const userStateManager = stateManager.connect(namespace);
```

### Creating State

To create and initialize the state within a namespace, use the setState method.

```js
const newState: AppState = { name: 'John Doe', age: 30 };
userStateManager.setState(newState);
```

### Setting and Getting State

You can set and get state values within a namespace using the setState and getState methods.

```js
const newState: AppState = { name: 'John Doe', age: 30 };
userStateManager.setState(newState);

const currentState: AppState = userStateManager.getState();
```

### Subscribing to State Changes

You can subscribe to state changes and be notified whenever the state is updated within a namespace. This is useful for reacting to state changes in your application.

```js
userStateManager.subscribe((newState) => {
  console.log('User state updated:', newState);
});
```

### Example

Here's an example of how you can use the StateManager library to manage user state:

```js
import stateManager, { StateNamespace, AppState } from 'wamya';

const userNamespace: StateNamespace = 'user';
const userStateManager = stateManager.connect(userNamespace);

// Set initial user state
userStateManager.setState({
  name: 'John Doe',
  age: 30,
});

// Subscribe to user state changes
userStateManager.subscribe((newState) => {
  console.log('User state updated:', newState);
});

// Dispatch an update
userStateManager.setState({
  age: currentState.age + 1,
});

```

## License

This library is released under the MIT License. Please check the LICENSE file for more details.
