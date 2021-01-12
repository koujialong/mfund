<!-- 云图 -->
<template>
    <div style="width: 100%;display: flex;justify-content: left;align-items:center;margin-left: 24px">
        <text style="margin-right: 24px;font-size: 20px;color: #f56c6c">板块分布类型</text>
        <el-radio-group v-model="tabMode" @change="changeMode">
            <el-radio-button label="cmv">总额</el-radio-button>
            <el-radio-button label="advanceDeclineRatio">涨跌幅</el-radio-button>
            <el-radio-button label="netInflow">资金流向</el-radio-button>
        </el-radio-group>
    </div>
    <div class="chart" ref="mainCharts"></div>

</template>

<script lang='ts'>
    import {reactive, toRefs} from "vue";
    import {getCloudData} from "@/api/apiList";
    import * as echarts from "echarts";
    import {log} from "echarts/lib/util/log";

    // const formatUtil = echarts.format;
    export default {
        name: "",
        data(){
          return {
              tabMode:'cmv'
          }
        },
        mounted(this: any) {
            this.init();
        },
        methods: {
            init(this: any) {
                this.chartEL = this.$refs.mainCharts;
                this.myChart = echarts.init(this.chartEL);
                this.option = {
                    title: {
                        text: "大盘板块云图",
                        textStyle: {
                            fontSize: 32,
                            color: "#f56c6c",
                        },
                        x: "center",

                    },
                    tooltip: {
                        formatter: function (info:any) {
                            return `行业：${info.name}<br />总额：${(info.value / 100000000).toFixed(
                                2
                            )}亿元<br />${info.data.netInflow>=0?'流入':'流出'}：${(info.data.netInflow / 100000000).toFixed(
                                2
                            )}亿元`;
                        }
                    },
                    series: [
                        {
                            name: 'Disk Usage',
                            type: 'treemap',
                            visibleMin:90,
                            // visibleMin: 300,
                            width:'98%',
                            height:'80%',
                            itemStyle: {
                                gapWidth:1
                            },
                            roam: false,
                            nodeClick: false,
                            breadcrumb: {
                                show: false
                            },
                            data: []
                        }
                    ]
                }
                this.getData()
            },
            getData(this: any) {
                getCloudData().then((res: any) => {
                    res = JSON.parse(res.split("(")[1].split(")")[0].split(";")[0].trim())
                    if (res.data.items) {
                        let mainKey=this.tabMode;
                        let maxValue=res.data.items.reduce((item1:any, item2:any) => {
                            return item1[mainKey]> item2[mainKey] ? item1 : item2
                        })[mainKey]
                        let mapData = res.data.items.map((item: any) => {
                            item.advanceDeclineRatio<0&&console.log(item.platName)
                            let mainValue=item[mainKey]
                            let fontSize=mainValue/maxValue*40
                            fontSize=fontSize<8?10:fontSize
                            let colorSaturation=Math.abs(item.mainValue)/10
                            console.log(colorSaturation)
                            return {
                                value: mainValue,
                                name: `${item.platName}(${item.advanceDeclineRatio>=0?"+":""}${item.advanceDeclineRatio}%)`,
                                netInflow:item.netInflow,
                                itemStyle: {
                                    color: item.advanceDeclineRatio>=0?'#f56c6c':'green',
                                    // colorSaturation,
                                    // colorAlpha:0.01
                                },
                                label:{
                                    fontSize
                                }
                            }
                        })
                        this.option.series[0].data = mapData;
                        this.myChart.setOption(this.option)
                    }
                });
            },

            changeMode(this: any, val: any){
                this.getData()
            }

        },
    };
</script>
<style scoped>
    .chart {
        width: 100%;
        height: 800px;
    }
</style>
