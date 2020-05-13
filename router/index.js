import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "../src/components/Dashboard";
import store from '../src/store'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/dashboard/:token', name: 'dashboard', component: Dashboard},
    ]
});

router.beforeEach((to, from, next) => {

    store.dispatch('getUserByToken', to.params.token)
        .then(next)
        .catch(error => console.log(error))
});

export default router;

