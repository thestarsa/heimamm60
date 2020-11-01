<template>
  <el-container>
    <el-header class="header">
      <div class="left">
        <i
          @click="isCollapse = !isCollapse"
          class="el-icon-s-fold setheight"
        ></i>
        <img src="@/assets/img/layout_icon.png" class="marginlr" alt="" />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <div class="ll">
          <div class="img">
            <img :src="bgm" alt="" />
          </div>
          <span>{{ text }} <i>欢迎你</i></span>
        </div>
        <el-button type="primary" size="default" @click="lgout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <!--
          collapse：折叠，如果折叠那么el-aside的width要设置auto，并且el-menu要与一个默认的宽度
          router：如果设置了它，会把el-menu-item中的index当做是路径
          default-active：当前激活菜单的 index
         -->
        <el-menu
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          :default-active="defaultActive"
          router
        >
          <!-- 找到整个路由对象找到chiildren下面的数组生成标签 -->
          <el-menu-item
            :index="item.meta.fullpath"
            v-for="item in $router.options.routes[2].children"
            :key="item.path"
            v-show="item.meta.roles.includes(role)"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
          <!--  <el-menu-item index="/layout/web">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token.js";
export default {
  name: "index",
  data() {
    return {
      bgm: "", //用户头像
      text: "", //用户名
      isCollapse: false, // 是否折叠，默认是false
      defaultActive: "/layout/chart", // 激活的index，
      role: "",
    };
  },
  watch: {
    $route(newValue) {
      if (!newValue.meta.roles.includes(this.role)) {
        // 提示
        this.$message.error("您没有访问该页面的权限！");

        // 跳转到登录页面
        this.$router.push("/login");
      }

      // 设置激活的index
      this.defaultActive = newValue.path;
    },
  },

  mounted() {
    this.defaultActive = this.$route.path;
    this.getUser();
    // console.log(router);
  },
  methods: {
    lgout() {
      //退出登录逻辑

      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.get("logout");
          if (res.code == 200) {
            //  删除token
            removeToken();
            //  跳转到登录页面
            this.$router.push("/login");
          } else if (res.code == 206) {
            removeToken();
            this.$router.push("/login");
          }
          this.$message({
            type: "success",
            message: "退出成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出",
          });
        });
    },
    async getUser() {
      //获取用户信息
      const res = await this.$http.get("info");

      this.text = res.data.username;
      this.bgm = process.env.VUE_APP_BASEURL + "/" + res.data.avatar;
      this.role = res.data.role;
   
      if(!this.$route.meta.roles.includes(res.data.role)){
         this.$message.error('您没有访问该页面的权限')
        //  跳转到登录页面
         this.$router.push('/login')
      }else{
        this.$store.commit('setUserInfo',res.data)
      }
    },
  },
};
</script>

<style lang="less">
.el-container {
  height: 100%;
}
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f3f3;
  .left {
    display: flex;
    align-items: center;
    .setheight {
      font-size: 20px;
    }
    .marginlr {
      margin-left: 10px;
      margin-right: 10px;
    }
    .title {
      font-size: 22px;
      color: #49a1ff;
    }
  }
}
.right {
  display: flex;
  align-items: center;
  height: 100%;
  width: 300px;

  .ll {
    width: 70%;
    height: 60px;
    line-height: 60px;

    .img {
      margin-top: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      // background-color: red;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    span {
      float: left;
      i {
        font-style: normal;
      }
    }
  }
}
.el-menu {
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.main {
  background-color: #e8e9ec;
}
</style>
