<template>
    <div>
        <div class="profile-container">
            <b-row>
                <b-col cols="12">{{authUser.username}}</b-col>
            </b-row>
        </div>

        <div class="balance-container">
            <b-row>
                <b-col cols="12">{{ authUser.balance | currency(authUser.currency.toUpperCase(), 0, {
                    symbolOnLeft: false,
                    spaceBetweenAmountAndSymbol: true }) }}
                </b-col>
            </b-row>
        </div>
        <div class="home-button-group">
            <b-row>
                <b-col cols="6" class="no-padding" v-show="showHomeLink">
                    <div id="home-target" class="home-button">
                        <!--<b-row>-->

                        <router-link :to="`/dashboard/` + this.$route.params.token">
                            <img src="/images/iconfinder_Home.png"/>
                        </router-link>
                        <!--</b-row>-->
                    </div>

                    <b-tooltip target="home-target" triggers="hover" placement="bottom">
                        {{$t('links.home')}}
                    </b-tooltip>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'Head',

        data() {
            return {
                showHomeLink: !window.location.pathname.includes('dashboard'),
            }
        },

        watch: {
            $route() {
                console.log(this.$route.meta.showBackBtn, this.$route);
            }
        },

        sockets: {
            connect() {
                console.log('connected')
                //this.$socket.emit('tokenConnection', this.$route.params.token);
            },

            news(val) {
                console.log('connected', val)
            },

            disconnect() {
                console.log('socket disconnect')
            },

            /*updateBalance(val) {
                console.log('updateBalance', val);
                this.authUser.balance = val
            },*/
        },

        computed: {
            ...mapGetters({
                authUser: 'getAuthUser'
            })
        },
        components: {

        },
        methods: {}
    }
</script>