import { Store } from '../main';

const store = new Store({
    state: {
        name: 'Marouen',
    },
    actions: {
        add: (context: any, payload: any) => context.commit('add', payload),
    },
    mutations: {
        add: (state: any, payload: string) => {
            state.name = payload;
        },
    }
});

export default store;