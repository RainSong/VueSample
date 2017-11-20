<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  /*background: url(assets/bg1.jpg) center !important;
		background-size: cover;
	  background: #1F2D3D;  */
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  /* border:1px solid #dfe6ec; */
  margin: 10px 0px;
}
.el-form-item {
  margin-bottom: 10px;
}

/* .el-table_1_column_1 div {
  text-align: center;
} */
.align-center{
	text-align: center;
}
</style>
