<!-- 指数详情 -->
<template>
  <div class="chart" ref="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import * as echarts from "echarts";
import { getIndexChart } from "@/api/apiList";
import { indexList } from "@/utils/constant";
import { time_arr } from "@/utils/utils";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
export default {
  name: "",
  data() {
    return {
      prePrice: 0,
    };
  },
  methods: {
    init(this: any, val: any) {
      this.code = val.f13 + "." + val.f12;
      this.codeData = val;

      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL);
      this.option = {
        title: {
          text: "上证指数",
          textStyle: {
            fontSize: 16,
            color: "#f56c6c",
          },
          x: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              show: true,
            },
          },
          formatter: (p: any) => {
            var color;
            if (
              p[0].dataIndex == 0 ||
              this.dataList[p[0].dataIndex][1] >
                this.dataList[p[0].dataIndex - 1][1]
            ) {
              color = '#f56c6c"';
            } else {
              color = '#4eb61b"';
            }
            return `时间：${p[0].name}<br />价格：${
              this.dataList[p[0].dataIndex][1]
            }<br />涨幅：${(
              ((this.dataList[p[0].dataIndex][1] - this.prePrice) * 100) /
              this.prePrice
            ).toFixed(
              2
            )}%<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color}"></span>成交量：${this.formatNum(
              this.dataList[p[0].dataIndex][2]
            )}`;
          },
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
        },
        grid: [
          {
            top: 40,
            left: 60,
            height: "50%",
          },
          {
            show: true,
            left: 60,
            top: "65%",
            height: "20%", //交易量图的高度
          },
        ],
        xAxis: [
          {
            data: this.timeData,
            position: "bottom",
            axisLine: {
              onZero: false,
            },
          },
          {
            //交易量图
            splitNumber: 2,
            type: "category",
            gridIndex: 1,
            boundaryGap: false,
            data: this.timeData,

            axisTick: {
              show: false,
            },
            splitLine: {
              //分割线设置
              show: true,
              lineStyle: {
                type: "dashed",
                color: this.defaultColor,
              },
            },
            axisLine: {
              lineStyle: {},
            },
            axisPointer: {
              show: true,
              label: {
                formatter: (p: any) => {
                  if (
                    p.seriesData[0] &&
                    this.dataList[p.seriesData[0].dataIndex]
                  ) {
                    var _p =
                      (
                        this.dataList[p.seriesData[0].dataIndex][2] / 10000
                      ).toFixed(3) + "万";
                    return _p;
                  }
                },
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: this.yAxisLabelColor,
              formatter: (val: any) => {
                return val.toFixed(2);
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
            axisPointer: {
              show: true,
              label: {
                formatter: function (params: any) {
                  return params.value.toFixed(2);
                },
              },
            },
          },
          {
            type: "value",
            axisLabel: {
              color: this.yAxisLabelColor,
              formatter: (val: number) => {
                let num = (
                  ((val - this.prePrice) * 100) /
                  this.prePrice
                ).toFixed(2);
                if ("" + num == "-0.0") {
                  num = "0.00";
                }
                return num + "%";
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: this.defaultColor,
              },
            },
            axisPointer: {
              show: true,
              label: {
                formatter: (p: any) => {
                  return (
                    (((p.value - this.prePrice) * 100) / this.prePrice).toFixed(
                      2
                    ) + "%"
                  );
                },
              },
            },
            data: [],
          },
          {
            //交易图
            // name: '万',
            nameGap: "0",
            nameTextStyle: {},
            gridIndex: 1,
            z: 4,
            splitNumber: 3,
            axisLine: {
              onZero: false,
              show: false,
            },
            axisTick: {
              show: false,
            },

            splitLine: {
              //分割线设置
              show: false,
            },
            axisPointer: {
              show: true,
              label: {
                formatter: function (params: any) {
                  var _p = (params.value / 10000).toFixed(2) + "万";
                  return _p;
                },
              },
            },
            axisLabel: {
              //label文字设置
              //   color: labelColor,
              inside: false, //label文字朝内对齐
              fontSize: 10,
              onZero: false,
              formatter: function (params: any) {
                //计算右边Y轴对应的当前价的涨幅比例
                var _p = (params / 10000).toFixed(2);
                if (params == 0) {
                  _p = "(万)";
                }
                return _p;
              },
            },
          },
        ],
        series: [
          {
            name: "涨幅",
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
            name: "价格",
            type: "line",
            yAxisIndex: 1,
            symbol: "none",
            data: [],
            lineStyle: {
              normal: {
                width: 0,
              },
            },
          },
          {
            name: "成交量",
            type: "bar",
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 2,
            data: [],
            itemStyle: {
              normal: {
                color: this.CJcolor,
              },
            },
          },
        ],
      };
      bus.$on(TIMER.SECCB30, this.getData);
    },
    async getData(this: any) {
      const res: any = await getIndexChart(indexList[0].value);
      this.prePrice = res.data.prePrice;
      let dataList = res.data.trends.map((itme: any) => itme.split(","));
      this.dataList = dataList;
      this.option.series[0].data = dataList.map((item: any) => +item[1]);
      this.option.series[1].data = dataList.map((item: any) => +item[1]);
      this.option.series[2].data = dataList.map((item: any) => +item[2]);

      let firstDate = dataList[0][0].substr(11, 5);
      this.isHK = false;

      if (this.codeData.f13 == 1 || this.codeData.f13 == 0) {
        this.timeData = time_arr("hs");
        this.option.xAxis[0].axisLabel = {
          formatter: this.fmtAxis,
          interval: this.fmtVal,
        };
        this.option.xAxis[1].axisLabel = {
          formatter: this.fmtAxis,
          interval: this.fmtVal,
        };
      } else {
        switch (firstDate) {
          case "09:30":
            this.timeData = this.time_arr("hk");
            this.isHK = true;
            this.option.xAxis[0].axisLabel = {
              formatter: this.fmtAxis,
              interval: this.fmtVal,
            };
            this.option.xAxis[1].axisLabel = {
              formatter: this.fmtAxis,
              interval: this.fmtVal,
            };
            break;
          case "21:30":
            this.timeData = this.time_arr("us-s");
            break;
          case "22:30":
            this.timeData = this.time_arr("us-w");
            break;

          default:
            break;
        }
      }
      this.option.xAxis[0].data = this.timeData;
      this.option.xAxis[1].data = this.timeData;

      this.option.series[0].markLine.data[0].yAxis = this.prePrice;

      let aa = this.handle_num(this.option.series[0].data);

      let minVal = this.prePrice - this.prePrice * aa;
      let maxVal = this.prePrice + this.prePrice * aa;
      this.option.yAxis[0].min = minVal;
      this.option.yAxis[0].max = maxVal;
      this.option.yAxis[0].interval = Math.abs((this.prePrice - minVal) / 4);
      this.option.yAxis[1].min = minVal;
      this.option.yAxis[1].max = maxVal;
      this.option.yAxis[1].interval = Math.abs((this.prePrice - minVal) / 4);
      this.myChart.setOption(this.option);
    },
    defaultColor() {
      return "#ccc";
    },
    defaultLabelColor() {
      return "#000";
    },
    yAxisLabelColor(this: any, val: string, ind: number) {
      return Number(val).toFixed(2) > this.prePrice.toFixed(2)
        ? "#f56c6c"
        : Number(val).toFixed(2) == this.prePrice.toFixed(2)
        ? this.defaultLabelColor
        : "#4eb61b";
    },
    handle_num(this: any, data: number[]) {
      var _aa = Math.abs(
        (Math.max.apply(null, data) - this.prePrice) / this.prePrice
      );
      var _bb = Math.abs(
        (Math.min.apply(null, data) - this.prePrice) / this.prePrice
      );
      return _aa > _bb ? _aa : _bb;
    },
    fmtAxis(this: any, val: string, ind: number) {
      if (this.isHK) {
        if (val == "12:00") {
          return "12:00/13:00";
        } else {
          return val;
        }
      } else {
        if (val == "11:30") {
          return "11:30/13:00";
        } else {
          return val;
        }
      }
    },
    fmtVal(this: any, ind: number, val: string) {
      var arr;
      if (this.isHK) {
        arr = ["09:30", "12:00", "16:00"];
      } else {
        arr = ["09:30", "10:30", "11:30", "14:00", "15:00"];
      }

      if (arr.indexOf(val) != -1) {
        return true;
      } else {
        return false;
      }
    },
    formatNum(val: number) {
      return (val / 10000).toFixed(3) + "万";
    },
    CJcolor(this: any, val: any, ind: number) {
      let colorList;
      if (
        val.dataIndex == 0 ||
        this.dataList[val.dataIndex][1] > this.dataList[val.dataIndex - 1][1]
      ) {
        colorList = "#f56c6c";
      } else {
        colorList = "#4eb61b";
      }
      return colorList;
    },
  },
  mounted(this: any) {
    this.init({
      f2: 3473.07,
      f3: 1.72,
      f4: 58.62,
      f12: "000001",
      f13: 1,
      f14: "上证指数",
    });
  },
};
</script>
<style scoped>
.chart {
  width: 680px;
  height: 490px;
  margin-top: 20px;
}
</style>