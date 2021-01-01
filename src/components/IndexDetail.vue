<!-- 指数详情 -->
<template>
  <div class="chart" ref="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import * as echarts from "echarts";
import { getIndexChart } from "@/api/apiList";
import { indexList } from "@/utils/constant";
export default {
  name: "",
  data() {
    return {
      prePrice: 0,
    };
  },
  methods: {
    init(this: any) {
      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL);
      this.option = {
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
              ((this.dataList[p[0].dataIndex][1] - this.DWJZ) * 100) /
              this.DWJZ
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
            top: 20,
            left: 60,
            height: "50%",
          },
          {
            show: true,
            left: 60,
            top: "65%",
            height: "28%", //交易量图的高度
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
      this.getData();
    },
    async getData(this: any) {
      const res: any = await getIndexChart(indexList[0].value);
      this.prePrice = res.data.prePrice;
    },
  },
  mounted(this: any) {
    this.init();
  },
};
</script>
<style scoped>
.chart {
  width: 560px;
  height: 500px;
}
</style>