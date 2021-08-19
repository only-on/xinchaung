<template>
  <div class="header">
    <p></p>
    <Breadcrumb />
  </div>
  <div class="content">
    <div class="content_box">
      fatie
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive } from 'vue'

export default defineComponent({
  name: 'CreatePosts',
  components: {
   
  },
  setup: (props,{emit}) => {
    
    onMounted(()=>{
     
    })
    return { };
  },
})
</script>

<style scoped lang="less">
  .header{
    display: flex;
    justify-content: space-between;
    width: @Edition-Center;
    margin: 0 auto;
  }
  .content{
    width: @Edition-Center;
    margin: 20px auto 0;
    background: #fff;
    height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
    }
  }
</style>
