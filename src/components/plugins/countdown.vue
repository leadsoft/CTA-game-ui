<template>
    <ul class="vuejs-countdown">
        <li v-if="days > 0">
            <p class="digit">{{ days | twoDigits }}</p>
            <p class="text">{{ days > 1 ? 'days' : 'day' }}</p>
        </li>
        <li v-if="hours > 0">
            <p class="digit">{{ hours | twoDigits }}</p>
            <p class="text">{{ hours > 1 ? 'hours' : 'hour' }}</p>
        </li>
        <li v-if="minutes > 0 && hours < 1">
            <p class="digit">{{ minutes | twoDigits }}</p>
            <p class="text">min</p>
        </li>
        <li v-if="hours < 1" :class="{blink: diff < 10 && diff > 0}">
            <p class="digit" >{{ seconds | twoDigits }}</p>
            <p class="text">Sec</p>
        </li>
    </ul>
</template>

<script>
    let interval = null;
    export default {
        name: 'countdown',

        props: {
            deadline: {
                type: String
            },
            end: {
                type: String
            },
            stop: {
                type: Boolean
            }
        },
        data() {
            return {
                now: Math.trunc((new Date()).getTime() / 1000),
                date: null,
                diff: 0
            }
        },
        created() {
            if (this.end > 0) {
                this.diff = this.end;
                this.start();
            }
        },

        computed: {
            seconds() {
                return Math.trunc(this.diff) % 60
            },
            minutes() {
                return Math.trunc(this.diff / 60) % 60
            },
            hours() {
                return Math.trunc(this.diff / 60 / 60) % 24
            },
            days() {
                return Math.trunc(this.diff / 60 / 60 / 24)
            }
        },
        watch: {
            end(value) {
                console.log(value, 'value123');
                if(value > 0){
                    this.diff = value;
                    this.start();
                }
            },

            now() {
                if(this.diff <= 0 || this.stop){
                    this.diff = 0;
                    // Remove interval
                    clearInterval(interval);
                } else {
                    this.diff = this.diff - 1;
                }
            }
        },
        filters: {
            twoDigits(value) {
                if ( value.toString().length <= 1 ) {
                    return '0'+value.toString()
                }
                return value.toString()
            }
        },
        methods: {
            start(){
                console.log('intra', 'value')
                interval = setInterval(() => {
                    this.now = Math.trunc((new Date()).getTime() / 1000);
                }, 1000);
            }
        }
    }
</script>
<style>
    .vuejs-countdown {
        padding: 0;
        margin: 0;
    }
    .vuejs-countdown li {
        display: inline-block;
        margin: 0 2px;
        text-align: center;
        position: relative;
    }
    .vuejs-countdown li p {
        margin: 0;
    }
    .vuejs-countdown li:after {
        content: ":";
        position: absolute;
        top: 0;
        right: -4px;
        font-size: 12px;
    }
    .vuejs-countdown li:first-of-type {
        margin-left: 0;
    }
    .vuejs-countdown li:last-of-type {
        margin-right: 0;
    }
    .vuejs-countdown li:last-of-type:after {
        content: "";
    }
    .vuejs-countdown .digit {
        font-size: 12px;
    }
    .vuejs-countdown .text {
        text-transform: uppercase;
        margin-bottom: 0;
        font-size: 6px;
    }

    .blink{
        animation: blinker 1s linear infinite;
    }

    @keyframes blinker {
        50% {
            opacity: 0.3;
        }
    }
</style>