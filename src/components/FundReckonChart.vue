<!-- 基金估算净值图 -->
<template>
  <div class="chart" ref="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs, defineComponent } from "vue";
import * as echarts from "echarts";
import { time_arr } from "@/utils/utils";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
import { getFundReckonChart } from "@/api/apiList";
export default defineComponent({
  name: "",
  props: {
    fundCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timeData: time_arr("hs"),
    };
  },
  mounted(this: any) {
    this.init();
  },
  beforeUnmount(this: any) {
    this.myChart.clear();
  },
  methods: {
    init(this: any) {
      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL);
      this.option = {
        title: {
          text: "",
          textStyle: {
            fontSize: 16,
            color: "#f56c6c",
          },
          x: "center",
        },
        tooltip: {
          trigger: "axis",
          formatter: (p: any) => {
            return `时间：${p[0].name}<br />估值涨跌幅：${
              p[0].value
            }%<br />估值净算${(this.DWJZ * (1 + 0.01 * p[0].value)).toFixed(
              4
            )}元`;
          },
        },
        grid: {
          top: 40,
          bottom: 30,
        },
        xAxis: {
          type: "category",
          data: this.timeData,
          position: "bottom",
          axisLabel: {
            formatter: this.fmtAxis,
            interval: this.fmtVal,
          },
          axisLine: {
            onZero: true,
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: this.yAxisLabelColor,
              formatter: (val: any) => {
                return val.toFixed(2) + "%";
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: this.defaultColor,
              },
            },
            data: [],
          },
          {
            type: "value",
            axisLabel: {
              color: this.yAxisLabelColor,
              formatter: (val: any) => {
                return (this.DWJZ * (1 + 0.01 * val)).toFixed(4);
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: this.defaultColor,
              },
            },
            data: [],
          },
        ],
        series: [
          {
            name: "估算涨跌幅",
            type: "line",
            data: [],
            markLine: {
              silent: true,
              symbol: "none",
              animation: false,
              label: {
                show: false,
              },
              lineStyle: {
                type: "solid",
              },
              data: [
                {
                  yAxis: 0,
                },
              ],
            },
          },
          {
            name: "估算净值",
            type: "line",
            symbol: "none",
            data: [],
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                width: 0,
              },
            },
          },
        ],
      };
      this.getData();
      bus.$on(TIMER.SECCB30, () => {
        this.getData();
      });
    },

    async getData(this: any) {
      const res: any = await getFundReckonChart(this.fundCode);
      let dataList = res.Datas.map((item: any) => item.split(","));
      let fund = res.Expansion;
      this.option.title.text = `${fund.SHORTNAME}(${fund.GZ},${
        fund.GSZZL >= 0 ? "+" + fund.GSZZL : fund.GSZZL
      })`;
      this.option.title.textStyle.color =
        fund.GSZZL >= 0 ? "#f56c6c" : "#4eb61b";
      this.option.series[0].data = dataList.map((item: any) =>
        (+item[2]).toFixed(2)
      );
      this.option.series[1].data = dataList.map((item: any) =>
        (+item[2]).toFixed(2)
      );
      let lineVal = this.handle_num(this.option.series[0].data);
      this.DWJZ = fund.DWJZ;
      this.option.yAxis[0].min = -lineVal;
      this.option.yAxis[0].max = lineVal;
      this.option.yAxis[0].interval = lineVal / 4;
      this.option.yAxis[1].min = -lineVal;
      this.option.yAxis[1].max = lineVal;
      this.option.yAxis[1].interval = lineVal / 4;

      this.myChart.setOption(this.option);
    },

    handle_num(data: any) {
      var _aa = Math.abs(Math.max.apply(null, data)).toFixed(2);
      var _bb = Math.abs(Math.min.apply(null, data)).toFixed(2);
      return _aa > _bb ? _aa : _bb;
    },

    fmtAxis(val: string, ind: number) {
      if (val == "13:00") {
        return "11:30/13:00";
      } else {
        return val;
      }
    },

    fmtVal(ind: number, val: string) {
      let arr = ["09:30", "10:30", "13:00", "14:00", "15:00"];
      if (arr.indexOf(val) != -1) {
        return true;
      } else {
        return false;
      }
    },

    yAxisLabelColor(val: number, ind: number) {
      return val > 0 ? "#f56c6c" : "#4eb61b";
    },
    defaultColor() {
      return "#ccc";
    },
  },
});
</script>
<style scoped>
.chart {
  width: 600px;
  height: 400px;
}
</style>