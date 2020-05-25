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
        },

        gameTables: {},
    },

    mutations: {
        setUser(state, payload) {
            state.user = payload
        },

        updateUser(state, payload) {
            state.user[payload.field] = payload.value
        },

        "pb"(data) {
            console.log('test123', data.gameTables)
        },

        setGames(state, payload) {
            state.gameTables = payload
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

        /*GET Game details*/

        getGames: (context, data) => {
            const apiService = new APIService();
            apiService.gameTables(data.token).then((response) => {

                console.log(response);
                context.commit('setGames', response.data)

            });

            /*apiService.gameTables(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                self.tableGames = data.data;
            });*/
        }
    },

    getters: {
        getAuthUser(state) {
            return state.user
        },

        getGames(state) {
            return state.gameTables
        },

        test(){
            return 1;
        }
    }
});
