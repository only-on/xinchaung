<template>
  <div>
    <div class="header">
      <div class="item custom_input">
        <a-input-search v-model:value="ForumSearch.name" placeholder="请输入试卷名关键字查询" @search="search" />
      </div>
    </div>
    <div class="main-box">
      <div class="list">
        <div v-if="ForumSearch.page===1" class="card cread-card" @click="add">
          <div class="kernel">
            <div class="create-btn card-item-content">
              <i class="iconfont icon-chuangjian"></i>
              <span>创建试卷</span>
            </div>
          </div>
        </div>
        <div class="card" v-for="v in list" :key="v.id">
          <div class="kernel">
            <div class="card-item-heard">{{v.name}}</div>
            <div class="card-item-content">
              <div class="score">
                <div class="score-text">总分</div>
                <div class="score-num">{{v.score_total}}</div>
              </div>
              <div class="des">{{v.description}}</div>
            </div>
            <div class="card-item-foot">
              <div class="footer-text">
                试题数量：<span class="exam-paper-num">{{v.questions_count}}</span>
              </div>
              <div class="footer-btns">
                <i class="iconfont icon-fuyong" title="复用" @click="copy(v.id)"></i>
                <i class="iconfont icon-bianji1" title="编辑" @click="edit(v.id)" v-if="v.is_edited"></i>
                <i class="iconfont icon-shanchu" title="删除" @click="delate(v.id)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!list.length" />
      <a-pagination v-if="list.length"
          v-model:current="ForumSearch.page"
          :pageSize="12"
          :total="totalCount+1"
          @change="pageChange"
        />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject,createVNode } from 'vue'
import { useRouter } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import {Modal,message} from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
interface IlistItem{
  id:number;
  name:string;
  score_total:number;
  questions_count:number;
  is_edited:boolean;
  description:string | null
}
interface IforumSearch{
  name:string,
  type:string,
  page:number,
  limit:number
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).teacherExam
    const ForumSearch:IforumSearch=reactive({
      name:'',
      type:'exam',
      page:1,
      limit:11
    })
    // const totalCount
    var totalCount:Ref<number>=ref(0)
    function initData(){
      loading.value=true
      list.length=0
      ForumSearch.limit=ForumSearch.page===1?11:12
      http.getTestPaperList({param:{...ForumSearch}}).then((res:IBusinessResp)=>{
        //  console.log(res)
        loading.value=false
        list.push(...res.data.list)
        totalCount.value=res.data.page.totalCount
      })
    }
    function search(val:any){
      if(ForumSearch.name===''){
         return
       }
      initData()
    }
    function copy(id:number){
      http.copy({urlParams: {paper_id: id}}).then((res:IBusinessResp)=>{
        message.success('复用成功')
         initData()
      })
    }
    function delate(id:number){
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
           http.TestPaperDetele({urlParams: {paper_id: id}}).then((res:IBusinessResp)=>{
            message.success('删除成功')
            initData()
          })
        }
      });
     
    }
    function add(){
      router.push('/teacher/teacherExam/CreateTestPaper')
    }
    function edit(id:number){
      console.log(id);
      router.push('/teacher/teacherExam/CreateTestPaper?editId='+id)
    }
    
    function pageChange(current:any,pageSize:any){
        // console.log(current, pageSize);
        ForumSearch.page=current
        initData()
      }
    var updata=inject('updataNav') as Function

    onMounted(()=>{
     initData()
    })
    return {list,loading,ForumSearch,totalCount,search,pageChange,copy,edit,delate,add};
  },
})
</script>
<style  scoped lang="less">
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item{
  display: flex;
  align-items: center;
  margin-right: 22px;
  :deep(.ant-input){
      width: 640px;
      padding-left: 20px;
    }
 }
}
.custom_input{
  position: relative;
  &::before{
      content: '';
      position: absolute;
      left:8px;
      top:10px;
      background: url(../../assets/images/screenicon/Group6.png) no-repeat;
      width: 16px;
      height: 16px;
      z-index: 10;
  }
}
.list{
  display: flex;
  flex-wrap: wrap;
  padding-top: 30px;
}
.card{
  width: 33.3%;
  cursor: pointer;
  padding: 0 20px;
  margin-bottom: 15px;

  .kernel{
    display: flex;
    flex-direction: column;
    height: 160px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid rgba(226, 225, 225, 1);
    box-shadow: 0px 3px 7px 0px rgb(0 0 0 / 17%);
    color: #999;
    transition: all .2s;
    overflow: hidden;
  }
  .kernel:hover{
    box-shadow: 0px 2px 4px 0px rgb(164 36 167 / 14%);
    transform: translateY(-3px);
    border: 1px solid @theme-color;
  }
  .card-item-heard{
    background-color: @theme-color;
    height: 32px;
    padding: 0 20px;
    color: #fff;
    font-size: 14px;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-item-content{
    display: flex;
    flex-grow: 1;
    .score{
      display: flex;
      flex-direction: column;
      flex-basis: 112px;
      align-items: flex-start;
      padding-right: 36px;
      padding-left: 15px;
      color: @theme-color;
      .score-text{
        font-size: 12px;
        padding-top: 12px;
      }
      .score-num{
        font-size: 44px;
      }
    }
    .des{
      flex-grow: 1;
      font-size: 14px;
      line-height: 24px;
      text-align: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }
  .create-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E2E1E1;
    i{
      font-size: 48px;
    }
    span {
        margin: 10px 0 0 10px;
        font-size: 24px;
    }
  }
  .card-item-foot{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // height: 42px;
    padding: 0 20px 0 15px;
    font-size: 14px;
    .footer-text{
      color: #333333;
    }
    .footer-btns{
      i{
        color: #C5C5C5;
        font-size: 16px;
        padding-left: 16px;
        cursor: pointer;
      }
    }
  }
}
.ant-pagination{
  text-align: center;
  margin-top: 20px;
}
</style>