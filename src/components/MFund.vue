<!-- sd -->
<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入基金代码"
    :remote-method="remoteMethod"
    :loading="loading"
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
  <el-table :data="fundList" border style="margin-left: 20px; width: auto">
    <el-table-column label="基金代码" width="100">
      <template #default="scope">
        <span>{{ scope.row.fundcode }}</span>
      </template>
    </el-table-column>
    <el-table-column label="基金名称" width="300">
      <template #default="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有份额" width="200">
      <template #default="scope">
        <el-input v-model="scope.row.hold" v-if="scope.row.isEdit" />
        <span v-else>{{ scope.row.hold }}</span>
      </template>
    </el-table-column>
    <el-table-column label="持有总额" width="200">
      <template #default="scope">
        <span>{{ scope.row.holdPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="单位净值" width="100">
      <template #default="scope">
        <span>{{ scope.row.dwjz }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估算净值" width="100" color="red">
      <template #default="scope">
        <span>{{ scope.row.gsz }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估值" width="100">
      <template #default="scope">
        <span>{{ scope.row.gszzl }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估值时间" width="140">
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
</template>

<script lang='ts'>
import { reactive, toRefs, getCurrentInstance, ref, watch, toRaw } from "vue";
import { getFundData, searchFund } from "@/api/apiList";

interface fundItem {
  fundcode: string;
  name: string;
  jzrq: string;
  dwjz: number;
  gsz: string;
  gszzl: string;
  gztime: string;
  isEdit: boolean;
  hold: number;
  holdPrice: number;
}

export default {
  name: "MFund",
  data() {
    return {
      value: [],
      loading: false,
      options: [{}],
      fundList: new Array<fundItem>(),
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
        this.loading = false;
        this.options = res.Datas.map((item: any) => {
          return {
            value: item._id,
            label: item.NAME,
          };
        });
      } else {
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
      this.updataFundList();
    },

    updataFundList(this: any) {
      this.fundList.forEach(async (item: fundItem) => {
        let res: any = await getFundData(item.fundcode);
        eval(res);
        function jsonpgz(obj: Object) {
          item = Object.assign(item, obj);
          item.hold || (item.hold = 0);
          item.holdPrice = Number((item.hold * item.dwjz).toFixed(2));
        }
      });
    },

    startTimer(this: any) {
      this.updataFundList();
      this.timmer = setInterval(() => {
        this.updataFundList();
      }, 5000);
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
      if (item.isEdit) {
        item.isEdit = false;
        this.updataLocalFundList();
        this.updataFundList();
      } else {
        item.isEdit = true;
      }
    },
  },
  beforeUnmount(this: any) {
    this.timer && this.timer.clearInterval();
  },
};
</script>
<style scoped>
.el-select {
  width: 400px;
  margin: 40px 20px;
}
.sub-btn {
  margin-left: 20px;
}
</style>