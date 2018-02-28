<template>
  <section>
    <!--编辑界面-->
    <el-form :model="info" :rules="rules" label-width="100px" ref="addEdifForm">
      <el-form-item label="日期" prop="date">
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="info.date" style="width:260px">
        </el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="应到人数" prop="total">
            <el-input-number v-model="info.total" controls-position="right" :min="0" style="width:260px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实到人数" prop="attendance">
            <el-input-number v-model="info.attendance" controls-position="right" :min="0" style="width:260px"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="请假人数" prop="leave">
            <el-input-number v-model="info.leave" controls-position="right" :min="0" style="width:260px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他人数" prop="other">
            <el-input-number v-model="info.other" controls-position="right" :min="0" style="width:260px"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="3" v-model="info.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style=" text-align:right;padding:20px 0 0 0">
      <el-button v-on:click="cancelClick">取消</el-button>
      <el-button v-on:click="saveClick" type="primary">提交</el-button>
    </div>
  </section>
</template>

<script>
  import api from "../../api";
  export default {
    props: {
      attendanceId: {
        type: String,
        default: ""
      }
    },
    name: "AttendanceAddEdit",
    data: function () {
      return {
        info: {
          date: "",
          total: 0,
          attendance: 0,
          leave: 0,
          other: 0,
          remark:''
        },
        rules: {
          date: [{ required: true, message: "日期不能为空", trigger: "blur" }],
          total: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == 0) {
                callback(new Error("应到人数不能为空"));
              }
              callback();
            }
          }],
          attendance: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == 0) {
                callback(new Error("实到人数不能为空"));
              }
              callback();
            }
          }]
        }
      };
    },
    watch: {
      attendanceId: function (newVal) {
        if (typeof newVal === "undefined" || newVal.length == 0) {
          this.resetData();
        } else {
          this.loadData(newVal);
        }
      }
    },
    methods: {
      loadData: function () {
        let that = this;
        api
          .getAttendanceInfo(this.attendanceId)
          .then(res => {
            if (res.status) {
              this.info = {
                ...res.data
              };
            }
          })
          .catch(err => {
            if (err && err.response && err.response.status === 401) {
              that.$router.push({ path: "/login" });
            }
          });
      },
      saveData: function () {
        let that = this;
        let save = () => {
          let action = null;
          if(this.attendanceId === '' || typeof this.attendanceId === 'undefined'){
            let data = {
              report_user_id:localStorage.getItem('uid'),
              ...this.info
            }
            action = api.addAttendance(data);
          }
          else {
            let data = {
              id:this.attendanceId,
              report_user_id:localStorage.getItem('uid'),
              ...this.info
            }
            action = api.updateAttendance(data);
          }
          action.then(res=>{
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
          .catch(err=>{
            if (err && err.response && err.response.status === 401) {
              that.$router.push({ path: "/login" });
            }
          });
        };
        this.$refs["addEdifForm"].validate(valid => {
          console.info(valid)
          if (valid) {
            save();
          } else {
            this.$message({ message: "数据输入有误,请修改后再保存", type: "warning" });
            return false;
          }
        });
      },
      resetData: function () {
        this.$refs["addEdifForm"].resetFields();
        this.info.deparemnt_id = [];
        this.departmentIds = [];
      },
      cancelClick: function () {
        this.resetData();
        this.$emit("cancelHandle");
      },
      saveClick: function () {
        this.saveData();
      }
    },
    mounted: function () {
      if (typeof this.attendanceId === "undefined" || this.attendanceId.length == 0) {
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