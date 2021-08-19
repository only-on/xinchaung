<template>
  <div class="content">
    <NavTab :tabs="tabs" @tabSwitch="tabSwitch" :current="type" />
    <div class="content_box">
      <div class="header">
        <div class="search">
          <div class="item custom_input">
            <a-input v-model:value="ForumSearch.title" placeholder="请输入帖子名称" />
          </div>
          <div  class="item custom_select">
              <a-select  placeholder="请选择发帖类型" :options="options"></a-select>
          </div>
          <div class="item">
            <a-button type="primary" @click="search()">查询</a-button>
            <a-button type="primary" @click="clearSearch()">清空</a-button>
          </div>
        </div>
        <a-button @click="release()" type="primary">发布问题</a-button>
      </div>
      <!-- :row-key="(record) => record.id" -->
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage}"  
        class="components-table-demo-nested">
        <template #title="{record, text }">
          <a @click="detaile(record.id)">{{ text }}</a>
        </template>
        <template #operation="{record}">
          <a  class="caozuo" @click="replyCard(record )">回帖</a>
          <a  class="caozuo" @click="editCard(record )" v-if="type===1">编辑</a>
          <a  class="caozuo" @click="delateCard(record )" v-if="record.can_delete">删除</a>
        </template>
        <!-- <template>
          <a-pagination v-model:current="ForumSearch.page" :total="14" show-less-items @change="onChangePage" />
        </template> -->
      </a-table>
    </div>
    <a-modal v-model:visible="visible" title="帖子回复" @ok="handleReply" :width="620">
      <h4>回复内容</h4>
      <a-textarea v-model:value="ForumArticle.content" placeholder="请输入回复内容" :rows="6" showCount :maxlength="100" />
      <template #footer>
        <a-button @click="handleReply" type="primary">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message } from 'ant-design-vue';
import {createVNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import serve from "../../request/getRequest";
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { SelectTypes } from 'ant-design-vue/es/select';
import myicon from 'src/assets/images/forum/data-type.png'
interface IforumSearch{
  title:string,
  type:string | undefined,
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
interface Ireply{
  forum_id:number,
  content:string
}
const columns=[
  {
    title: '帖子名称',
    dataIndex:"title",
    align:'center',
    width:260,
    slots: { customRender: 'title' },
  },
  {
    title: '类型',
    dataIndex: 'type',
    align:'center'
  },
  {
    title: '发帖人/发帖时间',
    dataIndex: 'creat',
    align:'center',
    width:260
  },
  {
    title: '回复数/查看数',
    dataIndex: 'replyViews',
    align:'center'
  },
  {
    title: '最近回帖人/最近回帖时间',
    dataIndex: 'reply',
    align:'center',
    width:260
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    slots: { customRender: 'operation' },
    fixed:'right',
    width:200
  }
]

export default defineComponent({
  name: 'forumindex',
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const tabs=[{name:'随堂论坛',componenttype:0},{name:'我的提问',componenttype:1},{name:'我参与的帖子',componenttype:2}]
    const options = ref<SelectTypes['options']>([{value: '1', label: '求助'},{value: '1', label: '分享'},{value: '1', label: '通知'},{value: '1', label: '公告'},])
    const http=(request as any).forum
    const apiName=['pubIndex','myself','attend'] 
    var type:Ref<number>=ref(0)
    var loading:Ref<boolean>=ref(false)
    var visible:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:ItdItems[]=reactive([])
    var currentPosts:any=reactive({})
    var replyContent:Ref<string>=ref('')
    var ForumArticle:Ireply=reactive({
      forum_id:0,
      content:''
    })
    // var list: Ref<ItdItems[]> = ref([])
    var ForumSearch:IforumSearch=reactive({
      title:'',
      pageSize:10,
      page:1,
      type:undefined
    })
    function tabSwitch(val:any){
      if(val.componenttype!==type.value){
        type.value=val.componenttype
        updateRouter()
        initData()
      }
    }
    function initData(){
      loading.value=true
      http[apiName[type.value]]({param:{...ForumSearch}}).then((res:IBusinessResp)=>{
        loading.value=false
        let data=res.data.list
        data.map((v:any)=>{
          v.creat=`${v.user_name} / ${v.created_at}`,
          v.replyViews=`${v.reply_num} / ${v.views_num}`,
          v.reply=`${v.last_reply_username} / ${v.last_reply_time}`
        })
        list.push(...data)
        total.value=res.data.page.totalCount
      })
    }
    function updateRouter(){
      router.replace({
            path: '/forum',
            query: { currentTab: type.value },
       })
    }
    function search(){
      console.log(ForumSearch)
      if(ForumSearch.title!=='' || ForumSearch.type!=='0'){
        ForumSearch.page=1
        initData()
      }
    }
    function delateCard(val:ItdItems){
      // console.log(val)
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          http.delateCard({param:{id:val.id}}).then((res:IBusinessResp)=>{
            if(res.status===1){
              initData()
              message.success('删除成功')
            }else{
              message.warning(res.msg)
            }
            
          })
        }
      });
    }
    function replyCard(val:ItdItems){
      visible.value=true
      // console.log(val)
      ForumArticle.forum_id=val.id
    }
    function handleReply(){
      http.handleReply({param:{ForumArticle:{...ForumArticle}}}).then((res:IBusinessResp)=>{
        if(res.status===1){
              initData()
              message.success('回复成功')
              visible.value=false
              ForumArticle.content=''
            }else{
              message.warning(res.error.msg)
            }
      })
    }
    function editCard(val:ItdItems){
    }
    function clearSearch(){
      if(ForumSearch.title || ForumSearch.type){
        ForumSearch.title=''
        ForumSearch.type='0'
        ForumSearch.page=1
        initData()
      }
    }
    function onChangePage(val:number){
      ForumSearch.page=val
      initData()
    }
    function release(){
      router.push('/forum/CreatePosts')
    }
    function detaile(id:number){
      router.push('/forum/PostsDetailed?id='+id)
    }
    onMounted(()=>{
      // serve.v(dataObj); 
      const { currentTab } = route.query
      currentTab?type.value=Number(currentTab):''
      updateRouter()
      initData()
    })
    return {tabs,type,list,columns,ForumSearch,loading,total,visible,replyContent,ForumArticle,options,tabSwitch,search,onChangePage,clearSearch,delateCard,replyCard,handleReply,editCard,release,detaile};
  },
})
</script>

<style scoped lang="less">
  :deep(.ant-modal-header){
      border:  1px solid @theme-color;
      background: @theme-color;
    }
.content{
    width: @center-width;
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
          :deep(.ant-select-selector){
            width: 240px;
            height: 35px;
            padding-left: 30px;
            align-items: center;
          }
          .ant-input{
            padding-left: 30px;
          }
        }
        .item:nth-child(2){
          padding: 0 20px;
        }
        .item:nth-child(3){
          .ant-btn{
            margin: 0 10px;
          }
        } 
        
        .custom_select{
          :deep(.ant-select-selector)::before{
            content: '';
            position: absolute;
            left:5px;
            top:6px;
            background: url(../../assets/images/forum/data-type.png) no-repeat;
            width: 18px;
            height: 18px;
          }
        }
        .custom_input{
          position: relative;
          &::before{
              content: '';
              position: absolute;
              left:5px;
              top:6px;
              background: url(../../assets/images/forum/data-type.png) no-repeat;
              width: 18px;
              height: 18px;
              z-index: 10;
          }
        }
      }
    }
  }
</style>
