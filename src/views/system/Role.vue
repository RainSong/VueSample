<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.key_word" placeholder="角色名"></el-input>
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
			<el-table :data="roles" @selection-change='selectionChange' @sort-change='sortChange' sortable="custom" stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="name" label="角色名" sortable="true" >
				</el-table-column>
				<el-table-column prop="level" label="级别" sortable="true">
				</el-table-column>
				</el-table-column>
        <el-table-column prop="created_at" label="添加时间" :formatter="formatDate" sortable="true">
				</el-table-column>
				
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
						<!-- <el-button size="mini" type="text" @click="setPermissionsClick(scope.row.id)">设置权限</el-button> -->
					</template>
				</el-table-column>    
      
      </el-table>

      <!--新增修改弹窗   -->
			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" >
				<RoleAddEdit  :roleId="roleId" v-on:cancelHandle="canceled" v-on:saveHandle="saved">
				</RoleAddEdit>
			</el-dialog>
    </section>
</template>

<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import RoleAddEdit from "../system/RoleAddEdit";

Vue.component(RoleAddEdit.name, RoleAddEdit);

export default {
  data() {
    return {
      filters: {
        key_word: ""
      },
      roleId: "",
      sort_column: "",
      order: "",
      roles: [],
      selected: [],
      dialogVisable: false,
      selectedIds: []
    };
  },
  methods: {
    getRoles: function() {
      let that = this;
      var paras = {
        ...this.filters,
        sort_column: this.sort_column,
        order: this.order
      };
      api
        .getRoles(paras)
        .then(res => {
          if (res && res.status) {
            this.roles = res.roles;
          }
        })
        .catch(err => {
          //console.error(err);
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
          .deleteRole(ids)
          .then(res => {
            if (res.status) {
              this.$message({ message: "删除成功", type: "sccuess" });
              this.getRoles();
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
      this.getRoles();
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    sortChange: function(column) {
      this.sort_column = column.prop;
      this.order = column.order;
      this.getRoles();
    },
    editClick: function(id) {
      this.dialogVisable = true;
      this.roleId = id + "";
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getRoles();
    },
    addClick: function() {
      this.dialogVisable = true;
      this.roleId = "";
    },
    setPermissionsClick:function(id){
      this.$router.push('/system/role/permissions')
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
        this.roleId = "";
      }
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>

<style scoped>
.block {
  text-align: right;
  padding: 10px 10px;
}
</style>

