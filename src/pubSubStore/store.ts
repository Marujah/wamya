// StateManager.ts
export type StateNamespace = string;

export interface AppState {
  [key: string]: any;
}

type StateUpdate<T> = (state: T) => T;

class StateManager {
  private state: Record<StateNamespace, AppState> = {};

  private subscribers: Record<StateNamespace, StateUpdate<AppState>[]> = {};

  connect(namespace: StateNamespace) {
    return new ConnectedStateManager(this, namespace);
  }

  disconnect(namespace: StateNamespace) {
    // Remove the namespace and its state properties
    delete this.state[namespace];

    // Remove the subscribers associated with the namespace
    delete this.subscribers[namespace];
  }

  getState(namespace: StateNamespace): AppState {
    if (!this.state[namespace]) {
      this.state[namespace] = {};
    }
    return this.state[namespace];
  }

  setState(namespace: StateNamespace, state: AppState): void {
    this.state[namespace] = state;
    this.notifySubscribers(namespace, state);
  }

  subscribe(namespace: StateNamespace, callback: StateUpdate<AppState>): void {
    if (!this.subscribers[namespace]) {
      this.subscribers[namespace] = [];
    }

    this.subscribers[namespace].push(callback);
  }

  dispatch(namespace: StateNamespace, updateFn: StateUpdate<AppState>): void {
    const currentState = this.getState(namespace);
    const updatedState = updateFn({ ...currentState });
    this.setState(namespace, updatedState);
  }


  commit(): void {
    // Implement any commit logic here, like persisting state to storage.
  }

  private notifySubscribers(namespace: StateNamespace, state: AppState): void {
    const subscribers = this.subscribers[namespace] || [];
    for (const subscriber of subscribers) {
      subscriber(state);
    }
  }
}

class ConnectedStateManager {
  constructor(private manager: StateManager, private namespace: StateNamespace) {}

  getState(): AppState {
    return this.manager.getState(this.namespace);
  }

  setState(state: AppState): void {
    this.manager.setState(this.namespace, state);
  }

  subscribe(callback: StateUpdate<AppState>): void {
    this.manager.subscribe(this.namespace, callback);
  }

  dispatch(updateFn: StateUpdate<AppState>): void {
    this.manager.dispatch(this.namespace, updateFn);
  }

  commit(): void {
    this.manager.commit();
  }

  disconnect(): void {
    this.manager.disconnect(this.namespace);
  }
}

const stateManager = new StateManager();
export default stateManager;
