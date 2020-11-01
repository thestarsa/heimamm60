<template>
  <div class="question-type">
    <div v-if="form.type === 1">
      <!-- 遍历生成一行一行的数据 -->
      <div class="item" v-for="item in form.select_options" :key="item.label">
        <!-- el-radio的v-model要绑定同一个值 -->
        <el-radio
          v-model="form.single_select_answer"
          :label="item.label"
        ></el-radio>
        <!-- 要双向绑定的是 每一项的item -->
        <el-input v-model="item.text"></el-input>
        <!-- 这个要传递item，因为上传成功之后，要给每一项的image -->
          <up-add  type="image" :obj="item" />
      </div>
    </div>
    <div v-else-if="form.type === 2">
      <!-- 遍历生成一行一行的数据 -->
      <div class="item" v-for="item in form.select_options" :key="item.label">
        <!-- el-checkbox的v-model要绑定同一个值 -->
        <el-checkbox
          v-model="form.multiple_select_answer"
          :label="item.label"
          >{{ item.label }}</el-checkbox
        >
        <!-- 要双向绑定的是 每一项的item -->
        <el-input v-model="item.text"></el-input>
        <!-- 这个要传递item，因为上传成功之后，要给每一项的image -->
         <up-add  type="image" :obj="item" />
      </div>
    </div>
    <div v-else-if="form.type === 3">
      <el-input
        type="textarea"
        rows="10"
        v-model="form.short_answer"
      ></el-input>
    </div>
  </div>
</template>

<script>
import UpAdd from "./up-add";//引入上传文件模块
export default {
  name: 'conditions',
  components: {
  UpAdd
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style lang="less">
.question-type {
  .el-input {
    color: #606266;
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
