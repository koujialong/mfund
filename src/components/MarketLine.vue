<!-- 市场行情 -->
<template>
  <div class="chart-content" ref="marketChart"></div>
</template>

<script lang='ts'>
import { getCurrentInstance, reactive, toRefs } from "vue";
import { getMarketLine } from "@/api/apiList";
import { timeData } from "@/utils/constant";
import * as echart from "echarts";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
interface barItem {
  f14: string; //名称
  f62: number; //流入流出金额
}
export default {
  name: "marketChart",
  data() {
    return {
      timeData,
    };
  },
  methods: {
    init(this: any) {
      this.chartEl = this.$refs.marketChart;
      this.myChart = echart.init(this.chartEl);
      this.option = {
        tooltip: {
          trigger: "axis",
          // formatter: (p: any) => {
          //   return `${p[0].name}<br />${(p[0].value / 100000000).toFixed(
          //     2
          //   )}亿元`;
          // },
        },
        title: {
          text: "大盘沪申资金流向",
          textStyle: {
            fontSize: 16,
            color: "#f56c6c",
          },
          x: "center",
        },
        grid: {
          top: 80,
          bottom: 30,
          right: 40,
          left: 60,
        },
        xAxis: {
          type: "category",
          data: this.timeData,
          axisLabel: {
            formatter: this.fmtAxis,
            interval: this.fmtVal,
          },
          axisLine: {
            onZero: false,
          },
        },
        yAxis: {
          type: "value",
          name: "单位：亿元",
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        legend: {
          top: 30,
          show: true,
          data: [
            "主力净流入",
            "超大单净流入",
            "大单净流入",
            "中单净流入",
            "小单净流入",
          ],
        },
        data: [],
      };
      bus.$on(TIMER.SECCB30, this.getChartData);
    },

    async getChartData(this: any) {
      let that = this;
      const res: any = await getMarketLine();
      let dataList: barItem[] = res.data.klines;
      let xdata: any[] = [];
      let sdata: any[] = [];
      let data1 = [0];
      let data2 = [0];
      let data3 = [0];
      let data4 = [0];
      let data5 = [0];
      if (dataList) {
        dataList.forEach((item: any) => {
          let arr = item.split(",");
          data1.push(+(arr[1] / 100000000).toFixed(4));
          data2.push(+(arr[2] / 100000000).toFixed(4));
          data3.push(+(arr[3] / 100000000).toFixed(4));
          data4.push(+(arr[4] / 100000000).toFixed(4));
          data5.push(+(arr[5] / 100000000).toFixed(4));
        });
        this.option.series = [
          {
            type: "line",
            name: "主力净流入",
            data: data1,
          },
          {
            type: "line",
            name: "超大单净流入",
            data: data5,
          },
          {
            type: "line",
            name: "大单净流入",
            data: data4,
          },
          {
            type: "line",
            name: "中单净流入",
            data: data3,
          },
          {
            type: "line",
            name: "小单净流入",
            data: data2,
          },
        ];
        this.myChart.setOption(this.option);
      }
    },
    fmtAxis(val: any, ind: number) {
      if (val == "11:30") {
        return "11:30/13:00";
      } else {
        return val;
      }
    },
    fmtVal(ind: number, val: any) {
      let arr = ["09:30", "10:30", "11:30", "14:00", "15:00"];
      if (arr.indexOf(val) != -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted(this: any) {
    this.init();
  },
  beforeDestroy(this: any) {
    this.myChart.clear();
  },
};
</script>
<style scoped>
.chart-content {
  width: 600px;
  height: 440px;
  margin-top: 20px;
}
</style> 