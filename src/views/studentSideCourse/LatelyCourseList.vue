<template>
  <div class="list_content">
    <!-- <a-spin v-if="loading" tip="Loading..." size="large" /> -->
    <div class="list_item" v-for="v in list" :key="v.course_student_id">
      <div class="time">{{v.study_time}}</div>
      <div class="info">
        <div class="card" @click="startLearning(v.course_student_id)">
          <div class="mask">
            {{v.course_status}}
          </div>
          <div class="card_pic">
            <img :src="v.course_url" />
          </div>
        </div>
        <div class="card_info">
          <div class="title" @click="startLearning(v.course_student_id)">
            <span>已学{{v.progress}}%</span>
            <div>{{v.name}}</div>
          </div>
          <p class="status">{{v.between_time}}</p>
          <p class="status">
            <span class="iconfont icon-jiaoshi1"></span>
            <span>教师</span>
            <span>{{v.userName}}</span>
          </p>
          <p class="status">
            <span class="iconfont icon-daojishi"></span>
            <span>用时</span>
            <span>{{v.used_time}}</span>
            <span>学至</span>
            <span>{{v.recent}}</span>
          </p>
        </div>
        <div class="start_training" v-if="v.course_status==='进行中'">
          <a-button @click="startLearning(v.course_student_id)" type="primary"> 继续学习 </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref } from 'vue'
import { useRouter } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
interface IlistItem{
  course_url:string,
  name:string;
  study_time:string;
  course_status:string;
  status:number;
  progress:number;
  between_time:string;
  used_time:string;
  recent:string;
  userName:string;
  course_student_id:number;
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var defaultUrl:string='/src/assets/images/studentcourse/course-default1.jpg'
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).studentCourse
    function initData(){
      loading.value=true
      http.getLatelyCourseList().then((res:IBusinessResp)=>{
        loading.value=false
        list.push(...res.data)
        list.length?list.map((v:IlistItem)=>{
          v.course_url=v.course_url?v.course_url:defaultUrl
        }):''
      })
    }
    function startLearning(id:number) {
      router.push('/studentSideCourse/ContinueDetail?DetailId='+id)
    }
    onMounted(()=>{
     initData()
    })
    return {list,loading,startLearning };
  },
})
</script>

<style  scoped lang="less">
  .ant-spin-spinning{
      margin-top: 200px;
    }
    .list_content{
      .list_item{
        border-left: 1px solid @theme-color;
        position: relative;
        padding: 0px 100px 16px 24px;
        margin-left: 5px;
        &::before{
          position: absolute;
          content: '';
          width: 10px;
          height: 10px;
          border: 1px solid @theme-color;
          border-radius: 50%;
          top: 0;
          left: -5px;
          background-color: @white;
        }
        .time{
          color: rgba(5,1,1,0.85);
          font-size: 18px;
          font-weight: 400;
          margin-bottom: 10px;
        }
      }
      .info{
        // margin: 16px 0;
        // padding-bottom: 10px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #E5E5E5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        .card{
          position: relative;
          width: 290px;
          height: 166px;
          cursor: pointer;
        }
        .mask{
          position: absolute;
          right: 0px;
          top: 20px;
          width:64px;
          height: 24px;
          background-color: #60AE34;
          text-align: center;
          line-height: 24px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          cursor: auto;
          color: @white;
        }
        .card_pic{
          // position: absolute;
          width: 100%;
          height: 100%;
          // background: url('../../assets/images/Experimental/cover5.png') no-repeat center 100%/100%;
          img{
            width: 100%;
            height: 100%;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
        }
        .card_info{
          flex: 1;
          padding-left: 24px;
          font-size: 14px;
          h3{
            font-weight: 600;
            color: #333;
            margin-bottom: 14px;
          }
          .title{
            font-size: 18px;
            color: #333;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            span{
              width: 70px;
              height: 24px;
              background-color: #FF8F00;
              color: white;
              font-size: 14px;
              text-align: center;
              line-height: 24px;
              border-radius: 4px;
              margin-right: 14px;
            }
          }
          .status{
            // margin-bottom: 10px;
            color: rgba(0,0,0,0.45);
            span{
              padding-right:14px;
            }
          }
        }
        .start_training{
          padding: 123px 20px 0 0;
        }
      }
    }
  </style>
