<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div class="item custom_input">
          <a-input v-model:value="ForumSearch.title" placeholder="请输入帖子名称" @keyup="search" />
        </div>
        <div  class="item custom_select">
            <a-select v-model:value="ForumSearch.type"  placeholder="请选择发帖类型" :options="options"></a-select>
        </div>
        <div class="item">
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
      <a-button @click="release()" type="primary">发布问题</a-button>
    </div>
    <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
      :pagination="{pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}"  
      class="components-table-demo-nested">
      <template #title="{record, text }">
        <a @click="detaile(record.id)">{{ text }}</a>
      </template>
      <template #operation="{record}">
        <a  class="caozuo" @click="replyCard(record )">回帖</a>
        <a  class="caozuo" @click="editCard(record)" v-if="tabType===1">编辑</a>
        <a  class="caozuo" @click="delateCard(record )" v-if="record.can_delete">删除</a>
      </template>
      <!-- <template>
        <a-pagination v-model:current="ForumSearch.page" :total="14" show-less-items @change="onChangePage" />
      </template> -->
    </a-table>
    <a-modal v-model:visible="visible" title="帖子回复" @ok="handleReply" :width="620">
      <h4>回复内容</h4>
      <a-textarea v-model:value="ForumArticle.content" placeholder="请输入回复内容" :rows="6" showCount :maxlength="100" />
      <template #footer>
        <a-button @click="handleReply" type="primary">提交</a-button>
      </template>
    </a-modal>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message } from 'ant-design-vue';
import {createVNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import serve from "../../request/getRequest";
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { SelectTypes } from 'ant-design-vue/es/select';
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
    align:'center',
    width:160
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
    const options1 = ref<SelectTypes['options']>([{value: '1', label: '求助'},{value: '2', label: '分享'},{value: '3', label: '通知'},{value: '4', label: '公告'}])
    const options2 =ref<SelectTypes['options']>([{value: '1', label: '求助'},{value: '2', label: '分享'}])
    const options = computed(()=>{
        return tabType.value===1?options2.value:options1.value
    })
    const http=(request as any).forum
    const apiName=['pubIndex','myself','attend'] 
    var tabType:Ref<number>=ref(0)
    var loading:Ref<boolean>=ref(false)
    var visible:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:ItdItems[]=reactive([])
    var replyContent:Ref<string>=ref('')
      
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined})

    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      tabType.value=val
      initData()
    })
    var ForumArticle:Ireply=reactive({
      forum_id:0,
      content:''
    })
    var ForumSearch:IforumSearch=reactive({
      title:'',
      pageSize:10,
      page:1,
      type:undefined
    })
    function initData(){
      loading.value=true
      list.length=0
      http[apiName[tabType.value]]({param:{...ForumSearch}}).then((res:IBusinessResp)=>{
        loading.value=false
        let data=res.data.list
        data.map((v:any)=>{
          v.creat=`${v.user_name} / ${v.created_at}`,
          v.replyViews=`${v.reply_num} / ${v.views_num}`,
          v.reply=`${v.last_reply_username} / ${v.last_reply_time}`
        })
        list.push(...data)
        total.value=res.data.page.totalCount
        // console.log(list)
      })
    }
    function search(){
      // console.log(ForumSearch)
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
      router.push('/forum/CreatePosts?editId='+val.id)
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
      router.push('/forum/PostsDetailed?detailId='+id)
    }
    onMounted(()=>{
      // serve.v(dataObj); 
      // initData()
    })
    return {tabType,list,columns,ForumSearch,loading,total,visible,replyContent,ForumArticle,options,search,onChangePage,clearSearch,delateCard,replyCard,handleReply,editCard,release,detaile};
  },
})
</script>

<style scoped lang="less">
    :deep(.ant-modal-header){
      border:  1px solid @theme-color;
      background: @theme-color;
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
      padding: 20px 30px 0 ;
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
            left:8px;
            top:10px;
            background: url(../../assets/images/screenicon/Group3.png) no-repeat;
            width: 14px;
            height: 15px;
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
      }
    }

</style>
