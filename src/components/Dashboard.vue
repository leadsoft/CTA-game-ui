<template>
    <div>
        <b-container class="bv-example-row">
            <b-row class="text-center" :class="{'justify-content-md-center': !test}">
                <b-col :class="{'history-active offset-md-1': test}" class="games-container col-12 col-sm-12 col-md-10">
                    <b-list-group-item href="#"
                                       class="flex-column align-items-start table-head">
                        <div class="p-1 d-flex w-100 justify-content-between">
                            <b-row class="w-100">
                                <b-col cols="3" class="px-0">
                                    <div class="title-container" v-on:click="doSort('name')">
                                        <p class="mb-1 inline-container"><b>Name</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="1" class="px-0">
                                    <div class="connected-players-container" v-on:click="doSort('current_player')">
                                        <p class="mb-1 inline-container"><b>No.</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="2" class="px-0">
                                    <div class="jackpot-container" v-on:click="doSort('jackpot')">
                                        <p class="mb-1 inline-container"><b>Jackpot</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="2" class="px-0">
                                    <div class="possible-win-container" v-on:click="doSort('potential_win')">
                                        <p class="mb-1 inline-container"><b>Win</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="1" class="px-0">
                                    <div class="time-to-next-hand-container" v-on:click="doSort('time_to_started_at')">
                                        <p class="mb-1 inline-container"><b>Time</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="1" class="px-0">
                                    <div class="time-to-next-hand-container" v-on:click="doSort('count_hands')">
                                        <p class="mb-1 inline-container"><b>Round</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="1" class="px-0">
                                    <div class="time-to-next-hand-container" v-on:click="doSort('buy_in')">
                                        <p class="mb-1 inline-container"><b>Price</b></p>
                                        <img src="/images/sort.png"/>
                                    </div>
                                </b-col>

                                <b-col cols="3" class="px-0">

                                </b-col>
                            </b-row>
                        </div>
                    </b-list-group-item>
                    <div id="scroll-area">
                        <smooth-scrollbar>
                            <b-list-group>
                                <b-list-group-item v-for="tableGame in orderedTableGames" href="#"
                                                   class="flex-column align-items-start" :key="tableGame.key">
                                    <div class="p-1 d-flex w-100 justify-content-between">
                                        <b-row class="w-100">
                                            <b-col cols="3" class="px-0">
                                                <p class="mb-1"><b>{{tableGame.name}}</b></p>
                                            </b-col>

                                            <b-col cols="1" class="px-0">
                                                <div class="connected-players-container">
                                                    <img src="/images/players.png"/>
                                                    <p class="inline-container">{{tableGame.current_player}}</p>
                                                </div>
                                            </b-col>

                                            <b-col cols="2" class="px-0">
                                                <div class="jackpot-container">
                                                    <img src="/images/jackpot.png"/>
                                                    <p class="inline-container">{{ tableGame.jackpot |
                                                        currency(tableGame.currency,
                                                        0,
                                                        { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })
                                                        }}</p>
                                                </div>
                                            </b-col>

                                            <b-col cols="2" class="px-0">
                                                <div class="possible-win-container">
                                                    <img src="/images/win.png"/>
                                                    <p class="inline-container">{{ tableGame.potential_win |
                                                        currency(tableGame.currency,
                                                        0, {
                                                        symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}</p>
                                                </div>
                                            </b-col>

                                            <b-col cols="1" class="px-0">
                                                <div class="time-to-next-hand-container">
                                                    <Countdown :gameId="tableGame.id.toString()"
                                                               :end="tableGame.time_to_started_at.toString()"></Countdown>
                                                </div>
                                            </b-col>

                                            <b-col cols="1" class="px-0">
                                                <div class="time-to-next-hand-container">
                                                    {{tableGame.count_hands}}
                                                </div>
                                            </b-col>

                                            <b-col cols="1" class="px-0">
                                                <div class="time-to-next-hand-container">
                                                    {{
                                                    tableGame.buy_in | currency(tableGame.currency, 0, {
                                                    symbolOnLeft:
                                                    false, spaceBetweenAmountAndSymbol: true }) }}
                                                </div>
                                            </b-col>

                                            <b-col cols="1" class="px-0">
                                                <router-link
                                                        :to="{ path: '/table-game/' + tableGame.id + '/' + token }">
                                                    <b-button class="btn btn-secondary btn-sm btn-join"
                                                    >{{tableGame.in_play === 1 ? 'VIEW' : 'ENTER'}}
                                                    </b-button>
                                                </router-link>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </smooth-scrollbar>
                    </div>
                </b-col>

                <b-col v-if="test" class="col-12 col-sm-12 col-md-10 offset-md-1 top-winns-wrap" >
                   <b-row>
                    <div class="top-wins-container mt-6 col-12 col-sm-6" v-if="topWins.length > 0">
                        <label>Top Winners</label>
                        <smooth-scrollbar>
                            <b-list-group>

                                <b-list-group-item v-for="(topWin, index) in orderedTopWin" href="#" :key="topWin.key"
                                                   class="flex-column align-items-start">
                                    <div class="p-1 d-flex w-100 justify-content-between">
                                        <b-row class="w-100">
                                            <b-col cols>
                                                <p class="mb-1">{{ index + 1}}</p>
                                            </b-col>
                                            <b-col cols>
                                                <p class="mb-1" v-if="topWin.winnerName.length < 6">{{ topWin.winnerName
                                                    }}</p>
                                                <p class="mb-1" v-else>{{ topWin.winnerName.substring(0,6)+".." }}</p>
                                            </b-col>

                                            <b-col cols>
                                                <div class="buy_in-container">
                                                    <p>{{ topWin.win |
                                                        currency(topWin.currency,
                                                        0, {
                                                        symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}</p>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </smooth-scrollbar>
                    </div>
                    <div class="top-wins-container mt-6 col-12 col-sm-6" v-if="Object.keys(history).length > 0">
                        <label>History</label>
                        <smooth-scrollbar>
                            <b-list-group>

                                <b-list-group-item v-for="(h, index) in orderedHistory" href="#" :key="h.key"
                                                   class="flex-column align-items-start">
                                    <div class="p-1 d-flex w-100 justify-content-between">
                                        <b-row class="w-100">
                                            <b-col cols>
                                                <p class="mb-1">{{ index + 1}}</p>
                                            </b-col>
                                            <b-col cols>
                                                <p class="mb-1" v-if="h.name.length < 6">{{ h.name }}</p>
                                                <p class="mb-1" v-else>{{ h.name.substring(0,6)+".." }}</p>
                                            </b-col>
                                            <b-col cols>
                                                <div class="buy_in-container">
                                                    <p>{{ h.stake |
                                                        currency(h.currency,
                                                        0, {
                                                        symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}</p>
                                                </div>
                                            </b-col>
                                            <b-col cols>
                                                <div class="buy_in-container">
                                                    <p>{{ h.win |
                                                        currency(h.currency,
                                                        0, {
                                                        symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}</p>
                                                </div>
                                            </b-col>
                                            <b-col cols>
                                                <div class="">
                                                    <p v-if="h.betStatus === 1" class="win-bet">Win</p>
                                                    <p v-if="h.betStatus === 0" class="lose-bet">Lose</p>
                                                    <p v-if="h.betStatus === -1" class="pending-bet">Pending</p>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </smooth-scrollbar>
                    </div>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
    import {APIService} from '../Services/ApiServices';
    import Countdown from '../components/plugins/countdown'
    import {serverBus} from '../main';
    import {mapGetters} from 'vuex'
    import _ from "lodash";

    const apiService = new APIService();

    export default {
        name: 'Dashboard',
        data() {
            return {

                token: '',
                sort: {
                    field: 'name',
                    desc: true
                },
                tableGames: {},

                test: false,
                options: {
                    height: '85vh',
                    size: '4px',
                    position: 'left',
                    color: 'rgba(219, 0, 24, 0.27)',
                    alwaysVisible: true,
                    distance: '1px',
                    railVisible: true,
                    railColor: 'rgba(34,34,34,0.65)',
                    railOpacity: 0.7,
                    allowPageScroll: false,
                    disableFadeOut: true
                },

                topWins: [],
                history: []
            }
        },

        created() {
            this.$socket.client.emit('joinRoom', 'dashboard');
            let self = this;
            self.token = this.$route.params.token;

            apiService.gameTables(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                if (!data.data.error)
                    self.tableGames = data.data;
            });

            apiService.gameTopWinners(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                if (!data.data.error)
                    self.topWins = data.data;
            });

            apiService.getLastMyBets(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                if (!data.data.error){
                    self.history = data.data;
                    self.$forceUpdate();
                }
            });

            serverBus.$on('showHistory', (data) => {
                /*this.mainCols = !data.showHideHistory ? 10 : 8;*/
                this.test = data.showHideHistory;
            });

            serverBus.$on('updateCountDown', (data) => {

                if (this.tableGames[data.gameId]){
                    this.tableGames[data.gameId].time_to_started_at = data.diff;
                    this.$forceUpdate();
                }

            });
        },

        sockets: {
            connect() {
                console.log("socket connected...")
            },

            updateTopWin(data){
                this.topWins.unshift(data);
                this.topWins.pop();
            },

            addNewTable(data) {
                console.log(typeof this.tableGames, data, 'data');
                this.$set(this.tableGames, data.id, data);
                /*this.tableGames[data.id] = data;*/
                //this.tableGames.push(data);
            },

            updateTable(data) {

                this.$delete(this.tableGames, data.id);
                let self = this;
                self.tableGames[data.id.toString()] = data;
                self.$forceUpdate();
            },

            updateUserHistory(data){

                this.$set(this.history, data.betId, data);
            },

            placeBet(data) {
                let pbDetails = data.gameDetails;
                let gameId = pbDetails.game_id;

                let tableDetails = this.tableGames[gameId];
                tableDetails.jackpot = pbDetails.jackpot;
                tableDetails.potential_win = pbDetails.potential_win;
                tableDetails.current_player = pbDetails.current_player;

                this.$set(this.tableGames, gameId, tableDetails);

                this.$forceUpdate();
            },
        },

        methods: {
            doSort(field) {
                if (field === this.sort.field) {
                    this.sort.desc = !this.sort.desc
                } else {
                    this.sort.field = field;
                    this.sort.desc = true;
                }
            }
        },

        computed: {

            orderedTableGames: function () {
                return _.orderBy(this.tableGames, this.sort.field, this.sort.desc ? "desc" : "asc")
            },

            orderedTopWin: function () {
                return _.orderBy(this.topWins, 'win', "desc")
            },

            orderedHistory: function () {
                return _.orderBy(this.history, 'created_at', "desc")
            }
        },
        components: {Countdown}
    }
</script>
<style scoped>
    .win-bet{
        color: #00ff00;
    }

    .lose-bet{
        color: #ff0000;
    }

    /*.pending-bet{

    }*/

    .inline-container {
        display: inline-block;
    }

    .jackpot-container p {
        margin-bottom: 0;
    }

    .title-container img, .possible-win-container img, .time-to-next-hand-container img, .connected-players-container img, .jackpot-container img {
        width: 25px;
        margin-right: 5px;
    }
    .games-container {
        margin-top: 55px;
        max-height: calc(100vh - 100px);
    }
    .games-container .list-group-item {
        padding: 0;
        position: relative;
        display: block;
        background-color: rgba(100, 108, 123, 0.89);
        border-bottom: 1px solid rgb(78, 68, 69);
        transition: box-shadow 0.3s ease-in-out;
    }
    .games-container .list-group-item .row {
        margin: 0;
    }
    .games-container p {
        font-size: 12px;
        margin: 0;
    }

    .top-wins-container .list-group-item {
        padding: 0;
        position: relative;
        display: block;
        background-color: rgba(100, 108, 123, 0.89);
        border-bottom: 1px solid rgb(78, 68, 69);
        transition: box-shadow 0.3s ease-in-out;
    }
    .list-group-item:first-child {
        border-radius: 0;
    }
    .list-group-item:last-child {
        /*
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
        */
    }

    .list-group-item:hover {
        box-shadow: 0 2px 3px rgba(0,0,0,0.5);
    }

    .list-group-item-action:hover, .list-group-item-action:focus {
        color: #f3f3f3;
        text-decoration: none;
        background-color: rgba(76, 81, 90, 0.89);
    }

    .list-group-item-action {
        color: #f3f3f3
    }

    .table-head.list-group-item {
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: rgba(76, 81, 90, 0.89);
        transition: none;
    }
    .table-head.list-group-item:hover {
        box-shadow: 0 0 0 transparent;
    }
    .table-head img {
        margin-left: 8px;
        width: 18px;
        height: 8px;
    }
    .red-button {
        padding: 0 8px;
        color: #ff0019;
        border-color: #ff0019;
    }

    .red-button:hover {
        color: #fff;
        background-color: #f2000654;
        border-color: #a0262e;
    }
    button.btn.btn-join {
        background-color: #505769;
        border-color: #505769;
        float: right;
        width: 100%;
        position: absolute;
        right: -4px;
        top: -4px;
        height: 38px;
        border-radius: 0;
    }
    .margin40 {
        margin-top: 40px;
    }

    .mt-6 {
        margin-top: 5rem;
    }
    .top-wins-container label {
        background-color: #5f646c;
        border-bottom: 1px solid #4e4445;
        padding: 10px;
        margin: 0;
        float: left;
        font-size: 20px;
        width: 100%;
    }
    .top-wins-container p {
        font-size: 12px;
    }
    
    label {
        color: #fff;
        font-size: 14px;
    }

    #scroll-area {
        /*height: 85vh;*/
    }

    
    .top-wins-container {
        height: 350px;
    }
    

</style>
<style>
    .scrollbar-track {
        background: rgba(222, 222, 222, 0.17) !important;
    }

    .scrollbar-track-y {
        top: 0;
        left: 0 !important;
        width: 3px !important;
        height: 100%;
    }

    .scrollbar-thumb {
        width: 3px !important;
        background: rgba(155, 31, 31, 0.5) !important;
    }
</style>

