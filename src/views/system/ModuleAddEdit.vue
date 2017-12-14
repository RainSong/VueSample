<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" :rules="rules" label-width="100px" ref="addEdifForm">
          <el-form-item label="名称"  prop="name">
              <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="路径"  prop="path">
              <el-input v-model="info.path"></el-input>
          </el-form-item>
          <el-form-item label="显示名称"  prop="displayName">
              <el-input v-model="info.displayName"></el-input>
          </el-form-item>
          <el-form-item label="父级模块"  prop="parentId">
              <el-cascader v-model="selectedParentIds" :options="parentModules" change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="是否显示"  prop="visible">
              <el-radio-group v-model="info.visible">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
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
    moduleId: {
      type: String,
      default: ""
    },
    parentModules:{
      type:Array,
      default:[]
    }
  },
  name: "ModuleAddEdit",
  data: function() {
    return {
      selectedParentIds:[],
      info: {
        name: "",
        path: "",
        displayName: "",
        visible: 1,
        parentId: 0,
        sort: 0
      },
      rules: {
        name: [{ required: true, message: "名称能为空", trigger: "blur" }],
        displayName: [{ required: true, message: "显示名不能为空", trigger: "blur" }],
        path: [{ required: true, message: "路径不能为空", trigger: "blur" }],
        sort: [
          {
            required: false,
            trigger: "blur",
            validator: (rule, value, callback) => {
              // if (this.info.level === "" && value === "") {
              //   callback(new Error("角色级别不能为空"));
              // }
              let temp = value + "";
              if (isNaN(temp) || temp < 0 || (temp + "").indexOf(".") > 0) {
                callback(new Error("顺序必须是正整数"));
                return;
              }
              callback();
            }
          }
        ]
      }
    };
  },
  watch: {
    moduleId: function(newVal) {
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
        .getModuleInfo(this.moduleId)
        .then(res => {
          if (res.status) {
            that.info.name = res.moduleInfo.name;
            that.info.path = res.moduleInfo.path;
            that.info.displayName = res.moduleInfo.display_name;
            that.info.parentId = res.moduleInfo.parent_id;
            that.info.sort = res.moduleInfo.sort;
            this.selectedParentIds= [this.info.parentId];
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
      if(this.selectedParentIds.length>0){
        this.info.parentId = this.selectedParentIds[this.selectedParentIds.length - 1];
      }
      let save = () => {
        let pre = null;
        if (
          typeof that.moduleId === "undefined" ||
          that.moduleId.length == 0
        ) {
          pre = api.addModule(that.info);
        } else {
          var data = {
            id: that.moduleId,
            ...that.info
          };
          pre = api.updateModule(data);
        }
        pre
          .then(res => {
            if (res.status) {
              that.resetData();
              that.$emit("saveHandle");
            } else {
              let msg = "";
              if (
                typeof res.message !== "undefined" &&
                res.message.length > 0
              ) {
                that.$message.error(res.message);
              } else {
                that.$message.error("发生错误，数据保存失败");
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
