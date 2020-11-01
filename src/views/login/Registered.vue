<template>
  <div>
    <el-dialog title="注册" :visible.sync="Isshow" width="600px" center>
      <!-- 上传头像部分 -->

      <!-- 中间内容部分 -->
      <el-form
        :model="SubmitForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :data="uploadobj"
            :action="getaction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="SubmitForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="SubmitForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="SubmitForm.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="SubmitForm.password" />
        </el-form-item>
        <el-row>
          <el-col :span="18">
            <el-form-item label="图形码" prop="imgcode">
              <el-input v-model="SubmitForm.imgcode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <img
              :src="getimg"
              alt=""
              style="width: 130px; height: 40px"
              @click="Once"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="验证码" prop="rcode">
              <el-input v-model="SubmitForm.rcode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="default" @click="getVerification">
              获取验证码
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="Isshow = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uploadobj: {
        image: "",
      },
      getaction: process.env.VUE_APP_BASEURL + "uploads", //上传头像的地址
      imageUrl: "", //保存头像的地址
      getimg: process.env.VUE_APP_BASEURL + "captcha?type=sendsms",
      Isshow: false,
      SubmitForm: {
        username: "", //昵称3
        phone: "", //手机号
        email: "", //邮箱
        avatar: "", //头像
        password: "", //密码
        rcode: "", //验证码
        imgcode: "", //图像码
      },
      rules: {
        phone: [
          {
            required: true,
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
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              //  rule 规则
              // value 输入的值
              //callback 确定是否校验OK 没有则返回ERrOR
              if (!value) {
                return callback(new Error("邮箱不能为空"));
              }
              let val = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
              if (!val.test(value)) {
                return callback(new Error("邮箱号不合法"));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        username: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
        imgcode: [
          { required: true, message: "图形码不能为空", trigger: "blur" },
        ],
        rcode: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    dialogVisible() {
      //确定注册按钮
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        delete this.SubmitForm.imgcode;
        const res = await this.$http.post("register", this.SubmitForm);
        if (res.code === 200) {
          this.$message({
            message: "注册成功",
            type: "success",
          });
          // 跳转
          this.Isshow = false;
          this.imageUrl = "";
        } else {
          this.$message.error(res.message);
          this.getVerification();
        }
      });

      this.Isshow = false; //隐藏对话框
    },
    Once() {
      this.getimg = `${process.env.VUE_APP_BASEURL}captcha?type=sendsms&ck=${
        new Date() - 0
      }`;
    },
    async getVerification() {
      const res = await this.$http.post("/sendsms", {
        code: this.SubmitForm.imgcode,
        phone: this.SubmitForm.phone,
      });
      this.SubmitForm.rcode = res.data.captcha;
    },
    beforeAvatarUpload(file) {
      //图片上传之前函数
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      this.uploadobj.image = file; //把文件赋值给上传数据中的image否则会报错
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.SubmitForm.avatar = res.data.file_path; //给要提交的 模型赋值
        console.log(file);
        //    把上传的图片地址赋值给图片的SRc
        this.imageUrl = process.env.VUE_APP_BASEURL + res.data.file_path;
      }
    },
  },
};
</script>
<style >
.al {
  text-align: center;
  line-height: 40px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader {
  text-align: center;
  margin-bottom: 10px;
}
</style>