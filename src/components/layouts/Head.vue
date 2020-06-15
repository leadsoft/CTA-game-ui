<template>
    <div>
        <div class="profile-container">
            <b-row>
                <b-col cols="12">{{authUser.username}}</b-col>
            </b-row>
        </div>

        <div class="balance-container">
            <b-row>
                <b-col cols="12">
                    {{ authUser.balance | currency(authUser.currency,  0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}
                </b-col>
            </b-row>
        </div>

        <div class="history-main-container" v-show="showHistoryButton">
            <b-row>
                <b-col cols="12" >
                    <img v-on:click="showHideHistory()" src="/images/history_white.png" alt="">
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
    import {serverBus} from '../../main';

    export default {
        name: 'Head',

        data() {
            return {
                showHistory: false,
                showHistoryButton: true,
                showHomeLink: !window.location.pathname.includes('dashboard'),
            }
        },

        watch: {
            $route($to, $from) {
                this.showHomeLink = !window.location.pathname.includes('dashboard');
                this.showHistoryButton = window.location.pathname.includes('dashboard');

                console.log($to, $from, 'asdasd');
                let room = '';
                if($from.name === 'game' && $from.params.gameId){
                    console.log('asdasd test123123');
                    room = 'room_' + $from.params.gameId
                } else if($from.name === 'dashboard'){
                    room = 'dashboard';
                }

                if(room !== '')
                    this.$socket.client.emit('leaveRoom', room);
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
            }
        },

        computed: {
            ...mapGetters({
                authUser: 'getAuthUser'
            })
        },
        components: {

        },
        methods: {
            showHideHistory() {
                this.showHistory = !this.showHistory;
                serverBus.$emit('showHistory', {showHideHistory: this.showHistory});
            },
        }
    }
</script>

<style scoped>
    .profile-container{
        position: absolute;
        top: 5px;
        padding: 5px 10px;
        right: 5px;
        border-bottom: 1px solid #505769;
        color: #fff;
        background-color: #505769;
    }

    .balance-container{
        position: absolute;
    bottom: 20px;
    padding: 10px;
    left: 20px;
    box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
    border-bottom: 1px solid rgb(255, 0, 25);
    color: #fff;
    background-color: #505769;
    border-color: #505769;
        cursor: pointer;
    }

    .history-main-container{
        position: absolute;
        bottom: 20px;
        padding: 10px;
        right: 20px;
        background-color: #505769;
        border-color: #505769;
        cursor: pointer;
    }

    .history-main-container:hover{
        box-shadow: 10px 12px 17px #f8f9fa12;
        border-bottom: 1px solid #f8f9fa;
    }

    .home-button-group {
        width: 80px;
        border-radius: 5px;
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 10px;
        font-weight: bold;
        z-index: 9;
    }

</style>