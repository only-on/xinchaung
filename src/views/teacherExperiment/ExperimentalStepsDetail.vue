<template>
  <div class="ExperimentalStepsDetail setScrollbar">
    <h3>实验步骤详情</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { useRoute, useRouter } from 'vue-router'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
// import AntdvMarkdown from 'src/components/editor/markedEditor.vue'
import envList from 'src/components/teacherExperiment/envList.vue'
import taskList from './create/taskList.vue'
import dataSet from 'src/components/selectDataSet/selectDataSet.vue'
import environment from 'src/components/teacherExperiment/environment.vue'
import sameScreen from 'src/components/teacherExperiment/sameScreen.vue'
import { MessageApi } from "ant-design-vue/lib/message";
import { UUID } from 'src/utils/uuid'
import { IimageData } from './experTyping'
import { RuleObject } from 'ant-design-vue/es/form/interface';
interface Istate{
  Subcomponents:string[];
  detail:any;
  select: (val:string) => void;
  selectType:string;
  visible:boolean;
  visibleBaseInfo:boolean;
  onClose:(val:string) => void;
  viewStep:(val:number) => void;
  editBaseInfo:() => void;
  handleCancel:() => void;
  openInfoModul:() => void;
  editEnvironmentInfo:() => void;
  editDateSetInfo:() => void;
  editGuideInfo:() => void;
  editTaskInfo:() => void;
  screenStatus:boolean;
  screenVmInfo:any[];
  EditEnvironment:boolean;
  EditInfo:boolean;
  EditDateSet:boolean;
  EditTask:boolean;
  EditGuidance:boolean;
  removeDataSet:(val: IselectedName, index: number) => void;
  environmentInfo:any;
  rules:any
  loading:boolean
}
interface IformState {
  name: string
  class_cnt: number | undefined
  datasets: string[]
  selectedName: IselectedName[]
  // 已选择镜像数据
  imageDataSelected: IimageData[]
  guide: any,
  taskData:any[]
}
interface IselectedName {
  uid: string
  name: string
  amount:number
  size:string
}
export default defineComponent({
  components:{envList,dataSet, environment,sameScreen,taskList,AntdvMarkdown},
  setup(){
    let route = useRoute()
    let router = useRouter()
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teacherExperiment
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:true,showContent:false,componenttype:undefined,showNav:true})
    
    onMounted(() => {
      // getContentDetail()
    })
    return {}
  }
})
</script>
<style scoped lang="less">

</style>