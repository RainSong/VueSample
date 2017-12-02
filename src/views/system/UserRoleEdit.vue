<template>
  <section>
      <el-transfer v-model="selectRoleIds" :button-texts="['取消','选择']" :data="roles"></el-transfer>
      <div slot="footer" style=" text-align:right;padding:20px 0 0 0">
				<el-button v-on:click="cancelClick">取消</el-button>
				<el-button v-on:click="saveClick" type="primary">提交</el-button>
			</div>
  </section>
</template>

<script>
import api from "../../api";
export default {
  name: "UserRoleEdit",
  props: {
    roleUserId: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      roles: [],
      selectRoleIds: []
    };
  },
  watch: {
    roleUserId: function(val) {
      if(typeof val === 'undefined' || val === ''){
        this.selectRoleIds = [];
      }
      else{
        this.getUserRoleIds();
      }
    }
  },
  methods: {
    getRoles: function() {
      let that = this;
      api
        .getRoles()
        .then(res => {
          let data = res.roles;
          for (let i = 0, j = data.length; i < j; i++) {
            this.roles.push({
              key: data[i].id,
              label: data[i].name
            });
          }
        })
        .catch(err => {
          if (err && err.response && res.response.status === 401) {
            that.$router.push("/login");
          }
        });
    },
    getUserRoleIds: function() {
      let that = this;
      api
        .getUserRoleIds(this.roleUserId)
        .then(res => {
          this.selectRoleIds = res.data;
        })
        .catch((err => {
          if(err && err.response && err.response.status === 401){
            that.$router.push('/login');
          }
        }));
    },
    saveData:function(){
      let paras = {
        user_id:this.roleUserId,
        role_ids:this.selectRoleIds.join(",")
      };
      let that = this;
      api.updateUserRoles(paras).then(res=>{
        if(res.status){

          this.$emit("saveHandle");
        }
        else{
          let msg = "发生错误，数据保存失败";
            if(typeof res.message !== 'undefined' && res.message.length >0){
              msg = res.message;
            }
            this.$message({ message:msg, type: "warning" });
        }
      }).catch(err=>{
        if(err){
          if(err.response && err.response.status === 401){
            that.$router.push('/login');
          }
          else{
            let msg = "发生错误，数据保存失败";
            if(typeof err.message !== 'undefined' && err.message.length >0){
              msg = err.message;
            }
            this.$message({ message:msg, type: "warning" });
          }
        }
      })
    },
    saveClick: function() {
      this.saveData();
    },
    cancelClick: function() {
       this.$emit("cancelHandle");
    }
  },
  mounted: function() {
    this.getRoles();
  }
};
</script>

<style scoped>
.el-transfer {
  margin: 0 auto;
  width: 525px;
}
</style>