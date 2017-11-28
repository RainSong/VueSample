<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
                <el-form-item label="关键字">
                    <el-input v-model="filters.key_word" placeholder="权限名/父级权限名"></el-input>
                </el-form-item>
                <el-form-item label="父级权限">
                  <el-select v-model="filters.parent_id" clearable placeholder="请选择父级权限">
                    <el-option
                        v-for="item in parentPermissions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                  </el-select>
                    <!-- <el-input v-model="filters.key_word" placeholder="权限名/父级权限名"></el-input> -->
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
			<el-table :data="permissions" @selection-change='selectionChange' @sort-change='sortChange' sortable="custom" stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="name" label="权限名" sortable="true" >
				</el-table-column>
				<el-table-column prop="parent" label="父级权限" sortable="true" :formatter="formatParent">
				</el-table-column>
				<el-table-column prop="sort" label="排序" sortable="true">
				</el-table-column>
				</el-table-column>
        <el-table-column prop="created_at" label="添加时间" :formatter="formatDate" sortable="true">
				</el-table-column>
				
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="setPermission(scope.row.id)">设置权限</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>    
      
      </el-table>

      <!--新增修改弹窗-->
			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" >
				<PermissionsAddEdit  :permissionsId="permissionsId" :parentPermissions="parentPermissions" v-on:cancelHandle="canceled" v-on:saveHandle="saved">

				</PermissionsAddEdit>
			</el-dialog>

    </section>
</template>



<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import PermissionsAddEdit from "../system/PermissionsAddEdit";

Vue.component(PermissionsAddEdit.name, PermissionsAddEdit);

export default {
  data() {
    return {
      filters: {
        key_word: "",
        parent_id:""
      },
      permissionsId: "",
      sort_column: "",
      order: "",
      parentPermissions:[],
      permissions: [],
      selected: [],
      dialogVisable: false,
      selectedIds: []
    };
  },
  methods: {
    getParentPermissions:function(){
      let that = this;
      var paras = {
        parent_id:0
      };
      api
        .getPermissions(paras)
        .then(res => {
          if (res && res.status) {
           this.parentPermissions = res.permissions;
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
    getPermissions: function() {
      let that = this;
      var paras = {
        ...this.filters,
        sort_column: this.sort_column,
        order: this.order
      };
      api
        .getPermissions(paras)
        .then(res => {
          if (res && res.status) {
            this.permissions = res.permissions;
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
          .deletePermissions(ids)
          .then(res => {
            if (res.status) {
              this.$message({ message: "删除成功", type: "sccuess" });
              this.getParentPermissions();
              this.getPermissions();
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
      this.getPermissions();
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    formatParent:function(row,column){
      return row.parent_name;
    },
    sortChange: function(column) {
      this.sort_column = column.prop;
      this.order = column.order;
      this.getParentPermissions();
      this.getPermissions();
    },
    editClick: function(id) {
      this.dialogVisable = true;
      this.permissionsId = id + "";
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getParentPermissions();
      this.getPermissions();
    },
    addClick: function() {
      this.dialogVisable = true;
      this.permissionsId = "";
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
        this.permissionsId = "";
      }
    }
  },
  mounted() {
    this.getParentPermissions();
    this.getPermissions();
  }
};
</script>

<style scoped>
.block {
  text-align: right;
  padding: 10px 10px;
}
</style>

