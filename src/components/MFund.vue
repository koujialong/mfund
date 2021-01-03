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
    :loading="loading"
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
    >点击刷新：{{ timeStr }}</el-button
  >
  <el-table :data="fundList" border style="margin-left: 20px; width: auto">
    <el-table-column label="基金代码" width="100">
      <template #default="scope">
        <span>{{ scope.row.fundcode }}</span>
      </template>
    </el-table-column>
    <el-table-column label="基金名称" width="240">
      <template #default="scope">
        <span
          :style="`color:${scope.row.color};cursor:pointer`"
          @mouseenter="scope.row.color = 'blue'"
          @mouseout="scope.row.color = 'black'"
          @click="popDetail(scope.row.fundcode)"
          >{{ scope.row.name }}</span
        >
      </template>
    </el-table-column>
    <el-table-column label="持仓成本价" width="140">
      <template #default="scope">
        <el-input v-model="scope.row.cccb" v-if="scope.row.isEdit" />
        <span v-else>{{ scope.row.cccb }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有份额" width="140">
      <template #default="scope">
        <el-input v-model="scope.row.hold" v-if="scope.row.isEdit" />
        <span v-else>{{ scope.row.hold }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有总额" width="140">
      <template #default="scope">
        <span>{{ scope.row.holdPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持仓收益" width="100">
      <template #default="scope">
        <span :style="`color: ${scope.row.ccsy >= 0 ? 'red' : 'green'}`">{{
          scope.row.ccsy >= 0 ? `+${scope.row.ccsy}` : scope.row.ccsy
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持仓收益率" width="100">
      <template #default="scope">
        <span :style="`color: ${scope.row.ccsyl >= 0 ? 'red' : 'green'}`"
          >{{
            scope.row.ccsyl >= 0 ? `+${scope.row.ccsyl}` : scope.row.ccsyl
          }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column label="单位净值" width="100">
      <template #default="scope">
        <span>{{ scope.row.dwjz }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估算净值" width="100">
      <template #default="scope">
        <span>{{ scope.row.gsz }}</span>
      </template>
    </el-table-column>
    <el-table-column label="涨跌幅" width="100">
      <template #default="scope">
        <span :style="`color: ${scope.row.gszzl >= 0 ? 'red' : 'green'}`"
          >{{
            scope.row.gszzl >= 0 ? `+${scope.row.gszzl}` : scope.row.gszzl
          }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column label="当日预估收益" width="120">
      <template #default="scope">
        <span :style="`color: ${scope.row.gzsy >= 0 ? 'red' : 'green'}`">{{
          scope.row.gzsy >= 0 ? `+${scope.row.gzsy}` : scope.row.gzsy
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估值时间" width="150">
      <template #default="scope">
        <span>{{ scope.row.gztime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160">
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
  <div style="display: flex">
    <index-detail />
    <market-line />
    <market-bar />
  </div>

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
import { getFundData, searchFund } from "@/api/apiList";
import { formatDateTime } from "@/utils/utils";
import MarketBar from "@/components/MarketBar.vue";
import MarketLine from "@/components/MarketLine.vue";
import IndexDetail from "@/components/IndexDetail.vue";
import bus from "@/utils/bus";
import { TIMER } from "@/utils/timer";
import FundDetail from "@/components/FundDetail.vue";
interface fundItem {
  fundcode: string;
  name: string;
  jzrq: string;
  dwjz: number;
  gsz: string;
  gszzl: number;
  gztime: string;
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
  },
  data() {
    return {
      value: [],
      loading: false,
      options: [{ disabled: true }],
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
    console.log(fundStr);
    this.fundList =
      fundStr && fundStr != "{}" && fundStr != "undefined"
        ? JSON.parse(fundStr)
        : new Array<fundItem>();
    this.startTimer();
  },
  methods: {
    async remoteMethod(this: any, query: string) {
      if (query !== "") {
        this.loading = true;
        let res: any = await searchFund(query).catch((err: Error) => {
          this.loading = false;
        });
        if (res.Datas.length > 0) {
          const options = res.Datas.filter((remoteItem: any) => {
            return !this.fundList.some((item: fundItem) => {
              return item.fundcode == remoteItem.CODE;
            });
          }).map((item: any) => {
            return {
              value: item.CODE,
              label: item.NAME,
            };
          });
          this.options = options.length > 0 ? options : [{ disabled: true }];
          this.loading = false;
        } else {
          this.options = [{ disabled: true }];
        }
        console.log("选项", this.options);
      } else {
        this.loading = false;
        this.options = [{ disabled: true }];
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
      this.isOpen || (this.isOpen = this.checkIsOpen());
      if ((this.isOpen() && !this.loading) || isLoading) {
        let dayProfit: number = 0;
        let rental: number = 0;
        let allProfit: number = 0;
        let fundReqList = this.fundList.map((item: fundItem) => {
          return getFundData(item.fundcode);
        });
        this.loading = true;
        let resList: any = await Promise.all(fundReqList).catch(() => {
          this.loading = false;
        });
        let that = this;
        resList.forEach((res: any, index: number) => {
          eval(res);
          function jsonpgz(obj: Object) {
            let item = that.fundList[index];
            item = Object.assign(item, obj);
            //持仓成本价
            item.cccb || (item.cccb = item.dwjz);
            //持有份额
            item.hold || (item.hold = 0);
            item.ccsyl || (item.ccsyl = 0);
            //持有总额
            item.holdPrice = Number((item.hold * item.dwjz).toFixed(2));
            //当日估值收益
            item.gzsy = Number((item.holdPrice * item.gszzl * 0.01).toFixed(2));
            //总收益计算
            dayProfit = Number((dayProfit + item.gzsy).toFixed(2));
            //持仓总额
            rental = Number((rental + item.holdPrice).toFixed(2));
            //持仓收益
            item.ccsy = Number(
              ((item.dwjz - item.cccb) * item.hold).toFixed(2)
            );
            //持仓收益
            item.ccsyl = item.holdPrice
              ? Number(
                  ((item.ccsy / (item.holdPrice - item.ccsy)) * 100).toFixed(2)
                )
              : 0;
            //持仓总收益
            allProfit = Number((allProfit + item.ccsy).toFixed(2));
            // //持仓总收益
            // allProfit = Number((allProfit + item.ccsy).toFixed(2));
            if (index === resList.length - 1) {
              that.dayProfit = dayProfit;
              that.rental = rental;
              that.rentalRatio = ((dayProfit / rental) * 100).toFixed(2);
              that.allProfit = allProfit;
              that.allProfitRatio = Number(
                ((allProfit / (rental - allProfit)) * 100).toFixed(2)
              );
            }
          }
        });
        //延迟加载效果
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },

    /**
     * 判断当前是否开盘
     */
    checkIsOpen() {
      let now = new Date();
      let nowTime = now.getTime();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let startStr = year + "/" + month + "/" + date + " " + "9:30:00";
      let startTime = Date.parse(startStr);
      return function (this: any) {
        let now = new Date();
        let nowTime = now.getTime();
        this.timeStr = formatDateTime(now);
        return nowTime >= startTime && hour < 15;
      };
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