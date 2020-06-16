<template>
    <div class="hand spread">
        <div v-for="index in 20" :key="index" class="card" :style="style(index)"
             :class="{initial: initialClass, 'winner_card': index === 10, 'move-left': index === 10 && leftCard, 'flip-card': index === 10 && flipCard, 'burn': index === 10 && burnCard}">
            <div class="flip-card-back back_card"></div>
            <div class="flip-card-front">
                <img :src="'/images/Cards/' + winnerCard + '.png'" style="width: 100%; height: 100%"/>
            </div>
        </div>

    </div>
</template>
<script>

    export default {
        name: 'DrawCard',
        props: {
            initialClass: {
                type: Boolean,
                default: false
            },
            winnerCard: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                name: 'DrawCard',
                leftCard: false,
                flipCard: false,
                gameEnd: false,
                burnCard: false,
            }
        },

        created() {

        },

        watch: {
            async initialClass(val) {
                console.log('initialClass');
                let self = this;
                if (!val) {
                    this.$emit('gameEnd', false);
                    await sleep(1000);
                    self.leftCard = true;
                    await sleep(1000);
                    this.$emit('initialClass', true);
                    await sleep(1000);
                }
            },

            async winnerCard(val) {
                console.log('winner');
                let self = this;
                if (val) {
                    self.flipCard = true;
                    await sleep(3500);
                    self.flipCard = false;
                    await sleep(700);
                    self.burnCard = true;
                    await sleep(1000);
                    self.leftCard = false;
                    //await sleep(1000);
                    this.$emit('gameEnd', true);
                    await sleep(1000);

                    console.log('test');
                    self.burnCard = false;
                }
            }
        },

        sockets: {},

        methods: {},

        computed: {
            style: function () {
                return function (index) {

                    let left = -100 + index * 10;
                    let transform = -43 + index * 4;

                    return {
                        left: left + 'px',
                        transform: 'rotate(' + transform + 'deg)'
                    };
                };
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    body {
        background: #00a651;
    }

    /*HEADER*/
    .header {
        height: 25px;
        background: #222;
        color: #eee;
        text-align: center;
        font: 10px/25px Helvetica, Verdana, sans-serif;
    }

    .header a {
        color: #999;
    }

    .hand {
        margin: 50px;
    }

    /* For modern browsers */
    .hand:before,
    .hand:after {
        content: "";
        display: table;
    }

    .hand:after {
        clear: both;
    }

    /* For IE 6/7 (trigger hasLayout) */
    .hand {
        zoom: 1;
    }

    .card {
        position: relative;
        float: left;
        margin-right: 10px;
        width: 150px;
        height: 220px;
        border-radius: 10px;
        background: white;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        -webkit-box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
        box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
    }

    .card p {
        text-align: center;
        font: 100px/220px Georgia, serif;
    }

    /*.suitdiamonds:before, .suitdiamonds:after {
        content: "♦";
        color: #ff0000;
    }

    .suithearts:before, .suithearts:after {
        content: "♥";
        color: #ff0000;
    }

    .suitclubs:before, .suitclubs:after {
        content: "♣";
        color: #000;
    }

    .suitspades:before, .suitspades:after {
        content: "♠";
        color: #000;
    }*/

    /*SPREAD*/
    .spread {
        width: 0;
        height: 0;
        position: relative;
        margin: 0 0 0 25%;
    }

    .spread > .card {
        position: absolute;

        transition: all 0.8s;
    }

    .spread > .card:hover {
        -webkit-box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.4);
        box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.4);
    }

    .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    .flip-card-front {
        transform: rotateY(180deg);
    }

    .flip-card-back {

    }

    .back_card {
        background-image: url(/images/back_card.svg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 95% 95%;

    }

    .card.initial {
        left: 0 !important;
        transform: rotate(0deg) !important;
    }

    .card.move-left {
        transform: rotate(0deg) !important;
        left: -160px !important;
    }

    .card.flip-card {
        /*transform: rotate3d(0, 1, 0, 180deg) !important;
        z-index: 9999;*/

        transform: rotateY(180deg) !important;
    }

    .card.burn {
        -webkit-animation: slide-out-blurred-bottom 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
        animation: slide-out-blurred-bottom 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
    }

    /**
     * ----------------------------------------
     * animation slide-out-blurred-bottom
     * ----------------------------------------
     */
    @-webkit-keyframes slide-out-blurred-bottom {
        0% {
            -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
            -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
            -webkit-filter: blur(0);
            filter: blur(0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translateY(1000px) scaleY(2) scaleX(0.2);
            transform: translateY(1000px) scaleY(2) scaleX(0.2);
            -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
            -webkit-filter: blur(40px);
            filter: blur(40px);
            opacity: 0;
        }
    }

    @keyframes slide-out-blurred-bottom {
        0% {
            -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
            -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
            -webkit-filter: blur(0);
            filter: blur(0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translateY(1000px) scaleY(2) scaleX(0.2);
            transform: translateY(1000px) scaleY(2) scaleX(0.2);
            -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
            -webkit-filter: blur(40px);
            filter: blur(40px);
            opacity: 0;
        }
    }

    /**
     * ----------------------------------------
     * animation swirl-out-bl-bck
     * ----------------------------------------
     */
    @-webkit-keyframes swirl-out-bl-bck {
        0% {
            -webkit-transform: rotate(0) scale(1);
            transform: rotate(0) scale(1);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            opacity: 1;
        }
        100% {
            -webkit-transform: rotate(-540deg) scale(0);
            transform: rotate(-540deg) scale(0);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            opacity: 0;
        }
    }

    @keyframes swirl-out-bl-bck {
        0% {
            -webkit-transform: rotate(0) scale(1);
            transform: rotate(0) scale(1);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            opacity: 1;
        }
        100% {
            -webkit-transform: rotate(-540deg) scale(0);
            transform: rotate(-540deg) scale(0);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            opacity: 0;
        }
     }

</style>

