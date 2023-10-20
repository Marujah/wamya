import { describe, test, expect, assert, vi } from 'vitest';
import centralStore from './store';

describe('CentralStore Tests', () => {

  test('should initialize with an empty state', () => {
    const namespace = 'testNamespace';
    const state = centralStore.getState(namespace);
    assert.deepEqual(state, {});
  });

  test('should set and get state correctly', () => {
    const namespace = 'testNamespace';
    const newState = { count: 42 };
    centralStore.connect(namespace);
    centralStore.setState(namespace, newState);
    const retrievedState = centralStore.getState(namespace);
    assert.deepEqual(retrievedState, newState);
  });

  test('should subscribe and notify subscribers correctly', () => {
    const namespace = 'testNamespace';
    const callback = vi.fn();

    centralStore.subscribe(namespace, callback);

    const newState = { count: 42 };
    centralStore.setState(namespace, newState);

    expect(callback).toHaveBeenCalledWith(newState);
  });

});
