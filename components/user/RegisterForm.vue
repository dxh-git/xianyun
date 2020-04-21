<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    // 确认密码输入框失去焦点时候触发的验证函数
    // rule：表示当前的规则，这个不需要使用
    // value：是输入框的值
    // callback是必须要调用，可以传入Error对象，实现报错。（new Error是javascript原生的方法）
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        // 正常通过
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        password: "",
        checkPassword: "",
        nickname: "",
        captcha: "" //手机验证
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPassword: [
          // 调用验证密码的函数
          { validator: validatePassword, trigger: "blur" }
        ],
        nickname: [{ required: true, message: "请输入名字", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入名字", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
        // 判断手机号是否为空
      if (this.form.username === "") {
        // 主动的触发表单某个属性字段的校验，并且会主动发生错误提示
        this.$refs.form.validateField("username");
        return;
      }
    //   判断手机号是否是11位
      if (this.form.username.length !== 11) {
        //弹框警告
        this.$message.warning('手机格式错误')
        return;
      }
      this.$axios({
        url: "/captchas",
        method: "post",
        data: {
          tel: this.form.username
        }
      }).then(res => {
        const {code} = res.data
        // 弹出确认框
       this.$message.success('手机验证码为：'+code)
      });
    },

    // 注册
    handleRegSubmit() {
      console.log(this.form);
    //   表单验证
      this.$refs.form.validate((valid) => {
          if (valid) {
            //   去掉form里的checkPassword字段  得到的data就是没有checkPassword的数据
            const {checkPassword,...data} = this.form
            this.$axios({
                url:'/accounts/register',
                method:'post',
                data
            }).then(res=>{
                const {data} = res
            // 通过store.commit调用mutations的方法
            this.$store.commit('user/setUserInfo',data)
            // 由于是在同一个模块下，可以省略前面的user名字
                this.$router.push('/')
            })
          } else {
            // 弹框提示
           this.$message.error('请输入内容')
          }
        });
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
</style>