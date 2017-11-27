<template>
    <el-row class = "container">
      <el-col :span="24" class="header">
        <el-col :span="10" class="logo logo-txt logo-width">
          VueSample
        </el-col>
        <el-col :span="10" v-if="false">
          <div>
					  <i>收起</i>
				  </div>
        </el-col>
      </el-col>
      <el-col :span="24" class="main">
        <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
          <!--导航菜单-->
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleselect" :router="true" v-show="!collapsed">
            <template v-for="(item,index) in $router.options.routes" v-if="item.visible">
              <el-submenu :key="item.name" :index="index+''" v-if="!item.leaf">
                <template slot="title"><i :class="item.iconCls"></i>{{item.meta? item.meta.title:item.name}}</template>
                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="child.visible" >{{ child.meta? child.meta.title : child.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item :key="item.name" v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" ><i :class="item.iconCls"></i>{{item.children[0].meta?item.children[0].meta.title: child.name}}</el-menu-item>
            </template>
          </el-menu>
        </aside>
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="breadcrumb-container">
              <strong class="title">{{$route.meta.title}}</strong>
              <el-breadcrumb separator="/" class="breadcrumb-inner">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                  {{ item.meta.title }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-col>
          </div>
			</section>
      </el-col>
    </el-row>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleselect: function(a, b) {
      console.log(a);
      console.log(b);
    },
    collapse() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.header {
  height: 60px;
  line-height: 60px;
  background-color: #20a0ff;
  color: #fff;
}
.logo {
  /* width:230px; */
  height: 60px;
  font-size: 22px;
  padding-left: 20px;
  padding-right: 20px;
  border-color: rgba(238, 241, 146, 0.3);
  border-right-width: 1px;
  border-right-style: solid;

  border:none;
}
.logo img {
  width: 40px;
  float: left;
  margin: 10px 10px 10px 18px;
}
.logo-txt {
  color: #fff;
}

.logo-width {
  width: 230px;
}
.logo-collapse-width {
  width: 60px;
}

.main {
  display: flex;
  /* background: #324057; */
  position: absolute;
  top: 60px;
  bottom: 0px;
  overflow: hidden;
}
aside {
  flex: 0 0 230px;
  width: 230px;
  /* position: absolute;
  top: 0px;
  bottom: 0px; */
}
.submenu {
  position: absolute;
  top: 0px;
  left: 60px;
  z-index: 99999;
  height: auto;
  display: none;
}
.el-menu {
  height: 100%;
}
.menu-collapsed {
  flex: 0 0 60px;
  width: 60px;
}
.menu-expanded {
  flex: 0 0 230px;
  width: 230px;
}
.content-container {
  /* background: #f1f2f7; */
  flex: 1;
  /* position: absolute;
				right: 0px;
				top: 0px;
				bottom: 0px;
				left: 230px; */
  overflow-y: scroll;
  padding: 20px;
}

/* margin-bottom: 15px; */
.title {
  width: 200px;
  float: left;
  color: #475669;
}
.breadcrumb-inner {
  float: right;
}
.content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
}
</style>

