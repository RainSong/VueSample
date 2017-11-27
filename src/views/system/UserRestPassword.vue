<template>
    <section>
      <!-- <div>重置密码</div> -->
        <!--编辑界面-->
			<el-form :model="info" :rules="rules" label-width="100px" ref="resetPassword">
          <el-form-item label="用户名"  prop="userName">
              <el-input v-model="this.userName" readonly></el-input>
          </el-form-item>
          <el-form-item label="密码"  prop="password">
              <el-input v-model="info.password" type="password" ></el-input>
          </el-form-item>
          <el-form-item label="确认密码"  prop="repassword">
              <el-input v-model="info.repassword" type="password" ></el-input>
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
  name: "UserResetPassword",
  props: {
    userId: {
      type: String,
      default: ""
    },
    userName: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      info: {
        password: "",
        repassword: ""
      },
      rules: {
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        repassword: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else {
                if (value !== this.info.password) {
                  callback(new Error("两次密码输入不一致"));
                }
              }
              callback();
            }
          }
        ]
      }
    };
  },
  methods: {
    saveData: function() {
      //保存数据
      let save = () => {
        let params = {
          id: this.userId,
          password: this.password
        };
        api
          .resetUserPassword(params)
          .then(res => {
            if (res.status) {
              this.$emit("saveHandle");
            } else {
              let msg = "发生错误，保存失败";
              if (
                typeof res.message !== "undefined" &&
                res.message.length > 0
              ) {
                msg = res.message;
              }
              this.$message({ message: msg, type: "error" });
            }
          })
          .catch(err => {
            console.error(err);

            if (err && err.response && err.response.status === 401) {
              that.$router.push({ path: "/login" });
            }
          });
      };
      //弹出确认对话框
      let confirmSave = () => {
        this.$confirm("确定要重置密码吗？", "提示")
          .then(() => {
            save();
          })
          .catch(() => console.log("canceled change password"));
      };
      // 验证输入
      this.$refs["resetPassword"].validate(valid => {
        if (valid) {
          confirmSave();
        } else {
          this.$message({ message: "数据输入有误,请修改后再保存", type: "warning" });
          return false;
        }
      });
    },
    resetData: function() {
      this.$refs["resetPassword"].resetFields();
      this.info.password = "";
      this.info.repassword = "";
    },
    cancelClick: function() {
      this.resetData();
      this.$emit("cancelHandle");
    },
    saveClick: function() {
      this.saveData();
    }
  },
  watch: {
    userId: function(newVal) {
      if (typeof newVal === "undefined" || newVal.length == 0) {
        this.resetData();
      }
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
