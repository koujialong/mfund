<!-- 持仓明细 -->
<template>
  <div class="title-content">
    <span v-if="expansion">截止日期：{{ expansion }}</span>
    <span v-else>暂无数据</span>
  </div>
  <el-table
    size="mini"
    :data="dataList"
    border
    class="table"
    row-class-name="row-content"
    style="width: 100%"
  >
    <el-table-column label="股票名称（代码）" min-width="32%">
      <template #default="scope">
        <span>{{ `${scope.row.GPJC}(${scope.row.GPDM})` }}</span>
      </template>
    </el-table-column>
    <el-table-column label="价格" min-width="16%">
      <template #default="scope">
        <span>{{ scope.row.gp.f2.toFixed(2) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="涨跌幅" min-width="16%">
      <template #default="scope">
        <span :class="scope.row.gp.f3 >= 0 ? 'up' : 'down'">{{
          scope.row.gp.f3 >= 0
            ? `+${scope.row.gp.f3.toFixed(2)}`
            : scope.row.gp.f3.toFixed(2)
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持仓占比" min-width="16%">
      <template #default="scope">
        <span>{{ parseFloat(scope.row.JZBL).toFixed(2) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="较上期" min-width="16%">
      <template #default="scope">
        <span>{{ compared(scope.row) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import { getPositionDetail, getStockData } from "@/api/apiList";
export default {
  name: "",
  data() {
    return {
      expansion: null,
      dataList: [],
      dataListGp: [],
    };
  },
  props: {
    fundCode: {
      type: String,
      required: true,
    },
  },
  methods: {
    init(this: any) {
      this.getData();
    },

    async getData(this: any) {
      const res: any = await getPositionDetail(this.fundCode);
      let dataList = res.Datas.fundStocks;
      if (dataList) {
        let stockList = dataList
          .map((val: any) => {
            return val.NEWTEXCH + "." + val.GPDM;
          })
          .join(",");
        const resStock: any = await getStockData(stockList);
        this.dataListGp = resStock.data.diff;
        this.dataList = dataList.map((item: any, ind: number) => {
          item.gp = this.dataListGp[ind];
          return item;
        });

        this.expansion = res.Expansion;
      }
    },
    compared(val: any) {
      if (val.PCTNVCHGTYPE == "新增") {
        return "新增";
      } else if (isNaN(val.PCTNVCHG)) {
        return 0;
      } else {
        let icon = val.PCTNVCHG > 0 ? "↑ " : "↓ ";
        return icon + Math.abs(parseFloat(val.PCTNVCHG)).toFixed(2) + "%";
      }
    },
  },
  mounted(this: any) {
    this.init();
  },
};
</script>
<style scoped>
.up {
  color: #f56c6c;
  font-weight: bold;
}

.down {
  color: #4eb61b;
  font-weight: bold;
}
.title-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
}
.table {
  height: 400px;
  width: 100%;
}
.row-content {
  font-size: 10px;
}
</style>