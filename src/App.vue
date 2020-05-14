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

    html, body {
        height: 100%;
        margin: 0px;
        padding: 0px;
    }

    #app {

        height: 100%;
        background-image: /*linear-gradient(
                rgb(27, 25, 25),
                rgba(255, 0, 0, 0.31)
        ),url(/images/bg.jpg);*/
                /*linear-gradient(
                        rgb(27, 25, 25), rgba(53, 35, 35, 0.82),
                        rgba(149, 59, 59, 0.6)
                ),url(/images/bg.jpg);*/

                linear-gradient(
                        rgb(0, 0, 0), rgba(0, 0, 0, 0.82),
                        rgba(100, 68, 68, 0.6)
                ),url(/images/bg.jpg);

        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
    }
</style>

