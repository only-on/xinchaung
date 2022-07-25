<template>
  <div class="courseManagement">
    <div class="Statistics flexCenter">
      <div class="item">
        <StatisticsPie :title="'课程统计'"  :data="[{ value:analysisObj.privateCourseCount, name: '私有课程',color:'#00CBC2' }, { value:analysisObj.publicCourseCount, name: '公开课程' ,color:'#FF9544'}]" />
      </div>
      <div class="item item2">
        <h3 class="statisticalTitle">课程状态</h3>
        <div class="progressItem">
          <a-progress :percent="getpercent(analysisObj.pendingCourseCount)" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">未开始课程</span>
            <span class="num">{{analysisObj.pendingCourseCount}}</span>
          </div>
        </div>
        <div class="progressItem">
          <a-progress :percent="getpercent(analysisObj.progressingCourseCount)" :status="'success'" :strokeColor="'#83D540'" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">进行中课程</span>
            <span class="num">{{analysisObj.progressingCourseCount}}</span>
          </div>
        </div>
        <div class="progressItem">
          <a-progress :percent="getpercent(analysisObj.closingCourseCount)" :strokeColor="'#808294'" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">结束课程</span>
            <span class="num">{{analysisObj.closingCourseCount}}</span>
          </div>
        </div>
      </div>
      <div class="item item3">
        <h3 class="statisticalTitle">正在开设课程</h3>
        <div class="started">
          <div class="num">{{analysisObj.allCourseCount}}</div>
          <div class="img"></div>
        </div>
      </div>
      <div class="item item4">
        <h3 class="statisticalTitle">录屏</h3>
        <div class="flexCenter proportion">
          <div class="left flexCenter">
            <span class="left1">{{analysisObj.diskRatio}}%</span>
            <span class="left2">{{analysisObj.videoUsedDisk}}/{{analysisObj.allTotalDisk}}G</span>
          </div>
          <div class="right">
            <a-progress type="circle" :percent="analysisObj.diskRatio" :strokeColor="'#9872EB'" :strokeWidth="12">
              <template #format="percent">
                <div class="right1">磁盘总量</div>
                <div class="right2">{{analysisObj.allTotalDisk}}G</div>
              </template>
            </a-progress>
          </div>
        </div>
      </div>
    </div>
    <div class="courseManagementContent">
      <div class="search flexCenter">
        <div class="left flexCenter">
          <div class="item">
            <span>课程名称：</span>
            <a-input v-model:value="searchInfo.courseName" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
          <div  class="item">
            <span>课程属性：</span>
            <a-select v-model:value="searchInfo.courseAttribute" placeholder="请选择课程属性" @change="courseAttributechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option :value="1">公开课程</a-select-option>
              <a-select-option :value="0">私有课程</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span>课程状态：</span>
            <a-select v-model:value="searchInfo.courseState" placeholder="请选择课程状态" @change="courseStatechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option :value="2">未开始</a-select-option>
              <a-select-option :value="3">进行中</a-select-option>
              <a-select-option :value="1">已结束</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-button type="primary" @click="BatchDelete()"> 批量删除 </a-button>
          <a-button type="primary" class="brightBtn" @click="ClearScreen()"> 批量清除录屏 </a-button>
        </div>
      </div>
      <div class="tableContent">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <a-config-provider>
            <a-table :columns="columns" :data-source="courseList"
            :pagination="
              totalCount > 10? {
                    hideOnSinglePage: false,
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
              <template #courseState="{ record }">
                <div :class="{'进行中':'in','未开始':'nostarted','已结束':'end'}[record.courseState]">{{record.courseState}}</div>
              </template>
              <template #courseName="{ record }">
                <span class="courseName" :title="record.courseName" @click="viewDetail(record)">{{record.courseName}}</span>
              </template>
              <template #action="{record}">
                <a-button type="link" @click="dleDelete(record)">删除</a-button>
                <!-- <span class="action courseName" @click="dleDelete(record)">删除</span> -->
              </template>
            </a-table>
            <template #renderEmpty>
              <div v-if="!loading"><Empty :type="'tableEmpty'" /></div>
            </template>
          </a-config-provider>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { inject,ref, toRefs, onMounted ,Ref,reactive,createVNode} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import { useRouter } from "vue-router";
import StatisticsPie from '../components/StatisticsPie.vue'
import { Modal, message } from "ant-design-vue";
const router=useRouter()
const http = (request as any).TeachingResourceManagement;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "课程管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const columns= [
        {
          title: "课程名称",
          dataIndex: "courseName",
          align: "left",
          ellipsis: true,
          slots: { customRender: "courseName" },
        },
        {
          title: "课程属性",
          dataIndex: "courseAttribute",
          align: "center",
          // slots: { customRender: "is_public" },
        },
        {
          title: "课程所属",
          dataIndex: "courseGroup",
          align: "center",
          width:160,
          ellipsis: true,
        },
        {
          title: "课程状态",
          dataIndex: "courseState",
          align: "center",
          slots: { customRender: "courseState" },
        },
        {
          title: "实验数",
          dataIndex: "contentsCount",
          align: "center",
        },
        {
          title: "课时",
          dataIndex: "classesCount",
          align: "center",
        },
        {
          title: "操作记录大小",
          dataIndex: "recordSize",
          align: "center",
          ellipsis: true,
        },
        {
          title: '操作',
          width:150,
          key: 'action',
          slots: { customRender: 'action' },
        }
      ]
