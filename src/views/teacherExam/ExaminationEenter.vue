<template>
  <div>
    <div class="header">
      <div class="item custom_input">
        <a-input-search v-model:value="Forum.name" placeholder="请输入考试名称关键字搜索" @search="search" />
      </div>
      <div class="type">
        <span>仅显示</span>
        <a-radio-group v-model:value="Forum.status" @change="search">
          <a-radio :value="0">全部</a-radio>
          <a-radio :value="2">未开始</a-radio>
          <a-radio :value="1">进行中</a-radio>
          <a-radio :value="3">已结束</a-radio>
        </a-radio-group>
      </div>
    </div>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="box-body">
        <div class="examination-paper-content">
          <div class="examination-paper-card create-btn-card" @click="add">
            <div class="kernel">
              <div class="create-btn card-item-content">
                <i class="iconfont icon-chuangjian"></i>
                <span>创建试卷</span>
              </div>
            </div>
          </div>
          <div class="examination-paper-card" v-for="v in list" :key="v.id">
            <div class="kernel">
              <div class="card-item-header">
                <div class="card-item-title">{{v.name}}</div>
                <div class="card-item-text">{{v.paper_name}}</div>
                <div class="card-item-text card-item-time">{{v.start_day}}&nbsp;&nbsp;&nbsp;&nbsp;{{v.times}}</div>
                <div class="card-item-operate">
                  <i class="iconfont icon-bianji1" @click="edit(v.id)" :class="v.status!==2?'cursorNotAllowed':''"></i>
                  <i class="iconfont icon-shanchu" @click="delate(v.id)" :class="v.status!==2?'cursorNotAllowed':''"></i>
                </div>
              </div>
              <div class="card-item-content">
                <div class="score-text-scale">
                  <a-progress type="circle" :percent="v.pass_rate" :width="50" :stroke-width="14" 
                      :showInfo="true" 
                      :trail-color="'#ddd'"
                    />
                </div>
                <div class="score-num-middle">
                  <div>总分：{{v.all_score}}</div>
                  <div>通过比例：{{v.pass_rate}}%</div>
                </div>
                <div class="score-num-right" @click="publish(v.id,v.is_publish)">
                  <a-button type="primary" :disabled="v.status !== 2" >{{v.is_publish?'撤销发布':'发布考试'}}</a-button>
                </div>
              </div>
              <div class="card-item-content">
                <div class="score-text-scale">
                  <a-progress type="circle" :percent="Math.round(v.closed_students_count/v.students_count*100)" :width="50" :stroke-width="14" 
                      :showInfo="true" 
                      :stroke-color="'#FFB900'" 
                      :trail-color="'#ddd'"
                    >
                    <template #format="percent">
                      <span :title="percent">{{ v.closed_students_count }}</span>
                    </template>
                  </a-progress>
                </div>
                <div class="score-num-middle">
                  <div>学生数：{{v.students_count}}</div>
                  <div>已交卷：{{v.closed_students_count}}</div>
                </div>
                <div class="score-num-right" @click="Achievement(v.id)">
                  <a-button type="primary" :disabled="v.status!==3" ghost>成绩统计</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Empty v-if="!list.length  && !loading" />
        <a-pagination v-if="list.length"
            v-model:current="Forum.page"
            :pageSize="11"
            :total="totalCount"
            @change="pageChange"
          />
      </div>
    </a-spin>
  </div>
