<!-- 基金明细 -->
<template>
  <el-tabs type="border-card" style="height: 500px">
    <el-tab-pane lazy label="净值估算">
      <fund-reckon-chart :fundCode="fundCode" />
    </el-tab-pane>
    <el-tab-pane lazy label="持仓明细">
      <position-detail :fundCode="fundCode" />
    </el-tab-pane>
    <el-tab-pane lazy label="历史净值">
      <fund-chart lazy :fundCode="fundCode" :chartType="'LSJZ'" />
    </el-tab-pane>
    <el-tab-pane lazy label="累计收益">
      <fund-chart :fundCode="fundCode" :chartType="'LJSY'" />
    </el-tab-pane>
    <el-tab-pane label="基金概况">
      <fund-info :fundCode="fundCode" />
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
import FundReckonChart from "@/components/FundReckonChart.vue";
import PositionDetail from "@/components/PositionDeatil.vue";
import FundInfo from "@/components/FundInfo.vue";
interface DataProps {}
export default defineComponent({
  name: "",
  props: ["fundCode"],
  components: {
    FundChart,
    FundReckonChart,
    PositionDetail,
    FundInfo,
  },
});
</script>
<style scoped>
</style>