<template>
    <div v-if="showHistory">
        <b-col cols="12" class="betting-history-container" v-if="history.length > 0">
            <smooth-scrollbar>
                <b-list-group-item href="#" v-for="h in history" class="flex-column align-items-start"
                                   :key="h.key">
                    <div class="p-1 d-flex w-100 justify-content-between">
                        <b-row class="w-100">
                            <b-col class="">
                                <div class="title-container">
                                    <p class="mb-1 inline-container"><b>{{showWinnerName(h.winnerName)}}</b></p>
                                </div>
                            </b-col>
                            <b-col class="">
                                <div class="history-card">
                                    <span>{{showWinnerCard(h.winner_card).card_number}}</span>
                                    <span class="suit" :class="showWinnerCard(h.winner_card).card_type"></span>
                                    <!--<img :src="'/images/Cards/' + h.winner_card + '.png'" style="width: 100%; height: 100%"/>-->
                                </div>
                            </b-col>
                            <b-col class="">
                                <div class="">
                                    <p class="mb-1 inline-container">
                                        <b v-if="h.winn">
                                            {{ h.winn | currency(h.currency, 0, { symbolOnLeft: false,
                                            spaceBetweenAmountAndSymbol: true }) }}
                                        </b>

                                        <b v-else> - </b>
                                    </p>
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </b-list-group-item>
            </smooth-scrollbar>
        </b-col>
    </div>
</template>
<script>
    import {APIService} from '../Services/ApiServices';

    const apiService = new APIService();
    export default {
        name: 'History',
        props: {
            historyData: {
                type: Object,
                default: []
            }
        },
        data() {
            return {
                history: [],
                showHistory: false,
            }
        },
        watch: {
            async historyData(val) {
                this.showHistory = false;
                await sleep(50);
                if(val.resetGame){
                    this.history = [];
                } else{
                    if(this.history.length > 0)
                        this.history.unshift(val);
                    else
                        this.history.push(val);
                }

                this.showHistory = true;
            }
        },

        created() {
            let self = this;
            apiService.gameGameHistory(this.$route.params.token, this.$route.params.gameId).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');
                self.history = data.data;
                self.showHistory = true
            });
        },

        methods: {},

        computed: {
            showWinnerCard: function () {
                return function (card) {
                    return {
                        card_type: card.substr(card.length - 1).toLowerCase(),
                        card_number: card.substring(0, card.length - 1)
                    };
                };
            },

            showWinnerName: function () {
                return function (winnerName) {
                    return winnerName ? winnerName : '-'
                };
            }
        },
        components: {}
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
</script>
<style scoped>

    .suit {
        position: relative;
        padding: 0 10px;
    }
    .suit:before {
        font-size: 21px;
        position: absolute;
        right: 0;
        top: 2px;
        line-height: 10px;
    }
    .suit.d:before {
        content: "♦";
        color: #ff0000;
        font-size: 26px;
        right: -1px;
    }

    .suit.h:before {
        content: "♥";
        color: #ff0000;
        font-size: 23px;
        right: -1px;
    }

    .suit.c:before {
        content: "♣";
        color: #fff;
    }

    .suit.s:before {
        content: "♠";
        color: #fff;
        font-size: 22px;
    }

    .betting-history-container {
        height: 290px;
    }

    .betting-history-container:after {
        content: '';
        position: absolute;
        top: 0px;
        left: 10%;
        width: 80%;
        border-top: 1px solid rgb(255, 0, 25);
    }

    .betting-history-container .list-group-item, .players-container .players .list-group-item {
        padding: 0;
        position: relative;
        display: block;
        background-color: rgba(100, 108, 123, 0.89);
        border-bottom: 1px solid rgb(78, 68, 69);
        transition: box-shadow 0.3s ease-in-out;
        color: #fff;
        font-size: 12px;
    }

    .inline-container {
        display: inline-block;
    }

    .game-tables-container img {
        width: 25px !important;
        margin-right: 5px;
    }

    .game-tables-container p {
        color: #fff;
        font-size: 12px;
    }


</style>