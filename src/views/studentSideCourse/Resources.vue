<template>
  <div v-layout-bg="{bg:ResourcesBg,size:'234px'}">
    <div class="header">
        <div class="item custom_input">
          <a-input-search v-model:value="ForumSearch.name" placeholder="请输搜索关键字" style="width: 360px" @search="onSearch" />
        </div>
        <span class="iconfont icon-fanhui" @click="go"></span>
    </div>
    <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
      :pagination="{current:ForumSearch.page,pageSize:ForumSearch.limit,total:total,onChange:onChangePage,hideOnSinglePage:true}"  
      class="components-table-demo-nested">
      <template #operation="{record}">
        <span class="iconfont icon-download" @click="downloadResource(record)"></span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import ResourcesBg from '../../assets/images/studentcourse/course-detail_Resources_bg.jpg'
import { defineComponent,ref, onMounted,inject,reactive,Ref } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch';
import {message } from 'ant-design-vue';
interface IforumSearch{
  name:string;
  limit:number,
  page:number
}
interface ItdItems{
  name:string,
  describe:string,
  posfix:string,
  size:string,
  created_at:string,
  id:number,
}
const columns=[
  {
    title: '资源名称',
    dataIndex:"name",
    align:'center',
    width:220,
  },
  {
    title: '资源说明',
    dataIndex: 'describe',
    align:'center',
    width:220
  },
  {
    title: '文件类型',
    dataIndex: 'posfix',
    align:'center',
    width:160
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    align:'center',
    width:160
  },
  {
    title: '上传时间',
    dataIndex: 'created_at',
    align:'center',
    width:220
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    slots: { customRender: 'operation' },
    fixed:'right',
    // width:200
  }
]
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const http=(request as any).studentCourse
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined})
    const {course_id}=route.query
    var ForumSearch:IforumSearch=reactive({
      name:'',
      limit:10,
      page:1,
    })
    var total:Ref<number>=ref(0)  
    var loading:Ref<boolean>=ref(false)
    var list:ItdItems[]=reactive([])
    function init() {
      list.length=0
      http.getResources({urlParams: {courseId: course_id},param:{...ForumSearch}}).then((res: IBusinessResp)=>{
        if(res.data){
          let data=res.data
          list.push(...data.list)
          total.value=data.page.totalCount
        }
      })
    }
    function onSearch() {
      ForumSearch.page=1
      init()
    }
    function onChangePage(val:number){
      ForumSearch.page=val
      init()
    }
    function downloadResource(val:any) {
      var link = document.createElement('a');
      link.href =val.url;
      link.download = val.name;
      link.click();
    }
    onMounted(()=>{
     init()
    })
    function go(){
      router.go(-1)
    }
    return {go, ResourcesBg,onSearch,columns,loading,list,ForumSearch,total,onChangePage,downloadResource};
  },
})
</script>

<style scoped lang="less">
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .icon-fanhui{
      background-color: #ebeff8;
      color: var(--primary-color);
      font-size: 16px;
      text-align: center;
      line-height: 38px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .icon-download{
    cursor: pointer;
  }
</style>
