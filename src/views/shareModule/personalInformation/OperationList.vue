<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div  class="item custom_select">
            <a-select v-model:value="ForumSearch.type"  placeholder="请选择操作类型" :options="options" />
        </div>
        <div class="item custom_input custom_input_operation_type">
          <a-input v-model:value="ForumSearch.operation_type" placeholder="请输入操作行为" @keyup.enter="search" />
        </div>
        <div class="item custom_input custom_input_ip">
          <a-input v-model:value="ForumSearch.ip" placeholder="ip地址" @keyup.enter="search" />
        </div>
        <a-range-picker class="item" v-model:value="ForumSearch.date" valueFormat="YYYY-MM-DD">
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
        :pagination="{pageSize:ForumSearch.limit,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        class="components-table-demo-nested">
      </a-table>
    </a-config-provider>
</template>

<script lang="tsx">
import {message} from 'ant-design-vue';
import {createVNode,VNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from 'src/typings/fetch.d';
import request from 'src/api/index'
import { useRouter ,useRoute } from 'vue-router';
import { SmileOutlined, MehOutlined ,ClockCircleOutlined} from '@ant-design/icons-vue';
import type { SelectProps } from 'ant-design-vue';
import { Moment } from 'moment';
import extStorage from "src/utils/extStorage";
interface IforumSearch{
  operation_type:string;
  ip:string;
  type:string | undefined ;
  date:Moment[];
  limit:number;
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
  // {
  //   title: 'ID',
  //   dataIndex:"id",
  //   align:'center',
  //   width:260,
  // },
  {
    title: '用户名',
    dataIndex: 'user_name',
    align:'center'
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    align:'center',
    width:260
  },
  {
    title: '操作行为',
    dataIndex: 'operation_type',
    align:'center',
    width:160
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
    align:'center',
    width:260
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
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
    const options = ref<SelectProps['options']>([{value: '登录', label: '登录'},{value: '退出', label: '退出'},{value: '添加', label: '添加'},{value: '删除', label: '删除'},{value: '编辑', label: '编辑'},{value: '回帖', label: '回帖'},{value: '修改设置', label: '修改设置'},{value: '开始学习', label: '开始学习'},{value: '继续学习', label: '继续学习'},{value: '重修', label: '重修'},{value: '练习', label: '练习'},{value: '结束实验', label: '结束实验'},{value: '开始实训', label: '开始实训'},{value: '继续实训', label: '继续实训'},{value: '保存学习进度', label: '保存学习进度'},{value: '开始录制视频', label: '开始录制视频'},{value: '停止录制视频', label: '停止录制视频'},{value: '发帖', label: '发帖'},{value: '删帖', label: '删帖'},{value: '提交', label: '提交'}])
    const http=(request as any).common
    var loading:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:ItdItems[]=reactive([])

    const { lStorage } = extStorage
    const role = lStorage.get('role')
    var updata=inject('updataNav') as Function
    // updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    updata({
      tabs: [],
      showContent: true,
      componenttype: undefined,
      showNav: false,
    });
    if(role===2){
      // updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    }else{
      
    }
    // const value3= ref<Moment[]>([])
    const customizeRenderEmpty =function (): VNode{
      if(loading.value){
        return <template></template>
      }else{
        let type=(ForumSearch.operation_type || ForumSearch.type!==undefined)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumArticle:Ireply=reactive({
      forum_id:0,
      content:''
    })
    var ForumSearch:IforumSearch=reactive({
      operation_type:'',
      ip:'',
      limit:10,
      page:1,
      type:undefined,
      date:[]
    })
    function initData(){ 
      console.log(ForumSearch)
      let search={
        // ...ForumSearch,
        limit:ForumSearch.limit,
        page:ForumSearch.page,
        'search[type]':ForumSearch.type===undefined?'':ForumSearch.type,
        'search[operation_type]':ForumSearch.operation_type,
        'search[ip]':ForumSearch.ip,
        'search[from]':ForumSearch.date[0]?ForumSearch.date[0]:'',
        'search[to]':ForumSearch.date[1]?ForumSearch.date[1]:''
      }
      loading.value=true
      list.length=0
      http.operationLog({param:{...search}}).then((res:IBusinessResp)=>{
        loading.value=false
        let data=res.data.list
        list.push(...data)
        total.value=res.data.page.totalCount
        // console.log(list)
      })
    }
    function search(){
      // console.log(ForumSearch)
      // initData()
      // return
      // if(ForumSearch.operation_type!=='' || ForumSearch.ip!=='' || ForumSearch.type!=='' || ForumSearch.date){
        ForumSearch.page=1
        initData()
      // }
    }
    function clearSearch(){
      if(ForumSearch.operation_type || ForumSearch.ip || ForumSearch.type!==undefined || ForumSearch.date){
        ForumSearch.operation_type=''
        ForumSearch.type=undefined
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
      initData()
    })
    return {customizeRenderEmpty,list,columns,ForumSearch,loading,total,options,search,onChangePage,clearSearch};
  },
})
</script>

<style scoped lang="less">
    :deep(.ant-modal-header){
      border:  1px solid var(--primary-color);
      background: var(--primary-color);
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
        .custom_input_operation_type{
          &::before{
            background: url(src/assets/images/screenicon/Group5.png) no-repeat;
          }
        }
        .custom_input_ip{
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
