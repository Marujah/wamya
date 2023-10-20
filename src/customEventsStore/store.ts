// StateManager.ts
export type StateNamespace = string;

export interface AppState {
  [key: string]: any;
}

export type StateUpdate<T> = (state: T) => T;

class StateManager {
  private state: Record<StateNamespace, AppState> = {};
  private eventTarget: EventTarget = new EventTarget();
  private namespace: string | null = null;

  constructor() {}

  // Connect to a namespace
  connect(namespace: StateNamespace) {
    this.namespace = namespace;
    return new ConnectedStateManager(this, namespace);
  }

  // Set a state value
  setState(namespace: StateNamespace, state: AppState): void {
    if (this.namespace) {
      this.state[namespace] = state;

      // Dispatch a custom event to notify listeners
      this.dispatchEvent(state);
    } else {
      console.error("StateManager is not connected to a namespace.");
    }
  }

  // Get a state value
  getState(namespace: StateNamespace): AppState {
    if (!this.state[namespace]) {
      this.state[namespace] = {};
    }
    return this.state[namespace];
  }

  // Subscribe to state change events
  public subscribe(
    namespace: StateNamespace,
    callback: (value: any) => void
  ): void {
    if (namespace) {
      // Add an event listener for the specific state key within the namespace
      this.eventTarget.addEventListener(namespace, (event) => {
        const value = (event as CustomEvent).detail;
        callback(value);
      });
    } else {
      console.error("StateManager is not connected to a namespace.");
    }
  }

  // Unsubscribe from state change events
  public unsubscribe(namespace: StateNamespace, callback: (value: any) => void): void {
    if (namespace) {
      // Remove the specific event listener within the namespace
      this.eventTarget.removeEventListener(
        namespace,
        (event) => {
          const value = (event as CustomEvent).detail;
          callback(value);
        }
      );
    } else {
      console.error("StateManager is not connected to a namespace.");
    }
  }

  // Dispatch a custom event with the namespace
  private dispatchEvent(state: AppState): void {
    const event = new CustomEvent(`${this.namespace}`, {
      detail: state,
    });
    this.eventTarget.dispatchEvent(event);
  }
}

class ConnectedStateManager {
  constructor(
    private manager: StateManager,
    private namespace: StateNamespace
  ) {}

  getState(): AppState {
    return this.manager.getState(this.namespace);
  }

  setState(state: AppState): void {
    this.manager.setState(this.namespace, state);
  }

  subscribe(callback: StateUpdate<AppState>): void {
    this.manager.subscribe(this.namespace, callback);
  }
  
  unsubscribe(callback: StateUpdate<AppState>): void {
    this.manager.unsubscribe(this.namespace, callback);
  }
}

const stateManager = new StateManager();
export default stateManager;
