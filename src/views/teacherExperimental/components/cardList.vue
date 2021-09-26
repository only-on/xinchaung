<template>
  <div class="cardList">
    <div class="cardBox mySelfCreate"  v-if="trainType === 0">
      <span>新建实训</span>
    </div>
    <div class="cardBox" v-for="(item,index) in dataList" :key="index.toString()">
      <div class="cardpic">
        <img src="../../../assets/images/Experimental/train.png" alt="" class="pic-train" v-if="item.is_highconf && trainType !== 2">
        <img :src="item.url ? item.url: defaultImg" alt="">
        <span :class="['stateClass', item.status === '已结束' ? 'end' : item.status === '进行中' ? 'onGoing' : 'noStart' ]" v-if="trainType === 0">{{item.status}}</span>
      </div>
      <!-- 我的实训 -->
      <div v-if="trainType === 0">
        <ul class="cardinfo">
          <li class="train-title">{{item.name}}</li> 
          <li class="train-time"><span>{{item.start_time}}</span> ~ <span>{{item.end_time}}</span></li>
          <li class="desc-status">
            <span>
              任务描述状态:
              <a-switch checked-children="开启" un-checked-children="关闭" :checked="item.is_open ? true: false" @change="changeSwitch(item)"/>
            </span>
            <span>
              <i class="iconfont icon-fuyong" title="复用" @click="handleOperate(item.id, 'Complex')"></i>
              <i v-if="item.status === '已结束'" class="iconfont icon-guidang" title="归档" @click="handleOperate(item.id, 'Archived')"></i>
              <i v-if="item.status === '未开始'" class="iconfont icon-shanchu" title="删除" @click="handleOperate(item.id, 'Deleted')"></i>
            </span>
          </li>
        </ul>
        <ul class="cardfoot cardcount">
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
            <span>{{item.stu_num}}</span>
          </li>
        </ul>
        <ul class="cardfoot cardbtn">
          <li>考核</li>
          <li>资源</li>
          <li>环境</li>
        </ul>
      </div>
      <!-- 内置实训 -->
      <div v-if="trainType === 1" class="init">
        <ul class="cardinfo">
          <li class="train-title">{{item.name}}</li>
        </ul>
        <ul class="cardfoot1">
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
        </ul>
        <ul class="cardfoot cardbtn">
          <li>内容</li>
          <li>资源</li>
          <li>保存到我的</li>
        </ul>
      </div>
      <!-- 归档实训 -->
      <div v-if="trainType === 2" class="archive">
        <ul class="cardinfo">
          <li class="train-title">{{item.name}}</li>
        </ul>
        <ul class="cardfoot1">
          <li>
            <i class="iconfont icon-renwu"></i>
            归档时间：
            <span>{{item.archive_time}}</span>
          </li>
        </ul>
        <ul class="cardfoot cardbtn">
          <li>详情</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, toRef, reactive } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperimentalHttp } from '../typings'
import { message } from 'ant-design-vue';
export default defineComponent({
  props: ['trainType', 'data'],
  setup(props,{emit}) {
    const http=(request as ITeacherExperimentalHttp).teacherExperimental
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
        emit('refresh')
      })
    }
    function handleOperate (id:number, type:string) {
      http['train'+type]({param:{train_id: id}}).then((res:IBusinessResp) => {
        message.success(res.error ? res.error :'操作成功')
        emit('refresh')
      })
    }
    return {
      switchVal,
      trainType,
      dataList,
      changeSwitch,
      handleOperate,
      defaultImg: '/src/assets/images/Experimental/wlkc.png'
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
  box-shadow: 0px 2px 4px 0px rgba(164,36,167,0.14);
  margin: 0 1% 20px;
  &.mySelfCreate{
    height: 277px;
    border: 1px dashed @theme-color;
    cursor: pointer;
    background: url('../../../assets/images/Experimental/createdTrain.png') no-repeat 50% 30%;
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
    padding: 0 14px;
    .train-title{
      line-height: 35px;
      font-size: 16px;
      color: #000;
      cursor: pointer;
    }
    .train-time{
      color: #8c8c8c;
    }
    .desc-status{
      display: none;
      color: #8c8c8c;
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
    height: 40px;
    margin-bottom: 0;
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
        height: 14px;
        right: 0;
        top: 6px;
        background-color: #ececec;
      }
    }
    &.cardbtn{
      background: #fafafa;
      border-radius: 0 0 10px 10px;
      li{
        font-size: 14px;
        cursor: pointer;
        &:hover{
          color: @theme-color;
        }
      }
      display: none;
    }
  }
  // 内置
  .init{
    .cardinfo{
      margin-bottom: 0;
    }
    .cardbtn{
      background: #fff;
    }
  }
  // 归档
  .archive{
    .cardinfo{
      margin-bottom: 0;
    }
    .cardbtn{
      li{
        color: @theme-color;
      }
    }
  }
  &:hover{
    .train-time{
      display: none;
    }
    .desc-status{
      display: flex;
      justify-content: space-between;
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
    line-height: 40px;
    margin-bottom: 0;
    li{
      color: #898989;
      margin-right: 20px;
    }
  }
}
</style>
