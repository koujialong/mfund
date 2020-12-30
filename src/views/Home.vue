<!-- 首页 -->
<template>
  <div>
    <m-fund></m-fund>
  </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import MFund from "@/components/MFund.vue";
export default {
  components: { MFund },
  name: "",
  setup() {
    return {};
  },
};
</script>
<style scoped>
</style>