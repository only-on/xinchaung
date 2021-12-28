<template>
  <div class="cardList">
    <div class="cardBox mySelfCreate"  v-if="trainType === 0" @click="router.push('/teacher/teacherTrain/creatTrain')">
      <span>新建实训</span>
    </div>
    <div class="cardBox" v-for="(item,index) in dataList" :key="index.toString()"  @click="editExperimental(item.id,trainType)">
      <div class="cardpic">
        <img src="../../../assets/images/Experimental/train.png" class="pic-train" v-if="item.is_highconf && trainType !== 2">
        <!-- <img :src="item.url ? item.url: defaultImg" alt=""> -->
        <img :src="item.url">
        <span :class="['stateClass', item.status === '已结束' ? 'end' : item.status === '进行中' ? 'onGoing' : 'noStart' ]" v-if="trainType === 0">{{item.status}}</span>
      </div>
      <!-- 我的实训 -->
      <div v-if="trainType === 0">
        <div class="cardinfo">
          <li class="train-title">{{item.name}}</li> 
          <li class="train-time"><span>{{item.start_times}}</span> ~ <span>{{item.end_times}}</span></li>
          <li class="desc-status">
            <span @click.stop>
              任务描述状态:
              <a-switch checked-children="开启" un-checked-children="关闭" :checked="item.is_open ? true: false" @change="changeSwitch(item)"/>
            </span>
            <span>
              <i class="iconfont icon-fuyong" title="复用" @click.stop="handleOperate(item.id, 'Complex')"></i>
              <i v-if="item.status === '已结束'" class="iconfont icon-guidang" title="归档" @click.stop="planceOnFile(item.id, 'Archived')"></i>
              <i v-if="item.status === '未开始'" class="iconfont icon-shanchu" title="删除" @click.stop="deleteTrain(item.id, 'Deleted')"></i>
            </span>
          </li>
        </div>
        <div class="cardfoot cardcount">
          <li>
            <i class="iconfont icon-renwu"></i>
            实验
            <span>{{item.task_num}}</span>
          </li>
          <li>
            <i class="iconfont icon-shijian1"></i>
            课时
            <span>{{item.class_cnt}}</span>
          </li>
          <li>
            <i class="iconfont icon-renshu"></i>
            学生
            <span>{{item.user_num}}</span>
          </li>
        </div>
        <div class="cardfoot cardbtn">
          <li @click.stop="evaluate(item.id)">考核</li>
          <li @click.stop="resource(item.id)">资源</li>
          <li @click.stop="virtualEnv(item.id)">环境</li>
        </div>
      </div>
      <!-- 内置实训 -->
      <div v-if="trainType === 1" class="init">
        <div class="cardinfo">
          <li class="train-title">{{item.name}}</li>
        </div>
        <div class="cardfoot1">
          <li>
            <i class="iconfont icon-renwu"></i>
            实验
            <span>{{item.task_num}}</span>
          </li>
          <li>
            <i class="iconfont icon-shijian1"></i>
            课时
            <span>{{item.class_cnt}}</span>
          </li>
        </div>
        <div class="cardfoot cardbtn">
          <li>内容</li>
          <li @click.stop="resource(item.id)">资源</li>
          <li @click.stop="handleOperate(item.id, 'Complex')">保存到我的</li>
        </div>
      </div>
      <!-- 归档实训 -->
      <div v-if="trainType === 2" class="archive">
        <div class="cardinfo">
          <li class="train-title">{{item.name}}</li>
        </div>
        <div class="cardfoot1">
          <li>
            <i class="iconfont icon-renwu"></i>
            归档时间：
            <span>{{item.created_time}}</span>
          </li>
        </div>
        <div class="cardfoot cardbtn">
          <li>详情</li>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, toRef, reactive } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherTrainHttp } from '../typings'
