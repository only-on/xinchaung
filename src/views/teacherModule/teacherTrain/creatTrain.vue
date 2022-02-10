<template>
   <div class="creatExperimental"  v-layout-bg>
     <div class="header">
       <a-steps progress-dot :current="current">
          <a-step v-for="(v) in stepList" :key="v.name" :title="v.name" description="" />
      </a-steps>
     </div>
     <div class="step">
       <component @step-status='stepStatus' @content-trainid='contentTrainid' :trainId='trainId' :is="componentName" />
     </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,reactive,toRefs ,provide,inject, computed,watch} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch';
import { useRouter ,useRoute } from 'vue-router';
import step1 from './step/step1.vue'
import step2 from './step/step2.vue'
import step3 from './step/step3.vue'
import step4 from './step/step4.vue'
import step5 from './step/step5.vue'
import step6 from './step/step6.vue'
import step7 from './step/step7.vue'
const http=(request as any).studentForum
export default defineComponent({
  name: 'CreatePosts',
  components: {
   step1,step2,step3,step4,step5,step6,step7
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
    provide('stepInfoOne','')
    provide('stepInfoTwo','')
    provide('stepInfoThree','')
    provide('stepInfoFour','')
    provide('stepInfoFive','')
    var componentName:Ref<string>=ref('step1')
    var current:Ref<number>=ref(0)
    var trainId:Ref<string>=ref('')
    var stepList=[
    {name:'基本信息',component:'step1'},
    {name:'实训环境',component:'step2'},
    {name:'实训内容',component:'step3'},
    {name:'实训资源',component:'step4'},
    {name:'实训成员',component:'step5'},
    {name:'分组信息',component:'step6'},
    {name:'完成',component:'step7'}]
    const methods={
      stepStatus(val:any){
        componentName.value=stepList[val].component
        current.value=val
      },
      contentTrainid(val:any){
        trainId.value=val
        console.log(val)
      }
    }
    onMounted(()=>{
     componentName.value='step1'
    })
    return {componentName,stepList,current,trainId,...methods}
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
        color:var(--primary-color);
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
    width:100%;
    margin: 0 auto;
    height: calc(100% - 100px);
    overflow: auto;
  }
  
    
</style>
