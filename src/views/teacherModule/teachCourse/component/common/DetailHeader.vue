<template>
  <div class="courseHeader">
    <div class="infoBox flexCenter">
      <div class="LeftBox">
        <breadcrumb />
        <div class="termOfValidity">
          <span v-if="isShowCourseDetail">2022 / 02 /23 - 2022 / 02 /24</span>
        </div>
        <div class="titleBox flexCenter">
          <div class="title">玩转组件库搭建流程</div>
          <!-- class = endState -->
          <div class="state" v-if="isShowCourseDetail">进行中</div>
        </div>
        <div class="info">
          <div class="details flexCenter">
            <div class="item">
              <span>章节</span>
              <span class="num num2">4</span>
            </div>
            <div class="item">
              <span>实验</span>
              <span class="num num2">22</span>
            </div>
            <div class="item">
              <span>课时</span>
              <span class="num num2">12</span>
            </div>
            <div class="item">
              <span>课程方向</span>
              <span class="num num2">深度学是发是</span>
            </div>
            <div class="item">
              <span>职业方向</span>
              <span class="num" :class="isShowCourseDetail?'num2':''">深度学发是发是</span>
            </div>
            <div class="item" v-if="isShowCourseDetail">
              <span>实验成绩</span>
              <span class="num num2">100分</span>
            </div>
            <div class="item" v-if="isShowCourseDetail">
              <span>实验时长</span>
              <span class="num">30分钟</span>
            </div>
          </div>
          <div class="user flexCenter">
            <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
            <div class="name flexCenter" v-if="currentTab && Number(currentTab) === 1">
              <div class="chart"></div>
              <div class="userName">教师名字</div>
            </div>
            <div class="tags">
              <span>标签1/标签2/</span>
              <!-- <span>{{`${props.info.tags.join('/')}`}}</span> -->
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="flexCenter caozuo" v-if="currentTab && Number(currentTab) === 0 && role === 3">
          <a-button class="brightBtn" type="primary" @click="setup()">设置</a-button>
          <a-button type="primary"  @click="edit()">编辑</a-button>
        </div>
        <div v-if="role === 4">
          学习累计用时
        </div>
      </div>
    </div>
    <div class="courseDetailTab flexCenter">
      <div class="tabBox flexCenter" v-if="props.tabs.length">
        <span v-for="v in props.tabs" :key="v" :class="activeTab.name === v.name?'active':''" @click="selectTab(v)">{{v.name}}</span>
      </div>
    </div>
  </div>
  
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
const router = useRouter();
const route = useRoute();
const { currentTab,course_id } = route.query;
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const http = (request as any).teacherImageResourcePool;
interface Props {
  info: any;
  tabs?:any
}
const props = withDefaults(defineProps<Props>(), {
  info: () => {},
  tabs:() => [],  // [{name:'课程章节',value:1}] 可自定义value   父组件需要什么值判断   选中tab之后 返回item 和value 值
});

const emit = defineEmits<{
  (e: "selectTab", val: any): void;
  (e: "setupCourse"): void;
  (e: "editCourse"): void;
}>();
var activeTab:any=reactive({
  name:'',
  value:''
})
if(props.tabs && props.tabs.length){
  var {name,value}=props.tabs[0]
  activeTab.name=name,
  activeTab.value=value
}
const selectTab=(v:any)=>{
  activeTab.name=v.name,
  activeTab.value=v.value
  emit("selectTab", v);
}
const isShowCourseDetail=computed(()=>{
  let flag=false
  if((currentTab && Number(currentTab) === 0) || role === 4){
    flag=true
  }
  return flag
})

const setup=()=>{
  emit("setupCourse")
}
const edit=()=>{
  emit("editCourse")
}
// 
</script>
<style scoped lang="less">

.courseHeader{
  // height: 200px;
  background: url('src/assets/images/teacherCourse/courseHeader.jpg') no-repeat;
  background-size: 100% 100%;
  color: var(--white);
  .infoBox{
    width: var(--center-width);
    margin: 0 auto;

    .LeftBox{
     padding : 14px 0;
     width: 940px;
      .termOfValidity{
        color: #37E6AE;
        font-size: 12px;
        height: 40px;
        line-height: 40px;
      }
      .titleBox{
        .title{
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 38px;
          letter-spacing: 2.1px;
          // padding-top: 20px;
        }
        .state{
          width: 60px;
          height: 24px;
          background: var(--primary-color);
          border-radius: 4px;
          text-align: center;
          margin-left: 10px;
        }
        .endState{
          background: #98a4b9;
        }
      }
      .info{
        // justify-content: space-between;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // height: 50px;
        // line-height: 50px;
        .user{
          padding-top: 16px;
          .chart{
            width: 19px;
            height: 19px;
            border-radius: 50%;
            background-color: #ffffff;
            background-size: 100% 100%;
          }
          .userName{
            margin: 0 20px 0 6px;
          }
          .tags{
            padding: 0 1rem;
            background: rgba(255,149,68,0.24);
            border-radius: 10px;
            span{
              color: var(--primary-color);
            }
          }
        }
        .details{
          flex-wrap: wrap;
          .item{
            margin-right: 16px;
            letter-spacing: 0.98px;
            .num{
              padding-left: 10px;
              margin-right: 14px;
              color: var(--white-85);
              opacity: 0.85;
            }
            .num2{
              position: relative;
              &::after{
                position: absolute;
                content: '';
                width: 2px;
                height: 2px;
                background: var(--white);
                border-radius: 50%;
                top: 50%;
                right: -16px;
              }
            }
          }
        }
      }
    }
    .rightBox{
      flex: 1;
      .caozuo{
        .brightBtn{
          margin-right: 1rem;
        }
      }
    }
  }
  .courseDetailTab{
    width: var(--center-width);
    margin: 0 auto;
    .tabBox{
      // height: 70px;
      padding-top: 34px;
      border-top: 1px dashed rgba(255,255,255,0.24);
      span{
        border-bottom: 4px solid transparent;
        margin-right: 70px;
        padding-bottom: 8px;
        cursor: pointer;
        // padding: ;
      }
      .active{
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
  }
}
</style>
