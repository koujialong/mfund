<!-- 基金明细 -->
<template>
  <el-tabs :type="pc?'border-card':''" style="height: 500px;width:100%">
    <el-tab-pane lazy label="净值估算">
      <fund-reckon-chart :fundCode="fundCode||fundCodePhone" />
    </el-tab-pane>
    <el-tab-pane lazy label="持仓明细" >
      <position-detail :fundCode="fundCode||fundCodePhone" :pc="pc" />
    </el-tab-pane>
    <el-tab-pane lazy label="历史净值">
      <fund-chart lazy :fundCode="fundCode||fundCodePhone" :chartType="'LSJZ'" :pc="pc" />
    </el-tab-pane>
    <el-tab-pane lazy label="累计收益">
      <fund-chart :fundCode="fundCode||fundCodePhone" :chartType="'LJSY'" :pc="pc"/>
    </el-tab-pane>
    <el-tab-pane label="基金概况">
      <fund-info :fundCode="fundCode||fundCodePhone" />
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
import { _isMobile } from "@/utils/utils";
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
  data(){
    return {
      fundCodePhone:0
    }
  },
  beforeMount(this:any){
    this.pc =! _isMobile();
    (!this.pc)&&(this.fundCodePhone=this.$route.query.fundCode)
  }
});
</script>
<style scoped>
</style>