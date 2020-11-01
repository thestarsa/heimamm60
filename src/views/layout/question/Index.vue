<template>
  <div>
    <el-card>
      <el-form :model="form" ref="form" label-width="80px" inline size="normal">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="form.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="form.step" placeholder="请选择阶段">
            <el-option
              v-for="item in stepList"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="form.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in Enterprises"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型">
            <el-option
              v-for="item in typeOptions"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度">
            <el-option
              v-for="item in difficultyList"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="username">
          <el-input v-model="form.username" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="create_date">
          <el-date-picker
            v-model="form.create_date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="seach">搜索</el-button>
          <el-button type="primary" @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+新增试题</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="ak">
      <el-table :data="list" border stripe>
        <!-- type 索引，是从1开始的 -->
        <el-table-column label="序号" type="index"></el-table-column>
        <!-- prop 找到数组中对应那一行的值 -->
        <el-table-column label="题目">
          <template slot-scope="scope">
            <!-- //用v-html来解析带标签的内容 -->
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="学科.阶段"
          :formatter="formatterData"
        ></el-table-column>

        <el-table-column
          label="题型"
          :formatter="formatterData1"
        ></el-table-column>
        <el-table-column label="企业" prop="enterprise_name"></el-table-column>
        <el-table-column label="创建者" prop="username"> </el-table-column>
        <el-table-column label="访问量" prop="reads"> </el-table-column>
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
    <child
      ref="childref"
      :subjects="subjects"
      :Enterprises="Enterprises"
      :stepList="stepList"
      :typeOptions="typeOptions"
      :difficultyList="difficultyList"
    />
  </div>
</template>
<script>
import child from "./child";
export default {
  name: "question",
  components: {
    child,
  },
  data() {
    return {
      form: {
        subject: "",
        enterprise: "",
        step: "",
        type: "",
        difficulty: "",
        username: "",
        status: "",
        create_date: "",
        title: "",
      },
      page: 1,
      limit: 2,
      total: 0, // 总条数
      list: [],
      subjects: [], //学科数组
      Enterprises: [], //企业数组
      stepList: [
        { label: 1, value: "初级" },
        { label: 2, value: "中级" },
        { label: 3, value: "高级" },
      ], //阶段数组
      typeOptions: [
        //题型数组
        { label: 1, value: "单选" },
        { label: 2, value: "多选" },
        { label: 3, value: "简答" },
      ],
      difficultyList: [
        //难度数组
        { label: 1, value: "简单" },
        { label: 2, value: "一般" },
        { label: 3, value: "困难" },
      ],
      statusList: [
        //状态
        { label: 0, value: "禁用" },
        { label: 1, value: "启用" },
      ],
    };
  },
  mounted() {
    this.getlistdata(); //获取学科信息
    this.getEnterprise(); //获取企业信息
    this.getQuestionData(); //获取题库列表
    console.log( this.$refs.childref);

  },
  methods: {
    async getlistdata() {
      //获取学科列表
      const res = await this.$http.get("/subject/list");
      if (res.code === 200) {
        this.subjects = res.data.items;
      }
    },
    async getEnterprise() {
      //获取企业列表
      const res = await this.$http.get("/enterprise/list");
      if (res.code === 200) {
        this.Enterprises = res.data.items;
      }
    },
    async getQuestionData() {
      //获取题库列表
      const res = await this.$http.get("/question/list", {
        params: {
          ...this.form,
          page: this.page,
          limit: this.limit,
        },
      });
      if (res.code === 200) {
        this.list = res.data.items;
        this.total = res.data.pagination.total;
      }
    },
    add() {
      // 新增按钮
      this.$refs.childref.mode = "add";
      this.$refs.childref.dialogVisible = true;

      this.$refs.childref.form = {
        subject: "", //学科
        enterprise: "", //企业
        step: "", //
        city: [],
        type: 1,
        difficulty: 1,
        title: "",
        remark: "",
        video: "",
        answer_analyze: "",
        single_select_answer: "A", //单选
        multiple_select_answer: [], //多选
        short_answer: "", //简答
        select_options: [
          // 单选、多选的选项
          {
            label: "A",
            text: "选项A",
            image: "",
          },
          {
            label: "B",
            text: "选项B",
            image: "",
          },
          {
            label: "C",
            text: "选项C",
            image: "",
          },
          {
            label: "D",
            text: "选项D",
            image: "",
          },
        ],
      };

      this.$nextTick(() => {
        //在dom渲染完毕后执行这个函数
        this.$refs.childref.$refs.form.clearValidate();
      });
    },
    editor(row) {
      //编辑按钮
      this.$refs.childref.mode = "editor";
      //  这样只能拷贝一层 如果对象里面还有嵌套的对象或数组会影响之前的数据
      // this.$refs.childref.form={...row}
      this.$refs.childref.form = JSON.parse(JSON.stringify(row));
      // 城市和多选要单独处理 选中和上传的格式不一样
      this.$refs.childref.form.city = row.city.split(",");
      this.$refs.childref.form.multiple_select_answer = row.multiple_select_answer.split(
        ","
      );
      this.$refs.childref.dialogVisible = true;
    },
    seach() {
      this.page = 1;
      this.getQuestionData();
    },
    clear() {
      // 注意：每个el-form-item 都要设置prop 才会起作用
      this.$refs.form.resetFields();

      this.seach();
    },
    del(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post("/question/remove", { id });

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
    formatterData(row) {
      let stpeName = "";
      switch (row.step) {
        case 1:
          stpeName = "初级";
          break;
        case 2:
          stpeName = "中级";
          break;
        case 3:
          stpeName = "高级";
          break;

        default:
          break;
      }
      //  一定要返回值
      return `${row.subject_name}.${stpeName}`;
    },
    formatterData1(row) {
      let typeName = "";
      switch (row.step) {
        case 1:
          typeName = "初级";
          break;
        case 2:
          typeName = "中级";
          break;
        case 3:
          typeName = "高级";
          break;

        default:
          break;
      }
      return typeName;
    },
    async changeStatus(id) {
      const res = await this.$http.post("/question/status", { id });
      // 注意更改状态要重新发送请求 因为更改的是后台数据 要想更新必须重新请求
      if (res.code === 200) {
        // 提示
        this.$message({
          type: "success",
          message: "更改状态成功~",
        });

        // 重新发请求
        this.getQuestionData();
      }
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.limit = val;
      // 注意：页容量发生改变之后，重新从第一页加载
      this.page = 1;
      this.getQuestionData();
    },
    // 页面切换了
    handleCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.getQuestionData();
    },
  },
};
</script>
<style >
.ak {
  margin-top: 20px;
}
</style>