var searchInfo:any=reactive({
  courseName:'',
  courseAttribute:'',
  courseState:'',

  page:1,
  limit:10,
  selectedRowKeys:[]
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{id:1}]);
var totalCount: Ref<number> = ref(0);
var analysisObj:any=reactive({})
const initData = () => {
  const param:any={
    'search[courseName]':searchInfo.courseName,
    'search[courseAttribute]':searchInfo.courseAttribute,
    'search[courseState]':searchInfo.courseState,
    page:searchInfo.page,
    limit:searchInfo.limit
  }
  loading.value = true;
  courseList.length = 0
  totalCount.value=0
  http.courselist({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,analysis }  = res.data
    list.forEach((v: any) => {
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    Object.assign(analysisObj,analysis)
    courseList.push(...list)
    totalCount.value = page.totalCount
  }).catch((err:any)=>{
      loading.value = false
  })
};

const onChange=(page: any, pageSize: any)=> {
  searchInfo.page=page
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
const onShowSizeChange=(page:any,pageSize:any)=>{
  searchInfo.page=1
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
const courseAttributechange=(val: any)=> {
  searchInfo.page=1
  initData()
}
const searchList=()=> {
  searchInfo.page=1
  initData()
}

const courseStatechange=(val: any)=> {
  searchInfo.page=1
  initData()
}
type Key = ColumnProps["key"];
const onSelectChange=(selectedRowKeys: Key[], selectedRows: Key[])=> {
  searchInfo.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  console.log(searchInfo.selectedRowKeys);
  
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
}
const dleDelete=(item:any)=>{
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.CourseBatchDelete({param: {course_ids:[item.id]}}).then((res: any) => {
        message.success("删除成功"); //
        initData();
      });
    },
  });
}
const BatchDelete=()=>{
  if(!searchInfo.selectedRowKeys?.length){
    message.warning('请至少选择一条数据！')
    return
  }
  // return
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.CourseBatchDelete({param: {course_ids:searchInfo.selectedRowKeys}}).then((res: any) => {
        message.success("删除成功"); //
        searchInfo.selectedRowKeys=[]
        initData();
      });
    },
  });
}
// 
const ClearScreen=()=>{
  if(!searchInfo.selectedRowKeys?.length){
    message.warning('请至少选择一条数据！')
    return
  }
  // return
  Modal.confirm({
    title: "确认清除录屏吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "清除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.CourseBatchClearScreen({param: {course_ids:searchInfo.selectedRowKeys}}).then((res: any) => {
        message.success("清除成功"); //
        searchInfo.selectedRowKeys=[]
        initData();
      });
    },
  });
}
const getpercent=(val:number)=>{
  // console.log(Math.ceil(val/analysisObj.allCourseCount*100));
  
  return Math.ceil(val/analysisObj.allCourseCount*100)
}
// /teacher/teacherCourse/Detail?currentTab=1&courseId=500173
const viewDetail=(val:any)=>{
  router.push({
    path:'/admin/TeachingResourceManagement/courseManagement/courseManagementDetail',
    query:{
      // role:2,
      currentTab:1,
      courseId:val.id,
      // from:'courseManagement'
    }
  })
  // return Math.ceil(val/analysisObj.allCourseCount)
}
onMounted(() => {
  initData()
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
      // width:270px;
    }
    .item2{
      .progressItem{
        .tip{
          justify-content: space-between;
          font-size: 10px;
          .name{
            color: #808294;
          }
          .num{
            font-size: 14px;
            color: #31394D;
            font-weight: 600;
          }
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
          background-image: url('src/assets/images/TeachingResourceManagement/8739.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
    .item4{
      .proportion{
        justify-content: space-between;
        .left{
          flex-direction: column;
          .left1{
            color: #31394D;
            font-size: 30px;
          }
          .left2{
            color: #808294;
            
          }
        }
        .right{
          .right1{
            color: #102241;
            font-size: 12px;
            padding: 6px 0;
          }
          .right2{
            color: #455A64;
            font-size: 12px;
          }
        }
      }
    }
  }
  .courseManagementContent{
    background-color: var(--white);
    margin-top: 2rem;
    min-height: 750px;
    padding: 24px 30px 0;
    .search{
      justify-content: space-between;
      .left{
        .item{
          display: flex;
          align-items: center;
          margin-right: 12px;
           width:270px;
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
      .in{
        color: rgba(6,178,104,0.65);
      }
      .nostarted,.courseName{
        color:var(--primary-color);
        cursor: pointer;
      }
      .end{
        color: #808294;
      }
    }

  }
</style>