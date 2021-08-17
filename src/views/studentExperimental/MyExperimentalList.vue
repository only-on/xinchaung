<template>
  <div class="list_content">
    <div class="info" v-for="v in 1" :key="v">
      <div class="card">
        <div class="mask"></div>
        <div class="card_pic">
          <img :src="defaultUrl" />
        </div>
      </div>
      <div class="card_info">
        <h3>我的课件测试</h3>
        <div class="text-primary">
          <span>已结束</span>
          <span> 用时&nbsp;&nbsp; 01时12分54秒 </span>
          <span>学习至 任务一</span>
        </div>
        <p class="status">实训教师：{{'sihai'}}</p>
        <p class="status">实训状态：{{'已结束'}}</p>
        <p class="status">起止时间：{{'2021-08-03 - 2021-08-06'}}</p>
      </div>
    </div>
    <!-- <a-spin v-if="loading" tip="Loading..." size="large" /> -->
    <div class="info" v-for="v in list" :key="v.name">
      <div class="card">
        <div class="mask"></div>
        <div class="card_pic">
          <img :src="v.url" />
        </div>
      </div>
      <div class="card_info">
        <h3>{{v.name}}</h3>
        <div class="text-primary">
          <span>{{v.status_name}}</span>
          <span> 用时&nbsp;&nbsp; {{v.cost_time}} </span>
          <span>学习至 {{v.content_name}}</span>
        </div>
        <p class="status">实训教师：{{v.u_name}}</p>
        <p class="status">实训状态：{{v.status_name}}</p>
        <p class="status">起止时间：{{v.times}}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref } from 'vue'
import { useRouter } from 'vue-router';
import request from '../../api/index'
interface IlistItem{
  url:string,
  name:string,
  status_name:string,
  cost_time:string,
  content_name:string,
  u_name:string,
  times:string,
}
interface load{
  loading:boolean
}
export default defineComponent({
  name: 'MyExperimentalList',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var defaultUrl:string='/src/assets/images/Experimental/cover5.png'
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).Experimental
    function initData(){
      loading.value=true
      http.getMyExperimentalList().then((res:any)=>{
        // loading.value=false
        list=res.data
        list.length?list.map((v:IlistItem)=>{
          v.url=v.url?v.url:defaultUrl
        }):''
      })
    }
    onMounted(()=>{
     initData()
    })
    return {list,defaultUrl,loading };
  },
})
</script>

<style scoped lang="less">
  .ant-spin-spinning{
    margin-top: 200px;
  }
  .list_content{
    padding: 20px 10px;
    text-align: center;
    .info{
      margin: 16px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
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
    }
  }
</style>
