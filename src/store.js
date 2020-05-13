import Vuex from "vuex"
import Vue from "vue"
import {APIService} from "../src/Services/ApiServices";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            language: 'en',
            username: 'LeadSoft',
            currency: 'eur',
            api_id: ''
        }
    },

    mutations: {
        setUser(state, payload) {
            state.user = payload
        },

        updateUser(state, payload) {
            state.user[payload.field] = payload.value
        },

    },

    actions: {
        getUserByToken(context, token) {
            /*context.commit('setUser', response.data)*/
            const apiService = new APIService();
            apiService.getUser(token).then((response) => {
                context.commit('setUser', response.data)

            });
        },

        updateValue: (context, data) => {
            context.commit('updateUser', data)
        },
    },

    getters: {
        getAuthUser(state) {
            return state.user
        },

        test(){
            return 1;
        }
    }
});
