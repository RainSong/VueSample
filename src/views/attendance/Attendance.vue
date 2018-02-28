<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-row>
                    <el-form-item label="日期" label-width='90px'>
                        <el-date-picker type="date" placeholder="选择日期" v-model="filters.date" style="width: 100%;"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryClick">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addClick">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="deleteSomeClick">删除</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="attendances" @selection-change='selectionChange' @sort-change='sortChange' sortable="custom" stripe border row-class-name="row-height"
            style="margin-top:30px;">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column prop="date" label="日期" sortable="true" :formatter="formatDate">
            </el-table-column>
            <el-table-column prop="total" label="应到人数">
            </el-table-column>
            <el-table-column prop="attendance" label="实到人数">
            </el-table-column>
            <el-table-column prop="leave" label="请假人数">
            </el-table-column>
            <el-table-column prop="other" label="其他">
            </el-table-column>
            <el-table-column prop="user_name" label="上报人">
            </el-table-column>
            <el-table-column prop="created_at" label="上报时间">
            </el-table-column>
            <el-table-column  prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" :min-width="100">
                <template scope="scope">
                    <el-button size="mini" type="text" @click="editClick(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
        <div class="block">
            <el-pagination @current-change="pageCurrentChange" 
            :current-page.sync="pagition.page_index" 
            :page-size="pagition.page_size"
                layout="total, prev, pager, next" :total="pagition.total">
            </el-pagination>
        </div>

        <!-- 新增修改弹窗-->
        <el-dialog title="编辑" :visible.sync="dialogVisable" :close-on-click-modal="false" modal>
            <AttendanceAddEdit :attendanceId="attendanceId" v-on:cancelHandle="canceled" v-on:saveHandle="saved">
            </AttendanceAddEdit>
        </el-dialog>

    </section>
</template>



<script>
    import Vue from "vue";
    import api from "../../api";
    import { dateFormat, dataParse } from "../../common/util";

    import AttendanceAddEdit from "../attendance/AttendanceAddEdit";

    Vue.component(AttendanceAddEdit.name, AttendanceAddEdit);

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
                    date:'',
                },
                pagition: {
                    page_size: 10,
                    page_index: 1,
                    total: 0
                },
                sort_column: "",
                order: "",
                attendances: [],
                selected: [],
                dialogVisable: false,
                attendanceId: "",
                selectedIds: [],
            };
        },
        methods: {
            getAttendances: function () {
                let departmentId = "";
                let that = this;
                let paras = {
                    ...this.filters,
                    ...this.pagition,
                    sort_column: this.sort_column,
                    order: this.order,
                    department_id: departmentId
                };
                api
                    .getAttendances(paras)
                    .then(res => {
                        if (res && res.status) {
                            this.pagition.total = res.total;
                            this.attendances = res.attendances;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        if (err && err.response && err.response.status === 401) {
                            that.$router.push("/login");
                        }
                    });
            },
            deleteData: function (ids) {
                let that = this;
                let deleteSome = () => {
                    api
                        .deleteAttendance(ids)
                        .then(res => {
                            if (res.status) {
                                this.$message({ message: "删除成功", type: "sccuess" });
                                this.getAttendances();
                            } else {
                                if (
                                    typeof res.message !== "undefined" &&
                                    res.message.length > 0
                                ) {
                                    this.$message({ message: res.message, type: "error" });
                                } else {
                                    this.$message({ message: "发生错误，删除失败", type: "error" });
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
                this.$confirm("确定要删除吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        deleteSome();
                    })
                    .catch(err => console.log("cancel delete user"));
            },
            deleteClick: function (id) {
                this.deleteData(id);
            },

            queryClick: function () {
                this.getAttendances();
            },
            formatDate: function (row, column) {
                let date = row[column.property];
                if (date && date.length) {
                    return dateFormat(dataParse(date, "yyyy-MM-dd HH-mm-ss"), "y-M-d");
                }
                return "";
            },
            sortChange: function (column) {
                this.sort_column = column.prop;
                this.order = column.order;
                this.getAttendances();
            },
            editClick: function (id) {
                this.dialogVisable = true;
                this.attendanceId = id + "";
            },
            canceled: function () {
                this.dialogVisable = false;
            },
            saved: function () {
                this.dialogVisable = false;
                this.getAttendances();
            },
            addClick: function () {
                this.dialogVisable = true;
                this.userId = "";
            },
            selectionChange: function (val) {
                this.selectedIds = [];
                let that = this;
                val.forEach(function (item) {
                    that.selectedIds.push(item.id);
                });
            },
            deleteSomeClick: function () {
                if (this.selectedIds.length === 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: "warning"
                    });
                    return;
                }
                let ids = this.selectedIds.join(",");
                this.deleteData(ids);
            },
            pageCurrentChange: function (val) {
                this.pagition.currentPage = val;
            },
            resetClick: function (row) {
                if (typeof row === "undefined") console.error("null of parameter");
                this.userId = row.id + "";
                this.userName = row.user_name;
                this.passwordDialogVisable = true;
            },
        },
        watch: {
            dialogVisable: function (val) {
                if (!val) {
                    this.attendanceId = "";
                }
            },
            passwordDialogVisable: function (val) {
                if (!val) {
                    this.userId = "";
                    this.userName = "";
                }
            },
            roleDialogVisable: function (val) {
                if (!val) {
                    this.roleUserId = "";
                }
            }
        },
        mounted() {
            // this.getDepartments();
            this.getAttendances();
        }
    };
</script>

<style scoped>
    .block {
        text-align: right;
        padding: 10px 10px;
    }

    /* .el-input{
      width:215px !important;
    } */
</style>