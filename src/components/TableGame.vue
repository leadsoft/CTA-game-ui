<template>
    <div>
        <v-dialog/>
        <b-container class="bv-example-row bv-example-row-flex-cols game-tables-container">
            <b-row>

                <b-col cols="4" class="players-container">
                    <smooth-scrollbar class="players">
                        <transition name="fade">
                            <div v-if="!game.hidePlayerList">
                                <b-list-group-item href="#" v-for="player in orderedByWinner"
                                                   class="flex-column align-items-start enrolled-users"
                                                   :class="{ selected: player.isSelected, winner: player.winner }"
                                                   :key="player.key">
                                    <div class="p-1 d-flex w-100 justify-content-between">
                                        <b-row class="w-100">
                                            <b-col class="">
                                                <div class="title-container">
                                                    <p class="mb-1 inline-container"><b>{{player.username}} </b></p>
                                                    <p v-if="player.tickets > 1"
                                                       class="mb-1 inline-container float-right"><b>( {{player.tickets >
                                                        1 ? player.tickets : ''}} ) </b></p>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-list-group-item>
                            </div>
                        </transition>
                    </smooth-scrollbar>
                </b-col>
                <b-col class="main-container">
                    <b-col cols="12" class="game-header">
                        <b-row>
                            <b-col>
                                <p class="mb-1 inline-container"><b>{{details.name}} - {{details.round_id}}</b></p>
                                <!--<img src="/images/sort.png"/>-->
                            </b-col>
                            <b-col>
                                <img src="/images/jackpot.png"/>
                                <p class="inline-container">{{ details.jackpot |
                                    currency(details.currency,
                                    0,
                                    { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })
                                    }}</p>
                            </b-col>
                            <b-col>
                                <img src="/images/win.png"/>
                                <p class="inline-container">{{ details.potential_win |
                                    currency(details.currency,
                                    0,
                                    { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })
                                    }}</p>
                            </b-col>
                            <b-col>
                                <p class="inline-container">{{details.count_hands}}</p>
                            </b-col>
                            <b-col>
                                <img src="/images/time.png"/>
                                <p class="inline-container">{{details.time_between_rounds}}</p>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="game-container">

                        <transition name="fade">
                            <div class="countdown-container">
                                <Countdown :gameId="details.game_id.toString()"
                                           :end="details.time_to_started_at.toString()"></Countdown>
                            </div>
                        </transition>

                        <transition name="fade">
                            <!--<div class="card-container" v-if="game.start">-->
                            <div class="card-container">
                                <DrawCard @gameEnd="game.gameEnd = !game.gameEnd" @initialClass="game.draw = !game.draw"
                                          :winnerCard="game.winner_combination" :initialClass="game.draw"/>
                            </div>
                        </transition>

                        <div class="pb-container">
                            <b-button :disabled="game.disabled_place_bet" class="red-button " variant="outline-primary"
                                      v-on:click="placeBet(details.id)">
                                <span v-if="!placeBetWaiting">
                                    Buy Ticket <br> {{ details.buy_in |
                                    currency(details.currency,
                                    0,
                                    { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })
                                    }}
                                </span>

                                <span v-else="">
                                    <b-spinner label="Loading..."></b-spinner>
                                </span>
                            </b-button>
                        </div>
                    </b-col>
                    <History :history-data="history"/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
    import {APIService} from '../Services/ApiServices';
    import Countdown from '../components/plugins/countdown'
    import DrawCard from '../components/DrawCard'
    import History from '../components/History'

    import {serverBus} from '../main';

    const apiService = new APIService();
    export default {
        name: 'TableGame',

        data() {
            return {

                placeBetWaiting: false,
                players: {/*
                    "26": {"username": "leadsoft15", "id": 26, "tickets": 1},
                    "23": {"username": "leadsoft1", "id": 23, "tickets": 1},
                    "24": {"username": "leadsoft3", "id": 24, "tickets": 1},
                    "25": {"username": "leadsoft12", "id": 25, "tickets": 1},
                */},
                history: {},
                details: {
                    hand_id: '',
                    round_id: '',
                    in_play: '',
                    jackpot: 0,
                    name: "leadsoft",
                    game_id: 0,
                    potential_win: 0,
                    time_between_rounds: 0,
                    time_to_started_at: 0,
                },

                game: {
                    gameEnd: true,
                    draw: true,
                    hidePlayerList: false,
                    start: false,
                    running: false,
                    disabled_place_bet: false,
                    winner_combination: '',
                    winn: {}
                }
            }
        },

        sockets: {
            placeBet(data) {
                if (this.players[data.user.id]) {
                    this.players[data.user.id].tickets += 1
                } else {
                    data.user.tickets = 1;
                    this.$set(this.players, data.user.id.toString(), data.user);
                    /*this.players[data.user.id] = data.user;
                    this.$forceUpdate();*/
                }

                this.details.potential_win = data.details.potential_win;
                this.details.time_to_started_at = data.details.time_to_started_at;
                this.details.jackpot = data.details.jackpot;
            },

            showWinner(data) {
                //console.log('showWinner', data);
                this.game.winn = data;
                this.details.time_to_started_at = data.time_to_started_at;
                this.details.count_hands = data.count_hands;
                this.details.round_id = data.round_id;

                this.details.jackpot = data.jackpot;
                this.details.potential_win = data.potential_win;
                this.$set(this.game, 'winner_combination', data.winner_card);
                this.history = data;
                this.$forceUpdate();
                this.$set(self.game, 'disabled_place_bet', false);
            }
        },

        created() {
            let self = this;
            this.$socket.client.emit('joinRoom', 'room_' + this.$route.params.gameId);

            apiService.gameDetails(this.$route.params.token, this.$route.params.gameId).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                self.details = data.data.details;
                self.players = data.data.players;

                console.log(self.details.time_to_started_at, typeof self.details.time_to_started_at);
                /*if(self.details.time_to_started_at < 5)
                    self.game.disabled_place_bet = true;*/
            });

            serverBus.$on('updateCountDown', (data) => {
                self.game.disabled_place_bet = true;
                if ((!self.game.start && !self.game.running) && this.$route.params.gameId === data.gameId) {
                    console.log('testStart');
                    self.game.start = true;
                }

                self.details.time_to_started_at = data.diff;
            });
        },
        watch: {
            'game.start'(val) {
                if (val)
                    this.startGame();
            },

            'game.gameEnd'(val) {
                console.log(this.game.start, val, 'game.gameEnd');
                if (val && this.game.start)
                    this.prepareForNewGame();
            }
        },

        methods: {
            placeBet(tableId) {
                this.placeBetWaiting = true;
                let self = this;
                apiService.placeBet(this.$route.params.token, {
                    tableId: tableId
                }).then((data) => {
                    if (data.error) {
                        self.placeBetWaiting = false;
                        console.log(data.msg);
                        self.$modal.show('dialog', {
                            title: '!',
                            text: data.msg,
                            buttons: [
                                {
                                    title: 'Close'
                                }
                            ]
                        })
                    } else {
                        this.$store.dispatch("updateValue", {
                            field: 'balance',
                            value: data.response.balance
                        });

                        this.placeBetWaiting = false;
                    }
                }).catch(error => {
                    console.log(error, 'err');
                });
            },

            async startGame() {
                let self = this;
                if (self.game.start)
                    self.game.running = true;

                await sleep(500);
                this.$set(self.game, 'draw', false);


                if (Object.keys(this.players).length > 0) {
                    let i = 0;
                    let j = 0;
                    let prevPlayer = false;
                    while (i < Object.keys(this.players).length) {
                        await sleep(100);
                        let currentPlayerId = Object.keys(this.players)[i];

                        if (prevPlayer)
                            this.players[prevPlayer]['isSelected'] = false;

                        this.players[currentPlayerId]['isSelected'] = true;
                        this.$forceUpdate();

                        prevPlayer = currentPlayerId;

                        if (self.game.winn.winnerId && self.game.winn.winnerId !== 0 && self.game.winn.winnerId === self.players[currentPlayerId].id) {
                            this.$set(self.players[currentPlayerId], 'winner', true);
                            let winnerUser = self.players[currentPlayerId];
                            this.$delete(self.players, currentPlayerId);

                            this.$set(self.players, currentPlayerId.toString(), winnerUser);
                            break;
                        } else if (self.game.winn.winnerId === 0) {
                            this.$set(self.players[prevPlayer], 'isSelected', false);
                            break;
                        } else if(i === Object.keys(this.players).length - 1){
                                i = 0;
                        } else {
                            i++;
                        }
                    }
                }
            },

            async prepareForNewGame() {

                let self = this;

                this.$set(self.game, 'hidePlayerList', true);
                this.$set(self.game, 'winn', {});
                await sleep(500);
                this.$set(self.game, 'hidePlayerList', false);
                self.players = {};

                this.$set(self.game, 'running', false);
                this.$set(self.game, 'start', 0);
                this.$set(self.game, 'disabled_place_bet', false);
                this.$set(self.details, 'in_play', false);
                this.$set(self.game, 'winner_combination', '');
            }
        },

        computed: {
            orderedByWinner: function () {
                return _.orderBy(this.players, 'winner')
            }
        },
        components: {Countdown, DrawCard, History}
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
</script>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .7s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .game-tables-container {
        height: 90vh;
    }

    .game-tables-container .row {
        height: 100%;
    }

    .main-container, .players-container {
        height: 100%;
        margin-top: 5%;
    }

    .players-container {
        position: relative;
        z-index: 10;
    }

    .players-container:after {
        content: '';
        position: absolute;
        top: 10%;
        right: 0;
        height: 80%;
        border-left: 1px solid rgb(255, 0, 25);
    }

    .main-container .game-header {
        height: 5%;
    }

    .betting-history-container {
        height: 30%;
    }

    .betting-history-container:after {
        content: '';
        position: absolute;
        top: 0px;
        left: 10%;
        width: 80%;
        border-top: 1px solid rgb(255, 0, 25);
    }

    .game-container {
        height: 60%;
        position: relative;
    }

    .game-header:after {
        content: '';
        position: absolute;
        left: 10%;
        bottom: 0;
        width: 80%;
        border-bottom: 1px solid rgb(255, 0, 25);
    }

    .betting-history-container .list-group-item, .players-container .players .list-group-item {
        padding: 0;
        position: relative;
        display: block;
        background-color: transparent;
        border-bottom: 1px solid rgb(255, 0, 25);
        margin-bottom: 11px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        transition: box-shadow 0.3s ease-in-out;
        color: #fff;
        font-size: 12px;
    }

    .inline-container {
        display: inline-block;
    }

    .game-tables-container img {
        width: 25px;
        margin-right: 5px;
    }

    .game-tables-container p {
        color: #fff;
        font-size: 12px;
    }

    .card-container {
        width: 290px;
        height: 290px;
        /*border: 1px solid red;*/
        margin-left: calc((100% - 290px) / 2);
        /*box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);*/
        position: absolute;
        top: 15%;
        z-index: 1;
    }

    .countdown-container {
        background: #010101de;
        /*width: 290px;
        height: 290px;*/
        /*border: 1px solid red;*/
        margin-left: calc((100% - 290px) / 2);
        /*border-radius: 50%;*/
        /*box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);*/
        position: absolute;

        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        border-bottom: 1px solid rgb(255, 0, 25);
        z-index: 2;
        right: 30px;
        top: 0;
    }

    .red-button {
        padding: 0 8px;
        color: #ff0019;
        border-color: #ff0019;
        width: 200px;
        height: 80px;
        font-size: 25px;
    }

    .red-button:disabled {
        color: #fff;
    }

    .red-button:hover {
        color: #fff;
        background-color: #f2000654;
        border-color: #a0262e;
    }

    .game-container .pb-container {
        position: absolute;
        bottom: 10%;
        width: 290px;
        margin-left: calc((100% - 290px) / 2);

    }

    .float-right {
        float: right;
    }

    .players {
        height: 90%;
        margin-top: 7%;
    }

    .enrolled-users.selected {
        border-bottom: 1px solid #fff !important;
        box-shadow: 10px 12px 17px rgba(250, 250, 250, 0.16) !important;
    }

    .enrolled-users.selected.winner {
        animation: blinker 1s linear infinite;
    }

    .history-card img {
        height: 23px !important;
        width: 20px !important;
    }
</style>
<style>
    .game-container .vuejs-countdown li:last-child:after {
        content: ":";
        position: absolute;
        top: 10px;
        left: -78px;
        font-size: 25px;
        color: #fff;
    }

    .game-container p {
        color: #fff !important;
        font-size: 40px !important;
    }

    .game-container .vuejs-countdown {
        margin-top: 23%;
    }

    .vm--overlay {
        background: rgba(0, 0, 0, 0.7) !important;
    }
</style>