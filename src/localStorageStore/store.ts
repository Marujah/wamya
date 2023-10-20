type State = { [key: string]: any };

class CentralStore {
  private listeners: { [key: string]: Function[]} = {};
  private state: State = {};

  connect(namespace: string) {
    if (!this.listeners[namespace]) {
      this.listeners[namespace] = [];
    }
    return new ConnectedStateManager(this, namespace);
  }

  public getState(namespace: string): State {
    const storedState = localStorage.getItem(namespace);
    return storedState ? JSON.parse(storedState) : {};
  }

  private saveState(namespace: string): void {
    localStorage.setItem(namespace, JSON.stringify(this.state));
    this.listeners[namespace].forEach((listener) => listener(this.state));
  }

  public setState(namespace: string, newState: State): void {
    this.state = { ...this.state[namespace], ...newState };
    this.saveState(namespace);
  }

  public subscribe(namespace: string, listener: Function): void {
    this.listeners[namespace].push(listener);
  }

}
class ConnectedStateManager {
  constructor(private manager: CentralStore, private namespace: string) {}

  getState(): State {
    return this.manager.getState(this.namespace);
  }

  setState(state: State): void {
    this.manager.setState(this.namespace, state);
  }

  subscribe(callback: Function): void {
    this.manager.subscribe(this.namespace, callback);
  }

}

const stateManager = new CentralStore();
export default stateManager;