</template>
<script lang="tsx">
import { defineComponent,ref, onMounted,reactive,Ref,inject,createVNode } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import {Modal,message} from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { IBusinessResp} from 'src/typings/fetch.d';
interface IlistItem{
  id:number;
  name:string;
  paper_name:string;
  start_day:string;
  times:string;
  students_count:number;
  pass_rate:number;
  all_score:number;
  closed_students_count:number
  is_publish:number
  status:number
}
interface IForum{
  name:string,
  status?:number,
  page:number,
  limit:number
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => { //Forum
    const router = useRouter();
    const route=useRoute();
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).teacherExam
    const Forum:IForum=reactive({
      name:'',
      status:0,
      page:1,
      limit:11
    })
    var totalCount:Ref<number>=ref(0)
    function initData(){
      const {page,name,status}= route.query
      page?Forum.page=Number(page):''
      name?Forum.name=String(name):''
      status?Forum.status=Number(status):''
      loading.value=true
      list.length=0
      let obj={
        name:Forum.name,
        page:Forum.page,
        status:Forum.status,
        limit:Forum.limit
      }
      obj.status? '' : delete  obj.status
      http.ExaminationEnter({param:{...obj}}).then((res:IBusinessResp)=>{
        //  console.log(res)   
        loading.value=false
        list.push(...res.data.list)
        totalCount.value=res.data.page.totalCount
      })
    }
    async function search(val:any){
      // console.log(val) 
      // console.log(Forum) 
      // if(Forum.name || Forum.status!==0){
        const {query,path}= route
        let obj:any={
          name:Forum.name,
          status:Forum.status,
          // page:Forum.page,
        }
        Forum.name?'': delete obj.name
        Forum.status===0? delete obj.status:''
        // Forum.page===1?delete obj.page:''
        await router.replace({
              path: path,
              query: {currentTab:query.currentTab,...obj},
        })
        // console.log(query) 
        // console.log(obj) 
         Forum.page=1
         initData()
      //  }
    }
    var updata=inject('updataNav') as Function
    async function pageChange(current:any,pageSize:any){
        // console.log(current, pageSize);  CreatedExamination
        Forum.page=current
        const {query,path}= route
        await router.replace({
              path: path,
              query: {...query, page: current},
        })
        initData()
    }
    function add(){
      router.push('/teacher/teacherExam/CreatedExamination')
    }
    function edit(id:number){
      // console.log(id);
      router.push('/teacher/teacherExam/CreatedExamination?editId='+id)
    }
    function Achievement(id:number){
      router.push('/teacher/teacherExam/Achievement?Id='+id)
    }
    function delate(id:number){
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),       
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
           http.examinationDetele({urlParams: {exam_id: id}}).then((res:IBusinessResp)=>{
            message.success('删除成功')
            initData()
          })
        }
      });
     
    }
    function publish(id:number,is_publish:number){
      let methed=is_publish?'unpublished':'publish'       
      http[methed]({urlParams: {exam_id: id}}).then((res:IBusinessResp)=>{
        message.success(is_publish?'撤销成功':'发布成功')
        // message.success(is_publish?'撤销成功':'发布成功')
        initData()
      })
    }
    onMounted(()=>{
    //  const {page}= route.query
      const {page}= route.query
      page?Forum.page=Number(page):''
      // console.log(route.query)   
      initData()
    })
    return {list,loading,Forum,totalCount,search,pageChange,Achievement,delate,add,edit,publish};
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
      width: 440px;
      padding-left: 20px;
    }
 }
 .type>span{
   padding: 0 16px;
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
.examination-paper-content{
  display: flex;
  flex-wrap: wrap;
  padding-top: 30px;
  .examination-paper-card{
     width: 25%;
      cursor: pointer;
      padding: 0 8px;
      margin-bottom: 15px;
    .kernel{
      display: flex;
      flex-direction: column;
      height: 277px;
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
    .card-item-header{
      background: url('src/assets/images/teacherExam/eaxmBack.png') no-repeat;
      height: 124px;
      width: 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      color: #fff;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .card-item-title {
          display: flex;
          height: 35px;
          align-items: center;
          padding:0 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-item-text {
          margin-left: 20px;
          line-height: 24px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 220px;
          font-size: 18px;
        } 
        .card-item-time {
          font-size: 14px;
          line-height: 20px;
        }   
        .card-item-operate {
            text-align: right;
            margin-right: 15px;
            i{
              margin-right: 10px;
            }
            .cursorNotAllowed{
              cursor: not-allowed;
            }
        }  
      }
    .card-item-content{
      display: flex;
      align-items: center;
      margin-top: 14px;
      padding: 0 10px;
      justify-content: space-between;
      .score-text-scale{
        width: 50px;
        height: 55px;
        line-height: 55px;
        :deep(.ant-progress-text){
          color: #A9A9A9;
        }
      }
      .score-num-middle{
        width: 100px;
        // text-align: center;
      }
    }
    .create-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #E2E1E1;
      i{
        font-size: 60px;
      }
      span {
          margin: 10px 0 0 10px;
          font-size: 24px;
      }
    }
  }
  .create-btn-card{
    .kernel{
      justify-content: center;
    }
  }
}
.ant-pagination{
  text-align: center;
  margin-top: 20px;
}
</style>