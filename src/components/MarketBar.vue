<!-- 市场行情 -->
<template>
  <div class="chart-content" :style="`width:${pc?33:96}%`" ref="marketChart"></div>
</template>

<script lang='ts'>
import { getCurrentInstance, reactive, toRefs } from "vue";
import { getMarketBar } from "@/api/apiList";
import * as echart from "echarts";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
interface barItem {
  f14: string; //名称
  f62: number; //流入流出金额
}
export default {
  name: "marketBar",
  data() {
    return {};
  },
  props:[
    'pc'
  ],
  methods: {
    init(this: any) {
      this.chartEl = this.$refs.marketChart;
      this.myChart = echart.init(this.chartEl);
      this.option = {
        tooltip: {
          trigger: "axis",
          formatter: (p: any) => {
            return `${p[0].name}<br />${(p[0].value / 100000000).toFixed(
              2
            )}亿元`;
          },
        },
        title: {
          text: "行业板块资金流向",
          textStyle: {
            fontSize: 16,
            color: "#f56c6c",
          },
          x: "center",
        },
        grid: {
          top: 70,
          bottom: 100,
          right: 40,
          left: 60,
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            zoomLock: true,
            xAxisIndex: [0],
            start: 0,
            end: this.pc?25:20,
          },
        ],
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            fontSize: 10,
            formatter: (val: any) => {
              return val.split("").join("\n");
            },
          },
        },
        yAxis: {
          type: "value",
          name: "单位：亿元",
          data: [],
          axisLabel: {
            formatter: (val: any) => {
              return (val / 100000000).toFixed(2);
            },
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        data: [],
      };
      this.getChartData();
      setTimeout(() => {
        bus.$on(TIMER.SECCB30, this.getChartData);
      }, 2000);
    },

    async getChartData(this: any) {
      let that = this;
      const res: any = await getMarketBar();
      let dataList: barItem[] = res.data.diff;
      let xdata: any[] = [];
      let sdata: any[] = [];
      if (dataList) {
        dataList.forEach((item: barItem) => {
          xdata.push(item.f14);
          sdata.push(item.f62);
        });
        this.option.xAxis.data = xdata;
        this.option.series = [
          {
            type: "bar",
            data: sdata,
            itemStyle: {
              normal: {
                color: function (data: any) {
                  return data.value > 0 ? "#f56c6c" : "#4eb61b";
                },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 10,
                  },
                  formatter: (params: any) => {
                    return (params.value / 100000000).toFixed(2);
                  },
                },
              },
            },
          },
        ];
        this.myChart.setOption(this.option);
      }
    },
  },
  mounted(this: any) {
    this.init();
  },
  beforeUnmount(this: any) {
    this.myChart.clear();
  },
};
</script>
<style scoped>
.chart-content {
  width: 33%;
  height: 410px;
  margin-top: 20px;
}
</style> 