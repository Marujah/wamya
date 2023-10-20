type State = { [key: string]: any };

class CentralStore {
  private storageKey: string;
  private listeners: Function[] = [];
  private state: State;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.state = this.loadState();
  }

  private loadState(): State {
    const storedState = localStorage.getItem(this.storageKey);
    return storedState ? JSON.parse(storedState) : {};
  }

  private saveState(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.listeners.forEach((listener) => listener(this.state));
  }

  public setState(newState: State): void {
    this.state = { ...this.state, ...newState };
    this.saveState();
  }

  public subscribe(listener: Function): void {
    this.listeners.push(listener);
  }

  public getState(): State {
    return this.state;
  }
}

const sharedCentralStore = new CentralStore('toggleState');
export default sharedCentralStore;
