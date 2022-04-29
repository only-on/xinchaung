<template>
  <div class="courseHeader">
    <div class="infoBox">
      <div class="LeftBox">
        <breadcrumb />
        <div class="termOfValidity">
          <span v-if="isShowCourseDetail && info.start_time && info.end_time">{{info.start_time.split(' ')[0]}} - {{info.end_time.split(' ')[0]}}</span>
        </div>
        <div class="titleBox flexCenter">
          <div class="title">{{info.name}}</div>
          <!-- class = endState -->
          <div class="state" v-if="isShowState">{{`${['已结束','未开始','进行中'][info.state-1]}`}}</div>
        </div>
        <div class="info">
          <div class="details flexCenter">
            <div class="item">
              <span>章节</span>
              <span class="num num2">{{info.chapter_total}}</span>
            </div>
            <div class="item">
              <span>实验</span>
              <span class="num num2">{{info.content_total}}</span>
            </div>
            <div class="item">
              <span>课时</span>
              <span class="num num2">{{info.class_total}}</span>
            </div>
            <div class="item">
              <span>课程方向</span>
              <span class="num num2">{{info.category}}</span>
            </div>
            <div class="item">
              <span>职业方向</span>
              <span class="num" :class="isShowCourseDetail?'num2':''">{{info.direction}}</span>
            </div>
            <div class="item" v-if="isShowCourseDetail">
              <span>实验成绩</span>
              <span class="num num2">{{info.content_score}}分</span>
            </div>
            <div class="item" v-if="isShowCourseDetail">
              <span>实验时长</span>
              <span class="num">{{info.content_duration}}分钟</span>
            </div>
          </div>
          <div class="user flexCenter">
            <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
            <div class="name flexCenter" v-if="(Number(currentTab) === 1 && role===3) || role===4">
              <div class="chart"></div>
              <div class="userName">{{info.user_name}}</div>
            </div>
            <div class="tags">
              <!-- <span>标签1/标签2/</span> -->
              <span>{{(info.tag && info.tag.length)?`${info.tag.join(' / ')}`:''}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <!-- 教师端我的教学 -->
        <div v-if="currentTab && Number(currentTab) === 0 && role === 3" class="flexCenter caozuo">
          <a-button class="brightBtn" type="primary" @click="setup()">设置</a-button>
          <a-button type="primary"  @click="edit()">编辑</a-button>
        </div>
        <!-- 学生端 -->
        <div class="student flexCenter" v-if="role === 4">
          <div class="timeUse ">
            <div class="date">
              <div class="item1">
                <!-- <span>123</span>小时
                <span>45</span>分钟 -->
                <span>{{info.used_time}}</span>
              </div>
              <div class="item2">学习累计用时</div>
            </div>
            <div class="ratio">
              <div class="item3">
                <span>{{info.learned_content_total}}</span>
                <span>/{{info.content_total}}</span>
              </div>
              <div class="item4">
                <div class="progress-inner" :style="{ width: '50%' }"></div>
              </div>
              <div class="item5">
                <span>课程完成率</span>
                <span>{{info.progress}}%</span>
              </div>
            </div>
          </div>
          <div class="img"></div>
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
  activeTabOrder?:number
}
const props = withDefaults(defineProps<Props>(), {
  info: () => {},
  tabs:() => [],  // [{name:'课程章节',value:1}] 可自定义value   父组件需要什么值判断   选中tab之后 返回item 和value 值
  activeTabOrder:0      // 默认选中第几个tab  传tab 数组的下标。
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
const selectTab=(v:any)=>{
  activeTab.name=v.name,
  activeTab.value=v.value
  emit("selectTab", v);
}
if(props.tabs && props.tabs.length){
  var {name,value}=props.tabs[0]
  activeTab.name=name,
  activeTab.value=value
  if(props.activeTabOrder && props.activeTabOrder <= props.tabs.length){
    selectTab(props.tabs[props.activeTabOrder])
  }else{
    selectTab(props.tabs[0])
  }
}


const isShowCourseDetail=computed(()=>{
  let flag=false
  if((currentTab && Number(currentTab) === 0) && role === 3){
    flag=true
  }
  return flag
})
const isShowState=computed(()=>{
  let flag=false
  if((role === 3 && Number(currentTab) === 0) || role === 4){
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
    // padding : 14px 0;
    display: flex;

    .LeftBox{
     width: 940px;
     padding : 14px 0;
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
            background-image: url('src/assets/images/user/teacher.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
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
        margin-top: 4rem;
        .brightBtn{
          margin-right: 1rem;
        }
      }
      .student{
        justify-content: end;
        height: 100%;
        align-items: end;
        .timeUse{
          // flex-direction: column;
          margin-bottom: 14px;
          .date{
            margin-bottom: 20px;
            font-size: 12px;
            .item1{
              color: #FFBA49;
              span{
                font-size: 20px;
              }
            }
          }
          .ratio{
            font-size: 12px;
            .item3{
              span:nth-child(1){
                font-size: 20px;
                color: #00CBC2;
              }
            }
            .item4{
              width: 150px;
              height: 6px;
              background: rgba(255, 255, 255,.2);
              border-radius: 3px;
              .progress-inner{
                height: 100%;
                background: #00CBC2;
                border-radius: 2px;
              }
            }
            .item5{
              span:nth-child(2){
                color: #00CBC2;
              }
            }
          }

        }
        .img{
          width: 121px;
          height: 139px;
          background: url('src/assets/images/teacherCourse/courseHeader.jpg') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .courseDetailTab{
    width: var(--center-width);
    margin: 0 auto;
    .tabBox{
      // height: 70px;
      width: 100%;
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
