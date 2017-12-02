<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
              
            <el-row>
                <el-form-item label="查询关键字" label-width='90px' >
                    <el-input v-model="filters.key_word" placeholder="用户名/姓名/电话/邮箱" style="width:100%;"></el-input>
                </el-form-item>

              
                <el-form-item label="性别" label-width='90px' >
                    <el-select v-model="filters.sex" placeholder="性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
              
                <el-form-item label="入职时间" label-width='90px' >
                  <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="filters.entry_time_start" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2" style="text-align:center;">-</el-col>
                  <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="filters.entry_time_end" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>

            </el-row>


            <el-row>
                <el-form-item label="所属部门" label-width='90px' > 
                    <el-cascader v-model="departmentIds" :options="departments" change-on-select clearable style="width:100%;"></el-cascader>
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
            </el-row>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="users" @selection-change='selectionChange' @sort-change='sortChange' sortable="custom" stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="user_name" label="用户名" sortable="true" >
				</el-table-column>
				<el-table-column prop="name" label="姓名" sortable="true">
				</el-table-column>
        <el-table-column prop="sex" label="性别" :width="80" :formatter="formatSex" sortable="true">
				</el-table-column>
        <el-table-column prop="brithday" label="出生日期" :width="130" :formatter="formatDate" sortable="true">
				</el-table-column>
        <el-table-column prop="phone" label="电话" sortable="true" :width="130">
				</el-table-column>
        <el-table-column prop="email" label="邮箱" sortable="true">
				</el-table-column>
        <el-table-column prop="department" label="所属部门" :formatter="formatDepartment">
				</el-table-column>
				<el-table-column prop="entry_time" label="入职时间" :width="130" :formatter="formatDate" sortable="true">
          
				</el-table-column>
				
				<el-table-column label="操作" :min-width="100">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
						<el-button size="mini" type="text" @click="resetClick(scope.row)">重置密码</el-button>
            <el-button size="mini" type="text" @click="setRoleClick(scope.row.id)">设置角色</el-button>
					</template>
				</el-table-column>    
      
      </el-table>

      <!--分页-->
      <div class="block">
          <el-pagination @current-change="pageCurrentChange" 
                        :current-page.sync="pagition.currentPage" 
                        :page-size="pagition.pageSize" 
                        layout="total, prev, pager, next" 
                        :total="pagition.total">
          </el-pagination>
      </div>

      <!-- 新增修改弹窗--> 
			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" modal>
				<UserAddEdit  :userId="userId" v-on:cancelHandle="canceled" v-on:saveHandle="saved">
				</UserAddEdit>
			</el-dialog>

      <el-dialog title="重置密码" :visible.sync="passwordDialogVisable" :close-on-click-modal="false" modal>
				<UserResetPassword  :userId="userId" :userName="userName" v-on:cancelHandle="resetPasswordCencled" v-on:saveHandle="resetPasswordSaved">
				</UserResetPassword>
			</el-dialog>

      <el-dialog title="设置权限" :visible.sync="roleDialogVisable" width="600px" :close-on-click-modal="false">
        <UserRoleEdit :roleUserId="roleUserId" v-on:cancelHandle="roleCanceled" v-on:saveHandle="roleSaved">
        </UserRoleEdit>
      </el-dialog>

    </section>
</template>



<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import UserAddEdit from "../system/UserAddEdit";
import UserResetPassword from "../system/UserRestPassword";
import UserRoleEdit from "../system/UserRoleEdit";

