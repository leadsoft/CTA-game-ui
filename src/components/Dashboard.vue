<template>
   <div>
      <b-container class="bv-example-row">
         <b-row class="text-center" :class="{'justify-content-md-center': !test}">
            <b-col :cols="mainCols" :class="{'test-123': test}" class="margin-px-0 mt-5 games-container">
               <b-list-group-item href="#"
                  class="flex-column align-items-start table-head">
                  <div class="p-1 d-flex w-100 justify-content-between">
                     <b-row class="w-100">
                        <b-col cols="3" class="px-0">
                           <div class="title-container" v-on:click="doSort('name')">
                              <p class="mb-1 inline-container"><b>Table Name</b></p>
                              <img src="/images/sort.png"/>
                           </div>
                        </b-col>
                        <b-col cols="1" class="px-0">
                           <div class="connected-players-container">
                              <p class="mb-1 inline-container"><b>P. No.</b></p>
                              <img src="/images/sort.png"/>
                           </div>
                        </b-col>
                        <b-col cols="3" class="px-0">
                           <div class="jackpot-container">
                              <p class="mb-1 inline-container"><b>Jackpot</b></p>
                              <img src="/images/sort.png"/>
                           </div>
                        </b-col>
                        <b-col cols="2" class="px-0">
                           <div class="possible-win-container">
                              <p class="mb-1 inline-container"><b>Potential Win</b></p>
                              <img src="/images/sort.png"/>
                           </div>
                        </b-col>
                        <b-col cols="1" class="px-0">
                           <div class="time-to-next-hand-container">
                              <p class="mb-1 inline-container"><b>N. R</b></p>
                              <img src="/images/sort.png"/>
                           </div>
                        </b-col>
                        <b-col cols="2" class="px-0">
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
                                 <b-col cols="3" class="px-0">
                                    <div class="jackpot-container">
                                       <img src="/images/jackpot.png"/>
                                       <p class="inline-container">{{ tableGame.jackpot |
                                          currency(tableGame.currency,
                                          0,
                                          { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })
                                          }}
                                       </p>
                                    </div>
                                 </b-col>
                                 <b-col cols="2" class="px-0">
                                    <div class="possible-win-container">
                                       <img src="/images/win.png"/>
                                       <p class="inline-container">{{ tableGame.potential_win |
                                          currency(tableGame.currency,
                                          0, {
                                          symbolOnLeft: false, spaceBetweenAmountAndSymbol: true }) }}
                                       </p>
                                    </div>
                                 </b-col>
                                 <b-col cols="1" class="px-0">
                                    <div class="time-to-next-hand-container">
                                       <Countdown :gameId="tableGame.id.toString()" :end="tableGame.time_to_started_at.toString()"></Countdown>
                                    </div>
                                 </b-col>
                                 <b-col cols="2" class="px-0">
                                    <router-link
                                       :to="{ path: '/table-game/' + tableGame.id + '/' + token }">
                                       <b-button class="btn btn-secondary btn-sm btn-join"
                                          >{{tableGame.in_play === 1 ? 'VIEW' : 'JOIN'}} {{
                                          tableGame.buy_in | currency(tableGame.currency, 0, {
                                          symbolOnLeft:
                                          false, spaceBetweenAmountAndSymbol: true }) }}
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
            <b-col v-if="test">
               <div class="top-wins-container mt-6">
                  <b-list-group>
                     <label>Top Winners</label>
                     <b-list-group-item v-for="(topWin, index) in topWins" href="#" :key="topWin.key"
                        class="flex-column align-items-start">
                        <div class="p-1 d-flex w-100 justify-content-between">
                           <b-row class="w-100">
                              <b-col cols>
                                 <p class="mb-1">{{ index + 1}}</p>
                              </b-col>
                              <b-col cols>
                                 <p class="mb-1" v-if="topWin.name.length < 6">{{ topWin.name }}</p>
                                 <p class="mb-1" v-else>{{ topWin.name.substring(0,6)+".." }}</p>
                              </b-col>
                              <b-col cols>
                                 <div class="buy_in-container">
                                    <p>{{topWin.win}}</p>
                                 </div>
                              </b-col>
                           </b-row>
                        </div>
                     </b-list-group-item>
                  </b-list-group>
               </div>
               <div class="top-wins-container mt-6">
                  <b-list-group>
                     <label>History</label>
                     <b-list-group-item v-for="(h, index) in history" href="#" :key="h.key"
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
                                    <p>{{h.bet}}</p>
                                 </div>
                              </b-col>
                              <b-col cols>
                                 <div class="buy_in-container">
                                    <p>{{h.win}}</p>
                                 </div>
                              </b-col>
                           </b-row>
                        </div>
                     </b-list-group-item>
                  </b-list-group>
               </div>
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
                    field: '',
                    desc: true
                },
                tableGames: {},
                mainCols: 10,
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

                topWins: [
                    {name: 'Jon', win: '20USD'},
                    {name: 'Smith', win: '120USD'},
                    {name: 'LeadSoft', win: '20EUR'},
                    {name: 'Ghita', win: '220EUR'},
                    {name: 'Ion', win: '1BTC'},
                ],
                history: [
                    {name: 'table-1', bet: '10USD', win: '20USD'},
                    {name: 'table-1', bet: '10USD', win: '0'},
                    {name: 'table-1', bet: '20USD', win: '20USD'},
                    {name: 'table-1', bet: '100USD', win: '20USD'},
                    {name: 'table-1', bet: '5USD', win: '0'},
                ]
            }
        },

        created() {
            this.$socket.client.emit('joinRoom', 'dashboard');
            let self = this;
            self.token = this.$route.params.token;
            //this.$store.dispatch('getGames', {token: this.$route.params.token});

            apiService.gameTables(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                self.tableGames = data.data;
            });

            serverBus.$on('showHistory', (data) => {
                this.mainCols = !data.showHideHistory ? 10 : 8;
                this.test = data.showHideHistory;
            });

            serverBus.$on('updateCountDown', (data) => {
                this.tableGames[data.gameId].time_to_started_at = data.diff;
            });
        },

        sockets: {
            connect() {
                console.log("socket connected...")
            },
            disconnected() {
                console.log("socket disconnected...")
            },

            join() {
                console.log('joinToDashboard');
            },

            addNewTable(data) {
                console.log(typeof this.tableGames, data, 'data');
                this.$set(this.tableGames, data.id, data);
                /*this.tableGames[data.id] = data;*/
                //this.tableGames.push(data);
            },

            updateTable(data) {
                this.$set(this.tableGames, data.id, data);
                /*this.tableGames[data.id] = data;*/
                //this.tableGames.push(data);
                //this.$forceUpdate();
            },

            startNewGame() {

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
                if (!this.sort.field)
                    return _.orderBy(this.tableGames, 'time_between_rounds')

                return this.tableGames.concat().sort((a, b) => {
                    if (this.sort.desc) {
                        return a[this.sort.field] > b[this.sort.field] ? -1 : 1
                    } else {
                        return a[this.sort.field] > b[this.sort.field] ? 1 : -1
                    }
                })
            }
        },
        components: {Countdown}
    }
</script>
<style scoped>
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
    .list-group-item:hover {
        /*box-shadow: 0 5px 15px #000;*/
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
    .time-to-next-hand-container .vuejs-countdown .digit {
        color: #FFC107;
    }
    .margin40 {
        margin-top: 40px;
    }

    .mt-6 {
        margin-top: 5rem;
    }

    .top-wins-container p {
        font-size: 12px;
    }

    label {
        color: #fff;
        font-size: 14px;
    }

    #scroll-area {
        height: 85vh;
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

