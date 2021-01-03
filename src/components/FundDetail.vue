<!-- 基金明细 -->
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="基金概况"> </el-tab-pane>
    <el-tab-pane label="净值估算">净值估算</el-tab-pane>
    <el-tab-pane label="持仓明细">持仓明细</el-tab-pane>
    <el-tab-pane label="历史净值">
      <fund-chart :fundCode="fundCode" :chartType="'LSJZ'" />
    </el-tab-pane>
    <el-tab-pane label="累计收益">
      <fund-chart :fundCode="fundCode" :chartType="'LJSY'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang='ts'>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
} from "vue";
import FundChart from "@/components/FundChart.vue";
interface DataProps {}
export default defineComponent({
  name: "",
  props: ["fundCode"],
  components: {
    FundChart,
  },
});
</script>
<style scoped>
</style>