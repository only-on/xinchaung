<template>
  <div class="resourceManagement">
    <div class="Statistics flexCenter">
      <div class="item">
        <statistics-pie title="素材资源统计" :data="[{ value:analysisObj.privateCount, name: '私有资源',color:'#00CBC2' }, { value:analysisObj.publicCount, name: '公开资源',color:'#FF9544' }]"></statistics-pie>
      </div>
      <div class="item item2">
        <h3 class="statisticalTitle">素材类型</h3>
        <div class="progressBox flexCenter">
          <div class="progressItem progressItem1" v-for="list in materialTypeList" :key="list.id" :class="list.class">
            <div class="text flexCenter">
              <span :class="['iconfont', list.icon]" ></span>
              <span class="num">{{list.count}}</span>
            </div>
            <div class="type">{{list.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="courseManagementContent">
      <div class="searchcourse flexCenter">
        <div class="left flexCenter">
          <div class="item">
            <span>素材名称：</span>
            <a-input v-model:value="searchInfo.name" placeholder="请输入关键字搜索" @keyup.enter="searchList"  />
          </div>
          <div class="item">
            <span>素材属性：</span>
            <a-select v-model:value="searchInfo.is_public" placeholder="请选择素材属性"  @change="courseStatechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option :value="1">公开素材</a-select-option>
              <a-select-option :value="0">私有素材</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span>素材类型：</span>
            <a-select v-model:value="searchInfo.tags" placeholder="请选择素材类型"  @change="courseStatechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option  v-for="list in materialTypeList" :key="list.id" :value="list.name">{{list.name}}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-button type="primary"  @click="BatchDelete()"> 批量删除 </a-button>
        </div>
      </div>
      <div class="tableContent">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <a-config-provider>
            <a-table :columns="columns" :data-source="courseList"
              :pagination="
              totalCount > 10
                ? {
                    showSizeChanger:true,
                    total: totalCount, 
                    pageSize: searchInfo.limit,
                    current: searchInfo.page, 
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }
                : false
              "
              :row-selection="{ selectedRowKeys: searchInfo.selectedRowKeys, onChange: onSelectChange,}"
              rowKey="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'tags'">
                  <span :title="(record.tags && record.tags.length)?`${record.tags.join(' / ')}`:''">{{(record.tags && record.tags.length)?`${record.tags.join(' / ')}`:''}}</span>
                </template>
                <template v-if="column.dataIndex === 'name'">
                  <span class="courseName" :title="record.name" @click="viewDetail(record)">{{record.name}}</span>
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <a-button type="link" @click="dleDelete(record)">删除</a-button>
                </template>
              </template>
              
            </a-table>
            <template #renderEmpty>
              <div v-if="!loading"><Empty :type="EmptyType" /></div>
            </template>
          </a-config-provider>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { inject,ref, toRefs, onMounted ,Ref,reactive,createVNode, computed} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import StatisticsPie from './../components/StatisticsPie.vue'
import { useRouter } from "vue-router";
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
const { lStorage } = extStorage;
const uid = lStorage.get("uid")
const router=useRouter()
const http = (request as any).TeachingResourceManagement;
const http2 = (request as any).teacherMaterialResource;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "素材资源管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const materialTypeList: any = reactive([
  {id: 1, name: "数据集", count: 0, class: 'progressItem1', icon: 'icon-shujuji',key:'datasetCount'},
  {id: 2, name: "视频", count: 0, class: 'progressItem2', icon: 'icon-shipinbofang',key:'videoCount'},
  {id: 3, name: "课件", count: 0, class: 'progressItem3', icon: 'icon-a-zu8851',key:'coursewareCount'},
  {id: 4, name: "备课资料", count: 0, class: 'progressItem4', icon: 'icon-a-zu8852',key:'preparationCount'},
  {id: 5, name: "教学指导", count: 0, class: 'progressItem1', icon: 'icon-a-zu8853',key:'guidanceCount'},
  {id: 6, name: "实验文档", count: 0, class: 'progressItem2', icon: 'icon-a-zu8854',key:'documentCount'},
])
const columns= [
  {
    title: "目录名称",
    dataIndex: "name",
    align: "left",
    ellipsis: true
  },
  {
    title: "素材属性",
    dataIndex: "is_publicName",
    align: "center",
  },
  {
    title: "素材所属",
    dataIndex: "username",
    align: "center",
    width:160,
    ellipsis: true,
  },
  {
    title: "素材类型",
    dataIndex: "type_name",
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "item_count",
    align: "center",
  },
  {
    title: "大小",
    dataIndex: "item_size",
    align: "center",
  },
  {
    title: "标签",
    dataIndex: "tags",
    align: "center",
    ellipsis: true
  },
  {
    title: "描述",
    dataIndex: "description",
    align: "center",
    width:120,
    ellipsis: true,
  },
  {
    title: '操作',
    width:150,
   dataIndex: 'action'
  }
]
var searchInfo:any=reactive({
  name:'',
  is_public:'',
  tags:'',
  page:1,
  limit:10,
  selectedRowKeys:[],
  analysis:{}
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{id:1}]);
var totalCount: Ref<number> = ref(0);
var analysisObj:any=reactive({})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.name == '' && searchInfo.is_public == '' && searchInfo.tags == ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})
const initData = () => {
  const param:any={
    name:searchInfo.name,
    is_public:searchInfo.is_public,
    tags:searchInfo.tags,
    page:searchInfo.page,
    limit:searchInfo.limit
  }
  loading.value = true;
  courseList.length = 0
  // resourceslist
  http2.dataSets({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,analysis }  = res.data
    list.forEach((v: any) => {
      v.is_publicName=v.is_public?'公开素材':'私有素材'
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    Object.assign(analysisObj,analysis)
    courseList.push(...list)
    totalCount.value = page.totalCount
  })
};

const onChange=(page: any, pageSize: any)=> {
  searchInfo.page=page
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
  console.log(searchInfo.selectedRowKeys);
}
const onShowSizeChange=(page: any, pageSize: any)=>{
  searchInfo.page=1
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
const onSelectChange=(selectedRowKeys: any[], selectedRows: any[])=> {
  console.log(selectedRowKeys);
  
  searchInfo.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
  console.log(searchInfo.selectedRowKeys);
}
const courseStatechange=(val: any)=> {
  searchInfo.page=1
  initData()
}
const resourceStatistics=()=>{
  http.resourceStatistics().then((res: IBusinessResp) => {
    const {typeStatistics,visibleStatistics }  = res.data
    Object.assign(analysisObj,typeStatistics,visibleStatistics)
    materialTypeList.forEach((v:any)=>{
      if(analysisObj[v.key]){
        v.count=analysisObj[v.key]
      }
    })
  })
}
const viewDetail=(val:any)=>{
  let query:any={
    currentTab:val.is_public?0:1,
    role:2,
    editId: val.slab_uid ? val.slab_uid: val.id,
    type:val.type_name,
    cardType: val.slab_uid ? 'setData':'other',
    user_id: uid
  }
  if(val.slab_uid){
    router.push({
      path:'/admin/TeachingResourceManagement/resourcesManagement/setDataDetail',
      query:{
        ...query,  
        avatar: val.user.avatar,
        username: val.username
      }
    })
  }else{
    router.push({
      path:'/admin/TeachingResourceManagement/resourcesManagement/resourcesDetail',
      query:{...query}
    })
  }
}
const searchList=()=> {
  searchInfo.page=1
  initData()
}
const dleDelete=(item:any)=>{
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.resourceBatchDelete({param: {datasetIds:`${item.id}`}}).then((res: any) => {
        message.success("删除成功"); //
        initData();
        resourceStatistics()
      });
    },
  });
}
const BatchDelete=()=>{
  if(!searchInfo.selectedRowKeys?.length){
    message.warning('请至少选择一条数据！')
    return
  }
  let datasetIds=searchInfo.selectedRowKeys.join(',')
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.resourceBatchDelete({param: {datasetIds:datasetIds}}).then((res: any) => {
        message.success("删除成功"); //
        searchInfo.selectedRowKeys=[]
        initData();
        resourceStatistics()
      });
    },
  });
}
const statisticList: any = reactive([])
onMounted(() => {
  // statisticList.push(...[{ value:100, name: '私有资源',color:'#00CBC2' }, { value:50, name: '公开资源',color:'#FF9544' }])
  initData()
  resourceStatistics()
});
</script>

