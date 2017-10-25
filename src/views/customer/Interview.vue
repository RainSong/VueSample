<template>
    <div>
        <section>
           <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type="primary" @click="getUsers">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item> -->
                </el-form>
            </el-col>
        </section>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                filters:{
                    name: '',
                    data: ''
                }
            }
        }

    }
</script>

<style>

</style>