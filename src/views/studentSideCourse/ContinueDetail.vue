<template>
  <div class="course_info" v-layout-bg="{bg,size:'234px'}">
    <div class="header">
      <div class="title">
        <div class="left">
          <div>{{info.name}}</div>
          <span>{{info.course_status}}</span>
        </div>
        <span class="iconfont icon-fanhui"></span>
      </div>
      <div class="info">
        <div class="left">
          <div class="item">
            <span>{{info.chapters}}</span>
            <span>章节</span>
          </div>
          <div class="line"></div>
          <div class="item">
            <span>{{info.contents}}</span>
            <span>实验</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.category}}</span>
            <span>课程方向</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.direction}}</span>
            <span>职能方向</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.between_time}}</span>
            <span>课程时间</span>
          </div>
        </div>
        <span class="iconfont icon-xiangmu1" title="课程资源"></span>
      </div>
    </div>
    <div class="coursemain">
      <div class="mainLeft scroll-bar-customize">
        <!-- <Drag-tree :tree="tree" /> -->
      </div>
      <div class="mainRight">
        <component :is="componentName" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import bg from '../../assets/images/studentcourse/course-detail_bg.jpg'
import { defineComponent,ref, onMounted,inject,reactive, toRefs,Ref } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from '../../api/index'
import serve from "../../request/getRequest";
import { IBusinessResp} from '../../typings/fetch.d';
import StuChapter from './component/StuChapter1.vue'
interface IdetailObj{
  info:any;
  tree:any[]
}
export default defineComponent({
  name: 'ContinueDetail',
  components: {
    StuChapter
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const http=(request as any).studentCourse
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false})

    var componentName:Ref<string>=ref('StuChapter')

    const route = useRoute();
    const {DetailId}= route.query
    const detail:IdetailObj=reactive({
      info:{},
      tree:[]
    })
    function init(){
      http.coursesInfo({param:{id:DetailId}}).then((res:IBusinessResp)=>{
        detail.info=res.data
        detail.tree=res.data.tree
      })
    }
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    onMounted(()=>{
      init()
    })
   
    return {...toRefs(detail),bg,componentName};
  },
})
</script>

<style scoped lang="less">
  .course_info{
    height:100%;
    width: @center-width;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    .header{
      color:@white;
      .title{
        margin-bottom: 20px;
        position: relative;
      }
      .title,.info,.title>.left{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title .icon-fanhui{
        background-color: @theme-color;
        color: @white;
        font-size: 16px;
        padding: 8px 10px;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 10px;
      }
      .title .left{
        div{
          font-size: 24px;
        }
        span{
          margin-left: 24px;
          padding: 3px 16px;
          border-radius: 11px;
          font-size: 12px;
          background-color: #00d06a;
        }
      }
      .info{
        .left{
          display: flex;
          align-items: center;
          .line{
            width: 1px;
            height: 15px;
            background-color: hsla(0,0%,100%,.75);
            margin-right: 25px;
          }
          .item{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            text-align: center;
            span:nth-child(1){
              font-size: 14px;
              font-weight: 500;
              // width: 200px;
            }
            span:nth-child(2){
              font-size: 12px;
              font-weight: 400;
              color: hsla(0,0%,100%,.75);
            }
          }
          .dir{
            span:nth-child(1){
              width: 200px;
            }
          }
        }
        .icon-xiangmu1{
          background-color: #ff8f00;
          color: #fff;
          font-size: 16px;
          padding: 6px 10px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
    .coursemain{
      background-color: transparent;
      display: flex;
      justify-content: center;
      padding: 44px 0;
      // height: calc(100% - 260px);
      flex: 1;
      overflow: auto;
      .mainLeft{
        width: 378px;
        background-color: #fff;
        overflow-y: auto;
        text-align: left;
        margin-right: 10px;
        flex-shrink: 0;
        border-radius: 4px;
      }
      .mainRight{
        background-color: #fff;
        border-radius: 4px;
        flex: 1;
      }
    }
  }
</style>
