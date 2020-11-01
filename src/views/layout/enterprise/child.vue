<template>
  <el-dialog :title="mode==='add'?'新增企业':'修改企业'" :visible.sync="dialogVisible" width="600px" center>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
    <!-- mode=='add'?'新增企业':'修改企业' -->
      <!-- 
        prop：两个作用，一个是校验规则，另一个清空表单
     -->
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model="form.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short_name">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "child",
  data() {
    return {
      
      dialogVisible: false, // 确定对话框是否可见
      mode: "", // mode是模式 add：新增  edit：修改
      form: {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: "",
      },

      // 校验规则
      rules: {
        eid: [{ required: true, message: "企业编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        short_name: [
          { required: true, message: "企业简称不能为空", trigger: "blur" },
        ],
        intro: [
          { required: true, message: "企业简介名不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "企业备注不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {    
   
  },
  methods: {
    submit() {   
      // 如果你之前有自定义校验，callback必须执行，否则validate中的回调不会执行的啦
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        console.log(this.mode);
        let url = "";
        let message = "";
        if (this.mode === "add") {
          // 因为新增的时候，id是由后台决定的

          url = "/user/add";
          message = "新增成功~";
          const res = await this.$http.post(url, this.form);
          if (res.code === 200) {
            // 提示
            this.$message({
              type: "success",
              message,
            });

            // 清空表单，方便下一个新增
            // 注意：每个el-form-item 都要设置prop 才会起作用
            this.$refs.form.resetFields();

            // 关闭Dialog
            this.dialogVisible = false;

            // 调用父组件中的search
            this.$parent.search();
          } else {
            this.$message.error(res.message);
          }
        } else {
          url = "/user/edit";
          const rec = await this.$http.post(url, this.form);
          console.log(rec);
          message = "修改成功";
          
          return;
        }
      });
    },
   
  },
};
</script>
