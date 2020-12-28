<!--  -->
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="基金名称" width="180">
      <template #default="scope">
        <span>{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column label="估算净值" width="180" prop="price" />
    <el-table-column label="涨跌幅" width="180" prop="price" />
    <el-table-column label="持有额" width="180" prop="price" />
    <el-table-column label="估算收益" width="180" prop="price" />
    <el-table-column label="更新时间" width="180" prop="price" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
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
import { reactive, toRefs, getCurrentInstance } from "vue";
export default {
  name: "MFund",
  setup() {
    //@ts-ignore
    let { ctx } = getCurrentInstance();
    console.log(ctx);

    const tableData = reactive([
      {
        date: "2016-05-02",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1518 弄",
        price: 1.2,
      },
      {
        date: "2016-05-04",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1517 弄",
        price: 1.4,
      },
      {
        date: "2016-05-01",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1519 弄",
        price: 2.0,
      },
      {
        date: "2016-05-03",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1516 弄",
        price: 1.9,
      },
    ]);

    ctx.$http.get("/js/001186.js?rt=1463558676006");
    return { tableData };
  },
  mounted() {
    console.log(this);
  },
};
</script>
<style scoped>
</style>