import Vue from "vue";
import i18n from "../plugins/il8n"
import App from "./App.vue";
import router from "../router/";
import Vue2Filters from "vue2-filters";
import store from "../src/store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSlimScroll from "vue-slimscroll";
import SmoothScrollbar from "vue-smooth-scrollbar";

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

import VuePageTransition from 'vue-page-transition'
import VModal from 'vue-js-modal'


const socket = io('http://95.217.20.238:3000', {
    transportOptions: {
        polling: {
            extraHeaders: {
                Authorization: window.location.pathname.split("/").pop()
            }
        }
    }
});
Vue.use(VueSocketIOExt, socket);
//import VueSocketIO from 'vue-socket.io'
Vue.use(VuePageTransition)
Vue.use(SmoothScrollbar);
Vue.use(VueSlimScroll);
Vue.use(Vue2Filters);

Vue.config.productionTip = false;

export const serverBus = new Vue();
Vue.use(BootstrapVue);
Vue.use(Vue2Filters);
Vue.use(VModal, {dialog: true});
/*Vue.use(new VueSocketIO({
    debug: true,
    connection: "http://95.217.20.238:3000",
    vuex: {
        store,
        actionPrefix: 'cta_',
        mutationPrefix: 'cta_',
        options: {
            useConnectionNamespace: true
        }
    },
    options: {} //Optional options
}));*/


new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");