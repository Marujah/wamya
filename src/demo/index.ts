import store from './demoStore';

console.log(store.state);

store.dispatch('add', 'Mhiri');

console.log(store.state);