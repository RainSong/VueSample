<template>
  <section>
      <!-- <el-tree>
      </el-tree> -->
      <div style="position: relative;margin: 50px;">
        <el-row>
          <el-col :span="11">
            <div class="el-transfer-panel">
              <p class="el-transfer-panel__header">
                角色信息
              </p>
            
            
              <div class="el-transfer-panel__body"><!---->
                <el-table :data="roles" :border="true" :highlight-current-row="true" @current-change="tableSelectionChange">
                  <el-table-column label="角色名" prop="name">
                  </el-table-column>
                   <el-table-column label="级别" prop="level">
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
                  权限信息
              </p>
              <div class="el-transfer-panel__body"><!---->
                <el-tree
                ref="permissionsTree"
                node-key="key"
                :data="permissions"
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
      roleId: "",
      roles: [],
      permissions: [],
      permisionsIds: [],
      selectedRow: null
    };
  },
  methods: {
    getPermissions: function() {
      let that = this;
      api
        .getPermissions()
        .then(res => {
          let data = res.permissions;
          this.permissions = data
            .filter(o => o.parent_id === 0)
            .map((value, index, arr) => {
              return {
                key: value.id,
                label: value.name,
                children: data
                  .filter(o => o.parent_id === value.id)
                  .map((value2, index2, arr2) => {
                    return {
                      key: value2.id,
                      label: value2.name
                    };
                  })
              };
            });
        })
        .catch(err => {
          if (err && err.response && res.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getRolePermissions: function() {
      let that = this;
      api
        .getRolePermissionsIds(this.roleId)
        .then(res => {
          this.selectPermisionsIds = res.permissions_ids;
          that.$refs.permissionsTree.setCheckedKeys(this.selectPermisionsIds);
        })
        .catch(err => {
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getRoles: function() {
      let that = this;
      api
        .getRoles()
        .then(res => {
          this.roles = res.roles;
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
      if (typeof this.roleId === "undefined" || this.roleId.length === 0) {
        this.$message({ message: "请选择角色", type: "warning" });
        return;
      }
      if (
        typeof this.permisionsIds === "undefined" ||
        this.permisionsIds.length === 0
      ) {
        this.$message({ message: "请选择权限", type: "warning" });
        return;
      }
      let paras = {
        role_id: this.roleId,
        permissions_ids: this.permisionsIds.join(",")
      };
      let that = this;
      api
        .updateRolePermissions(paras)
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
      this.roleId = val.id;
      this.getRolePermissions();
    },
    treeCheckChange: function(data, checked, indeterminate) {
      let that = this;
      setTimeout(() => {
        that.permisionsIds = that.$refs.permissionsTree.getCheckedKeys();
      }, 1000);
    }
  },
  mounted: function() {
    this.getPermissions();
    this.getRoles();
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