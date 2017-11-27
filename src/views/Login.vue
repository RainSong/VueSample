<template>
    <section>
        <div style="margin: 180px auto 0 auto; width:420px;">
            <el-alert v-if="!loginReuslt.success" :title="loginReuslt.title" type="error" :description="loginReuslt.message" show-icon :closable="false" class="msg" style="width:420px">
            </el-alert>
        </div>
        <el-form :model="info" :rules="rules" ref="loginForm" class="login-container">
            <el-form-item label="用户名" prop="user_name">
                <el-input v-model="info.user_name" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="info.password" type="password" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="info.remember">保存用户名</el-checkbox>
            </el-form-item>
            <el-form-item style="text-align:right;margin-top:-25px;">
                <el-button @click="resetClick">重置</el-button>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import api from "../api";

export default {
  data: function() {
    return {
      loginReuslt: {
        success: true,
        title: "",
        message: ""
      },
      info: {
        remember: true,
        user_name: "",
        password: ""
      },
      rules: {
        user_name: [
          {
            required: false,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("用户名不能为空"));
              }
              callback();
            }
          }
        ],
        password: [
          {
            required: false,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("密码不能为空"));
              }
              callback();
            }
          }
        ]
      }
    };
  },
  methods: {
    resetData: function() {
      this.$refs["loginForm"].resetFields();
    },
    resetClick: function() {
      resetData();
    },
    login: function(arg1,arg2) {
      debugger
      api
        .login({
          user_name: this.info.user_name,
          password: this.info.password
        })
        .then(res => {
          if (res.status) {
            if (this.info.remember) {
              localStorage.setItem("uid", this.info.user_name);
            } else {
              localStorage.removeItem("uid");
            }
            localStorage.setItem("token", res.token);
            this.$router.go(-1);
          } else {
            this.loginReuslt.success = false;
            this.loginReuslt.title = res.title;
            this.loginReuslt.message = res.message;
          }
        })
        .catch(err => {
          debugger;
          this.loginReuslt.success = false;
          this.loginReuslt.title = "登录失败";
          this.loginReuslt.message = "发生错误登录失败，请稍后再试";
          console.error(err);
        });
    }
  },
  mounted: function() {
    let uid = localStorage.getItem("uid");
    if (typeof uid !== "undefined" && uid.length > 0) {
      this.info.user_name = uid;
    }
  }
};
</script>

<style scoped>
.msg {
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-container {
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 20px auto auto auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.el-form-item .is-required .el-form-item__label:before {
  display: none;
}
</style>