import { message } from 'ant-design-vue';
import { useRouter, useRoute, RouteParamsRaw } from 'vue-router'
import defaultImg from 'src/assets/images/Experimental/wlkc.png'
export default defineComponent({
  props: ['trainType', 'data'],
  setup(props,{emit}) {
    const http=(request as ITeacherTrainHttp).teacherTrain
    const router = useRouter();
    // const route = useRoute();
    // const {currentTab}= route.query
    var switchVal=ref<boolean>(false)
    var trainType = ref<number>(props.trainType)
    var dataList = ref<any>(props.data)
    watch(()=>props.trainType, (newVal) => {
      trainType.value = newVal
    })

    watch(()=>props.data, (newVal) => {
      dataList.value = newVal
    })
    function changeSwitch (item:any) {
      item.is_open =item.is_open == 1 ? 0 : 1
      let params = {
        train_id: item.id,
        is_open: item.is_open
      }
      http.changeStatus({param: params}).then((res:IBusinessResp) => {
        message.success('操作成功')
        // emit('refresh')
      })
    }
    function handleOperate (id:number, type:string) {
      // http['train'+type]({param:{train_id: id}}).then((res:IBusinessResp) => {
      //   message.success(res.error ? res.error :'操作成功')
      //   emit('refresh')
      // })
      http.trainComplex({urlParams:{train:id}}).then((res:IBusinessResp) => {
        message.success(res.error ? res.error :'操作成功')
        emit('refresh')
      })
    }
    function planceOnFile(id:number, type:string){
      http.fileTrain({param:{id:[id]}}).then((res:any)=>{
        console.log(res)
        message.success('实训归档成功！')
      })
    }
    function deleteTrain(id:number, type:string){
      http.deleteTrain({urlParams:{train:id}}).then((res:any)=>{
        console.log(res)
        emit('refresh')
      })
    }
    function editExperimental(id:number,trainType: number){
      router.push({path:'/teacher/teacherTrain/detail',query:{id:id,currentTab:trainType}})
    }
    // 考核
    // const evaluate = (id: number) => {
    //   router.push('/teacher/teacherTrain/evaluate?trainId=' + id)
    // }
    function evaluate(id: number){
      console.log('考核')
      router.push('/teacher/teacherTrain/evaluate?trainId=' + id)
    }

    // 资源

    // const resource = (id: number) => {
    //   let param = {
    //     trainType: trainType.value,
    //     trainId: id
    //   }
    //   router.replace({
    //     path: '/teacher/teacherTrain/resource',
    //     query: param
    //   })
    // }
    function resource(id: number){
      console.log('资源')
      let param = {
        trainType: trainType.value,
        trainId: id
      }
      router.push({
        path: '/teacher/teacherTrain/resource',
        query: param
      })
    }

    // 环境
    // const virtualEnv = (id: number) => {
    //   let param = {
    //     type: 'train',
    //     taskId: id
    //   }
    //   router.replace({
    //     path: '/teacher/teacherTrain/virtualEnv',
    //     query: param
    //   })
    // }
    function virtualEnv(id: number){
      console.log('环境')
      let param = {
        type: 'train',
        taskId: id
      }
      router.push({
        path: '/teacher/teacherCourse/virtualEnv',
        query: param
      })
    }
    return {
      switchVal,
      trainType,
      dataList,
      changeSwitch,
      handleOperate,
      planceOnFile,
      deleteTrain,
      defaultImg,
      router,
      editExperimental,
      evaluate,
      virtualEnv,
      resource,
    }
  },
})
</script>
<style lang="less" scoped>
.cardList{
  display: flex;
  flex-wrap: wrap;
}
.cardBox{
  width: 23%;
  // height: 280px;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.07) ;
  margin: 0 2% 20px 0px;
  &.mySelfCreate{
    height: 277px;
    border: 1px dashed @theme-color;
    cursor: pointer;
    background: url('src/assets/images/Experimental/createdTrain.png') no-repeat 50% 30%;
    position: relative;
    span{
      position: absolute;
      top: 70%;
      width: 100%;
      left: 0;
      text-align: center;
      font-size: 20px;
      color: @theme-color;
    }
  }
  &:not(.mySelfCreate):hover{
    box-shadow: 0px 7px 7px 0px rgba(164,36,167,0.22); 
  }
  .cardpic{
    width: 100%;
    height: 166px;
    overflow: hidden;
    position: relative;
    border-radius: 10px 10px 0 0;
    .pic-train{
      position: absolute;
      left: 0;
      z-index: 1;
    }
    img:not(.pic-train){
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition: 0.5s;
      &:hover{
        transform: scale(1.5);
      }
    }
    .stateClass{
      position: absolute;
      width: 64px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      top: 20px;
      right: 0;
      border-radius: 12px 0px 0px 12px;
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.50);
      &.end{
        background: #373737;
        color: #8a8a8a;
      }
      &.noStart{
        background: @white; 
        color: #acacac;
      }
      &.onGoing{
        background: #60ae34;
        color: @white;
      }
    }
  }
  .cardinfo{
    height: 100%;
    // padding: 0 14px;
    font-size: 14px;
    .train-title{
      font-size: 16px;
      line-height: 16px;
      color: #000;
      cursor: pointer;
      font-weight: 500;
      margin-top: 8px;
      margin-bottom: 12px;
      padding:0 14px;
    }
    .train-time{
      color: @text-color-secondary;
      margin-bottom: 12px;
      padding:0 14px;
    }
    .desc-status{
      display: none;
      color: @text-color-secondary;
      padding: 0 14px;
      .iconfont:hover{
        color: @theme-color;
      }
      i{
        cursor: pointer;
        margin-left: 10px;
        font-size: 14px;
      }
      .ant-switch-checked{
        background: #FF9C00;
      }
      .ant-switch{
        width: 69px;
      }
    }
  }
  .cardfoot{
    display: flex;
    justify-content: space-between;
    align-items: center;
    li{
      width: 100%;
      text-align: center;
      position: relative;
      color: #898989;
      font-size: 12px;
      i{
        font-size: 16px;
      }
      &:not(:last-child)::after{
        content: '';
        position: absolute;
        width: 1px;
        // height: 14px;
        right: 0;
        top: 6px;
        background-color: #ececec;
      }
    }
    &.cardbtn{
      background: #fafafa;
      border-radius: 0 0 10px 10px;
      margin-top: 12px;
      height:40px;
      border-top: 1px solid #E9E9E9;
      box-sizing: border-box;
      li{
        font-size: 14px;
        cursor: pointer;
        border-right: 1px solid #E9E9E9;
        &:hover{
          color: @theme-color;
        }
      }
      :nth-last-child(1){
        border: none;
      }
      display: none;
    }
  }



  // 内置
  .init{
    .cardbtn{
      margin-top: 24px;
      background: #fafafa;
      box-sizing: border-box;
      height: 41px;
    }
  }



  // 归档
  .archive{
    .cardbtn{
      margin-top: 24px;
      background: #fafafa;
      box-sizing: border-box;
      height: 40px;
    }
  }
  &:hover{
    .train-time{
      display: none;
    }
    .desc-status{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    & .cardfoot.cardcount{
      display: none;
    }
    .cardfoot.cardbtn{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cardfoot1{
      display: none;
    }
  }
  .cardfoot1{
    display: flex;
    padding: 0 14px;
    margin-top:16px;
    margin-bottom: 24px;
    li{
      color: #898989;
      margin-right: 20px;
      font-size: 14px;
    }
  }
}
.cardBox:hover{
  box-shadow: 0 7px 7px 0 rgba(0,0,0,0.07)   
}
</style>
