<!-- 云图 -->
<template>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: left;
      align-items: center;
      margin-left: 24px;
    "
  >
    <text style="margin-right: 24px; font-size: 34px; color: #f56c6c"
      >大盘板块云图</text
    >
    <el-radio-group fill="#f56c6c" v-model="tabMode" @change="changeMode">
      <el-radio-button label="cmv">总额</el-radio-button>
      <el-radio-button label="advanceDeclineRatio">涨跌幅</el-radio-button>
      <el-radio-button label="netInflow">资金流向</el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart" ref="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import { getCloudData } from "@/api/apiList";
import * as echarts from "echarts";
import { log } from "echarts/lib/util/log";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";

export default {
  name: "",
  data() {
    return {
      tabMode: "cmv",
    };
  },
  mounted(this: any) {
    this.init();
  },
  methods: {
    init(this: any) {
      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL);
      this.option = {
        tooltip: {
          formatter: function (info: any) {
            return `行业：${info.name}<br />总额：${(
              info.value / 100000000
            ).toFixed(2)}亿元<br />${
              info.data.netInflow >= 0 ? "流入" : "流出"
            }：${(info.data.netInflow / 100000000).toFixed(2)}亿元`;
          },
        },
        series: [
          {
            name: "板块云图",
            type: "treemap",
            colorSaturation: [0.35, 1],
            visibleMin: 90,
            width: "98%",
            height: "94%",
            itemStyle: {
              gapWidth: 1,
            },
            roam: false,
            breadcrumb: {
              show: true,
            },
            data: [],
          },
        ],
      };
      this.getData();
      setTimeout(() => {
        bus.$on(TIMER.SECCB30, this.getData);
      }, 2000);
    },
    getData(this: any) {
      getCloudData().then((res: any) => {
        res = JSON.parse(res.split("(")[1].split(")")[0].split(";")[0].trim());
        if (res.data.items) {
          let mainKey = this.tabMode;
          let maxValue = 0;
          let maxAdvanceDeclineRatio = 0;
          res.data.items.forEach((item: any) => {
            maxValue < item[mainKey] && (maxValue = item[mainKey]);
            maxAdvanceDeclineRatio < item.advanceDeclineRatio &&
              (maxAdvanceDeclineRatio = item.advanceDeclineRatio);
          });
          let mapData = res.data.items.map((item: any) => {
            item.advanceDeclineRatio < 0 && console.log(item.platName);
            let mainValue = item[mainKey];
            let fontSize = (mainValue / maxValue) * 40;
            fontSize = fontSize < 8 ? 10 : fontSize;
            let colorSaturation = Math.abs(item.mainValue) / 10;
            let alphe =
              Math.abs(item.advanceDeclineRatio / maxAdvanceDeclineRatio) *
                0.3 +
              0.7;
            console.log(colorSaturation);
            return {
              value: mainValue,
              name: `${item.platName}(${
                item.advanceDeclineRatio >= 0 ? "+" : ""
              }${item.advanceDeclineRatio}%)`,
              netInflow: item.netInflow,
              itemStyle: {
                color:
                  item.advanceDeclineRatio >= 0
                    ? `rgba(255, 65, 24, ${alphe})`
                    : `rgba(0,100,0, ${alphe})`,
                colorAlpha: fontSize % 2 == 1 ? 9 : 0,
              },
              label: {
                fontSize,
              },
              colorAlpha: mainValue / maxValue,
            };
          });
          this.option.series[0].data = mapData;
          this.myChart.setOption(this.option);
        }
      });
    },

    changeMode(this: any, val: any) {
      this.getData();
    },
  },
  beforeUnmount(this: any) {
    this.myChart.clear();
  },
};
</script>
<style scoped>
.chart {
  width: 100%;
  height: 800px;
}
</style>
