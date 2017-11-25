<template>
    <section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.key_word" placeholder="姓名/手机/身份证号码"></el-input>
					</el-form-item>
									<el-form-item>
											<el-date-picker v-model="filters.date   " align="right" type="date" placeholder="选择面试时间">
											</el-date-picker>
									</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="queryClick">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addClick">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="interviews" stripe border row-class-name="row-height" style="margin-top:30px;">
				<el-table-column type="selection" align="center" width="55">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="120">
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex">
				</el-table-column>
				<el-table-column prop="id_card" label="身份号码" width="180">
				</el-table-column>
				<el-table-column prop="mobile" label="手机" width="130">
				</el-table-column>
				<el-table-column prop="brithday" label="生日" width="120" :formatter="formatDate">
				</el-table-column>
				<el-table-column prop="interview_time" label="面试时间" width="120" :formatter="formatDate">
				</el-table-column>
				<el-table-column prop="entry_time" label="拟入职时间" width="120" :formatter="formatDate">
				</el-table-column>
				<el-table-column prop="address" label="地址" min-width="120">
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" >
				<InterviewAddEdit  :interviewId="interviewId" v-on:cancelHandle="canceled" v-on:saveHandle="saved">

				</InterviewAddEdit>
			</el-dialog>

    </section>
</template>



<script>
import Vue from "vue";
import api from "../../api";
import { dateFormat, dataParse } from "../../common/util";

import InterviewAddEidt from "../employee/InterviewAddEdit";

Vue.component(InterviewAddEidt.name, InterviewAddEidt);

export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      filters: {
        key_word: "",
        date: ""
      },
      total: 0,
      interviews: [],
      selected: [],
      interviewInfo: {},
      dialogVisable: false,
      interviewId: ""
    };
  },
  methods: {
    getInterviews: function() {
      var paras = {
        key_word: this.filters.key_word,
        date: this.filters.date
      };
      let that = this;
      api
        .getInterviews(paras)
        .then(res => {
          console.log(res);
          if (res && res.status) {
            this.total = res.data.total;
            this.interviews = res.data.interviews;
            console.log(res.data);
          }
        })
        .catch(err => {
          console.error(err);
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    deleteClick: function(id) {
      let that = this;
      api
        .deleteInterview(id)
        .then(res => {
          if (res.status) {
            this.$message({ message: "删除成功", type: "sccuess" });
            this.getInterviews();
          } else {
            this.$message({ message: "发生错误，删除成功", type: "error" });
          }
        })
        .catch(err => {
          console.error(err);
          if (err && err.response && err.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    queryClick: function() {
      this.getInterviews();
    },
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    formatDate: function(row, column) {
      let date = row[column.property];
      if (date && date.length) {
        return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
      }
      return "";
    },
    editClick: function(id) {
      this.dialogVisable = true;
      this.interviewId = id + "";
    },
    canceled: function() {
      this.dialogVisable = false;
    },
    saved: function() {
      this.dialogVisable = false;
      this.getInterviews();
    },
    addClick: function() {
      this.dialogVisable = true;
    }
  },
  watch: {
    dialogVisable: function(val) {
      if (!val) {
        this.interviewId = "";
      }
    }
  },
  mounted() {
    this.getInterviews();
  }
};
</script>

<style scope>

</style>