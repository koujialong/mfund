<!-- 云图 -->
<template>
  <div
    style="
      width: 70%;
      display: flex;
      justify-content: left;
      align-items: center;
      margin-left: 24px;
      margin-bottom: 12px;
      margin-right: 0;
    "
  >
    <text style="margin-right: 24px; font-size: 34px; color: #f56c6c"
      >板块云图</text
    >
    <el-radio-group fill="#f56c6c" v-model="tabMode" @change="changeMode">
      <el-radio-button label="rt">实时涨跌幅</el-radio-button>
      <el-radio-button label="week">近一周涨跌幅</el-radio-button>
      <el-radio-button label="month">近一月涨跌幅</el-radio-button>
      <el-radio-button label="year">近一年涨跌幅</el-radio-button>
      <el-radio-button label="pe">市盈率</el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart" ref="mainCharts" id="mainCharts"></div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import { getCloudClass, getCloudData } from "@/api/apiList";
import * as echarts from "echarts";
import { log } from "echarts/lib/util/log";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
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
      let el: any = document.getElementById("mainCharts");
      this.myChart = echarts.init(el);
      this.option = {
        tooltip: {
          formatter: function (info: any) {
            return `${info.name}`;
          },
        },
        series: [
          {
            name: "板块云图",
            type: "treemap",
            visibleMin: 90,
            width: "98%",
            height: "96%",
            itemStyle: {
              gapWidth: 1,
            },
            roam: "move",
            breadcrumb: {
              show: true,
              top: "top",
              height: 30,
            },
            upperLabel: {
              show: true,
            },
            zoomToNodeRatio: 0.16 * 0.16,
            levels: [
              {
                itemStyle: {
                  borderWidth: 20,
                  padding: 24,
                  gapWidth: 0,
                },
                upperLabel: {
                  show: false,
                },
              },
              {
                upperLabel: {
                  show: true,
                  color: "#fff",
                  fontSize: 12,
                  offset: [4, 2],
                  height: 20,
                },
                itemStyle: {
                  borderColor: "#202930",
                  borderWidth: 1,
                  gapWidth: 1,
                },
              },
              {
                upperLabel: {
                  show: true,
                  color: "#fff",
                  offset: [4, 0],
                  fontSize: 10,
                  height: 18,
                },
                itemStyle: {
                  borderWidth: 1,
                  gapWidth: 1,
                },
              },
            ],
            data: [],
          },
        ],
      };
      this.myChart.on("mapselectchanged", (params: any) => {
        console.log(params);
        this.location = params;
      });

      this.getData(true);
      setTimeout(() => {
        bus.$on(TIMER.SECCB30, this.getData);
      }, 2000);
    },

    changeMode(this: any, val: any) {
      this.option = null;
      this.init();
    },

    async getData(this: any, forceGet: boolean = false) {
      if (forceGet || this.tabMode === "rt") {
        let plate: any = await getCloudClass();
        let nums: any = await getCloudData(this.tabMode);
        this.maxScale = plate.scale;
        let root = this.getChildItem(null, plate, nums, 0);
        this.option.series[0].data = root.children;
        this.myChart.clear();
        this.myChart.setOption(this.option);
      }
    },

    getChildItem(this: any, pre: any, root: any, nums: any, index: number) {
      root.value = root.scale;
      if (root.children && root.children.length > 0) {
        root.children.forEach((item: any, index: any) => {
          this.getChildItem(root, item, nums, index);
        });
      } else {
        root.zdf = nums.data[root.name];
        let alphe = Math.abs(root.zdf) * 0.4 + 0.6;
        let color =
          root.zdf >= 0
            ? `rgba(255, 65, 24, ${alphe})`
            : `rgba(0,100,0, ${alphe})`;
        if (index === 0 && pre) {
          pre.itemStyle = {
            borderColor: color,
          };
        }
        let fontSize = (root.scale / this.maxScale) * 800;
        fontSize = fontSize > 10 ? fontSize : 10;
        root.value = root.scale;
        root.itemStyle = {
          color,
        };
        if (this.tabMode === "pe") {
          root.name = `${root.name}\n${Number(root.zdf).toFixed(2)}`;
        } else {
          root.name = `${root.name}\n${root.zdf >= 0 ? "+" : ""}${Number(
            root.zdf
          ).toFixed(2)}%`;
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
  },
};
</script>
<style scoped>
.chart {
  width: 100%;
  height: 800px;
}
</style>
