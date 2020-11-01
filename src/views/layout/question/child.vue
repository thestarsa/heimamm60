<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="100%"
      center
      fullscreen
    >
      <!-- 在element中dialog标签内置有几个插槽等着被替换 -->
      <div slot="title" class="left11">
        {{ mode === "add" ? "新增题库" : "修改题库" }}
      </div>
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
        style="width: 800px"
        class="abk"
        center
      >
        <!-- 学科 -->
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
        <!-- 企业 -->
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="form.enterprise" placeholder="请选择学科">
            <el-option
              v-for="item in Enterprises"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 阶段 -->
        <el-form-item label="阶段" prop="step">
          <el-select v-model="form.step" placeholder="请选择学科">
            <el-option
              v-for="item in stepList"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 省市三级联动 -->
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :options="options"
            :props="{ value: 'label' }"
            v-model="form.city"
          >
          </el-cascader>
        </el-form-item>
        <!-- 题型 -->
        <el-form-item label="题型" prop="type" @change="typeChange">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="item in typeOptions"
              :key="item.label"
              :label="item.label"
              @blur="onEditorBlur('title')"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 难度 -->
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="form.difficulty">
            <el-radio
              v-for="item in difficultyList"
              :key="item.label"
              :label="item.label"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <hr class="hr" />
        <el-form-item class="setMargin" label="试题标题" prop="title">
          <quill-editor
            ref="myQuillEditor"
            v-model="form.title"
            :options="{ placeholder: '请输入标题' }"
            class="al"
            @blur="onEditorBlur('title')"
          />
        </el-form-item>
        <!-- 动态显示组件位置 -->
        <el-form-item
          :label="questtypeobj[form.type]"
          :prop="propTypeObj[form.type]"
        >
          <conditons :form="form" />
        </el-form-item>

        <!-- 动态显示组件位置 -->
        <hr class="hr" />
        <el-form-item label="视频解析">
          <up-add ref="UP" type="video" :obj="form" />
        </el-form-item>
        <el-form-item label="答案解析" class="setMargin" prop="answer_analyze">
          <quill-editor
            ref="myQuillEditor"
            v-model="form.answer_analyze"
            :options="{ placeholder: '请输入标题' }"
            @blur="onEditorBlur('answer_analyze')"
          />
        </el-form-item>
        <hr class="hr" />
        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="form.remark" size="normal" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">立即创建</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Conditons from "./Conditions";
import UpAdd from "./up-add";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 引入富文本
import { quillEditor } from "vue-quill-editor";
// 引入省市三级联动
import { regionData } from "element-china-area-data";
export default {
  name: "chiid1",
  components: {
    quillEditor, //富文本
    UpAdd, //上传文件模块
    Conditons, //条件渲染模块
  },
  props: {
    subjects: {
      type: Array,
      default: function () {
        return [];
      },
    },
    Enterprises: {
      type: Array,
      default: function () {
        return [];
      },
    },
    stepList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    typeOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    difficultyList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.form.clearValidate();

      }
    },
  },
  data() {
    return {
      mode: "", //模块类型  新增or 修改
      questtypeobj: {
        //题型类型传递过去
        1: "单选",
        2: "多选",
        3: "简答",
      },
      propTypeObj: {
        // 校验类型的对象（校验单选答案、多选答案、简答答案）
        1: "single_select_answer",
        2: "multiple_select_answer",
        3: "short_answer",
      },
      form: {
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
      },
      options: regionData, //省市三级联动数据
      dialogVisible: false,
      rules: {
        subject: [
          { required: true, message: "学科不能为空", trigger: "change" },
        ],
        enterprise: [
          { required: true, message: "阶段不能为空", trigger: "change" },
        ],
        step: [{ required: true, message: "企业不能为空", trigger: "change" }],
        city: [{ required: true, message: "城市不能为空", trigger: "change" }],
        type: [{ required: true, message: "题型不能为空", trigger: "change" }],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        difficulty: [
          { required: true, message: "难度不能为空", trigger: "cheange" },
        ],
        remark: [
          { required: true, message: "试题备注不能为空", trigger: "blur" },
        ],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "blur" },
        ],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "change" },
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "change" },
        ],
        short_answer: [
          { required: true, message: "简答不能为空", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    onEditorBlur(fileName) {
      this.$refs.form.validateField(fileName);
    },
    // 切换了类型
    typeChange() {
      //如果题型发生了改变清空之前 校验
      this.$refs.form.clearValidate([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer",
      ]);
    },
   
    cancel() {
      //取消按钮
      this.dialogVisible = false;
      //   console.log(regionData);
    },
    add() {
      //新增按钮
      this.dialogVisible = false;
      console.log('------------------------------');
       this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        let url = "";
        let message = "";
        if (this.mode === "add") {
          url = "/question/add";
          message = "新增成功~";
        } else {
          // 修改的时候城市要传递字符串
          this.form.city = this.form.city.join(",");

          url = "/question/edit";
          message = "修改成功~";
        }

        const res = await this.$http.post(url, this.form);

        if (res.code === 200) {
          // 提示
          this.$message({
            type: "success",
            message,
          });

          // 关闭当前窗口
          this.dialogVisible = false;

          // 父组件的search方法要调用
          this.$parent.seach();
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style  lang="less">
.el-dialog__header {
  height: 60px !important ;
  color: #0066ff;
  line-height: 40px;
}
.left11 {
  position: absolute;
  left: 20px;
  top: 10px;
  font-size: 20px;
}
.abk {
  margin: 20px 200px;
}
.hr {
  width: 800px;
  height: 3px;
  background-color: antiquewhite;
  margin-top: 20px;
  margin-bottom: 20px;
}
.setMargin {
  .el-form-item__content {
    margin-left: 0px !important;
    margin-top: 40px;
  }
}
</style>
