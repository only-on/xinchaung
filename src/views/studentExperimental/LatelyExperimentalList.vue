<template>
  <div class="list_content">
    <div class="info" v-for="v in list" :key="v.name">
      <div class="card">
        <div class="mask">
          <div class="link" @click="continueTraining" v-if="v.status_name==='进行中'">
            <img src="../../assets/images/Experimental/tap.png" alt="">
            <span>点击继续实训</span>
          </div>
        </div>
        <div class="card_pic">
          <img :src="v.url" />
        </div>
      </div>
      <div class="card_info">
        <h3>{{v.name}}</h3>
        <div class="text-primary">
          <span>{{v.status_name}}</span>
          <span> 用时&nbsp;&nbsp; {{v.used_time}} </span>
          <span v-if="v.recent_content">学习至 {{v.recent_content}}</span>
        </div>
        <p class="status">实训教师：{{v.teacher}}</p>
        <p class="status">实训状态：{{v.state}}</p>
        <p class="status">起止时间：{{v.period}}</p>
      </div>
      <div class="start_training" v-if="v.state==='进行中'">
        <a-button @click="continueTraining(v)" type="primary"> 继续实训 </a-button>
      </div>
    </div>
    <empty v-if="!loading && list.length===0" />
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref } from 'vue'
import { useRouter } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
interface IlistItem{
  url:string,
  name:string,
  status_name:string,
  cost_time:string,
  content_name:string,
  u_name:string,
  times:string,
  used_time:string,
  recent_content:string,
  teacher:string,
  state:string,
  period:string,
}
import {toVmConnect} from "src/utils/vncInspect"
export default defineComponent({
  name: 'LatelyExperimentalList',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var defaultUrl:string='/src/assets/images/Experimental/cover5.png'
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).studentExperimental
    function initData(){
      loading.value=true
      http.getLatelyExperimentalList().then((res:IBusinessResp)=>{
        // console.log(res)
        loading.value=false
        list.push(...res.data)
        list.map((v:IlistItem)=>{
          v.url=v.url?v.url:defaultUrl
        })
      })
    }
    function  continueTraining(val:any) {
      let param :any= {
        type: "train",
        opType: "start",
        taskId: val.train_id,
      }
      toVmConnect(router,param,'')
      // router.push({path:'/vm/vnc',query:{type:'train',opType:'',taskId:530247,routerQuery:"{detailId:12,course_id:501638}"}})
    }
    onMounted(()=>{
      initData()
    })
    return {list,defaultUrl ,continueTraining,loading};
  },
})
</script>

<style scoped lang="less">
  .list_content{
    .info{
      margin: 16px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card{
        position: relative;
        width: 290px;
        height: 166px;
      }
      .card:hover{
        .mask{
          opacity: 1;
          z-index: 10;
        }
      }
      .mask{
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(34, 34, 34, 0.46);
        .link{
          color: @white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 68px;
          cursor: pointer;
          span{
            font-size: 16px;
            padding: 0 5px;
          }
        }
      }
      .card_pic{
        position: absolute;
        width: 100%;
        height: 100%;
        // background: url('../../assets/images/Experimental/cover5.png') no-repeat center 100%/100%;
        img{
          width: 100%;
          height: 100%;
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
        .text-primary{
          color: #07b28f;
          margin-bottom: 10px;
          span:nth-child(1){
            color: red;
            padding-right: 26px;
          }
          span:nth-child(3){
            padding-left: 30px;
          }
        }
        .status{
          margin-bottom: 10px;
        }
      }
      .start_training{
        padding: 123px 20px 0 0;
      }
    }
  }
</style>
