<template>
  <div>
    <!-- 搜索区域 -->
    <el-card>
      <!-- inline 横线排列 -->
      <el-form :model="form" ref="form" label-width="68px" size="normal" inline>
        <!--
          之前的prop 有验证规则的作用
          今天的prop 还有清除表单内容的功能
         -->
        <el-form-item label="学科编号" prop="username">
          <el-input v-model="form.username" style="width: 75px"></el-input>
        </el-form-item>
        <el-form-item label="学科姓名" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请输入">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="search"
            style="width: 60px"
            size="default"
            >搜索</el-button
          >
          <el-button @click="clear" style="width: 60px" size="default"
            >清除</el-button
          >
          <el-button
            @click="add"
            type="primary"
            style="width: 80px; text-align: center"
            >+新增学科</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 & 分页 -->
    <el-card style="margin-top: 20px">
      <el-table :data="list">
        <!-- type 索引，是从1开始的 -->
        <el-table-column label="序号" type="index"></el-table-column>
        <!-- prop 找到数组中对应那一行的值 -->
        <el-table-column label="学科编号" prop="rid"></el-table-column>
        <el-table-column label="学科名称" prop="name"></el-table-column>

        <el-table-column label="简称" prop="short_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" prop="update_time" style="width: 180px;"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽要写在el-table-column 标签里面 score.row 每一行的数据，其实就是数组中每一个对象
            slot-scope 是固定写法
           -->
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.status === 0 ? 'red' : '#606266' }"
              >{{ scope.row.status === 0 ? "禁用" : "启用" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button @click="editor(scope.row)">编辑</el-button>
            <!-- 处理逻辑，跟状态刚好相反 -->
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status === 0 ? 'success' : 'info'"
              >{{ scope.row.status === 0 ? "启用" : "禁用" }}</el-button
            >
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
        size-change：页容量，每页多少条改变了
        current-change：页码改变了 < > 点击页面，前往多少页那些地方都可以触发
        current-page：当前页
        page-sizes：每页多少条，下拉的时候展示
        page-size：每页多少条 它和 total 一起就可以决定一个有多少页
        layout：要显示分页的哪些部分
        total：总条数，服务器返回，它和 page-size 一起就可以决定一个有多少页
      -->
      <el-pagination
        style="text-align: center; height: 40px; margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <add ref="AddUpdate" />
  </div>
</template>

<script>
import Add from "./Add";
export default {
  name: "sbubject",
  components: {
    Add,
  },
  data() {
    return {
      form: {
        // 搜索条件
        username: "", // 用户名称
        email: "", // 用户邮箱
        role_id: "", // 角色id
      },
      page: 1, // 页码：默认值
      limit: 2, // 每页多少条
      total: 0, // 总条数
      roles: [
        {
          label: "启用",
          value: "1",
        },
        {
          label: "禁用",
          value: "2",
        },
      ],
      list: [], // 列表数据
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.get("/subject/list", {
        params: {
          limit: this.limit,
          page: this.page,
        },
      });
      console.log(res);
      // 给列表赋值
      this.list = res.data.items;
      // 给总条数赋值
      this.total = res.data.pagination.total;
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.limit = val;
      // 注意：页容量发生改变之后，重新从第一页加载
      this.page = 1;
      this.getListData();
    },
    // 页面切换了
    handleCurrentChange(val) {
      this.page = val;
      this.getListData();
    },
    // 搜索相关的方法
    search() {
      // 注意：搜索的时候，重新从第一页加载
      this.page = 1;
      this.getListData();
    },
    clear() {
      // 注意：每个el-form-item 都要设置prop 才会起作用
      this.$refs.form.resetFields();

      this.search();
    },
    // 删除
    del(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post("/subject/remove", { id });

          if (res.code === 200) {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功~",
            });

            // 调用search 方法，从第一页开始查
            this.search();
          }
        })
        .catch(() => {});
    },
    // 更改状态
    async changeStatus(id) {
      const res = await this.$http.post("/subject/status", { id });

      if (res.code === 200) {
        // 提示
        this.$message({
          type: "success",
          message: "更改状态成功~",
        });

        // 重新发请求
        this.getListData();
      }
    },
    // 新增 & 修改相关
    add() {
      this.$refs.AddUpdate.mode = "add";
      this.$refs.AddUpdate.dialogVisible = true;
      this.$refs.AddUpdate.form=  {
        rid: "", //id
        name: "", // 学intro科
        short_name: "", //学科简称
        intro: "", // 学科简介
        remark: "", // 备注
      }
    },
    editor(row) {
      //编辑用户
      this.$refs.AddUpdate.mode = "edit";
      this.$refs.AddUpdate.dialogVisible = true;

      this.$refs.AddUpdate.form = { ...row };
      console.log(row);
    },
  },
};
</script>
<style >
.el-card__body {
  /* padding: 0 !important; */
  margin-top: 15px;
}
* {
  font-size: 13px;
  
}

</style>