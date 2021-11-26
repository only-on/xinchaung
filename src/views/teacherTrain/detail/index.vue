<template>
  <div class="editExperimental" v-layout-bg>
    <div class="top-info">
        <div class="info-left">
          <img :src="trainDetailInfo.url">
        </div>
        <div class="info-right">
          <div>
            <div>{{trainDetailInfo.name}}</div>
            <div>
              课时数：{{trainDetailInfo.class_cnt}}
            </div>
            <div>
              实验数：{{trainDetailInfo.task_num}}
            </div>
            <div v-if="currentTab!=='1'">
              实训时间：{{trainDetailInfo.start_times}}-{{trainDetailInfo.end_times}}
            </div>
          </div>
          <a-button type="primary" @click="goback"><span class="iconfont icon-fanhui"></span> 返回</a-button>
        </div>
    </div>
    <div v-if="currentTab==='0'||currentTab==='1'">
       <a-tabs type="card" default-active-key="0" @change="callback">
        <a-tab-pane v-for="item in componentsNames" :key="item.key" :tab='item.textname'></a-tab-pane>
      </a-tabs>
      <component  
      :is="componentName" 
      :propTrainDetailInfo='propTrainDetailInfo' 
      :trainId="trainId"
      :trainType="currentTab" 
      @save-success='saveSuccess' 
      @uploadppt='uploadppt' 
      @selected-envie='selectedEnvie' 
      @selected-envir-delete='selectedEnvirDelete' />
    </div>
    <div v-else>
      <archive-training-detail
      :trainId="trainId"
      ></archive-training-detail>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import { useRoute } from "vue-router";
import request from 'src/api/index'
import basicInfo from './basicInfor/index.vue'
import trainingGuide from './trainingGuide/index.vue'
import trainCourseware from './trainCourseware/index.vue'
import trainEnvironment from './trainEnvironment/index.vue'
import customerInfor from './customerInfor/index.vue'
import groupingInfor from './groupingInfor/index.vue'
import resources from './resources/index.vue'
import archiveTrainingDetail from './archiveTrainingDetail/index.vue'
import defaultImg from 'src/assets/images/Experimental/wlkc.png'
import { stat } from 'fs/promises';
interface State{
  trainDetailInfo:any,
  propTrainDetailInfo:any,
  componentName:string,
  trainId:any,
  currentTab:any,
  componentsNames:any[]
}
export default defineComponent({
  name:'editExperimental',
  components:{basicInfo,trainingGuide,trainCourseware,trainEnvironment,customerInfor,groupingInfor,resources,archiveTrainingDetail},
  setup() {
    let router = useRoute();
    const http=(request as any).teacherTrain
    var updata=inject('updataNav') as Function
    var configuration:any=inject('configuration')
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})
     const state:State=reactive({
       trainDetailInfo:"",
       propTrainDetailInfo:{},
       trainId:'',
       currentTab:'',
       componentsNames:[
        {key:0,textname:'基础信息',name:'basicInfo'},
        {key:1,textname:'实训指导',name:'trainingGuide'},
        {key:2,textname:'实训课件',name:'trainCourseware'},
        {key:3,textname:'实训环境',name:'trainEnvironment'},
        {key:4,textname:'排课信息',name:'customerInfor'},
        {key:5,textname:'分组信息',name:'groupingInfor'},
        {key:6,textname:'资源',name:'resources'},
       ],
       componentName:'basicInfo'
     })
    onMounted(()=>{
      state.currentTab=router.query.currentTab
      state.trainId=router.query.id
      console.log(router.query.id,state.currentTab)
      methods.getTrainDetailInfo()
      if(state.currentTab==='1'){
        state.componentName='trainingGuide'
        state.componentsNames=[
        {key:0,textname:'实训指导',name:'trainingGuide'},
        {key:1,textname:'实训课件',name:'trainCourseware'},
        {key:2,textname:'实训环境',name:'trainEnvironment'}
        ]
       }
      // else if(state.currentTab==='2'){
      //   stat
      // }
    })
    
    const methods={
        getTrainDetailInfo(){
          http.trainDetailInfo({urlParams:{train:state.trainId}}).then((res:any)=>{
          state.trainDetailInfo=res.data
          state.propTrainDetailInfo=res.data
        })
      },
      saveSuccess(){
        console.log('修改成功')
        methods.getTrainDetailInfo()
      },
      uploadppt(){
        methods.getTrainDetailInfo()
      },
      goback(){
        window.history.go(-1)
        inject['stepInfoOne']={}
        inject['stepInfoTwo']={}
        inject['stepInfoThree']={}
        inject['stepInfoFour']={}
        inject['stepInfoFive']={}
      },
      callback(key:any){
        state.componentName=state.componentsNames[key].name
      },
      selectedEnvie(value:any){
        let flag:boolean=false
        state.propTrainDetailInfo.server.forEach((item:any,index:number) => {
          console.log(item.id,value.id)
          console.log( item.id===value.id)
            if(item.id===value.id){
              flag=true 
            }
        });
        if(flag){
          return
        }
        const item={id:value.id,image_name:value.image.name,cpu:value.config.cpu_text,disk:value.config.disk_text,ram:value.config.ram_text}
        state.propTrainDetailInfo.server?.push(item)
      },
      selectedEnvirDelete(value:any){
        console.log(value.id,'valueid')
        let deleteIndex:number=0
        state.propTrainDetailInfo.server.forEach((item:any,index:number) => {
          console.log(item.id,value.id)
            if(item.id===value.id){
              return deleteIndex=index
            }
        });
        state.propTrainDetailInfo.server.splice(deleteIndex,1)
      }
    }
    return {...toRefs(state),...methods,defaultImg}
  },
})
</script>
<style lang="less" scoped>
.top-info{
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  .info-left{
    width:290px;
    margin-right: 10px;
    img{
      width: 290px;
      height: 164px;
    }
  }
  .info-right{
    padding-right:10px;
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
}
</style>
