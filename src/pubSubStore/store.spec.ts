// StateManager.test.ts
import { describe, test, assert, vi, expect } from 'vitest';
import stateManager, { StateNamespace, AppState } from './store';

describe('StateManager Tests', () => {
  
  test('should initialize with an empty state', () => {
    const namespace: StateNamespace = 'testNamespace';
    const state: AppState = stateManager.getState(namespace);
    expect(state).to.deep.equal({});
  });

  test('should set and get state correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const newState: AppState = { count: 42 };
    stateManager.setState(namespace, newState);
    const retrievedState: AppState = stateManager.getState(namespace);
    assert.deepEqual(retrievedState, newState);
  });

  test('should dispatch and update state correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const initialState: AppState = { count: 42 };
    stateManager.setState(namespace, initialState);

    const updateFn = (state: AppState) => ({ ...state, count: state.count + 1 });
    stateManager.dispatch(namespace, updateFn);

    const updatedState: AppState = stateManager.getState(namespace);
    assert.equal(updatedState.count, 43);
  });

  test('should subscribe and notify subscribers correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const initialState: AppState = { count: 42 };
    stateManager.setState(namespace, initialState);

    const callback = vi.fn();
    stateManager.subscribe(namespace, callback);

    const updateFn = (state: AppState) => ({ ...state, count: state.count + 1 });
    stateManager.dispatch(namespace, updateFn);

    expect(callback).toHaveBeenCalledWith({ count: 43 });
  });

  test('should disconnect and remove state correctly', () => {
    const namespace: StateNamespace = 'testNamespace';
    const initialState: AppState = { count: 42 };
    stateManager.setState(namespace, initialState);

    const callback = vi.fn();
    stateManager.subscribe(namespace, callback);

    stateManager.disconnect(namespace);

    const retrievedState: AppState = stateManager.getState(namespace);
    assert.deepEqual(retrievedState, {});
  });
});