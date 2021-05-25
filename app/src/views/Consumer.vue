<template>
    <button class="btn btn-primary" v-on:click="sendMsg()">Test button</button>
    <v-chart class="chartBar" :option="optionBar" />
    <!-- <v-chart class="chartPie" :option="optionPie" /> -->
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
                text: "Test",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c}"
            },
            xAxis: {
                type: 'category',
                data: [] // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'time'
            },
            series: [{
                data: [], // [120, 200, 150, 80, 70, 110, 130],
                type: 'line'
            }]
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
            
                ws.onopen = () => {
                    console.log('Connection created');
                };
                
                ws.onmessage = (evt) => {
                    const received_msg = evt.data;
                    // updateData(data, evt.data);
                    // chart.Line(data, {animation : false})
                    // console.log(received_msg);

                    const payload = JSON.parse(received_msg);
                    // console.log(payload);
                    console.log(payload['@timestamp'] + ' --- ' + payload['time']);
                    // this.optionBar.xAxis.data.push(payload['@timestamp']);
                    // this.optionBar.series[0].data.push(payload['time']);

                    this.optionBar.xAxis.data.push(payload['@timestamp']);
                    this.optionBar.series[0].data.push(payload['time']);
                };
                
                ws.onclose = () => {
                    console.log('Connection closed');
                };
            }
            else {
                console.log('WebSocket NOT supported by your Browser!');
            }



            // const payload = {"@timestamp":"2021-03-02T13:27:55.369Z","@metadata":{"beat":"filebeat","type":"doc","version":"6.2.4","topic":"log_stream"},"beat":{"hostname":"filebeat","version":"6.2.4","name":"filebeat"},"docker":{"container":{"id":"data"}},"offset":11836350559,"log":"\"@version\" =\u003e \"1\",","stream":"stdout","time":"2021-03-02T13:27:54.366674823Z","source":"/usr/share/filebeat/dockerlogs/data/146a7303f95c350172c8683d59a6d02a1f2aa24e916cbe793bea3d06da39d86a/146a7303f95c350172c8683d59a6d02a1f2aa24e916cbe793bea3d06da39d86a-json.log","prospector":{"type":"log"}}
            // // const payloadParsed = JSON.parse(payload);

            // const cn = 1;
            // setInterval(() => {
            //     this.optionBar.xAxis.data.push('Test' + cn);
            //     this.optionBar.series[0].data.push('Test' + cn);
            //     cn++;
            // }, 4000);
            // this.optionBar.xAxis.data.push('Test');
            // console.log(this.optionBar.xAxis.data);
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
    height: 400px;
}
</style>
