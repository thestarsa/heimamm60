<template>
  <!--
        action：上传的地址，跟axios没关系
        data：上传的额外参数
        before-upload：上传之前的回调，它里面做两件事，第一：判断类型和大小，第二：给 uploadObj.file 赋值
        :on-success：上传成功之后的回调，它也要做两件事，第一：预览（图片跟视频预览的标签不一样），第二：给传递过来的
        obj对应的属性赋值（上传视频的时候对应的是video，到时候上传image的时候，对应的image）
     -->
  <el-upload
    class="avatar-uploader"
    :action="uploadUrl"
    :data="uploadObj"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
  >
    <!-- 预览 -->
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <video v-else-if="videoUrl" :src="videoUrl" controls="controls"></video>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
export default {
    name:'UPload',
     props: {
    type: String, // 类型 video、image
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
    data() {
        return {
           uploadUrl:`${process.env.VUE_APP_BASEURL}/question/upload`,  //图片要上传的地址
            uploadObj:{ //要传送的文件
                file:''
            },
            imageUrl:'', //图片的地址
            videoUrl:'' // 视频的 地址
        }
    },
    methods:{
        beforeAvatarUpload(fileName){  //上传之前的回调 一校验   二吧文件赋值给外参数
        this.uploadObj.file= fileName
        if (this.type === 'image') {
        const isJPG =
          fileName.type === 'image/jpeg' ||
          fileName.type === 'image/png' ||
          fileName.type === 'image/gif'
        const isLt2M = fileName.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      } else {
        const isVideo = fileName.type === 'video/mp4' || fileName.type === 'video/avi'
        const isLt2M = fileName.size / 1024 / 1024 < 2

        if (!isVideo) {
          this.$message.error('上传视频只能是 MP4、AVI 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传视频大小不能超过 2MB!')
        }
        return isVideo && isLt2M
      }

        },
        handleAvatarSuccess(res){  //上传之后的回调 1 吧文件上传到数据库中去  2 预览
               console.log(res);
               if(this.type==='image'){
                   this.imageUrl =  process.env.VUE_APP_BASEURL+ res.data.url
                   this.obj.image = res.data.url
               }else{
                   this.videoUrl =  process.env.VUE_APP_BASEURL+ res.data.url
              
               }
        }
    }
}
</script>
