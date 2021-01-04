<template>
  <div class="box">
    <div v-if="infoData.FCODE" class="content-box">
      <div class="hisrank-row content-box-div">
        <div class="hisrank-row-div">
          <div>近1月(排名)</div>
          <p :class="infoData.SYL_Y > 0 ? 'up' : 'down'">
            {{ infoData.SYL_Y }}%（{{ infoData.RANKM }}）
          </p>
        </div>
        <div class="hisrank-row-div">
          <div>近3月(排名)</div>
          <p :class="infoData.SYL_3Y > 0 ? 'up' : 'down'">
            {{ infoData.SYL_3Y }}%（{{ infoData.RANKQ }}）
          </p>
        </div>
        <div class="hisrank-row-div">
          <div>近6月(排名)</div>
          <p :class="infoData.SYL_6Y > 0 ? 'up' : 'down'">
            {{ infoData.SYL_6Y }}%（{{ infoData.RANKHY }}）
          </p>
        </div>
        <div class="hisrank-row-div">
          <div>近1年(排名)</div>
          <p :class="infoData.SYL_1N > 0 ? 'up' : 'down'">
            {{ infoData.SYL_1N }}%（{{ infoData.RANKY }}）
          </p>
        </div>
      </div>
      <div class="content-box-div">
        单位净值：{{ infoData.DWJZ }}（{{ infoData.FSRQ }}）
      </div>
      <div class="content-box-div">累计净值：{{ infoData.LJJZ }}</div>
      <div class="content-box-div">基金类型：{{ infoData.FTYPE }}</div>
      <div class="content-box-div">基金公司：{{ infoData.JJGS }}</div>
      <div class="content-box-div">基金经理：{{ infoData.JJJL }}</div>
      <div class="content-box-div">
        交易状态：{{ infoData.SGZT }} {{ infoData.SHZT }}
      </div>
      <div class="content-box-div">
        基金规模：{{ numberFormat(infoData.ENDNAV) }}
      </div>
      <div v-if="infoData.FUNDBONUS" class="content-box-div">
        分红状态：{{ infoData.FUNDBONUS.PDATE }}日，每份基金份额折算{{
          infoData.FUNDBONUS.CHGRATIO
        }}份
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { getFundInfo } from "@/api/apiList";
import { defineComponent } from "vue";
export default defineComponent({
  components: {},
  name: "FundInfo",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    fundCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      infoData: {},
      loading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    defaultColor() {
      return "#ccc";
    },
    init() {
      this.getData();
    },

    async getData() {
      this.loading = true;
      const res: any = await getFundInfo(this.fundCode);
      this.infoData = res.Datas;
    },

    numberFormat(value: any) {
      var param: any = {};
      var k = 10000,
        sizes = ["", "万", "亿", "万亿"],
        i;
      if (value < k) {
        param.value = value;
        param.unit = "";
      } else {
        i = Math.floor(Math.log(value) / Math.log(k));

        param.value = (value / Math.pow(k, i)).toFixed(2);
        param.unit = sizes[i];
      }
      return param.value + param.unit;
    },
    showManager() {
      this.$emit("showManager", this.fundCode);
    },
    close() {
      //   this.boxShadow = false;
    },
  },
});
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  min-height: 260px;
}
.content-box {
  text-align: left;
}
.hisrank-row {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.hisrank-row-div {
  text-align: center;
  margin: 0 10px;
}
.content-box-div {
  padding: 0 20px;
  line-height: 26px;
}
.up {
  color: #f56c6c;
  font-weight: bold;
}

.down {
  color: #4eb61b;
  font-weight: bold;
}

.shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 30px;
  z-index: 1000;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

.manager-box {
  background: #ffffff;
  border-radius: 15px;
  padding: 0 10px;
  margin: 0 auto;
  text-align: center;
  line-height: 1;
  vertical-align: middle;
}

.btn {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  background: #fff;
  padding: 5px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #000000;
  margin: 0 5px;
  outline: none;
  border: 1px solid #dcdfe6;
}
.tab-row {
  padding: 12px 0;
}

.manager-content {
  width: 100%;
  height: 305px;
}
</style>
