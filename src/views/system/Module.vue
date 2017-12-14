<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
                <el-form-item label="模块名">
                    <el-input v-model="filters.keyWord" placeholder="模块名"></el-input>
                </el-form-item>

                <el-form-item label="父级模块">
                    <el-cascader v-model="filters.parentIds" :options="parentModules" change-on-select clearable style="width:100%;"></el-cascader>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="queryClick">查询</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="addClick">新增</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="deleteSomeClick">删除</el-button>
                </el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="modules" @selection-change='selectionChange' @sort-change='sortChange' sortable="custom" stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="name" label="名称" :width="'180px'" sortable="true" >
				</el-table-column>
				<el-table-column prop="parent" label="父级模块" :width="'180px'" sortable="true">
				</el-table-column>
				<el-table-column prop="display_name" label="显示名称" :width="'180px'" sortable="true" >
				</el-table-column>
				<el-table-column prop="visible" label="是否显示" :width="'130px'" sortable="true" :formatter="formatVisible">
				</el-table-column>
        <el-table-column prop="path" label="路径" sortable="true">
				</el-table-column>
        <el-table-column prop="sort" label="排序" :width="'130px'" sortable="true">
				</el-table-column>
        <el-table-column prop="created_at" label="添加时间" :width="'130px'"  :formatter="formatDate" sortable="true">
				</el-table-column>

       <el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column> 
      
      </el-table>

      <!--新增修改弹窗   -->
			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" >
				<ModuleAddEdit  :moduleId="moduleId" :parentModules="parentModules" v-on:cancelHandle="canceled" v-on:saveHandle="saved">
				</ModuleAddEdit>
			</el-dialog>
    </section>
</template>

<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import ModuleAddEdit from "../system/ModuleAddEdit";

Vue.component(ModuleAddEdit.name, ModuleAddEdit);

export default {
  data() {
    return {
      filters: {
        keyWord: "",
        parentIds: []
      },
      moduleId: "",
      sortColumn: "",
      order: "",
      modules: [],
      selected: [],
      dialogVisable: false,
      selectedIds: [],
      parentModules: [],
      parentIds:[]
    };
  },
  methods: {
    getModules: function() {
      let that = this;
      
      var paras = {
        keyWord:this.filters.keyWord,
        parentId:"",
        sortColumn: this.sortColumn,
        order: this.order
      };
      if(this.parentIds.length > 0){
        paras.parentId = this.parentIds[this.parentIds.length - 1] + "";
      }
      api
        .getModules(paras)
        .then(res => {
          if (res.status) {
            this.modules = res.modules;
          }
        })
        .catch(err => {
          if (
            typeof err !== "undefined" &&
            typeof err.response !== "undefined" &&
            err.response.status === 401
          ) {
            that.$router.push("/login");
          }
        });
    },
    deleteData: function(ids) {
      let that = this;
      let deleteSome = () => {
        api
          .deleteModule(ids)
          .then(res => {
            if (res.status) {
              this.$message({ message: "删除成功", type: "sccuess" });
              this.getModules();
              this.getParents();
            } else {
              if (
                typeof res.message !== "undefined" &&
                res.message.length > 0
              ) {
                this.$message({ message: res.message, type: "error" });
              } else {
                this.$message({ message: "发生错误，删除失败", type: "error" });
              }
            }
          })
          .catch(err => {
            console.error(err);
            if (
              typeof err !== "undefined" &&
              typeof err.response !== "undefined" &&
              err.response.status === 401
            ) {
              that.$router.push({ path: "/login" });
            }
          });
      };
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSome();
        })
        .catch(err => console.error(err));
    },
    deleteClick: function(id) {
      this.deleteData(id);
    },
    queryClick: function() {
      this.getModules();
    },
    getParents: function() {
      let that = this;
      var paras = {
        levels: "1,2"
      };
      api
        .getModules(paras)
        .then(res => {
          if (res && res.status) {
            that.parentModules = [];
            that.parentModules = res.modules
              .filter(o => o.parent_id === 0)
              .map((item, index, arr) => {
                return {
                  value: item.id,
                  label: item.display_name,
                  children: res.modules
                    .filter(o => o.parent_id === item.id)
                    .map((citem, cindex, carr) => {
                      return {
                        value: citem.id,
                        label: citem.display_name
                      };
                    })
                };
              });
          }
        })
        .catch(err => {
          if (
            typeof err !== "undefined" &&
            typeof err.response !== "undefined" &&
            err.response.status === 401
          ) {
            that.$router.push("/login");
          }
        });
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    formatVisible: function(row, column) {
      let data = row[column.property];
      if (data === "1" || data === 1) {
        return "是";
      }
      return "否";
    },
    sortChange: function(column) {
      this.sortColumn = column.prop;
      this.order = column.order;
      this.getModules();
    },
    editClick: function(id) {
      this.moduleId = id + "";
      this.dialogVisable = true;
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getModules();
      this.getParents();
    },
    addClick: function() {
      this.dialogVisable = true;
      this.moduleId = "";
    },
    selectionChange: function(val) {
      this.selectedIds = [];
      let that = this;
      val.forEach(function(item) {
        that.selectedIds.push(item.id);
      });
    },
    deleteSomeClick: function() {
      if (this.selectedIds.length === 0) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning"
        });
        return;
      }
      let ids = this.selectedIds.join(",");
      this.deleteData(ids);
    }
  },
  watch: {
    dialogVisable: function(val) {
      if (!val) {
        this.moduleId = "";
      }
    }
  },
  mounted() {
    this.getModules();
    this.getParents();
  }
};
</script>

<style scoped>
.block {
  text-align: right;
  padding: 10px 10px;
}
</style>

