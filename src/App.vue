<template>
    <div id="app" :class="currentRouteName">
        <Head/>
        <!--<HelloWorld msg="Welcome to Your Vue.js App" />-->
        <router-view class="view box grow"/>
    </div>
</template>

<script>
    import Head from "./components/layouts/Head";

    export default {
        name: "App",
        components: {Head},
        computed: {
            currentRouteName() {
                return this.$route.name;
            }
        }
    };
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>