<style lang="less" scoped>
  .statisticalTitle{
    color: var(--black-85);
    font-weight: 500;
  }
  .Statistics{
    justify-content: space-between;
    .item{
      width: 285px;
      height: 180px;
      background-color: var(--white);
      padding: 12px;
      width:270px;
    }
    .item2{
      width:895px;
      .progressBox{
        justify-content: space-between;
        margin-top: 24px;
        .progressItem{
          width: 130px;
          height: 85px;
          border-radius: 6px;
          padding: 12px 20px;
          .text{
            justify-content: space-between;
            .iconfont{
              font-size: 26px;
            }
            .num{
              font-size: 28px;
              color: #3a3b43;
              font-weight: 400;
            }
          }
          .type{
            font-size: 12px;
            color:#363D5F;
            text-align: right;
          }
        }
        .progressItem1{
          background: linear-gradient(180deg,#fcdecb, #e9dbe4 55%, #dadaf8);
        }
        .progressItem2{
          background: linear-gradient(180deg,#95edf3, #a4cbfb);
        }
        .progressItem3{
          background: linear-gradient(180deg,#fbbcd9, #fecbd6 55%, #ffd2d5);
        }
        .progressItem4{
          background: linear-gradient(180deg,#9badfb, #c8adfc 71%, #d5b3fc);
        }
      }
    }
    .item3{
      .started{
        display: flex;
        padding-top: 1rem;
        .num{
         flex-grow: 1;
         color:#31394D;
         font-size: 30px;
         font-weight: 600;
        }
        .img{
          width: 164px;
          height: 98px;
          background-size: 100% 100%;
          background-image: url('src/assets/images/user/teacher.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
  .courseManagementContent{
    background-color: var(--white);
    margin-top: 2rem;
    min-height: 750px;
    padding: 24px 30px 0;
    .searchcourse{
      justify-content: space-between;
      .left{
        .item{
          display: flex;
          align-items: center;
          margin-right: 12px;
          .ant-select,.ant-input{
            width: 200px;
          }
        }
      }
      .right{
        .ant-btn:nth-child(1){
          margin-right: 12px;
        }
      }
    }
    .tableContent{
      margin-top: 2rem;
      .courseName{
        color:var(--primary-color);
        cursor: pointer;
      }
    }

  }
</style>