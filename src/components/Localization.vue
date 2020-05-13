<template>
    <div>

    </div>
    <div class="locale-changer">

        <div class="language-container">
            <ul>
                <li v-for="(lang, i) in langs" v-on:click="changeLanguage(i)" :class="{ 'active': lang ===  current_language }"><img
                        :src="'/images/' + lang.toUpperCase() + '.png'" alt=""></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {serverBus} from '../main';

    export default {
        name: 'locale-changer',
        data() {
            return {
                langs: ['en', 'kr'],
                current_language: 'en'
            }
        },

        methods: {
            changeLanguage(i) {
                this.current_language = this.langs[i];
                this.$i18n.locale = this.langs[i];
                this.$emit('changeLanguage');
                serverBus.$emit('changeLanguage');
            },
        }
    }
</script>

<style scoped>
    .language-container {
        position: absolute;
        right: 20px;
        top: 65px;
        background: black;
        border-radius: 5px;
        z-index: 9;
    }

    .language-container ul {
        margin: 5px 0;
    }

    .language-container li {
        display: block;
        opacity: 0.3;
    }

    .language-container li.active{
        display: block;
        opacity: 1;
    }

    .language-container li:hover{
        display: block;
        opacity: 1;
    }


</style>