<template>
    <div class="header">
      <p></p>
      <Breadcrumb :type="false" />
    </div>
    <div class="content" v-layout-bg>
      <div class="content_box">
        <div class="title">
          <div>
            <span>HTML是编程语言吗</span>
            <span>(分享)</span>
          </div>
          <a-button type="primary" @click.prevent="Reply"> 回 帖 </a-button>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive ,toRefs} from 'vue'
interface Istate{
  Reply: () => void;
}
export default defineComponent({
  name: 'PostsDetailed',
  components: {
   
  },
  setup: (props,{emit}) => {
    const state:Istate=reactive({
      Reply:()=>{

      }
    })
    onMounted(()=>{
     
    })
    return { ...toRefs(state)};
  },
})
</script>
<style scoped lang="less">
  .header{
    display: flex;
    justify-content: space-between;
    width: @center-width;
    margin: 0 auto;
  }
  .content{
    width: @center-width;
    margin: 20px auto 0;
    background: #fff;
    min-height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px 25px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
      .title{
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
