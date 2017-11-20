<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" label-width="100px" ref="info">
				<el-form-item label="部门名称"  prop="name">
					<el-input v-model="info.name"></el-input>
				</el-form-item>
				<el-form-item label="父级部门">
          <el-cascader v-model="info.parent_ids" :options="departments" change-on-select clearable></el-cascader>
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
    departmentId: {
      type: String,
      default: ""
    }
  },
  name: "DepartmentAddEdit",
  data: function() {
    return {
      departments: [],
      info: {
        id: 0,
        name: "",
        parent_ids: []
      }
    };
  },
  watch: {
    departmentId: function(newVal) {
      if (typeof newVal === "undefined" || newVal.length == 0) {
        this.resetData();
      } else {
        this.loadData(newVal);
      }
    }
  },
  methods: {
    getDepartments: function() {
      api.getDepartments({ levels: "0,1" }).then(res => {
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
      api
        .getDepartmentInfo(this.departmentId)
        .then(res => {
          if (res.status) {
            this.info = res.data;
          }
        })
        .catch(err => console.error(err));
    },
    saveData: function() {
      let pre = null;
      if (
        typeof this.departmentId === "undefined" ||
        this.departmentId.length == 0
      ) {
        pre = api.addDepartment(this.info);
      } else {
        var data = {
          id: this.departmentId,
          name: this.info.name,
          parent_id: 0
        };
        if(this.info.parent_ids.length == 2){
          data.parent_id = this.info.parent_ids[1];
        }
        else if(this.info.parent_ids.length == 1){
          data.parent_id = this.info.parent_ids[0];
        }
        pre = api.updateDepartment(data);
      }
      pre.then(res => {
        if (res.status) {
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
    },
    resetData: function() {
      this.info.id = 0;
      this.info.name = "";
      this.info.parent_ids = [];
    },
    cancelClick: function() {
      this.$emit("saveHandle");
    },
    saveClick: function() {
      this.saveData();
    }
  },
  mounted: function() {
    this.getDepartments();
    if (
      typeof this.departmentId === "undefined" ||
      this.departmentId.length == 0
    ) {
      this.resetData();
    } else {
      this.loadData(this.interviewId);
    }
  }
};
</script>

<style scope>

</style>
