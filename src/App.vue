<template>
    <div id="app" :class="currentRouteName">
        <Head/>
        <!--<HelloWorld msg="Welcome to Your Vue.js App" />-->
        <vue-page-transition name="zoom">
            <router-view class="view box grow"/>
        </vue-page-transition>
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

    html, body {
        height: 100%;
        margin: 0px;
        padding: 0px;
    }

    #app {

        height: 100%;
        background-image:
                linear-gradient(
                        rgb(0, 0, 0), rgba(0, 0, 0, 0.95),
                        rgba(0, 0, 0, 0.9)
                ),url(/images/bg.jpg);

        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
    }
</style>

