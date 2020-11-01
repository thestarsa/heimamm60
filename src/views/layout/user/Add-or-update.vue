<template>
  <el-dialog
    :title="mode === 'add' ? '新增用户' : '修改用户'"
    :visible.sync="dialogVisible"
    width="600px"
    center
  >
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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="form.role_id" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="remark">
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
  name: "user",
  data() {
    return {
      add: "",
      dialogVisible: false, // 确定对话框是否可见
      mode: "", // mode是模式 add：新增  edit：修改
      form: {
        id: "", //id
        username: "", // 用户名
        email: "", // 邮箱
        phone: "", // 手机
        role_id: "", // 角色
        status: "1", // 状态 0 代表禁用  1 代表启用
        remark: "", // 备注
      },
      // 角色数组
      roles: [
        {
          label: "超级管理员",
          value: 1,
        },
        {
          label: "管理员",
          value: 2,
        },
        {
          label: "老师",
          value: 3,
        },
        {
          label: "学生",
          value: 4,
        },
      ],
      // 状态数组
      statuses: [
        {
          label: "禁用",
          value: 0,
        },
        {
          label: "启用",
          value: 1,
        },
      ],
      // 校验规则
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: {
          required: true,
          validator: (rule, value, callback) => {
            /**
             * rule：规则
             * value：用户输入的值
             * callback：决定是否校验ok，如果里面没有接 new Error('xxxx')，callback必须调用
             */
            if (!value) {
              // return 阻止代码继续往下执行
              return callback(new Error("邮箱不能为空!"));
            }

            // eslint禁用
            /* eslint-disable */
            const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            // eslint启用
            /* eslint-enable */
            if (!reg.test(value)) {
              // return 阻止代码继续往下执行
              return callback(new Error("邮箱不合法!"));
            }

            // 校验ok
            callback();
          },
          trigger: "blur",
        },
        phone: {
          required: true, // 加了这个前面就会有红星星
          validator: (rule, value, callback) => {
            /**
             * rule：规则
             * value：用户输入的值
             * callback：决定是否校验ok，如果里面没有接 new Error('xxxx')，callback必须调用
             */
            if (!value) {
              // return 阻止代码继续往下执行
              return callback(new Error("手机号不能为空!"));
            }

            const reg = /^1[3456789][0-9]{9}$/;
            if (!reg.test(value)) {
              // return 阻止代码继续往下执行
              return callback(new Error("手机号不合法!"));
            }

            // 校验ok
            callback();
          },
          trigger: "blur",
        },
        role_id: [
          { required: true, message: "角色不能为空", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getAg();
  },
  methods: {
    submit () {
      // 如果你之前有自定义校验，callback必须执行，否则validate中的回调不会执行的啦
      this.$refs.form.validate(async valid => {
        if (!valid) return

        let url = ''
        let message = ''
        if (this.mode === 'add') {
          // 因为新增的时候，id是由后台决定的
          delete this.form.id
          url = '/user/add'
          message = '新增成功~'
        } else if (this.mode === 'edit') {
          url = '/user/edit'
          message = '修改成功~'
        }

        const res = await this.$http.post(url, this.form)
        if (res.code === 200) {
          // 提示
          this.$message({
            type: 'success',
            message
          })

          // 清空表单，方便下一个新增
          // 注意：每个el-form-item 都要设置prop 才会起作用
          this.$refs.form.resetFields()

          // 关闭Dialog
          this.dialogVisible = false

          // 调用父组件中的search
          this.$parent.search()
        } else {
          this.$message.error(res.message)
        }
      })
    }

   
  },
};
</script>
