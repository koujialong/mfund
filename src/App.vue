<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    const script = document.createElement("script");
    script.src =
      "https://v1.cnzz.com/z_stat.php?id=1279640181&web_id=1279640181"; //该路径为点击统计代码后，页面中第一个 文字统计 script代码
    script.language = "JavaScript";
    document.body.appendChild(script);
  },
};
</script>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