Vue.component(UserAddEdit.name, UserAddEdit);
Vue.component(UserResetPassword.name, UserResetPassword);
Vue.component(UserRoleEdit.name, UserRoleEdit);

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
        key_word: "",
        entry_time_start: "",
        entry_time_end: "",
        sex: ""
      },
      pagition: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      sort_column: "",
      order: "",
      users: [],
      selected: [],
      dialogVisable: false,
      passwordDialogVisable: false,
      userId: "",
      userName: "",
      selectedIds: [],
      departments: [],
      departmentIds: [],
      roleUserId: "",
      roleDialogVisable: false
    };
  },
  methods: {
    getDepartments: function() {
      let that = this;
      api
        .getDepartments()
        .then(res => {
          if (res.status) {
            let departments = res.data.departments;
            for (var i = 0, j = departments.length; i < j; i++) {
              if (departments[i].level != 0) continue;
              let item = {
                value: departments[i].id,
                label: departments[i].name
              };
              for (var m = 0, n = departments.length; m < n; m++) {
                if (
                  departments[m].level != 1 ||
                  departments[m].parent_id != departments[i].id
                )
                  continue;
                if (
                  typeof item.children === "undefined" ||
                  item.children.length === 0
                ) {
                  item.children = [];
                }
                item.children.push({
                  value: departments[m].id,
                  label: departments[m].name
                });
              }
              this.departments.push(item);
            }
          }
        })
        .catch(err => {
          debugger;
          console.error(err);

          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getUsers: function() {
      let departmentId = "";
      let that = this;
      if (this.departmentIds.length === 3) {
        departmentId = this.departmentIds[2];
      } else if (this.departmentIds.length === 2) {
        departmentId = this.departmentIds[1];
      } else if (this.departmentIds.length === 1) {
        departmentId = this.departmentIds[0];
      }
      var paras = {
        ...this.filters,
        ...this.pagition,
        sort_column: this.sort_column,
        order: this.order,
        department_id: departmentId
      };
      api
        .getUsers(paras)
        .then(res => {
          if (res && res.status) {
            this.pagition.total = res.total;
            this.users = res.users;
            console.log(res);
          }
        })
        .catch(err => {
          console.error(err);
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    deleteData: function(ids) {
      let that = this;
      let deleteSome = () => {
        api
          .deleteUser(ids)
          .then(res => {
            if (res.status) {
              this.$message({ message: "删除成功", type: "sccuess" });
              this.getUsers();
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

            if (err && err.response && err.response.status === 401) {
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
        .catch(err => console.log("cancel delete user"));
    },
    deleteClick: function(id) {
      this.deleteData(id);
    },

    queryClick: function() {
      this.getUsers();
    },
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "";
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    formatDepartment: function(row, column) {
      let deparemtnName = "";
      if (
        typeof row.department3 !== "undefined" &&
        row.department3 !== null &&
        row.department3.length > 0
      ) {
        deparemtnName += row.department3;
      }
      if (
        typeof row.department2 !== "undefined" &&
        row.department2 !== null &&
        row.department2.length > 0
      ) {
        if (deparemtnName.length > 0) deparemtnName += "/";
        deparemtnName += row.department2;
      }
      if (
        typeof row.department1 !== "undefined" &&
        row.department1 !== null &&
        row.department1.length > 0
      ) {
        if (deparemtnName.length > 0) deparemtnName += "/";
        deparemtnName += row.department1;
      }
      return deparemtnName;
    },
    sortChange: function(column) {
      this.sort_column = column.prop;
      this.order = column.order;
      this.getUsers();
    },
    editClick: function(id) {
      this.dialogVisable = true;
      this.userId = id + "";
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getUsers();
    },
    resetPasswordCencled: function() {
      this.passwordDialogVisable = false;
    },
    resetPasswordSaved: function() {
      this.passwordDialogVisable = false;
    },
    roleSaved:function(){
      this.roleDialogVisable = false;
    },
    roleCanceled:function(){
      this.roleDialogVisable = false;
    },
    addClick: function() {
      this.dialogVisable = true;
      this.userId = "";
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
    },
    pageCurrentChange: function(val) {
      this.pagition.currentPage = val;
    },
    resetClick: function(row) {
      if (typeof row === "undefined") console.error("null of parameter");
      this.userId = row.id + "";
      this.userName = row.user_name;
      this.passwordDialogVisable = true;
    },
    setRoleClick: function(id) {
      this.roleUserId = id + "";
      this.roleDialogVisable = true;
    }
  },
  watch: {
    dialogVisable: function(val) {
      if (!val) {
        this.userId = "";
      }
    },
    passwordDialogVisable: function(val) {
      if (!val) {
        this.userId = "";
        this.userName = "";
      }
    },
    roleDialogVisable:function(val){
      if(!val){
        this.roleUserId = "";
      }
    }
  },
  mounted() {
    this.getDepartments();
    this.getUsers();
  }
};
</script>

<style scoped>
.block {
  text-align: right;
  padding: 10px 10px;
}
/* .el-input{
  width:215px !important;
} */
</style>

