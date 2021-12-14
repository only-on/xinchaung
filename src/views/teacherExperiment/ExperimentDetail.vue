<template>
  <div class="ExperimentDetail setScrollbar">
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <!-- 基础信息 -->
      <div class="base-info box flexCenter" v-if="Subcomponents.includes('baseInfo')">
        <div class="left">
          <div class="title">{{detail.name}}</div>
          <div class="base-footer">
            <div class="info">
              <span>类型：{{detail.task_type_text}}</span>
              <span>课时数：{{detail.class_cnt}}</span>
              <span>GPU：{{detail.is_used_gpu?'启用':'未启用'}}</span>
            </div>
            <div class="label">
              <span v-for="v in detail.knowledge_maps" :key="v">{{v[v.length - 1]}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="inonBox"  v-if="currentTab==='0'" >
            <i class="iconfont" :class="EditInfo?'icon-baocun':'icon-bianji1'" @click="openInfoModul"></i>
          </div>
        </div>
      </div>
      <!-- 实验环境 -->
      <div class="environment box" v-if="Subcomponents.includes('environment')">
        <div class="head">
          <div class="left">
            <div class="title">实验环境</div>
            <div class="title-info">
              <span>CPU：{{environmentInfo.cpu}}核</span> | 
              <span>内存：{{environmentInfo.ram}}G</span> | 
              <span>磁盘：{{environmentInfo.disk}}G</span>
            </div>
          </div>
          <div class="right">
            <i class="iconfont"  v-if="currentTab==='0'"  :class="EditEnvironment?'icon-baocun':'icon-bianji1'" @click="editEnvironmentInfo"></i>
          </div>
        </div>
        <div class="maxAdd" v-if="EditEnvironment">
          <a-button class="add-btn" @click="select('image')">
            <span class="iconfont icon-tianjia"></span>
          </a-button>
          <span class="max-hint">最多可选{{detail.task_type===4?1:3}}个镜像</span>
        </div>
        <div class="environmentDataBox">
          <env-list :envData="formState.imageDataSelected" :edit="!EditEnvironment"></env-list>
        </div>
      </div>
      <!-- 数据集 -->
      <div class="dateSet box" v-if="Subcomponents.includes('dateSet')">
        <div class="head">
          <div class="left">
            <div class="title">数据集</div>
          </div>
          <div class="right">
            <i class="iconfont"  v-if="currentTab==='0'"  :class="EditDateSet?'icon-baocun':'icon-bianji1'" @click="editDateSetInfo"></i>
          </div>
        </div>
        <div class="maxAdd" v-if="EditDateSet">
          <a-button class="add-btn" @click="select('data')">
            <span class="iconfont icon-tianjia"></span>
          </a-button>
          <span class="max-hint">最多可选3个数据集</span>
        </div>
        <div class="data-list-box">
          <div class="data-item" v-for="(item, index) in formState.selectedName" :key="item.uid">
            <span class="data-name">{{ item.name }}</span>
            <span class="wenjian iconfont icon-wenjian">&nbsp;{{item.amount}}个</span>
            <span class="cunchuzhi iconfont icon-cunchuzhi">&nbsp;{{item.size}}</span>
            <span class="shanchu iconfont icon-shanchu" v-if="EditDateSet" @click="removeDataSet(item, index)"></span>
          </div>
        </div>
      </div>
      <!-- 实验任务 -->
      <div class="box task" v-if="Subcomponents.includes('task')">
        <div class="head">
          <div class="left">
            <div class="title">实验任务</div>
          </div>
          <div class="right">
            <i class="iconfont"  v-if="currentTab==='0'"  :class="EditTask?'icon-baocun':'icon-bianji1'" @click="editTaskInfo"></i>
          </div>
        </div>
        <div class="taskContent" v-if="!EditTask && formState.taskData[0].name">
          <div class="item" v-for="v in formState.taskData" :key="v.name">{{v.name}}</div>
        </div>
        <task-list v-if="EditTask" v-model:taskData="formState.taskData" :jupyterUuid="jupyterUuid"></task-list>
      </div>
      <!-- 实验指导 -->
      <div class="box" v-if="Subcomponents.includes('guide')">
        <div class="head">
          <div class="left">
            <div class="title">实验指导</div>
          </div>
          <div class="right">
            <i class="iconfont" v-if="currentTab==='0'" :class="EditGuidance?'icon-baocun':'icon-bianji1'" @click="editGuideInfo"></i>
          </div>
        </div>
        <div class="markdownBox">
          <antdv-markdown v-model="formState.guide"  :preview-only="!EditGuidance" class="markdown__editor"/>
        </div>
      </div>
      <!-- 实验步骤-->
      <div class="box" v-if="Subcomponents.includes('ExperimentalSteps')">
        <div class="head">
          <div class="left">
            <div class="title">实验步骤</div>
          </div>
          <div class="right">
            <i class="iconfont" v-if="currentTab==='0'" :class="EditGuidance?'icon-baocun':'icon-bianji1'" @click="editGuideInfo"></i>
          </div>
        </div>
        <div class="ExperimentalSteps">
          <div v-for="v in detail.task_steps" :key="v.id" class="item">
            <span class="name">{{v.name}}</span>
            <span class="detaile" @click="viewStep(v.id)">{{"查看详情"}}</span>
          </div>
        </div>
      </div>
      <!-- 镜像 数据集 选择 -->
      <a-drawer
        class="data-image-drawer"
        width="640"
        placement="right"
        :closable="false"
        :visible="visible"
        @close="onClose"
      >
        <div class="data" v-if="selectType === 'data'">
          <data-set v-model:value="formState.datasets" v-model:name="formState.selectedName"></data-set>
        </div>
        <div class="image" v-if="selectType === 'image'">
          <environment v-model="formState.imageDataSelected" :limitNumber="detail.task_type===4?1:3"></environment>
        </div>
      </a-drawer>
      <!-- 同屏模式 -->
      <same-screen ref="sameScreen" v-model:screenStatus="screenStatus" v-model="formState.guide" :screenInfo="screenVmInfo"></same-screen>
      <!-- 编辑基础信息 -->
      <a-modal v-model:visible="visibleBaseInfo" title="编辑基础信息" @ok="editBaseInfo" @cancel="handleCancel" class="postModal">
        <a-form
          ref="formRef"
          :model="formState"
          layout="vertical"
          :rules="rules"
        >
          <a-form-item label="实验名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入实验名称"/>
          </a-form-item>
          <a-form-item label="课时数" name="class_cnt">
            <a-input v-model:value="formState.class_cnt" placeholder="请输入课时数"/>
          </a-form-item>
        </a-form>
        <!-- <template #footer class="footer">
          <a-button @click="editBaseInfo" type="primary">提交</a-button>
        </template> -->
      </a-modal>
    </a-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs, computed } from 'vue'
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
    const {id,currentTab}=route.query
    let formRef = ref()
    let jupyterUuid = ref(UUID.uuid4())
    const state:Istate=reactive({
      Subcomponents:[],  // baseInfo  environment  dateSet  guide  task  ExperimentalSteps
      rules:{
        name: [
        { required: true, message: '请输入实验名称', trigger: 'blur'},
        {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{0,20}$/,message: "实验名称只能包含汉字、数字、字母和下划线，名称最长为20字符", trigger: "blur"}
      ],
      class_cnt: [
          { required: true,message: '',},     
          {validator: classCutValidator, trigger: 'blur'}
        ],
      },
      loading:false,
      openInfoModul:()=>{
        formState.name=state.detail.name
        formState.class_cnt=state.detail.class_cnt
        state.visibleBaseInfo=true
        state.EditInfo=true
      },
      editBaseInfo:()=>{
        formRef.value.validate().then(()=>{
          let obj={
            id:id,
            name:formState.name,
            class_cnt:formState.class_cnt,
          }
          state.loading=true
          http.editBaseInfo({param:obj}).then((res:IBusinessResp)=>{
            $message.success('编辑成功')
            state.visibleBaseInfo=false
            state.loading=false
            state.EditInfo=false
            getContentDetail()
          })
        })
      },
      handleCancel:()=>{
        state.EditInfo=false
        formRef.value.clearValidate()
      },
      editEnvironmentInfo:()=>{
        if(state.EditEnvironment===false){
          state.EditEnvironment=true
          return
        }
        let containerList:any[]=[]
         formState.imageDataSelected.forEach((v:any)=>{
           let obj={
             image:v.id,
             flavor:v.flavor,
             is_use_gpu:v.is_use_gpuNumber===1?true:false
           }
           containerList.push(obj)
         })
        let obj={
          id:id,
          container:containerList,
        }
        state.loading=true
        http.editEnvironmentInfo({param:obj}).then((res:IBusinessResp)=>{
          state.loading=false
          $message.success('编辑成功')
          state.EditEnvironment=false
          getContentDetail()
        })
      },
      editDateSetInfo:()=>{
        // EditDateSet=true
        if(state.EditDateSet===false){
          state.EditDateSet=true
          return
        }
        let obj={
          id:id,
          dataset_ids:formState.datasets,
        }
        state.loading=true
        http.editDateSetInfo({param:obj}).then((res:IBusinessResp)=>{
          $message.success('编辑成功')
          state.loading=false
          state.EditDateSet=false
          getContentDetail()
        })
      },
      editGuideInfo:()=>{
        if(state.EditGuidance===false){
          state.EditGuidance=true
          return
        }
        let obj={
          id:id,
          detail:formState.guide,
        }
        state.loading=true
        http.editGuideInfo({param:obj}).then((res:IBusinessResp)=>{
          $message.success('编辑成功')
          state.EditGuidance=false
          state.loading=false
          getContentDetail()
        })
      },
      editTaskInfo:()=>{
        if(state.EditTask===false){
          state.EditTask=true
          return
        }
        let jupyter_tasks:any[]=[]
        formState.taskData.forEach((item: any, index: number) => {
          const temp = {
            type: 1,
            file_name: item.data.file_name,
            file_url: item.data.file_path,
            suffix: item.data.suffix,
            size: item.data.size,
            sort: index, 
          }
          jupyter_tasks.push(temp)
        })
        let obj={
          id:id,
          jupyter_tasks:jupyter_tasks,
        }
        state.loading=true
        http.editTaskInfo({param:obj}).then((res:IBusinessResp)=>{
          $message.success('编辑成功')
          state.EditTask=false
          state.loading=false
          getContentDetail()
        })
      },
      viewStep:(val:number)=>{
         router.push({
          path: '/teacher/teacherExperiment/ExperimentalStepsDetail',
          query: {
            stepId: val,
            currentTab:currentTab
          },
        })
      },
      // dataset_ids
      detail:{},
      selectType:'',
      visible:false,
      visibleBaseInfo:false,
      screenStatus:false,
      screenVmInfo:[],
      EditInfo:false,
      EditEnvironment:false,
      EditDateSet:false,
      EditTask:false,
      EditGuidance:false,
      environmentInfo:{
        cpu:0,
        ram:0,
        disk:0,
      },
      select:(val:string)=>{
        state.selectType = val
        state.visible = true
      },
      onClose:()=>{
        state.visible = false
        state.selectType = ''
        // formRef.value.validate()
      },
      removeDataSet:(val: IselectedName, index: number)=>{
        let i = formState.datasets.indexOf(val.uid);
        i != -1 ? formState.datasets.splice(i, 1) : "";
        formState.selectedName.splice(index, 1);
      }
    })
    let formState = reactive<IformState>({
      name: '',
      class_cnt: 2,
      datasets: [],
      selectedName: [],
      // 已选择镜像数据
      imageDataSelected: [],
      // 实验指导
      guide: '',
      taskData:[{ name:'', status: false }]
    })
    function getContentDetail(){
      http.getContentDetail({urlParams: {id: id}}).then((res:IBusinessResp)=>{
        state.detail=res.data
        let list=res.data.container
        list.map((v: IimageData) => {
            v.isSelect = false
            v.flavor={
              cpu:v.cpu,
              ram:v.ram,
              disk:v.disk
            }
            v.is_use_gpuNumber=v.is_use_gpu===false?0:1        
            v.showSelectGpu=(v.tag && v.tag.length && v.tag.includes('GPU'))?true:false
          })
        formState.imageDataSelected=list
        let data_set=res.data.data_set?res.data.data_set:[]
        formState.selectedName=data_set
        formState.datasets=data_set.length?data_set.reduce((pre:any, cur:any) => {
          pre.includes(cur.uid)===false && pre.push(cur.uid)
          return pre
        },[]):[]
        formState.guide=res.data.detail

        let taskFile=res.data.content_task_files?res.data.content_task_files:[]
        if(taskFile.length){
          let arr:any[]=[]
          taskFile.forEach((v:any) => {
            arr.push({
              data:{
                file_name:v.file_name,
                file_path:v.file_url,
                size:v.size,
                suffix:v.suffix,

              },
              status:true,
              name:v.file_name
            })
          });
          formState.taskData=arr
        }

        // Subcomponents  处理显示的详情组件   baseInfo  environment  dateSet  guide  task  ExperimentalSteps
        if(state.detail.task_type===4){     // 交互
          state.Subcomponents=['baseInfo','environment','dateSet','task']
          if(currentTab==='1'){     //内置
            if(state.detail.programing_type===0){  // notebook
              state.Subcomponents=['baseInfo','dateSet','task']
            }else{                       // webide
              state.Subcomponents=['baseInfo','guide']
            }
          }
        }else{
          state.Subcomponents=['baseInfo','environment','dateSet','guide']
          if(currentTab==='1'){
            state.Subcomponents=['baseInfo','environment','dateSet','guide','ExperimentalSteps']
          }
        }
        // console.log(state.Subcomponents)
        // console.log(formState)
      })
    }
    async function classCutValidator(rule: RuleObject, value: string){
      if (!value){
        return Promise.reject('请输入课时数')
      } 
      const reg = new RegExp('^([1-9]|[1][0-6])$')
      if(!reg.test(String(formState.class_cnt))){
        return Promise.reject('课时数为1~16之间整数')
      }
    }
    watch(()=>{return formState.imageDataSelected},(val:any)=>{
        state.environmentInfo={ cpu:0,ram:0,disk:0, }
        if(val.length){
          val.forEach((v:any)=>{
            state.environmentInfo.cpu+=Number(v.flavor.cpu)
            state.environmentInfo.ram+=Number(v.flavor.ram)/1024
            state.environmentInfo.disk+=Number(v.flavor.disk)
          })
        }
      // console.log(state.environmentInfo)
    },{immediate:true,deep:true})
    watch(()=>{return formState.taskData},(val:any)=>{
      // console.log(val)
    },{deep:true})
    var showEdit=computed(()=>{
      // v-if="currentTab==='0'"
      let sign=false
      return sign
    })
    onMounted(() => {
      getContentDetail()
    })
    return {...toRefs(state),formState,formRef,jupyterUuid,currentTab}
  }
})
</script>
<style scoped lang="less">
.ExperimentDetail{
  width:@center-width;
  margin: 0 auto;
  // border: 1px solid red;
  height: 100%;
  overflow: auto;
}
.box{
  width: 100%;
  padding-left: 32px;
  margin-bottom: 24px;
}
.flexCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.iconfont{
  cursor: pointer;
  color: @theme-color;
}
.data-item .wenjian,.cunchuzhi{
  cursor: auto;
}
.head{
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
  .left{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{
      color: rgba(0,0,0,.85);
      font-size: 16px;
      font-weight: 600;
    }
    .title-info{
      padding-left: 60px;
      color: #ff8f00;
      span{
        // color: #ff8f00;
        font-size: 12px;
        padding:0 20px;
      }
    }
  }
  .right{
    width: 60px;
    // text-align: center;
    i{
      padding-left: 9px;
    }
  }
}
.data-image-drawer{
  .image,.data{
    height: 100%;
    overflow: hidden;
  }
}
.base-info{
  padding: 18px 0 12px 32px;
  background: url('src/assets/images/teacherExperiment/base_info.jpg') no-repeat;
  background-size: 100% 100%;
  .left{
    .title{
      color: #050101;
      line-height: 33px;
      letter-spacing: 1px;
      font-size: 24px;
    }
    .base-footer{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .info{
        min-width: 420px;
        span{
          color: rgba(5,1,1,.65);
          font-size: 14px;
          margin-right: 50px;
        }
      }
      .label span{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin:6px 7px;
        background: #dce8ff;
        border: 1px solid #7b65fa;
        font-size: 12px;
        color: #7b65fa;
        line-height: 20px;
        border-radius: 14px;
        padding: 0px 22px;
        display: inline-block;
      }
    }
  }
  .right{
    width: 60px;
    text-align: center;
    .inonBox{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #ebeff8;
      line-height: 34px;
      text-align: center;
    }
  }
}
.maxAdd{
  .add-btn {
      width: 112px;
      height: 32px;
      border: 1px solid @theme-color;
      border-radius: 4px;
      color: @theme-color;
      .iconfont {
        font-weight: 600;
        font-size: 18px;
      }
   }
   .max-hint{
     color: rgba(5, 1, 1, 0.25);
    font-size: 12px;
    margin-left: 14px;
   }
}
.environmentDataBox{
  padding-right: 30px;
}
.data-list-box {
  padding-right: 30px;
  .data-item {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background: #f5f5f5;
    line-height: 38px;
    margin-top: 16px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .data-name {
      flex: 1;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .shanchu {
      width: 20px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .iconfont {
      color: rgba(0,0,0,.45);
      font-size: 14px;
    }
    .wenjian {
      margin-right: 50px;
    }
    .cunchuzhi {
      margin-right: 170px;
    }
  }
}
.task{
  .taskContent{
    padding-right: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item{
      width:46%;
      line-height: 44px;
      border: 1px solid @theme-color;
      font-size: 14px;
      color: #050101;
      margin-bottom: 14px;
      border-radius: 6px;
      padding: 0 14px;
    }
  }
}
.markdownBox{
  padding-right: 30px;
  .markdown__editor {
    min-height: 300px;
  }
}
.ExperimentalSteps{
  padding: 40px 30px 40px 0;
  .item{
    border: 1px solid @theme-color;
    border-radius: 6px;
    line-height: 44px;
    display: flex;
    justify-content: space-between;
    padding: 0 14px;
    margin-bottom: 15px;
    .name{
      color: #050101;
      font-size: 14px;
    }
    .detaile{
      color: @theme-color;
      cursor: pointer;
    }
  }
}
</style>