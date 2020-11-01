<template>
  <el-dialog :title="mode==='add'?'新增学科':'修改学科'" :visible.sync="dialogVisible" width="600px" center>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <!-- 
        prop：两个作用，一个是校验规则，另一个清空表单
     -->
      <el-form-item label="学科编号" prop="rid">
        <el-input v-model="form.rid"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" prop="short_name">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" prop="remark">
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
  data() {
    return {
      add: "",
      dialogVisible: false, // 确定对话框是否可见
      mode: "", // mode是模式 add：新增  edit：修改
      form: {
        rid: "", //id
        name: "", // 学intro科
        short_name: "", //学科简称
        intro: "", // 学科简介
        remark: "", // 备注
      },
      // 角色数组

      // 校验规则
      rules: {
        rid: [{ required: true, message: "学科编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "学科名称不能为空", trigger: "blur" },
        ],
        short_name: [
          { required: true, message: "学科简称不能为空", trigger: "blur" },
        ],
        intro: [
          { required: true, message: "学科简介不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "学科备注不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    console.log(this.mode);
    if (this.mode == "add") {
      console.log(this);
    }
  },
  methods: {
    submit() {
      // 如果你之前有自定义校验，callback必须执行，否则validate中的回调不会执行的啦
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        let url = "";
        let message = "";
        if (this.mode === "add") {
          // 因为新增的时候，id是由后台决定的
          this.add = "新增学科";
          delete this.form.id;
          url = "/subject/add";
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
          this.add = "修改学科";
          url = "/subject/edit";
          const rec = await this.$http.post(url, this.form);
          console.log(rec);
          message = "修改成功";
        }
      });
    },
  },
};
</script>
