<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div  class="item custom_select">
            <a-select v-model:value="ForumSearch.type"  placeholder="请选择操作类型" :options="options" />
        </div>
        <div class="item custom_input custom_input_behavior">
          <a-input-search v-model:value="ForumSearch.behavior" placeholder="请输入操作行为" @search="search" />
        </div>
        <div class="item custom_input custom_input_IP">
          <a-input-search v-model:value="ForumSearch.IP" placeholder="IP地址" @search="search" />
        </div>
        <a-range-picker class="item" v-model:value="ForumSearch.date">
          <template #suffixIcon>
            <ClockCircleOutlined />
          </template>
        </a-range-picker>
        <div class="item">
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
    </div>
    <a-config-provider :renderEmpty="customizeRenderEmpty">
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        class="components-table-demo-nested">
      </a-table>
    </a-config-provider>
</template>

<script lang="tsx">
import {message} from 'ant-design-vue';
import {createVNode,VNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import { SmileOutlined, MehOutlined ,ClockCircleOutlined} from '@ant-design/icons-vue';
import { SelectTypes } from 'ant-design-vue/es/select';
import { Moment } from 'moment';
interface IforumSearch{
  behavior:string;
  IP:string;
  type:string | '' ;
  date:Moment[];
  pageSize:number;
  page:number;
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
    title: 'ID',
    dataIndex:"title",
    align:'center',
    width:260,
  },
  {
    title: '用户名',
    dataIndex: 'type',
    align:'center'
  },
  {
    title: '操作类型',
    dataIndex: 'creat',
    align:'center',
    width:260
  },
  {
    title: '操作行为',
    dataIndex: 'replyViews',
    align:'center',
    width:160
  },
  {
    title: 'IP地址',
    dataIndex: 'reply',
    align:'center',
    width:260
  },
  {
    title: '操作时间',
    dataIndex: 'operation',
    align:'center',
    fixed:'right',
    width:200
  }
]

export default defineComponent({
  name: 'forumindex',
  components: {
    SmileOutlined,
    MehOutlined,
    ClockCircleOutlined
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const options = ref<SelectTypes['options']>([{value: '1', label: '求助'},{value: '2', label: '分享'},{value: '3', label: '通知'},{value: '4', label: '公告'}])
    const http=(request as any).personalInformation
    var loading:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:ItdItems[]=reactive([])

    // const value3= ref<Moment[]>([])
    const customizeRenderEmpty =function (): VNode{
      if(loading.value){
        return <template></template>
      }else{
        let type=(ForumSearch.behavior || ForumSearch.type!=='')?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumArticle:Ireply=reactive({
      forum_id:0,
      content:''
    })
    var ForumSearch:IforumSearch=reactive({
      behavior:'',
      IP:'',
      pageSize:10,
      page:1,
      type:'',
      date:[]
    })
    function initData(){
      loading.value=true
      list.length=0
      http.journalList({param:{...ForumSearch}}).then((res:IBusinessResp)=>{
        loading.value=false
        let data=res.data.list
        list.push(...data)
        total.value=res.data.page.totalCount
        // console.log(list)
      })
    }
    function search(){
      console.log(ForumSearch)
      // initData()
      // return
      if(ForumSearch.behavior!=='' || ForumSearch.IP!=='' || ForumSearch.type!=='' || ForumSearch.date){
        ForumSearch.page=1
        initData()
      }
    }
    function clearSearch(){
      if(ForumSearch.behavior || ForumSearch.IP || ForumSearch.type!=='' || ForumSearch.date){
        ForumSearch.behavior=''
        ForumSearch.type=''
        ForumSearch.page=1
        initData()
      }
    }
    function onChangePage(val:number){
      ForumSearch.page=val
      initData()
    }
    onMounted(()=>{
      // serve.v(dataObj); 
      // initData()
    })
    return {customizeRenderEmpty,list,columns,ForumSearch,loading,total,options,search,onChangePage,clearSearch};
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
      padding: 0px 0px 15px ;
      .search{
        flex: 1;
        display: flex;
        align-items: center;
        // flex-wrap: wrap;
        .item{
          display: flex;
          align-items: center;
          margin-right: 22px;
          :deep(.ant-select-selector){
            width: 240px;
            height: 35px;
            padding-left: 30px;
            align-items: center;
          }
          :deep(.ant-input){
              padding-left: 20px;
          }
        }
        .item:last-child{
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
              background: url(src/assets/images/screenicon/Group6.png) no-repeat;
              width: 16px;
              height: 16px;
              z-index: 10;
          }
        }
        .custom_input_behavior{
          &::before{
            background: url(src/assets/images/screenicon/Group5.png) no-repeat;
          }
        }
        .custom_input_IP{
          &::before{
            background: url(src/assets/images/screenicon/Group2.png) no-repeat;
          }
        }
      }
    }
    :deep(.ql-container){
    height: calc(100% - 43px);
  }

</style>
