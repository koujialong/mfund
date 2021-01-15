<!-- 基金 -->
<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入基金名称或代码"
    :remote-method="remoteMethod"
    :loading="searchloading"
    loading-text="正在查找基金..."
    no-data-text="未查找到基金"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
  <el-button type="primary" class="sub-btn" @click="addFund">确认</el-button>
  <el-button
    type="danger"
    style="margin-left: 100px"
    :icon="loading ? 'el-icon-loading' : 'el-icon-refresh'"
    @click="updataFundList(true)"
    >点击刷新：{{ refreshTime }}</el-button
  >
  <el-table :data="fundList" border style="margin-left: 20px; width: 96%">
    <el-table-column label="代码" min-width="6%">
      <template #default="scope">
        <span>{{ scope.row.fundcode }}</span>
      </template>
    </el-table-column>
    <el-table-column label="基金名称" min-width="12%">
      <template #default="scope">
        <span
          :style="`color:${scope.row.color};cursor:pointer`"
          @mouseenter="scope.row.color = '#409EFF'"
          @mouseout="scope.row.color = '#606266'"
          @click="popDetail(scope.row.fundcode)"
          >{{ scope.row.SHORTNAME }}</span
        >
      </template>
    </el-table-column>
    <el-table-column label="成本价" min-width="8%">
      <template #default="scope">
        <el-input
          v-model="scope.row.cccb"
          type="number"
          v-if="scope.row.isEdit"
        />
        <span v-else>{{ scope.row.cccb }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有份额" min-width="8%">
      <template #default="scope">
        <el-input
          v-model="scope.row.hold"
          type="number"
          v-if="scope.row.isEdit"
        />
        <span v-else>{{ scope.row.hold }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有总额" min-width="6%">
      <template #default="scope">
        <span>{{ scope.row.holdPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持仓收益" min-width="6%">
      <template #default="scope">
        <span :style="`color: ${scope.row.ccsy >= 0 ? 'red' : 'green'}`">{{
          scope.row.ccsy >= 0 ? `+${scope.row.ccsy}` : scope.row.ccsy
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="收益率" min-width="6%">
      <template #default="scope">
        <span :style="`color: ${scope.row.ccsyl >= 0 ? 'red' : 'green'}`"
          >{{
            scope.row.ccsyl >= 0 ? `+${scope.row.ccsyl}` : scope.row.ccsyl
          }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column label="单位净值" min-width="6%">
      <template #default="scope">
        <span>{{ scope.row.NAV }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估算净值" min-width="6%">
      <template #default="scope">
        <span>{{ scope.row.GSZ }}</span>
      </template>
    </el-table-column>
    <el-table-column label="涨跌幅" min-width="6%">
      <template #default="scope">
        <span :style="`color: ${scope.row.GSZZL >= 0 ? 'red' : 'green'}`"
          >{{
            scope.row.GSZZL >= 0 ? `+${scope.row.GSZZL}` : scope.row.GSZZL
          }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column label="预估收益" min-width="6%">
      <template #default="scope">
        <span :style="`color: ${scope.row.gzsy >= 0 ? 'red' : 'green'}`">{{
          scope.row.gzsy >= 0 ? `+${scope.row.gzsy}` : scope.row.gzsy
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估值时间" min-width="10%">
      <template #default="scope">
        <span>{{ scope.row.GZTIME }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="10%">
      <template #default="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{
          scope.row.isEdit ? "完成" : "编辑"
        }}</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <span class="info-tag">总额数据：</span>
  <el-tag type="danger" effect="dark"> 持仓总额：{{ rental }} </el-tag>
  <el-tag :type="allProfit >= 0 ? 'danger' : 'success'" effect="dark">
    持仓总收益：{{ allProfit >= 0 ? `+${allProfit}` : allProfit }}
  </el-tag>
  <el-tag :type="allProfitRatio >= 0 ? 'danger' : 'success'" effect="dark">
    持仓总收益率：{{
      allProfitRatio >= 0 ? `+${allProfitRatio}` : allProfitRatio
    }}%
  </el-tag>
  <span class="info-tag" style="margin-left: 100px">当日数据：</span>
  <el-tag :type="dayProfit >= 0 ? 'danger' : 'success'" effect="dark">
    当日预估收益：{{ dayProfit >= 0 ? `+${dayProfit}` : dayProfit }}
  </el-tag>
  <el-tag :type="rentalRatio >= 0 ? 'danger' : 'success'" effect="dark">
    当日预估收益率：{{ rentalRatio >= 0 ? `+${rentalRatio}` : rentalRatio }}%
  </el-tag>
  <div style="display: flex; width: 100%; overflow: hidden">
    <index-detail />
    <market-line />
    <market-bar />
  </div>
  <cloud-chart />

  <el-dialog v-model="showPopDetail" destroy-on-close center>
    <fund-detail :fundCode="clickFundCode" />
  </el-dialog>
</template>

<script lang='ts'>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  ref,
  watch,
  toRaw,
  defineComponent,
} from "vue";
import { getFundData, getFundDatas, getFunds, searchFund } from "@/api/apiList";
import { formatDateTime } from "@/utils/utils";
import MarketBar from "@/components/MarketBar.vue";
import MarketLine from "@/components/MarketLine.vue";
import IndexDetail from "@/components/IndexDetail.vue";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
import FundDetail from "@/components/FundDetail.vue";
import CloudChart from "@/components/CloudChart.vue";
interface fundItem {
  fundcode: string;
  name: string;
  jzrq: string;
  NAV: number;
  GSZ: string;
  GSZZL: number;
  GZTIME: string;
  isEdit: boolean;
  hold: number;
  holdPrice: number;
  gzsy: number;
  cccb: number;
  ccsy: number;
  ccsyl: number;
}

export default defineComponent({
  name: "MFund",
  components: {
    MarketBar,
    MarketLine,
    IndexDetail,
    FundDetail,
    CloudChart,
  },
  data() {
    return {
      value: [],
      loading: false,
      searchloading: false,
      options: [],
      fundList: new Array<fundItem>(),
      allProfit: 0,
      dayProfit: 0,
      rental: 0,
      rentalRatio: 0,
      allProfitRatio: 0,
      showPopDetail: false,
      clickFundCode: 0,
    };
  },
  mounted(this: any) {
    let fundStr = window.localStorage.getItem("fund_list") || null;
    this.fundList =
      fundStr && fundStr != "{}" && fundStr != "undefined"
        ? JSON.parse(fundStr)
        : new Array<fundItem>();
    this.startTimer();
    getFunds().then((res: any) => {
      this.allFunds = JSON.parse(res.split("=")[1].split(";")[0].trim()).map(
        (item: any) => {
          return {
            value: item[0],
            label: item[2],
          };
        }
      );
    });
  },
  methods: {
    async remoteMethod(this: any, query: string) {
      if (query !== "") {
        this.searchloading = true;
        if (this.allFunds.length > 0) {
          let options = this.allFunds.filter((remoteItem: any) => {
            return (
              !this.fundList.some((item: fundItem) => {
                return item.fundcode == remoteItem.value;
              }) &&
              (remoteItem.value.indexOf(query) != -1 ||
                remoteItem.label.indexOf(query) != -1)
            );
          });
          this.options = options.length > 100 ? options.slice(0, 100) : options;
          this.searchloading = false;
        } else {
          this.options = [];
        }
      } else {
        this.searchloading = false;
        this.options = [];
      }
    },
    addFund(this: any) {
      this.value.forEach((item: any) => {
        this.fundList.push({
          fundcode: item,
        });
      });
      this.value = [];
      this.updataLocalFundList();
      this.updataFundList(true);
    },

    async updataFundList(this: any, isLoading: boolean = false) {
      this.refreshTime = formatDateTime(new Date());
      if (!this.loading || isLoading) {
        let dayProfit: number = 0;
        let rental: number = 0;
        let allProfit: number = 0;
        this.loading = true;
        let res: any = await getFundDatas(
          this.fundList.map((val: any) => val.fundcode).join(","),
          this.getDeviceid()
        ).catch(() => {
          this.loading = false;
        });
        let that = this;
        if (res && res.Datas && res.Datas.length > 0) {
          res.Datas.forEach((obj: any, index: number) => {
            let item = that.fundList[index];
            item = Object.assign(item, obj);
            //持仓成本价
            item.cccb || (item.cccb = item.NAV);
            //持有份额
            item.hold || (item.hold = 0);
            item.ccsyl || (item.ccsyl = 0);
            //持有总额
            item.holdPrice = Number((item.hold * item.NAV).toFixed(2));
            //当日估值收益
            item.gzsy = Number((item.holdPrice * item.GSZZL * 0.01).toFixed(2));
            //总收益计算
            dayProfit = Number((dayProfit + item.gzsy).toFixed(2));
            //持仓总额
            rental = Number((rental + item.holdPrice).toFixed(2));
            //持仓收益
            item.ccsy = Number(((item.NAV - item.cccb) * item.hold).toFixed(2));
            //持仓收益
            item.ccsyl = item.holdPrice
              ? Number(
                  ((item.ccsy / (item.holdPrice - item.ccsy)) * 100).toFixed(2)
                )
              : 0;
            //持仓总收益
            allProfit = Number((allProfit + item.ccsy).toFixed(2));
            // //持仓总收益
            if (index === res.Datas.length - 1) {
              that.dayProfit = dayProfit;
              that.rental = rental;
              that.rentalRatio = ((dayProfit / rental) * 100).toFixed(2);
              that.allProfit = allProfit;
              that.allProfitRatio = Number(
                ((allProfit / (rental - allProfit)) * 100).toFixed(2)
              );
            }
          });
          //延迟加载效果
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    },

    startTimer(this: any) {
      this.updataFundList(true);
      bus.$on(TIMER.SECCB10, () => {
        this.updataFundList();
      });
    },

    handleDelete(this: any, index: number, item: fundItem) {
      console.log(this, index, item);
      this.fundList.splice(index, 1);
      this.updataLocalFundList();
    },
    updataLocalFundList(this: any) {
      window.localStorage.setItem("fund_list", JSON.stringify(this.fundList));
    },
    handleEdit(this: any, index: number, item: fundItem) {
      this.fundList.forEach((item: any) => {
        let fundItem = item as fundItem;
        console.log(fundItem.fundcode != item.fundcode);
        fundItem.fundcode != item.fundcode && (fundItem.isEdit = false);
      });
      if (item.isEdit) {
        item.isEdit = false;
      } else {
        item.isEdit = true;
      }
      this.updataLocalFundList();
      this.updataFundList(true);
    },
    popDetail(this: any, code: number) {
      this.clickFundCode = code;
      this.showPopDetail = true;
    },
    getDeviceid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
});
</script>
<style scoped>
.el-select {
  width: 400px;
  margin: 20px 20px;
}
.sub-btn {
  margin-left: 20px;
}
.el-tag {
  margin: 20px 0 20px 20px;
}
.info-tag {
  height: 32px;
  margin-top: 2px;
  color: #f56c6c;
  font-size: 16px;
  margin-left: 20px;
}
</style>