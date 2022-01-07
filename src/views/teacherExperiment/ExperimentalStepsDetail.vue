<template>
  <div class="ExperimentDetail setScrollbar">
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <!-- 基础信息 -->
      <div class="base-info box flexCenter">
        <div class="left">
          <div class="title">{{detail.name}}</div>
          <div class="base-footer">
            <div class="label">
              <span v-for="v in detail.step_knowledge" :key="v">{{v}}</span>
              <!-- <span v-for="v in 6" :key="v">{{`知识点${v}`}}</span> -->
            </div>
          </div>
        </div>
        <div class="right">
          <div class="inonBox">
            <i class="iconfont icon-fanhui" @click="goBack"></i>
          </div>
        </div>
      </div>
      <!-- 步骤概述 -->
      <div class="box">
        <div class="head">
          <div class="left">
            <div class="title">步骤概述</div>
          </div>
          <div class="right">
            <!-- <i class="iconfont" :class="2===2?'icon-baocun':'icon-bianji1'" @click="editGuideInfo"></i> -->
          </div>
        </div>
        <div class="markdownBox">
          <antdv-markdown v-model="detail.summary"  :preview-only="true" class="markdown__editor"/>
        </div>
      </div>
     <!-- 步骤详情 -->
      <div class="box">
        <div class="head">
          <div class="left">
            <div class="title">步骤详情</div>
          </div>
          <div class="right">
            <!-- <i class="iconfont" :class="2===2?'icon-baocun':'icon-bianji1'" @click="editGuideInfo"></i> -->
          </div>
        </div>
        <div class="markdownBox">
          <antdv-markdown v-model="detail.detail"  :preview-only="true" class="markdown__editor"/>
        </div>
      </div>
      
    </a-spin>
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
  loading:boolean
  detail:any
  goBack:() => void;
}
interface IformState{
  guide:any
}
export default defineComponent({
  components:{envList,dataSet, environment,sameScreen,taskList,AntdvMarkdown},
  setup(){
    let route = useRoute()
    let router = useRouter()
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teacherExperiment
    const {stepId}=route.query
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:true,showContent:false,componenttype:undefined,showNav:true})
    const state:Istate=reactive({
      loading:false,
      detail:{},
      goBack:()=>{
        router.go(-1)
      }
    })
    let formState = reactive<IformState>({
      guide: '',
    })
    function taskStepDetail(){
      http.taskStepDetail({urlParams: {id: stepId}}).then((res:IBusinessResp)=>{
            state.detail=res.data
            state.detail.step_knowledge=(res.data.step_knowledge_map_names && res.data.step_knowledge_map_names.knowledge_name)?res.data.step_knowledge_map_names.knowledge_name.split():[]
            // console.log(state.detail)
          })
    }
    onMounted(() => {
      taskStepDetail()
    })
    return {...toRefs(state),formState}
  }
})
</script>
<style scoped lang="less">
.ExperimentDetail{
  width:var(--center-width);
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
.head{
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
  margin-bottom: 24px;
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
.iconfont{
  cursor: pointer;
  color: var(--purpleblue-6);
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
    margin-right: 20px;
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
.markdownBox{
  padding-right: 30px;
  .markdown__editor {
    min-height: 200px;
  }
}
</style>