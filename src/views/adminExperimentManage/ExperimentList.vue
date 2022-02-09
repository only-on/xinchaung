<template>
    <div class="basic" v-layout-bg>
      <div class="item">所属章节 ：
        <span>{{chapterName}}</span>
      </div>
      <div class="item">所属技术方向 ：
        <span>{{direction}}</span>
      </div>
    </div>
    <div class="header">
      <div class="search">
        <div class="item custom_input custom_input1">
          <a-input v-model:value="ForumSearch.name" placeholder="请输入实验名称" @keyup.enter="search()" />
        </div>
        <div  class="item custom_input custom_input2">
          <a-input v-model:value="ForumSearch.cnt" placeholder="请输入课时数" @keyup.enter="search()" />
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
          <a @click="details(record.id)">{{ text }}</a>
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
  cnt:string,
  limit:number,
  page:number
}
type Key = ColumnProps['key'];
const columns1=[
  {
    title: '实验名称',
    dataIndex:"name",
    align:'center',
    width:200,
    slots: { customRender: 'title' },
  },
  {
    title: '课时数',
    dataIndex: 'class_cnt',
    align:'center',
    // width:120
  },
  {
    title: '总内存',
    dataIndex: 'ram',
    align:'center',
    // width:260
  },
  {
    title: '最大内存',
    dataIndex: 'max_ram',
    align:'center',
    // width:160
  },
  {
    title: '总硬盘',
    dataIndex: 'disk',
    align:'center',
    // width:260
  },
  {
    title: '任课教师',
    dataIndex: 'teacherName',
    align:'center',
    width:240
  },
  {
    title: '更新时间',
    dataIndex: 'updated_time',
    align:'center',
    width:240
  }
]
const columns2=[
  {
    title: '实验名称',
    dataIndex:"name",
    align:'center',
    width:200,
    slots: { customRender: 'title' },
  },
  {
    title: '课时数',
    dataIndex: 'class_cnt',
    align:'center',
    // width:120
  },
  {
    title: '总内存',
    dataIndex: 'ram',
    align:'center',
    // width:260
  },
  {
    title: '最大内存',
    dataIndex: 'max_ram',
    align:'center',
    // width:160
  },
  {
    title: '总硬盘',
    dataIndex: 'disk',
    align:'center',
    // width:260
  }
]
export default defineComponent({
  name: 'ExperimentList',
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();

    var configuration:any=inject('configuration')

    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false,componenttype:undefined,})

    const http=(request as any).adminExperimentManage
    var loading:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:any[]=reactive([])  
    const {chapterName,direction}=route.query
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
      cnt:'',
    })
    function initData(){
      const type=['is_teacher','is_init','is_share']
      const currentTab=Number(route.query.currentTab)
      const {category_id}=route.query
      let cur=type[currentTab]
      let obj={
        ...ForumSearch,
        id:category_id,
        withs:'userProfile',
      }
      obj[cur]=1
      loading.value=true
      list.length=0
      http.ExperimentList({param:{...obj}}).then((res:IBusinessResp)=>{
        if(res){
          loading.value=false
          let data=res.data.list
          data.map((v:any)=>{
            v.teacherName=v.userProfile.name
            v.ram=v.envirment.ram+'G'
            v.disk=v.envirment.disk+'G'
            v.max_ram=v.envirment.max_ram+'G'
          })
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
    async function clearSearch(){
      // if(ForumSearch.username || ForumSearch.name || ForumSearch.department){  ExperimentList
        ForumSearch.cnt=''
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
    function details(id:number){
      let {currentTab}= route.query
      // console.log('实验详情id='+id)
      router.push({
        path:'/admin/adminExperimentManage/ExperimentDetail',
        query: {
          id: id,
          currentTab: currentTab,
        },
      })
    }
    const columns=computed(()=>{
      let {currentTab}= route.query
      if(currentTab === '1'){
        return columns2
      }else{
        return columns1
      }
    })
    onMounted(()=>{
      initData()
    })
    return {customizeRenderEmpty,list,columns,ForumSearch,loading,total,search,onChangePage,clearSearch,details,chapterName,direction};
  },
})
</script>

<style scoped lang="less">
.basic{
  display: flex;
  align-items: center;
  padding: 0px 10px 20px;
  border-bottom: 1px dashed #dcdcdc;
  // margin-bottom: 20px;
  font-size: 16px;
  .item{
    margin-right: 30px;
    color:#444;
  }
}
:deep(.ant-table-pagination.ant-pagination){
  width: 100%;
  text-align: center;
}
.caozuo{
  padding: 0 8px;
  color: var(--primary-color);
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
          top:8px;
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
