<!-- 基金净值 -->
<template>
  <div>
    <div class="chart" ref="mainCharts"></div>
    <div style="margin-left:30px">
      <el-radio-group :size="pc?'':'mini'" v-model="sltTimeRange" @change="changeTimeRange">
        <el-radio-button label="y">月</el-radio-button>
        <el-radio-button label="3y">季</el-radio-button>
        <el-radio-button label="6y">半年</el-radio-button>
        <el-radio-button label="n">一年</el-radio-button>
        <el-radio-button label="3n">三年</el-radio-button>
        <el-radio-button label="5n">五年</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
} from "vue";
interface DataProps {}
import * as echarts from "echarts";
import { getFundDetailChart, getFundProfit } from "@/api/apiList";
export default defineComponent({
  name: "",
  props: ["chartType", "fundCode","pc"],
  data() {
    return {
      sltTimeRange: "y",
      chartTypeList: {
        DWJZ: {
          name: "单位净值",
        },
        LJJZ: {
          name: "累计净值",
        },
      },
      option: {},
    };
  },
  methods: {
    init(this: any) {
      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL);
      this.option = {
        tooltip: {
          trigger: "axis",
          formatter: (p: any) => {
            return `时间：${p[0].name}<br />${
              this.chartTypeList[this.chratType].name
            }：${p[0].value}`;
          },
        },
        grid: {
          top: 30,
          bottom: 30,
          left: 60,
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {},
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLabel: {
            color: this.defaultColor,
            formatter: (val: number) => {
              if (this.chartType == "LJSY") {
                return val.toFixed(1) + "%";
              } else {
                return val.toFixed(3);
              }
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
        series: [
          {
            type: "line",
            data: [],
          },
        ],
      };
      this.getData();
    },
    async getData(this: any) {
      if (this.chartType == "LJSY") {
        const res: any = await getFundDetailChart(
          this.fundCode,
          this.sltTimeRange
        );
        let dataList = res.Datas;
        if (dataList) {
          this.option.legend = {
            show: true,
          };
          this.option.tooltip.formatter = (p: any) => {
            let str =
              p.length > 1 ? `<br />${p[1].seriesName}：${p[1].value}%` : "";
            return `时间：${p[0].name}<br />${p[0].seriesName}：${p[0].value}%${str}`;
          };
          this.option.series = [
            {
              type: "line",
              name: "涨幅",
              data: dataList.map((item: any) => +item.YIELD),
            },
            {
              type: "line",
              name: res.Expansion.INDEXNAME,
              data: dataList.map((item: any) => +item.INDEXYIED),
            },
          ];
          this.option.xAxis.data = dataList.map((item: any) => item.PDATE);
          this.myChart.setOption(this.option);
        }
      } else {
        let res: any = await getFundProfit(this.fundCode, this.sltTimeRange);
        let dataList = res.Datas;
        this.option.series = [
          {
            type: "line",
            name: "单位净值",
            data: dataList.map((item: any) => +item.DWJZ),
          },
          {
            type: "line",
            name: "累计净值",
            data: dataList.map((item: any) => +item.LJJZ),
          },
        ];
        this.option.tooltip.formatter = (p: any) => {
          let str =
            p.length > 1 ? `<br />${p[1].seriesName}：${p[1].value}` : "";
          return `时间：${p[0].name}<br />${p[0].seriesName}：${
            p[0].value
          }${str}<br />日增长率：${dataList[p[0].dataIndex].JZZZL}%`;
        };
        this.option.legend = {
          show: true,
        };
        this.option.xAxis.data = dataList.map((item: any) => item.FSRQ);
        this.myChart.setOption(this.option);
      }
    },
    changeTimeRange(this: any, val: any) {
      this.getData();
    },
    defaultColor() {
      return "#ccc";
    },
  },
  mounted(this: any) {
    this.init();
  },
  beforeUnmount(this: any) {
    this.myChart.clear();
  },
});
</script>
<style scoped>
.chart {
  width: 96%;
  height: 400px;
}
</style>