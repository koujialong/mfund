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
  <div v-for="item in fundList" :key="item.fundcode">{{ item.name }}</div>
</template>

<script lang='ts'>
import { reactive, toRefs, getCurrentInstance, ref, watch } from "vue";
import { getFundData, searchFund } from "@/api/apiList";

interface fundItem {
  fundcode: string;
  name: string;
  jzrq: string;
  dwjz: string;
  gsz: string;
  gszzl: string;
  gztime: string;
}

export default {
  name: "MFund",
  data() {
    return {
      value: [],
      loading: false,
      options: [{}],
      fundList: new Set<fundItem>(),
    };
  },
  mounted() {
    let fundStr = window.localStorage.getItem("fund_list") || "{}";
    this.fundList = JSON.parse(fundStr) || new Set<fundItem>();
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
        this.fundList.add({
          fundcode: item,
        });
      });
      this.value = [];
      console.log(this.fundList);
      window.localStorage.setItem("fund_list", JSON.stringify(this.fundList));
      this.updataFundList();
    },

    updataFundList() {
      this.fundList.forEach(async (item: fundItem) => {
        let res: any = await getFundData(item.fundcode);
        eval(res);
        function jsonpgz(obj: Object) {
          item = Object.assign(item, obj);
        }
      });
    },
  },
};
</script>
<style scoped>
.el-select {
  width: 400px;
  margin: 40px 0px;
}
.sub-btn {
  margin-left: 20px;
}
</style>