<template>
    <div>
      {{$store.getters.getUserInfo.username}} 欢迎你 ，您的身份是 <strong>{{$store.getters.getUserInfo.role}}</strong>   
    </div>
</template>
<script>
export default {
  /* mounted (){
    console.log(this);
  } */
}
</script>