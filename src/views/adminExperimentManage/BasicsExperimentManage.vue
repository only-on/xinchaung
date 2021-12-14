<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div class="item custom_input custom_input1">
          <a-input v-model:value="ForumSearch.name" placeholder="请输入章节" @keyup="search()" />
        </div>
        <div  class="item custom_input custom_input2">
          <a-input v-model:value="ForumSearch.category" placeholder="请输入所属技术方向" @keyup="search()" />
        </div>
        <div class="item">
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
    </div>
    <a-config-provider :renderEmpty="customizeRenderEmpty">
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{current:ForumSearch.page,pageSize:ForumSearch.limit,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        class="components-table-demo-nested">
        <template #title="{record, text }">
          <a @click="details(record)">{{ text }}</a>
        </template>
      </a-table>
    </a-config-provider>
</template>

<script lang="tsx">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message} from 'ant-design-vue';
import {createVNode,VNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
interface IforumSearch{
  name:string,
  category:string,
  limit:number,
  page:number
}
type Key = ColumnProps['key'];
const columns=[
  {
    title: '章节名称',
    dataIndex:"name",
    align:'center',
    // width:120,
    slots: { customRender: 'title' },
  },
  {
    title: '所属技术方向',
    dataIndex: 'parent_name',
    align:'center',
    // width:120
  },
  {
    title: '实验数',
    dataIndex: 'task_num',
    align:'center',
    // width:260
  },
  {
    title: '课时数',
    dataIndex: 'class_cnt',
    align:'center',
    // width:160
  }
]

export default defineComponent({
  name: 'BasicsExperimentManage',
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();

    const http=(request as any).adminExperimentManage
    var loading:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:any[]=reactive([])  
    const customizeRenderEmpty =function (): VNode{
      if(loading.value){
        return <template></template>
      }else{
        let type=(ForumSearch.name || ForumSearch.name)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumSearch:IforumSearch=reactive({
      name:'',
      limit:10,
      page:1,
      category:'',
    })
    function initData(){
      // console.log(ForumSearch)
      loading.value=true
      list.length=0
      http.basicsManageList({param:{...ForumSearch,withs:'userProfile'}}).then((res:IBusinessResp)=>{
        if(res){
          loading.value=false
          let data=res.data.list
          list.push(...data)
          total.value=res.data.page.totalCount
        }
        // console.log(list)
      })
    }
    function search(){
        ForumSearch.page=1
        initData()
    }
    function clearSearch(){
      // if(ForumSearch.username || ForumSearch.name || ForumSearch.department){  ExperimentList
        ForumSearch.category=''
        ForumSearch.name=''
        initData()
      // }
    }
    function onChangePage(val:number){
      const {query,path}= route
      ForumSearch.page=val
      router.replace({
            path: path,
            query: {...query,page:val},
      })
      initData()
    }
    function details(val:any){
      let {currentTab}= route.query
      router.push({
        path:'/admin/adminExperimentManage/ExperimentList',
        query:{
          category_id:val.id,
          currentTab:currentTab,
          chapterName:val.name,
          direction:val.parent_name,
        }
      })
    }
    onMounted(()=>{
      initData()
    })
    return {customizeRenderEmpty,list,columns,ForumSearch,loading,total,search,onChangePage,clearSearch,details};
  },
})
</script>

<style scoped lang="less">
:deep(.ant-table-pagination.ant-pagination){
  width: 100%;
  text-align: center;
}
.caozuo{
  padding: 0 8px;
  color: @theme-color;
  cursor: pointer;
}
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0 15px ;
  .search{
    flex: 1;
    display: flex;
    align-items: center;
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
          padding-left: 26px;
      }
    }
    .item:last-child{
      .ant-btn{
        margin: 0 8px;
      }
    } 
    .custom_input{
      position: relative;
      &::before{
          content: '';
          position: absolute;
          left:8px;
          top:10px;
          background: url(src/assets/images/screenicon/Group12.png) no-repeat;
          width: 16px;
          height: 16px;
          z-index: 10;
      }
    }
    .custom_input2{
      &::before{
        background: url(src/assets/images/screenicon/Group10.png) no-repeat;
      }
    }
    .custom_input3{
      &::before{
        background: url(src/assets/images/screenicon/Group11.png) no-repeat;
      }
    }
  }
  .addTeacher{
      margin-right: 16px;
    }
}
:deep(.ant-form-item-control){
  flex: 0 0 100%;
}
:deep(.ant-radio-group){
  display: flex;
}
.formBox{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left,.right{
    width: 46%;
  }
}
:deep(.ant-form-item-with-help){
  width:100%;
}
:deep(.ant-form-item){
  margin-bottom: 10px;
}
.userinitpassword{
  .ant-checkbox-wrapper{
    margin: 0 10px;
  }
}
</style>
