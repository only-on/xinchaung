<template>
   <div class="creatExperimental"  v-layout-bg>
     <div class="header">
       <a-steps progress-dot :current="current">
          <a-step v-for="(v) in stepList" :key="v.name" :title="v.name" description="" />
      </a-steps>
     </div>
     <div class="step">
       <component :is="componentName" />
     </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,reactive,toRefs ,inject, computed,watch} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import step1 from './step/step1.vue'
const http=(request as any).studentForum
export default defineComponent({
  name: 'CreatePosts',
  components: {
   step1
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    const options = {
      placeholder: "输入内容...",
      theme: "snow",
    };
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    var componentName:Ref<string>=ref('')
    var current:Ref<number>=ref(0)
    watch(componentName,(val:any)=>{
      console.log(val)
      stepList.forEach((v:any,k)=>{
        if(val===v.component){
          current.value=k
        }
      })
    })
    function getClass(){

    }
    var stepList=[{name:'设置基本信息',component:'step1'},{name:'设置实训内容',component:'step2'},{name:'添加实训资源',component:'step3'},{name:'设置排课信息',component:'step4'},{name:'分组信息',component:'step5'},{name:'完成',component:'step6'}]
    onMounted(()=>{
     componentName.value='step1'
    })
    return {componentName,stepList,current}
  },
})
</script>

<style scoped lang="less">
.creatExperimental{
  height: 100%;
  overflow: hidden;
}
  .header{
    // display: flex;
    // justify-content: space-between;
    width: 100%;
    padding-top: 4px;
    padding-bottom: 50px;
    :deep(.ant-steps-item-icon){
       width: 10px;
        height: 10px;
        line-height: 10px;
    }
    :deep(.ant-steps-item-title){
      font-size: 16px;
    }
    :deep(.ant-steps-item-finish > .ant-steps-item-container) {
       > .ant-steps-item-tail::after{
         background-color: #efefef;
       }
      
    }
    :deep(.ant-steps-item-finish),:deep(.ant-steps-item-active){
      .ant-steps-item-title{
        color:@theme-color;
      }
    }
    :deep(.ant-steps-item-active){
      .ant-steps-item-icon{
        width: 12px;
        height: 12px;
        line-height: 12px;
      }
    }
  }
  .step{
    height: calc(100% - 100px);
    overflow: auto;
  }
  
    
</style>
