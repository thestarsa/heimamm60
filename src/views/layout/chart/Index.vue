<template>
  <div>
    <div class="chart">
      <el-card>
        <ul class="list">
          <li>
            <div class="itemContent color1">{{ list.increment_users }}</div>
            <p>今日新增用户</p>
          </li>
          <li>
            <div class="itemContent color1">{{ list.total_users }}</div>
            <p>总用户数</p>
          </li>
          <li>
            <div class="itemContent color2">
              {{ list.increment_questions }}
            </div>
            <p>新增试题</p>
          </li>
          <li>
            <div class="itemContent color2">{{ list.total_questions }}</div>
            <p>总试题量</p>
          </li>
          <li>
            <div class="itemContent color3">
              {{ list.total_done_questions }}
            </div>
            <p>总刷题量</p>
          </li>
          <li>
            <div class="itemContent color3">
              {{ list.personal_questions }}
            </div>
            <p>人均刷题量</p>
          </li>
        </ul>
      </el-card>
    </div>

    <el-card style="margin-top: 20px">
      <div id="main" style="width: 1000px; height: 400px" ref="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      list: {},
    };
  },
  methods: {
    async getecharts() {
      const res = await this.$http.get("/data/statistics");

      let myChart = echarts.init(this.$refs.main);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 100,
          data: res.data.map((item) => item.name),
        },
        series: [
          {
            name: "题库来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: res.data,
          },
        ],
      };
      // 指定图表的配置项和数据

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    async getDatalist() {
      const res = await this.$http.post("/data/title");
      this.list = res.data;
    },
  },
  mounted() {
    this.getecharts();
    this.getDatalist();
    console.log(this.$router);
  },
};
</script>
<style lang="less">
.chart {
  .list {
    //弹性例子布局
    display: flex;
    //主轴分布
    justify-content: space-around;
    //侧轴分布
    align-items: center;
    //文本居中
    text-align: center;
    //颜色处理
    .color1 {
      border: 3px solid #0086fa;
      color: #0086fa;
    }
    .color2 {
      border: 3px solid #f76137;
      color: #f76137;
    }
    .color3 {
      border: 3px solid #55cd78;
      color: #55cd78;
    }
    //画圈圈
    .itemContent {
      border-radius: 50%;
      width: 99px;
      height: 99px;
      line-height: 99px;
    }
  }
  .echarts {
    height: 500px;
  }
}
</style>
