<template>
  <section>
      <!-- <el-tree>
      </el-tree> -->
      <div style="position: relative;margin: 50px;">
        <el-row>
          <el-col :span="11">
            <div class="el-transfer-panel">
              <p class="el-transfer-panel__header">
                权限信息
              </p>
            
            
              <div class="el-transfer-panel__body"><!---->
                <el-table :data="permissions" :border="true" :highlight-current-row="true" @current-change="tableSelectionChange">
                  <el-table-column label="权限名" prop="name">
                  </el-table-column>
                  <el-table-column label="父级权限" prop="parent_name">
                  </el-table-column>
                   <el-table-column label="排序" prop="sort">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col :span="2">
            <div>&nbsp;</div>
          </el-col>
          <el-col :span="11">
            <div class="el-transfer-panel">
              <p class="el-transfer-panel__header">
                  模块信息
              </p>
              <div class="el-transfer-panel__body"><!---->
                <el-tree
                ref="modulesTree"
                node-key="key"
                :data="modules"
                :show-checkbox="true"
                :default-expand-all="true"
                @check-change="treeCheckChange"
                style="margin:10px 10px 0 10px">
                </el-tree>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" style=" text-align:right;padding:20px 100px 0 0">
				<el-button type="primary" @click="saveData">提交</el-button>
			</div>
  </section>
</template>

<script>
import api from "../../api";

export default {
  name: "RolePermissionsEdit",
  data: function() {
    return {
      permissionsId: "",
      permissions: [],
      modules: [],
      moduleIds: [],
      selectedRow: null
    };
  },
  methods: {
    getPermissions: function() {
      let that = this;
      api
        .getPermissions()
        .then(res => {
          this.permissions = res.permissions;
        })
        .catch(err => {
          if (err && err.response && res.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getPermissionsModules: function() {
      let that = this;
      api
        .getPermissionsModuleIds(this.permissionsId)
        .then(res => {
          this.moduleIds = res.moduleIds;
          that.$refs.modulesTree.setCheckedKeys(this.moduleIds);
        })
        .catch(err => {
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getModules: function() {
      let that = this;
      api
        .getModules()
        .then(res => {
          that.modules = res.modules
            .filter(o => o.parent_id === 0)
            .map((value, index, arr) => {
              return {
                key: value.id,
                label: value.display_name,
                children: res.modules
                  .filter(o => o.parent_id === value.id)
                  .map((value2, index2, arr2) => {
                    return {
                      key: value2.id,
                      label: value2.display_name
                    };
                  })
              };
            });
        })
        .catch(err => {
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          } else {
            console.log(err);
          }
        });
    },
    saveData: function() {
      if (typeof this.permissionsId === "undefined" || this.permissionsId.length === 0) {
        this.$message({ message: "请选择权限", type: "warning" });
        return;
      }
      if (
        typeof this.moduleIds === "undefined" ||
        this.moduleIds.length === 0
      ) {
        this.$message({ message: "请选择模块", type: "warning" });
        return;
      }
      let paras = {
        permissions_id: this.permissionsId,
        module_ids: this.moduleIds.join(",")
      };
      let that = this;
      api
        .updatePermissionModules(paras)
        .then(res => {
          if (res.status) {
            this.$message({ message: "保存成功", type: "warning" });
          } else {
            let msg = "发生错误，数据保存失败";
            if (typeof res.message !== "undefined" && res.message.length > 0) {
              msg = res.message;
            }
            this.$message({ message: msg, type: "warning" });
          }
        })
        .catch(err => {
          if (err) {
            if (err.response && err.response.status === 401) {
              that.$router.push("/login");
            } else {
              let msg = "发生错误，数据保存失败";
              if (
                typeof err.message !== "undefined" &&
                err.message.length > 0
              ) {
                msg = err.message;
              }
              this.$message({ message: msg, type: "warning" });
            }
          }
        });
    },
    tableSelectionChange: function(val) {
      this.selectedRow = val;
      this.permissionsId = val.id;
      this.getPermissionsModules();
    },
    treeCheckChange: function(data, checked, indeterminate) {
      let that = this;
      setTimeout(() => {
        that.moduleIds = that.$refs.modulesTree.getCheckedKeys();
      }, 1000);
    }
  },
  mounted: function() {
    this.getPermissions();
    this.getModules();
  }
};
</script>

<style scoped>
.el-transfer {
  margin: 0 auto;
  width: 525px;
}
.el-transfer-panel {
  width: 100%;
}
.el-transfer-panel__body {
  min-height: 500px;
  border-left: 0;
}
.el-table_1_column_2 {
  border-right: 0;
}
</style>