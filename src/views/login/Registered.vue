<template>
    <div>
        <el-dialog
            title="注册"
            width="30%"
             :visible=Isshow }>
           
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
        </el-dialog>
        

    </div>
</template>
<script>
export default {
    data() {
        return {
            Isshow:true
        }
    },
}
</script>