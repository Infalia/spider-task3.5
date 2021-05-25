<template>
    <div>
        <button class="btn btn-primary" v-on:click="sendMsg()">Stream</button>
        <v-chart class="chartBar" :option="optionBar" />
        <!-- <v-chart class="chartPie" :option="optionPie" /> -->
    </div>
</template>

<style scoped>
.btn {
    display: inline-block;
    margin-bottom: 30px;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.btn:hover {
    cursor: pointer;
}

.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
</style>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from "echarts/components";
import { default as VChart, THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
import axios from "axios";

use([
    CanvasRenderer,
    PieChart,
    BarChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

export default defineComponent({
    name: "Charts",
    components: {
        VChart
    },
    provide: {
        [THEME_KEY]: "dark"
    },
    data () {
        const optionBar = {
            title: {
                text: "Kafka Consumers",
                left: "center"
            },
            grid: [
                {left: '5%', top: '5%', width: '40%', height: '80%'},
                {right: '5%', top: '5%', width: '40%', height: '80%'},
            ],
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c}"
            },
            xAxis: [
                {gridIndex: 0, type: 'category', data: []},
                {gridIndex: 1, type: 'category', data: []},
            ],
            yAxis: [
                {gridIndex: 0, type: 'time'},
                {gridIndex: 1, type: 'time'}
            ],
            series: [
                {
                    name: 'log_stream',
                    type: 'line',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: []
                },
                {
                    name: 'test-topic',
                    type: 'line',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: []
                }
            ]
        };
        


        return {
            // optionPie,
            optionBar
        };
    },
    methods: {
        webSocketInvoke () {
            if ('WebSocket' in window) {
                console.log('WebSocket is supported by your Browser!');


                const ws = new WebSocket('ws://localhost:3000/', 'echo-protocol');
                const ws2 = new WebSocket('ws://localhost:3002/', 'echo-protocol2');
            
                ws.onopen = () => {
                    console.log('Connection created');
                };

                ws2.onopen = () => {
                    console.log('Connection 2 created');
                };
                
                ws.onmessage = (evt) => {
                    const received_msg = evt.data;
                    const payload = JSON.parse(received_msg);

                    this.optionBar.xAxis[0].data.push(payload['offset']);
                    this.optionBar.series[0].data.push(payload['@timestamp']);
                };

                ws2.onmessage = (evt) => {
                    const received_msg = evt.data;
                    const payload = JSON.parse(received_msg);

                    this.optionBar.xAxis[1].data.push(payload['type']);
                    this.optionBar.series[1].data.push(payload['time']);
                };
                
                ws.onclose = () => {
                    console.log('Connection closed');
                };

                ws2.onclose = () => {
                    console.log('Connection 2 closed');
                };

            }
            else {
                console.log('WebSocket NOT supported by your Browser!');
            }
        },
        sendMsg () {
            const article = { title: "Vue POST Request Example" };
            
            axios.post("http://localhost:3001/api/sendMsg", article)
                .then(response => response.data)
                .catch(error => {
                    this.errorMessage = error.message;
                    console.error("There was an error!", error);
                });
        }
    },
    created() {
        // this.webSocketInvoke()
    },
    mounted() {
        this.webSocketInvoke()
    }
});
</script>

<style scoped>
.chartPie,
.chartBar {
    height: 700px;
}
</style>
