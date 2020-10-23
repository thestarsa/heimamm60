<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/img/login_icon.png" alt="" />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!--
        el-for的属性
          model: 绑定的模型值，也是将来要提交给后台服务器的值
          rules：校验的规则写在它里面
          ref：获取整个表单dom节点
          label-width：文字宽度
       -->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        class="login-form"
      >
        <!--
          el-form-item的属性
          prop校验规则字段，和rules中要保持一致
        -->
        <el-form-item prop="phone">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item prop="password">
          <!-- show-password设置为密码框 -->
          <el-input
            show-password
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-row>
          <el-col :span="17">
            <el-form-item prop="code">
              <el-input
                prefix-icon="el-icon-key"
                v-model="loginForm.code"
                placeholder="请输入验证码"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6" style="margin-left: 10px">
            <img :src="validation" alt="" class="ji" @click="validation1" />
          </el-col>
        </el-row>
        <el-form-item prop="isChecked">
          <el-checkbox v-model="ischexd" id="el"></el-checkbox>
          <span id="ak"
            >我已阅读并同意
            <el-link
              type="primary"
              :underline="false"
              href="http://itheima.com"
              target="_blank"
              >用户协议</el-link
            >和<el-link
              type="primary"
              :underline="false"
              href="http://itheima.com"
              target="_blank"
              >隐私条款</el-link
            ></span
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login"
            >登 录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="Registered1">注 册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/img/login_bg.png" alt="" />
    </div>
    <registered></registered>
  </div>
</template>

<script>
import Registered from "../login/Registered"
// 按需导入
import { saveToken } from "@/utils/token";
export default {
  components:{
    Registered
  },
  data() {
    return {
      // 需要提交给服务器的登录时候的参数
      loginForm: {
        phone: "18511111111", // 手机号
        password: "12345678", // 密码
        code: "", // 验证码
      },
      ischexd: false,
      validation: process.env.VUE_APP_BASEURL + "captcha?type=login",
      // 规则
      rules: {
        //   validator：()自定义校检规则
        phone: [
          {
            validator: (rule, value, callback) => {
              //  rule 规则
              // value 输入的值
              //callback 确定是否校验OK 没有则返回ERrOR
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }
              let val = /^1[3456789][0-9]{9}$/;
              if (!val.test(value)) {
                return callback(new Error("手机号不合法"));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "验证码格式不对", trigger: "blur" }],
        isChecked: [
          {
            validator: (rule, value, callback) => {
              if (!this.ischexd) {
                return callback(new Error("必须勾选用户协议"));
              }
              callback();
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    console.log(this.$http);
  },
  methods: {
    validation1() {
      let ck = new Date() - 0; //new date后i面加上 -0可以得到当前时间戳
      /*   由于开发版本使用的是本地服务器，尔上线之后使用网络服务器所以为了方面上线
        vue也提供了一个叫全局环境变量  目的是为了解决开发环境和上线环境变量不同的值 */
      this.validation = `${process.env.VUE_APP_BASEURL}captcha?type=login&ck=${ck}`;
    },
    login() {  //登录按钮触发
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; //如果没有返回值不执行下面的代码
        const res = await this.$http.post("login", this.loginForm);
        if (res.code === 200) {
          // 保存token
          saveToken(res.data.token);
          // 提示
          this.$message({
            message: "登录成功~",
            type: "success",
          });
          // 跳转
          this.$router.push("/lyont");
        } else {
          this.$message.error(res.message);
          this.validation1();
        }
      });
    },Registered(){ //注册按钮触发

    }
  },
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 20px;
    }
  }
  #el {
    float: left;
  }
  #ak {
    float: left;
    margin-left: 10px;
  }
  .ji {
    width: 100%;
    height: 40px;
  }
}
</style>
