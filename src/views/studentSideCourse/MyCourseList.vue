<template>
  <div  class="item custom_select">
      <a-select v-model:value="course_category_id"  placeholder="请选择课程方向" :options="options" @change="handleChange"></a-select>
  </div>
  <div :class="loading?'center':''">
    <a-spin :spinning="loading" tip="Loading..." size="large">
      <div class="list_content"> 
        <div class="info" v-for="v in list" :key="v.id" :class="v.state!=='已结束'?'info_hover':''">
          <div class="main">
            <div class="card" @click="keepLearning(v)">
              <div class="mask" :class="v.state==='已结束'?'mask_end':''">
                {{v.state}}
              </div>
              <div class="task">学至~{{v.recent_content}}</div>
              <div class="card_pic">
                <img :src="v.url" />
              </div>
            </div>
            <div class="card_info">
              <div class="course_name">{{v.name}}</div>
              <div class="course_mid">
                <div class="left">
                  <p class="row">{{v.period}}</p>
                  <p class="row">
                    <span  class="iconfont icon-jiaoshi1"></span>
                    <span>教师</span>
                    <span>{{v.teacher}}</span>
                  </p>
                </div>
                <div class="right">
                  <div class="circle" v-if="v.progress">
                    <a-progress type="circle" :percent="v.progress" :width="50" :stroke-width="14" 
                      :showInfo="false" 
                      :stroke-color="'#8955b5'" 
                      :trail-color="'#ddd'"
                    />
                  </div>
                </div>
              </div>
              <div class="course_time">
                  <div>
                    <span class="iconfont icon-daojishi"></span>
                    <span>用时</span>
                    <span>{{v.used_time}}</span>
                  </div>
                  <span v-if="v.progress">已学{{v.progress}}%</span>
              </div>
            </div>
            <div class="start_training">
              <a-button @click="keepLearning(v)" type="link"> {{v.progress?'继续':'开始'}}学习</a-button>
            </div>
          </div>
        </div>
        <empty v-if="!loading && list.length===0" :text="'您还没有选择任何课程'" />
      </div>
    </a-spin>
  </div>  
</template>

<script lang="tsx">
import { defineComponent,ref, onMounted,reactive,Ref } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { SelectTypes } from 'ant-design-vue/es/select';
interface IListItem{
  url:string,
  name:string;
  start_end_time:string;
  status:number;
  progress:number;
  recent:string;
  teacher:string;
  id:number;
  time_cost:string;
  state:String;
  course_id:number;
  course_student_id:number;
  cousre_id: number;
  used_time:string;
  recent_content: string;
  period:string;
}
interface Ioptions{
  id:number;
  name:String;
  value:number;
  label:String;
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter()
    const route=useRoute();
    var options = ref<Ioptions[]>([{id:1,name:'全部',value:1, label: '全部课程'}]);
    // var options:Ioptions[] = ref<SelectTypes['options']>([{id:1,name:'全部',value:1, label: '全部课程'}])
    var list:IListItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    var course_category_id:Ref<number | undefined>=ref(1)
    const http=(request as any).studentCourse
    var defaultUrl:string='/src/assets/images/studentcourse/course-default1.jpg'
    function initData(){
      let param=course_category_id.value!==1?{course_category:course_category_id.value}:{}
      loading.value=true
      list.length=0
      http.getMyCourseList({param:param}).then((res:IBusinessResp)=>{
        if(res){
          loading.value=false
          list.push(...res.data)
          list.length?list.map((v:IListItem)=>{
            v.url=v.url?v.url:defaultUrl
          }):''
        }
      })
    }
    function keepLearning(val:IListItem){
      const {currentTab}= route.query
      router.push('/studentSideCourse/ContinueDetail?DetailId='+val.course_student_id+'&course_id='+val.cousre_id+'&currentTab='+currentTab)
    }
    function getDirection(){
      http.courseDirection().then((res:IBusinessResp)=>{
        let data=res.data
        data.length?data.map((v:any)=>{
          v.value=v.id
          v.label=v.name
        }):'';
        // console.log(options);
        options.value.push(...data)
      })
    }
    function handleChange(val:any){
      initData()
    }
    onMounted(()=>{
     initData()
     getDirection()
    })
    return {list,loading,keepLearning,defaultUrl,options,course_category_id,handleChange}
  }
})
</script>

<style  scoped lang="less">
:deep(.ant-spin-spinning){
    margin-top: 150px;
 }
.center{
  text-align: center;
}
  .list_content{
    display: flex;
    flex-wrap: wrap;
    .info{
      width: 25%;
      text-align: center;
      margin-bottom:20px;
      cursor: auto;
      transition: all .3s;
      .main{
        margin: 0 auto;
        width: 285px;
        box-shadow: 0px 2px 4px 0px rgb(164 36 167 / 14%);
      }
    }
    .info_hover:hover{
      cursor: pointer;
      .card_info{
        .course_time{
          display: none;
        }
        .course_mid .right .circle{
          display: none;
        }
      }
      .start_training{
          display: block;
        }
    }
  }
  .card{
    position: relative;
    width: 270px;
    height: 166px;
    cursor: pointer;
    margin: 0 auto;
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
  .mask_end{
    background-color: rgba(0,0,0,9.5);
    color: rgba(138,138,138,1);
  }
  .task{
    text-align: left;
    position: absolute;
    left: 0px;
    bottom: 20px;
    background-color: rgba(5,1,1,0.77);
    color: rgba(255,255,255, 0.7);
    padding: 0 5px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 26px;
    line-height: 26px;
  }
  .card_info{
    width: 100%;
    margin: 0 auto;
    text-align: left;
    padding: 0 12px;
    color: #707070;
    .course_name{
      font-size: 18px;
      color: #333;
      margin-bottom:10px;
      line-height: 33px;
    }
    .course_mid{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      .left{
        .row{
          line-height: 25px;
          margin-bottom:10px;
        }
        .row:nth-child(2){
          margin-bottom:0px;
          span{
            margin-right: 10px;
          }
        }
      }
      .right {
        width: 24%;
          .circle{
            width: 50px;
            height:50px;
            /* position: relative; */
            :deep(.ant-progress-text){
              color: #A9A9A9;
            }
          }
      }
    }
    .course_time{
      /* margin-bottom: 10px; */
      padding: 15px 0 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &>span{
        margin: 0 0 0 20px;
        color: @theme-light-color;
      }
      div>span{
        margin-right: 10px;
      }
    }
  }
  .card_pic{
  
    width: 100%;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
  .start_training{
    display: none;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #fafafa;
    border-top: 1px solid #E9E9E9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    
  }
  .custom_select{
    padding: 0 0 20px 20px;
    :deep(.ant-select-selector){
      width: 400px;
      height: 35px;
      padding-left: 30px;
      align-items: center;
    }
    :deep(.ant-select-selector)::before{
      content: '';
      position: absolute;
      left:8px;
      top:10px;
      background: url(../../assets/images/screenicon/Group3.png) no-repeat;
      width: 14px;
      height: 15px;
    }
  }
</style>
