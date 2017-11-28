<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" :rules="rules" label-width="100px" ref="addEdifForm">
          <el-form-item label="角色名"  prop="name">
              <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="级别"  prop="level">
              <el-input v-model="info.level"></el-input>
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
    roleId: {
      type: String,
      default: ""
    }
  },
  name: "RoleAddEdit",
  data: function() {
    return {
      info: {
        name: "",
        level: 0
      },
      rules: {
        name: [{ required: true, message: "角色名不能为空", trigger: "blur" }],
        level: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.info.level === "" && value === "") {
                callback(new Error("角色级别不能为空"));
              }
              let temp = value + '';
              if(isNaN(temp) || temp < 0 || (temp+'').indexOf('.') > 0 ){
                callback(new Error("角色级别必须是正整数"));
              }
              callback();
            }
          }
        ]
      }
    };
  },
  watch: {
    roleId: function(newVal) {
      if (typeof newVal === "undefined" || newVal.length == 0) {
        this.resetData();
      } else {
        this.loadData(newVal);
      }
    }
  },
  methods: {
    loadData: function() {
      let that = this;
      api
        .getRoleInfo(this.roleId)
        .then(res => {
          if (res.status) {
            this.info.name = res.data.name;
            this.info.level = res.data.level;
          }
        })
        .catch(err => {
          console.error(err);
          if (err && err.response && err.response.status === 401) {
            that.$router.push({ path: "/login" });
          }
        });
    },
    saveData: function() {
      let that = this;
      let save = () => {
        let pre = null;
        if (typeof this.roleId === "undefined" || this.roleId.length == 0) {
          pre = api.addRole(this.info);
        } else {
          var data = {
            id: this.roleId,
            ...this.info
          };
          pre = api.updateRole(data);
        }
        pre
          .then(res => {
            if (res.status) {
              this.resetData();
              this.$emit("saveHandle");
            } else {
              let msg = "";
              if (
                typeof res.message !== "undefined" &&
                res.message.length > 0
              ) {
                this.$message.error(res.message);
              } else {
                this.$message.error("发生错误，数据保存失败");
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
    if (typeof this.roleId === "undefined" || this.roleId.length == 0) {
      this.resetData();
    } else {
      this.loadData();
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
