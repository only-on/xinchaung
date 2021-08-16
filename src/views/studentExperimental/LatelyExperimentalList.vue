<template>
  <div class="list_content">
    <div class="info" v-for="v in 20" :key="v">
      <div class="card">
        <div class="mask"></div>
        <div class="card_pic"></div>
      </div>
      <div class="card_info">
        <h3>zuiji课件测试</h3>
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
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import request from '../../api/index'
interface listItem{
  title:string,
  status:number,
  date:string,
  stage:string,
  teacherName:string
}
export default defineComponent({
  name: 'LatelyExperimentalList',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const list:listItem[]=[]
    const http=(request as any).Experimental
    function initData(){
      http.getMyExperimentalList().then((res:any)=>{

      })
    }
    onMounted(()=>{
    //  initData()
    })
    return {list,initData };
  },
})
</script>

<style scoped lang="less">
  .list_content{
    padding: 20px 10px;
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
      }
      .card_pic{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../../assets/images/Experimental/cover5.png') no-repeat center 100%/100%;
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
