<template>
    <div>
        <b-container class="bv-example-row bv-example-row-flex-cols game-tables-container">
            <b-row>
                <b-col cols="4" class="players-container">
                    <smooth-scrollbar class="players">
                        <b-list-group-item href="#" v-for="player in players" class="flex-column align-items-start"
                                           :key="player.key">
                            <div class="p-1 d-flex w-100 justify-content-between">
                                <b-row class="w-100">
                                    <b-col class="">
                                        <div class="title-container">
                                            <p class="mb-1 inline-container"><b>{{player.username}}</b></p>
                                        </div>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-list-group-item>
                    </smooth-scrollbar>
                </b-col>
                <b-col class="main-container">
                    <b-col cols="12"  class="game-header">
                        <b-row>
                            <b-col >
                                <p class="mb-1 inline-container"><b>{{details.name}}</b></p>
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
                                <img src="/images/time.png"/>
                                <p class="inline-container">{{details.time_between_rounds}}</p>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="game-container">
                        <div class="countdown-container">
                            <Countdown
                                    :end="details.time_to_started_at.toString()"></Countdown>
                        </div>

                        <div v-if="!details.in_play" class="pb-container">
                            <b-button class="red-button" variant="outline-primary" v-on:click="placeBet(details.id)">
                                <span v-if="!placeBetWaiting">
                                    Place Bet <br> {{ details.buy_in |
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

                        <div v-else="" class="pb-container">
                            <b-button class="red-button" variant="outline-primary" disabled>
                                In Play
                            </b-button>
                        </div>
                    </b-col>
                    <b-col cols="12" class="betting-history-container">
                        <smooth-scrollbar class="players">
                            <b-list-group-item href="#" v-for="h in history" class="flex-column align-items-start"
                                               :key="h.key">
                                <div class="p-1 d-flex w-100 justify-content-between">
                                    <b-row class="w-100">
                                        <b-col class="">
                                            <div class="title-container">
                                                <p class="mb-1 inline-container"><b>{{h.player_name}}</b></p>
                                            </div>
                                        </b-col>
                                        <b-col class="">
                                            <div class="">
                                                <p class="mb-1 inline-container"><b>{{h.card}}</b></p>
                                            </div>
                                        </b-col>
                                        <b-col class="">
                                            <div class="">
                                                <p class="mb-1 inline-container"><b>{{h.win}}</b></p>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-list-group-item>
                        </smooth-scrollbar>
                    </b-col>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
    import {APIService} from '../Services/ApiServices';
    import Countdown from '../components/plugins/countdown'

    import {serverBus} from '../main';

    const apiService = new APIService();

    export default {
        name: 'TableGame',
        data() {
            return {
                placeBetWaiting: false,
                players: [],
                history: [
                    {
                        "player_name": "Irene Ewing",
                        "win": "$3,321.76",
                        "card": 27
                    },
                    {
                        "player_name": "Estella Slater",
                        "win": "$2,320.94",
                        "card": 23
                    },
                    {
                        "player_name": "Janelle Pitts",
                        "win": "$3,757.15",
                        "card": 20
                    },
                    {
                        "player_name": "Lora Reese",
                        "win": "$1,200.29",
                        "card": 32
                    },
                    {
                        "player_name": "Jacquelyn Orr",
                        "win": "$2,527.21",
                        "card": 20
                    },
                    {
                        "player_name": "Torres Hall",
                        "win": "$2,988.40",
                        "card": 32
                    },
                    {
                        "player_name": "Duran Whitley",
                        "win": "$3,362.04",
                        "card": 21
                    },
                    {
                        "player_name": "Stark Ayers",
                        "win": "$2,453.82",
                        "card": 30
                    },
                    {
                        "player_name": "Alissa Bernard",
                        "win": "$1,055.06",
                        "card": 25
                    },
                    {
                        "player_name": "Ester Vega",
                        "win": "$1,494.60",
                        "card": 23
                    },
                    {
                        "player_name": "Dina Bartlett",
                        "win": "$1,127.41",
                        "card": 39
                    }
                ],
                details: {
                    hand_id: '',
                    round_id: '',
                    in_play: '',
                    jackpot: 0,
                    name: "leadsoft",
                    potential_win: 0,
                    time_between_rounds: 0,
                    time_to_started_at: 0,
                }
            }
        },

        sockets: {
            placeBet(data) {
                console.log('test', data);
                this.players.push(data.user);
                this.details.potential_win = data.details.potential_win;
                this.details.time_to_started_at = data.details.time_to_started_at;
                this.details.jackpot = data.details.jackpot;
            },

            showWinner(data){
                this.players = [];
                this.details.in_play = 0;
                this.details.potential_win = 0;
                this.details.time_to_started_at = 60;
                this.details.in_play = 0;
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
            });

            serverBus.$on('updateCountDown', (data) => {
                self.details.time_to_started_at = data.diff;
            });
        },

        methods: {
            placeBet(tableId) {
                this.placeBetWaiting = true;
                let self = this;
                apiService.placeBet(this.$route.params.token, {
                    tableId: tableId
                }).then((data) => {
                    if (data.error) {
                        this.placeBetWaiting = false;
                        /*self.gambling.autoBetting = false;
                        self.user.amount = parseFloat(self.user.amount) + parseFloat(self.model.stake);*/
                    } else {
                        self.details.in_play = 1;
                        this.placeBetWaiting = false;
                    }
                }).catch(error => {
                    console.log(error, 'err');

                });
            }
        },

        computed: {},
        components: {Countdown}
    }
</script>
<style scoped>
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

    .countdown-container {
        width: 50%;
        height: 50%;
        border: 1px solid red;
        margin-left: 20%;
        border-radius: 50%;
        box-shadow: 10px 12px 17px rgba(255, 0, 25, 0.16);
        position: relative;
        top: 20%;
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
        bottom: 0;
        transform: translate(83%);
    }

    .players {
        height: 90%;
        margin-top: 7%;
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


</style>
