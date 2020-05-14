<template>
    <div>
        <b-container-fluid class="bv-example-row">
            <b-row class="text-center">
                <b-col>
                    <div class="top-wins-container mt-10">
                        <b-list-group>
                            <label>Top Winners</label>
                            <b-list-group-item v-for="topWin in topWins" href="#"
                                               class="flex-column align-items-start">
                                <div class="p-1 d-flex w-100 justify-content-between">
                                    <b-row class="w-100">
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
                </b-col>
                <b-col cols="6" class="mt-5 games-container">
                    <b-list-group>
                        <b-list-group-item v-for="tableGame in tableGames" href="#"
                                           class="flex-column align-items-start">
                            <div class="p-1 d-flex w-100 justify-content-between">
                                <b-row class="w-100">
                                    <b-col cols="3">
                                        <p class="mb-1">{{tableGame.name}}</p>
                                    </b-col>

                                    <b-col cols="1" class="px-0">
                                        <div class="connected-players-container">
                                            <p class="inline-container">5</p>
                                        </div>
                                    </b-col>

                                    <b-col cols="3">
                                        <div class="jackpot-container">
                                            <p class="inline-container">2000 {{tableGame.currency}}</p>
                                        </div>
                                    </b-col>


                                    <b-col cols="3">
                                        <div class="buy_in-container">
                                            <span>Fee: {{tableGame.buy_in}} {{tableGame.currency}}</span>
                                        </div>
                                    </b-col>

                                    <b-col cols="2">
                                        <b-button class="red-button" variant="outline-primary">Enter</b-button>
                                    </b-col>
                                </b-row>


                            </div>

                        </b-list-group-item>
                    </b-list-group>
                </b-col>
                <b-col>
                    <b-col>
                        <div class="top-wins-container mt-10">
                            <b-list-group>
                                <label>Betting History</label>
                                <b-list-group-item v-for="topWin in topWins" href="#"
                                                   class="flex-column align-items-start">
                                    <div class="p-1 d-flex w-100 justify-content-between">
                                        <b-row class="w-100">
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
                    </b-col>
                </b-col>
            </b-row>
        </b-container-fluid>
    </div>
</template>
<script>
    import {APIService} from '../Services/ApiServices';

    const apiService = new APIService();

    export default {
        name: 'Dashboard',
        data() {
            return {
                tableGames: {},
                topWins: [
                    {name: 'Jon', win: '20USD'},
                    {name: 'Smith', win: '120USD'},
                    {name: 'LeadSoft', win: '20EUR'},
                    {name: 'Ghita', win: '220EUR'},
                    {name: 'Ion', win: '1BTC'},
                    {name: 'Claudiu', win: '1,5BTC'},
                    {name: 'Adrian', win: '1RTH'},
                    {name: 'Marius', win: '1ETH'},
                    {name: 'Adi', win: '1USB'},
                    {name: 'Lorin', win: '1RON'}
                ]


            }
        },

        created() {
            let self = this;
            apiService.gameTables(this.$route.params.token).then((data) => {
                if (data.error)
                    alert('TOKEN EXPIRE!');

                self.tableGames = data.data;
            });
        },
    }
</script>
<style scoped>
    .inline-container {
        display: inline-block;
    }

    .jackpot-container p {
        margin-bottom: 0;
    }

    .connected-players-container img, .jackpot-container img {
        width: 30px;
    }

    .jackpot-container {
        background: url(/images/jackpot.png);
        background-repeat: no-repeat;
        background-position: left;
        background-size: 27px;
    }

    .connected-players-container {
        background: url(/images/players.png);
        background-repeat: no-repeat;
        background-position: left;
        background-size: 27px;
    }

    .connected-players-container p {
        margin: 2px 0 0 6px;
    }

    .games-container .list-group-item {
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
    }

    .top-wins-container .list-group-item {
        padding: 0;
        position: relative;
        display: block;
        background-color: transparent;
        border-top: 1px solid rgb(255, 0, 25);
        margin-bottom: 11px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .list-group-item:last-child {
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }

    .list-group-item:hover {
        box-shadow: 0 5px 15px #000;
    }

    .list-group-item-action:hover, .list-group-item-action:focus {
        color: #f3f3f3;
        text-decoration: none;
        background-color: inherit;
    }

    .list-group-item-action {
        color: #f3f3f3
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

    .margin40 {
        margin-top: 40px;
    }

    .mt-10 {
        margin-top: 10rem;
    }

    .top-wins-container p {
        font-size: 12px;
    }

    label{
        color: #fff;
        font-size: 14px;
    }
</style>