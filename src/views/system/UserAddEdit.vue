<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" :rules="rules" label-width="100px" ref="addEdifForm">
          <el-form-item label="用户名"  prop="user_name">
              <el-input v-model="info.user_name"></el-input>
          </el-form-item>
          <el-form-item v-if="this.userId.length === 0" label="密码"  prop="password">
              <el-input v-model="info.password" type="password" ></el-input>
          </el-form-item>
          <el-form-item v-if="this.userId.length === 0" label="确认密码"  prop="repassword">
              <el-input v-model="info.repassword" type="password" ></el-input>
          </el-form-item>
          <el-form-item label="姓名"  prop="name">
              <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
              <el-radio v-model="info.sex" label="1">男</el-radio>
              <el-radio v-model="info.sex" label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="生日" prop="brithday">
              <el-date-picker type="date" value-format="yyyy-MM-dd"  v-model="info.brithday"></el-date-picker>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
              <el-input v-model="info.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="info.email"></el-input>
          </el-form-item>
          <el-form-item label="所属部门">
              <el-cascader v-model="departmentIds" :options="departments" change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="入职时间" prop="entry_time">
              <el-date-picker type="date"  value-format="yyyy-MM-dd" v-model="info.entry_time"></el-date-picker>
          </el-form-item>
			  </el-form>
			<div slot="footer" style=" text-align:right;padding:20px 0 0 0">
				<el-button v-on:click="cancelClick">取消</el-button>
				<el-button v-on:click="saveClick" type="primary">提交</el-button>
			</div>
    </section>
</template>

<script>
import api from "../../api/index";
export default {
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
  name: "UserAddEdit",
  data: function() {
    return {
      abc: "",
      departments: [],
      departmentIds: [],
      info: {
        user_name: "",
        password: "",
        repassword: "",
        name: "",
        sex: "1",
        brithday: "",
        phone: "",
        email: "",
        entry_time: ""
      },
      rules: {
        user_name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.userId === "" && value === "") {
                callback(new Error("密码不能为空"));
              }
              callback();
            }
          }
        ],
        repassword: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.userId === "") {
                if (value === "") {
                  callback(new Error("请再次输入密码"));
                } else {
                  if (value !== this.info.password) {
                    callback(new Error("两次密码输入不一致"));
                  }
                }
              }
              callback();
            }
          }
        ]
      }
    };
  },
  watch: {
    userId: function(newVal) {
      if (typeof newVal === "undefined" || newVal.length == 0) {
        this.resetData();
      } else {
        this.loadData(newVal);
      }
    }
  },
  methods: {
    getDepartments: function() {
      api.getDepartments().then(res => {
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
      });
    },
    loadData: function() {
      debugger
      api
        .getUserInfo(this.userId)
        .then(res => {
          if (res.status) {
            this.info.user_name = res.data.user_name;
            this.info.name = res.data.name;
            this.info.sex = res.data.sex + "";
            this.info.brithday = res.data.brithday;
            this.info.phone = res.data.phone;
            this.info.email = res.data.email;
            this.info.entry_time = res.data.entry_time;
            this.departmentIds.push(res.data.pid3);
            this.departmentIds.push(res.data.pid2);
            this.departmentIds.push(res.data.pid1);
          }
        })
        .catch(err => console.error(err));
    },
    saveData: function() {
      let save = () => {
        let pre = null;
        if (typeof this.userId === "undefined" || this.userId.length == 0) {
          pre = api.addUser(this.info);
        } else {
          var data = {
            id: this.userId,
            ...this.info,
            department_id: ""
          };
          if (this.departmentIds.length == 3) {
            data.department_id = this.departmentIds[2];
          } else if (this.departmentIds.length == 2) {
            data.department_id = this.departmentIds[1];
          } else if (this.departmentIds.length == 1) {
            data.department_id = this.departmentIds[0];
          }
          pre = api.updateUser(data);
        }
        pre.then(res => {
          if (res.status) {
            this.resetData();
            this.$emit("saveHandle");
          } else {
            let msg = "";
            if (typeof res.message !== "undefined" && res.message.length > 0) {
              this.$message.error(res.message);
            } else {
              this.$message.error("发生错误，数据保存失败");
            }
          }
        });
      };
      this.$refs["addEdifForm"].validate(valid => {
        if (valid) {
          save();
        } else {
          this.$message({ message: "数据输入有误,请修改后再保存", type: "warning" });
          return false;
        }
      });
    },
    resetData: function() {
      this.$refs["addEdifForm"].resetFields();
      this.info.deparemnt_id = [];
      this.departmentIds = [];
    },
    cancelClick: function() {
      this.resetData();
      this.$emit("cancelHandle");
    },
    saveClick: function() {
      this.saveData();
    }
  },
  mounted: function() {
    this.getDepartments();
    if (typeof this.userId === "undefined" || this.userId.length == 0) {
      this.resetData();
    } else {
      this.loadData();
    }
  }
};
</script>

<style scope>
.el-form-item {
  margin-bottom: 20px;
}
</style>
