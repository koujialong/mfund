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
      <el-radio-button label="rt">实时涨跌幅</el-radio-button>
      <el-radio-button label="week">近一周涨跌幅</el-radio-button>
      <el-radio-button label="month">近一月涨跌幅</el-radio-button>
      <el-radio-button label="year">近一年涨跌幅</el-radio-button>
      <el-radio-button label="pe">市盈率</el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart" ref="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import { getCloudClass, getCloudData } from "@/api/apiList";
import * as echarts from "echarts";
import { log } from "echarts/lib/util/log";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
var plate: any;
export default {
  name: "",
  data() {
    return {
      tabMode: "rt",
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
            return `名称(涨跌幅)：${info.name}`;
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
            upperLabel: {
              show: true,
            },
            levels: [
              {
                itemStyle: {
                  borderColor: "#202930",
                  borderWidth: 0,
                  gapWidth: 1,
                },
                upperLabel: {
                  show: false,
                },
              },
              {
                upperLabel: {
                  show: true,
                },
                itemStyle: {
                  borderColor: "#202930",
                  borderWidth: 1,
                  gapWidth: 1,
                },
                // emphasis: {
                //   itemStyle: {
                //     borderColor: "#202930",
                //   },
                // },
              },
              {
                upperLabel: true,
                colorSaturation: [0.8, 1],
                itemStyle: {
                  borderWidth: 1,
                  gapWidth: 1,
                  borderColor: "#202930",
                  borderColorSaturation: 0.6,
                },
              },
            ],
            data: [],
          },
        ],
      };
      this.getData(true);
      setTimeout(() => {
        // bus.$on(TIMER.SECCB30, this.getData);
      }, 2000);
    },

    changeMode(this: any, val: any) {
      plate = null;
      this.getData(true);
    },

    async getData(this: any, forceGet: boolean = false) {
      if (forceGet || this.tabMode === "rt") {
        plate || (plate = await getCloudClass());
        let nums: any = await getCloudData(this.tabMode);
        this.maxScale = plate.scale;
        let root = this.getChildItem(plate, nums);
        this.option.series[0].data = root.children;
        console.log(root.children);

        this.myChart.setOption(this.option);
      }
    },

    getChildItem(this: any, root: any, nums: any) {
      root.value = root.scale;
      if (root.children && root.children.length > 0) {
        root.children.forEach((item: any) => {
          this.getChildItem(item, nums);
        });
      } else {
        root.zdf = nums.data[root.name];
        let alphe = Math.abs(root.zdf) * 0.4 + 0.6;
        let fontSize = (root.scale / this.maxScale) * 800;
        fontSize = fontSize > 8 ? fontSize : 8;
        root.value = root.scale;
        root.itemStyle = {
          color:
            root.zdf >= 0
              ? `rgba(255, 65, 24, ${alphe})`
              : `rgba(0,100,0, ${alphe})`,
        };
        if (this.tabMode === "pe") {
          root.name = `${root.name}\n(PE: ${Number(root.zdf).toFixed(2)})`;
        } else {
          root.name = `${root.name}\n(${root.zdf >= 0 ? "+" : ""}${Number(
            root.zdf
          ).toFixed(2)}%)`;
        }
        root.label = {
          fontSize,
        };
      }
      return root;
    },
  },
  beforeUnmount(this: any) {
    this.myChart.clear();
    plate = null;
  },
};
</script>
<style scoped>
.chart {
  width: 100%;
  height: 800px;
}
</style>
