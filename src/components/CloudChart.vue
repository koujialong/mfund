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
import { getCloudData, getCloudData2 } from "@/api/apiList";
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
      getCloudData2().then((res:any)=>{
        console.log('数据2',res);
        
      })
      getCloudData().then((res: any) => {
        if (res.data.items) {
          let mainKey = this.tabMode;
          let maxValue = 0;
          let maxAdvanceDeclineRatio = 0;
          let max:any={
            advanceDeclineRatio:0
          };
          res.data.items.forEach((item: any) => {
            maxValue < item[mainKey] && (maxValue = item[mainKey]);
            let advanceDeclineRatio=Math.abs(item.advanceDeclineRatio)
            // maxAdvanceDeclineRatio < advanceDeclineRatio &&
            //   (maxAdvanceDeclineRatio = advanceDeclineRatio);
            //  max.advanceDeclineRatio < item.advanceDeclineRatio &&
            //   (max = item);
              if(maxAdvanceDeclineRatio < advanceDeclineRatio){
                maxAdvanceDeclineRatio = advanceDeclineRatio
                max = item
              }
          });
          let mapData = res.data.items.map((item: any) => {
            let mainValue = item[mainKey];
            let fontSize = (mainValue / maxValue) * 40;
            fontSize = fontSize < 8 ? 10 : fontSize;
            // console.log(item.advanceDeclineRatio,maxAdvanceDeclineRatio,res.data.items);
            
            let alphe =
              Math.abs(item.advanceDeclineRatio / maxAdvanceDeclineRatio) *
                0.3 +
              0.7;
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
                    : `rgba(0,100,0, ${alphe})`
              },
              label: {
                fontSize,
              },
              colorAlpha: mainValue / maxValue,
            };
          });
          this.option.series[0].data = mapData;
          console.log(maxAdvanceDeclineRatio,max,mapData,res.data.items,);
          
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
