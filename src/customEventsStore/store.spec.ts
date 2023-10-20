import { vi, describe, test, expect, beforeAll, assert } from 'vitest';
import stateManager, { StateNamespace, AppState } from './store';

describe('StateManager Tests', () => {

  beforeAll(() => {
    stateManager.connect('testNamespace');
  });

  test('should initialize with an empty state', () => {
    const namespace: StateNamespace = 'testNamespace';
    const state: AppState = stateManager.getState(namespace);
    assert.deepEqual(state, {});
  });

  test('should set and get state correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const newState: AppState = { count: 42 };
    stateManager.setState(namespace, newState);
    const retrievedState: AppState = stateManager.getState(namespace);
    assert.deepEqual(retrievedState, newState);
  });

  test('should subscribe and notify subscribers correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const callback = vi.fn();
    stateManager.subscribe(namespace, callback);

    const newState: AppState = { count: 42 };
    stateManager.setState(namespace, newState);

    expect(callback).toHaveBeenCalledWith(newState);
  });

  test('should unsubscribe and not notify unsubscribed subscribers', () => {
    const namespace: StateNamespace = 'testNamespace';
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    stateManager.subscribe(namespace, callback1);
    stateManager.subscribe(namespace, callback2);

    const newState: AppState = { count: 42 };
    stateManager.setState(namespace, newState);

    stateManager.unsubscribe(namespace, callback1);

    const updatedState: AppState = { count: 50 };
    stateManager.setState(namespace, updatedState);

    expect(callback1).toHaveBeenCalledWith(newState);
    expect(callback2).toHaveBeenCalledWith(newState);
    expect(callback2).toHaveBeenCalledWith(updatedState);
  });
});