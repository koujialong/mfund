<!-- 市场行情 -->
<template>
  <div class="chart-content" ref="marketChart"></div>
</template>

<script lang='ts'>
import { getCurrentInstance, reactive, toRefs } from "vue";
import { getMarketChart } from "@/api/apiList";
import * as echart from "echarts";
interface barItem {
  f14: string; //名称
  f62: number; //流入流出金额
}
export default {
  name: "marketChart",
  data() {
    return {};
  },
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
        grid: {
          top: 30,
          bottom: 100,
          right: 40,
          left: 60,
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 50,
          },
          {
            type: "inside",
            realtime: true,
            start: 0,
            end: 50,
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
    },

    async getChartData(this: any) {
      let that = this;
      const res: any = await getMarketChart();
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
};
</script>
<style scoped>
.chart-content {
  width: 600px;
  height: 400px;
}
</style>