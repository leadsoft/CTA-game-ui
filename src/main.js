import Vue from "vue";
import i18n from '../plugins/il8n'
import App from "./App.vue";
import router from "../router/";
import Vue2Filters from 'vue2-filters'
import store from "../src/store";
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    debug: true,
    transports: ['websocket', 'polling'],
    connection: 'http://95.217.20.238:3000/'
}));

Vue.config.productionTip = false;

export const serverBus = new Vue();
Vue.use(BootstrapVue);
Vue.use(Vue2Filters);
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");

