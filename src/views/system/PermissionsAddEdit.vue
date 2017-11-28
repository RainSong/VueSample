<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" :rules="rules" label-width="100px" ref="addEdifForm">
          <el-form-item label="权限名称"  prop="name">
              <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="父级权限"  prop="parent_id">
              <el-select v-model="info.parent_id" clearable>
                  <el-option
                      v-for="item in parentPermissions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="排序"  prop="sort">
              <el-input v-model="info.sort"></el-input>
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
    permissionsId: {
      type: String,
      default: ""
    },
    parentPermissions:{
      type:Array,
      default:[]
    }
  },
  name: "PermissionsAddEdit",
  data: function() {
    return {
      info: {
        name: "",
        parent_id: '',
        sort: 0
      },
      rules: {
        name: [{ required: true, message: "角色名不能为空", trigger: "blur" }],
        sort: [
          {
            required: false,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.info.level === "" && value === "") {
                callback(new Error("角色级别不能为空"));
              }
              let temp = value + "";
              if (isNaN(temp) || temp < 0 || (temp + "").indexOf(".") > 0) {
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
    permissionsId: function(newVal) {
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
        .getPermissionsinfo(this.permissionsId)
        .then(res => {
          if (res.status) {
            this.info.name = res.data.name;
            this.info.parent_id = res.data.parent_id === 0 || res.data.parent_id === "0" ? "" : res.data.parent_id;
            this.info.sort = res.data.sort;
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
        if (typeof this.permissionsId === "undefined" || this.permissionsId.length == 0) {
          pre = api.addPermissions(this.info);
        } else {
          var data = {
            id: this.permissionsId,
            ...this.info
          };
          pre = api.updatePermissions(data);
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
