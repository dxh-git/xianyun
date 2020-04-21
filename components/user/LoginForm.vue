<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      // 验证表单
      this.$refs.form.validate((valid)=>{
        // 为true表示没错
        if(valid){
           // 调用actions的方法,.then的参数res是上一个then的返回值决定的
         this.$store.dispatch('user/login',this.form).then(res=>{
          //  弹框
          this.$message.success('登入成功，欢迎回来'+res.user.nickname)
          // 跳转到首页
          this.$router.push('/')
         console.log( this.$store.state.user.userInfo)
         })
        }else{
          // 警告框
          this.$message.warning('请填写内容')
        }
      })
      
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
a {
  text-decoration: none;
}
</style>
