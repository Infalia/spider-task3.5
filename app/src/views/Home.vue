<template>
    <v-chart class="chartBar" :option="optionBar" />
    <!-- <v-chart class="chartPie" :option="optionPie" /> -->
</template>

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
                text: "Kafka Consumer",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c}"
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'time'
            },
            series: [{
                data: [],
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
        }
    },
    created() {
        this.webSocketInvoke()
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