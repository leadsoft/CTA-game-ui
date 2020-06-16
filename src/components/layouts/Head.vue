<template>
    <div>
        <div class="profile-container">
            <b-row>
                <b-col cols="12">{{authUser.username}}</b-col>
            </b-row>
        </div>

        <div class="balance-container">
            <b-row>
                <b-col cols="12" class="new-win" :class="{active: newWin}">
                    <b>+</b> {{ newWinVal | currency(authUser.currency, 0, { symbolOnLeft: false,
                    spaceBetweenAmountAndSymbol: true }) }}
                </b-col>
                <b-col cols="12" class="main-balance" :class="{'update-balance': updateBalance}">
                    {{ authUser.balance | currency(authUser.currency, 0, { symbolOnLeft: false,
                    spaceBetweenAmountAndSymbol: true }) }}
                </b-col>
            </b-row>
        </div>

        <div class="history-main-container" v-show="showHistoryButton">
            <b-row>
                <b-col cols="12">
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
                newWin: false,
                updateBalance: false,
                newWinVal: '',
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
                if ($from.name === 'game' && $from.params.gameId) {
                    console.log('asdasd test123123');
                    room = 'room_' + $from.params.gameId
                } else if ($from.name === 'dashboard') {
                    room = 'dashboard';
                }

                if (room !== '')
                    this.$socket.client.emit('leaveRoom', room);
            }
        },

        sockets: {
            async updateUserBalance(data) {
                this.newWinVal = data.balance;
                if (!this.newWin) {
                    this.newWin = true;

                    await sleep(1000);
                    this.$store.dispatch("updateValue", {
                        field: 'balance',
                        value: data.balance
                    });
                    this.newWinVal = '';
                    this.newWin = false;
                    this.updateBalance = true;
                    await sleep(5000);
                    this.updateBalance = false;
                }
            },

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
        }
        ,

        computed: {
            ...
                mapGetters({
                    authUser: 'getAuthUser'
                })
        }
        ,
        components: {}
        ,
        methods: {
            showHideHistory() {
                this.showHistory = !this.showHistory;
                serverBus.$emit('showHistory', {showHideHistory: this.showHistory});
            }
            ,
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
</script>

<style scoped>
    .profile-container {
        position: absolute;
        top: 20px;
        padding: 10px;
        right: 20px;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        border-bottom: 1px solid rgb(255, 0, 25);
        color: #fff;
    }

    .balance-container {
        position: absolute;
        bottom: 20px;
        padding: 10px;
        left: 20px;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        border-bottom: 1px solid rgb(255, 0, 25);
        color: #fff;
    }

    .history-main-container {
        position: absolute;
        bottom: 20px;
        padding: 10px;
        right: 20px;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        border-bottom: 1px solid rgb(255, 0, 25);
        cursor: pointer;
    }

    .history-main-container:hover {
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

    .new-win {
        position: absolute;
        top: -309px;
        opacity: 0;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        border-bottom: 1px solid rgb(255, 0, 25);
        transition: all 1s linear;
    }

    .new-win.active {
        -webkit-animation: fadein 1.2s; /* Safari, Chrome and Opera > 12.1 */
        -moz-animation: fadein 1.2s; /* Firefox < 16 */
        -ms-animation: fadein 1.2s; /* Internet Explorer */
        -o-animation: fadein 1.2s; /* Opera < 12.1 */
        animation: fadein 1.2s;
        top: 0;
    }

    @keyframes fadein {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }

    /* Firefox < 16 */
    @-moz-keyframes fadein {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }

    /* Safari, Chrome and Opera > 12.1 */
    @-webkit-keyframes fadein {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }

    /* Internet Explorer */
    @-ms-keyframes fadein {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }

    /* Opera < 12.1 */
    @-o-keyframes fadein {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }


    .main-balance.update-balance {
        animation: bounceIn 2s;
    }

    @-webkit-keyframes bounceIn {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes bounceIn {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            transform: scale(1);
        }
    }
</style>