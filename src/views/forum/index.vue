<template>
  <div class="content">
    <NavTab :tabs="tabs" @tabSwitch="tabSwitch" />
    <div class="content_box">
      <div class="header">
        <div class="search">
          <!-- <a-form :model="ForumSearch" :label-col="{ span: 2 }" :wrapper-col="{ span: 4 }">
              <a-form-item label="帖子名称">
                <a-input v-model:value="ForumSearch.title" />
              </a-form-item>
              <a-form-item label="发帖类型">
                <a-select v-model:value="ForumSearch.type" placeholder="please select your zone">
                  <a-select-option value="shanghai">Zone one</a-select-option>
                  <a-select-option value="beijing">Zone two</a-select-option>
                </a-select>
              </a-form-item>
          </a-form> -->
          <div class="item"><span>帖子名称：</span>
            <a-input v-model="ForumSearch.title" />
          </div>
          <div  class="item"><span>发帖类型：</span>
                <a-select v-model="ForumSearch.type" placeholder="请选择">
                  <a-select-option value="1">求助</a-select-option>
                  <a-select-option value="2">分享</a-select-option>
                  <a-select-option value="3">通知</a-select-option>
                  <a-select-option value="4">公告</a-select-option>
                </a-select>
          </div>
          <div class="item">
            <a-button type="primary">查询</a-button>
            <a-button type="primary">清空</a-button>
          </div>
        </div>
        <a-button type="primary">发布问题</a-button>
      </div>
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"  class="components-table-demo-nested">
        <template #operation>
          <a  class="caozuo">回帖</a>
          <a  class="caozuo">删除</a>
        </template>
        <template>
          <a-pagination v-model:current="ForumSearch.page" :total="total" show-less-items />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,UnwrapRef,Ref  } from 'vue'
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';

interface IforumSearch{
  title:string,
  type:number,
  pageSize:number,
  page:number
}
interface ItdItems{
  title:string,
  type:string,
  creat:string,
  replyViews:string,
  reply:string,
  id:number,
}
const columns=[
  {
    title: '帖子名称',
    dataIndex:"title",
    align:'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    align:'center'
  },
  {
    title: '发帖人/发帖时间',
    dataIndex: 'creat',
    align:'center'
  },
  {
    title: '回复数/查看数',
    dataIndex: 'replyViews',
    align:'center'
  },
  {
    title: '最近回帖人/最近回帖时间',
    dataIndex: 'reply',
    align:'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    slots: { customRender: 'operation' },
  }
]
export default defineComponent({
  name: 'forumindex',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route:any = useRoute()
    const tabs=[{name:'随堂论坛',componenttype:0},{name:'我的提问',componenttype:1},{name:'我参与的帖子',componenttype:2}]
    const http=(request as any).forum
    const apiName=['pubIndex','myself','attend']
    var type=ref(0)
    var loading:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    const list:Array<ItdItems>=reactive([{title:'铁汁',type:'分享',creat:'创建',replyViews:'回复数',reply:'回帖人', id: 2},{title:'铁汁2',type:'分享2',creat:'创建2',replyViews:'回复数2',reply:'回帖人2', id: 3}])
    var ForumSearch:UnwrapRef<IforumSearch>=reactive({
      title:'',
      type:0,
      pageSize:10,
      page:1
    })
    function tabSwitch(val:any){
      if(val.componenttype!==type.value){
        type.value=val.componenttype
        // initData()
        updateRouter()
      }
    }
    function initData(){
      loading.value=true
      http[apiName[type.value]]().then((res:any)=>{
        loading.value=false
      })
    }
    function updateRouter(){
      router.replace({
            path: '/forum',
            query: { currentTab: type.value },
       })
    }
    onMounted(()=>{
      const { currentTab } = route.query
      currentTab?type.value=Number(currentTab):''
      updateRouter()
       initData()
    })
    // pubIndex  myself   attend
    return {tabs ,tabSwitch,list,columns,ForumSearch,loading,total};
  },
})
</script>

<style scoped lang="less">
  
.content{
    width: 1330px;
    margin: 20px auto 0;
    background: #fff;
    height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
    }
    :deep(.ant-table-pagination.ant-pagination){
      width: 100%;
      text-align: center;
    }
    .caozuo{
      padding: 0 8px;
    }
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px 40px 0 ;
      .search{
        flex: 1;
        display: flex;
        align-items: center;
        .item{
          display: flex;
          align-items: center;
          >span{
            width: 94px;
            text-align: center;
            color: #444;
            font-weight: bold;
            font-size: 14px;
          }
          :deep(.ant-select-selector){
            width: 220px;
            height: 35px;
          }
        }
        .item:nth-child(3){
          .ant-btn{
            margin: 0 10px;
          }
        } 
      }
    }
  }
</style>
