<template>
    <section>
        <!--编辑界面-->
			<el-form :model="info" label-width="100px" ref="info">
				<el-form-item label="姓名"  prop="name">
					<el-input v-model="info.name"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="info.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
                <el-form-item label="身份证号码">
                    <el-input v-model="info.id_card"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="info.mobile"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="info.brithday"></el-date-picker>
                </el-form-item>
                <el-form-item label="面试时间">
                    <el-date-picker type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="info.brithday"></el-date-picker>
                </el-form-item>
                <el-form-item label="拟入职时间">
                    <el-date-picker type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="info.entry_time"></el-date-picker>
                </el-form-item>
				<el-form-item label="住址">
					<el-input v-model="info.address"></el-input>
				</el-form-item>
                <el-form-item label="备注">
					<el-input type="textarea" :rows="3" v-model="info.addr"></el-input>
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
  name: "InterviewAddEdit",
  props: {
    interviewId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      info: {
        name: "",
        sex: 1,
        id_card: "",
        mobile: "",
        brithday: "",
        entry_time: "",
        address: "",
        remark: ""
      }
    };
  },
  methods: {
    loadData: function(id) {
      api
        .getInterviewInfo(id)
        .then(res => {
          if (res.status) {
            this.info = res.message;
          } else {
            this.$message({ message: "发生错误，加载数据失败", type: "error" });
          }
        })
        .catch(err => console.error(err));
    },
    saveData: function() {
      let pre = null;
      if (
        typeof this.interviewId !== "undefined" &&
        this.interviewId.length > 0
      ) {
        pre = api.updateInterview(this.info);
      } else {
        pre = api.addInterview(this.info);
      }
      pre
        .then(res => {
          if (res.status) {
            debugger;
            this.resetData();
            this.$message({ message: "保存成功", type: "success" });
            this.$emit("saveHandle");
          } else {
            debugger;
            this.$message({ message: "发生错误，保存失败", type: "error" });
            console.error(res);
          }
        })
        .catch(res => console.error(res));
    },
    resetData: function() {
      this.info.sex = 1;
      this.info.name = "";
      this.info.id_card = "";
      this.info.mobile = "";
      this.info.brithday = "";
      this.info.entry_time = "";
      this.info.address = "";
      this.info.remark = "";
    },
    cancelClick: function() {
      this.$emit("cancelHandle");
    },
    saveClick: function() {
      this.saveData();
    }
  },
  watch: {
    interviewId: function(newVal) {
      if (typeof newVal === "undefined" || newVal.length == 0) {
        this.resetData();
      } else {
        this.loadData(newVal);
      }
    }
  },
  mounted: function() {
    if (
      typeof this.interviewId === "undefined" ||
      this.interviewId.length == 0
    ) {
      this.resetData();
    } else {
      this.loadData(this.interviewId);
    }
  }
};
</script>

