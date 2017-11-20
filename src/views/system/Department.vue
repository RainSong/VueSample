<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.key_word" placeholder="部门名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="queryClick">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addClick">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="departments" @selection-change='selectionChange' stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="name" label="部门名称">
				</el-table-column>
				<el-table-column prop="parent" label="父级部门">
				</el-table-column>
				<el-table-column prop="created_at" label="添加时间">
				</el-table-column>
				
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" >
				<DepartmentAddEdit  :departmentId="departmentId" v-on:cancelHandle="canceled" v-on:saveHandle="saved">

				</DepartmentAddEdit>
			</el-dialog>

    </section>
</template>



<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import DepartmentAddEdit from "../system/DepartmentAddEdit";

Vue.component(DepartmentAddEdit.name, DepartmentAddEdit);

export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      filters: {
        key_word: ""
      },
      total: 0,
      departments: [],
      selected: [],
      interviewInfo: {},
      dialogVisable: false,
      departmentId: "",
      selectedIds:[]
    };
  },
  methods: {
    getDepartments: function() {
      var paras = {
        key_word: this.filters.key_word
      };
      api.getDepartments(paras).then(res => {
        if (res && res.status) {
          this.total = res.data.total;
          this.departments = res.data.departments;
        }
      });
    },
    deleteClick: function(id) {
      api
        .deleteDepartment(id)
        .then(res => {
          if (res.status) {
            this.$message({ message: "删除成功", type: "sccuess" });
            this.getDepartments();
          } else {
            if(typeof res.message  !== 'undefined' && res.message.length>0){
              this.$message({ message: res.message, type: "error" });
            }
            else{
              this.$message({ message: "发生错误，删除失败", type: "error" });
            }
          }
        })
        .catch(err => console.error(err));
    },
    queryClick: function() {
      this.getDepartments();
    },
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    editClick: function(id) {
      this.dialogVisable = true;
      this.departmentId = id + "";
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getDepartments();
    },
    addClick: function() {
      this.dialogVisable = true;
      this.departmentId = '';
    },
    selectionChange:function(val){
      this.selectedIds = [];
      let that = this;
      val.forEach(function(item) {
        that.selectedIds.push(item.id);
      });
    },
    deleteSomeClick:function(){
      if (this.selectedIds.length === 0){
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        });
      }

    }
  },
  watch: {
    dialogVisable: function(val) {
      if (!val) {
        this.departmentId = "";
      }
    }
  },
  mounted() {
    this.getDepartments();
  }
};
</script>

<style scope>

</style>

