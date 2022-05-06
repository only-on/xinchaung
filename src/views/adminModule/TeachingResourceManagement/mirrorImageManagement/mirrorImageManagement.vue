<template>
  <div class="courseManagement">
    <div class="Statistics flexCenter">
      <div class="item"></div>
      <div class="item item2">
        <h3 class="statisticalTitle">镜像类型</h3>
        <div class="progressBox flexCenter">
          <div class="progressItem progressItem1">
            <div class="text flexCenter">
              <span class="iconfont icon-cpu"></span>
              <span class="num">79</span>
            </div>
            <div class="type">ARM</div>
          </div>
          <div class="progressItem progressItem2">
            <div class="text flexCenter">
              <span class="iconfont icon-docker"></span>
              <span class="num">23</span>
            </div>
            <div class="type">Docker</div>
          </div>
          <div class="progressItem progressItem3">
            <div class="text flexCenter">
              <span class="iconfont icon-linux"></span>
              <span class="num">145</span>
            </div>
            <div class="type">KVM-Linux</div>
          </div>
          <div class="progressItem progressItem4">
            <div class="text flexCenter">
              <span class="iconfont icon-windows"></span>
              <span class="num">89</span>
            </div>
            <div class="type">KVM-Windows</div>
          </div>
        </div>
      </div>
      <div class="item item4">
        <h3 class="statisticalTitle">镜像占用</h3>
        <div class="flexCenter proportion">
          <div class="left flexCenter">
            <span class="left1">32%</span>
            <span class="left2">300/1024</span>
          </div>
          <div class="right">
            <a-progress type="circle" :percent="75" :strokeColor="'#9872EB'" :strokeWidth="12">
              <template #format="percent">
                <div class="right1">镜像总量</div>
                <div class="right2">1024G</div>
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
            <span>镜像名称：</span>
            <a-input v-model:value="searchInfo.name" placeholder="请输入关键字搜索" />
          </div>
          <div  class="item">
            <span>镜像所属：</span>
            <a-select v-model:value="searchInfo.is_public" placeholder="请选择镜像所属">
              <a-select-option :value="1">内置镜像</a-select-option>
              <a-select-option :value="0">教师镜像</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span>镜像类型：</span>
            <a-select v-model:value="searchInfo.state" placeholder="请选择镜像类型">
              <a-select-option :value="0">ARM</a-select-option>
              <a-select-option :value="2">Docker</a-select-option>
              <a-select-option :value="3">KVM-Linux</a-select-option>
              <a-select-option :value="1">KVM-Windows</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-button type="primary"> 批量删除 </a-button>
        </div>
      </div>
      <div class="tableContent">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <a-config-provider>
            <a-table :columns="columns" :data-source="courseList"
              :pagination="{ hideOnSinglePage: false, total: totalCount, pageSize: searchInfo.limit,current: searchInfo.page, onChange: onChange}"
              :row-selection="{ selectedRowKeys: searchInfo.selectedRowKeys, onChange: onSelectChange,}"
              rowKey="id">
              <template #state="{ record }">
                <div>{{`${['已结束','未开始','进行中'][record.state-1]}`  }}</div>
              </template>
              <template #is_public="{ record }">
                <div>{{ record.is_public===1?'公开课程':'私有课程' }}</div>
              </template>
            </a-table>
            <template #renderEmpty>
              <div><Empty type="tableEmpty" /></div>
            </template>
          </a-config-provider>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject,ref, toRefs, onMounted ,Ref,reactive} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ColumnProps } from "ant-design-vue/es/table/interface";
const httpTeachCourse = (request as any).teachCourse;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "课程管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const columns= [
        {
          title: "镜像名称",
          dataIndex: "name",
          align: "left",
          ellipsis: true,
        },
        {
          title: "镜像所属",
          dataIndex: "is_public",
          align: "center",
          slots: { customRender: "is_public" },
        },
        {
          title: "镜像类型",
          dataIndex: "user_name",
          align: "center",
        },
        {
          title: "镜像大小",
          dataIndex: "state",
          align: "center",
          slots: { customRender: "state" },
        },
        {
          title: "镜像标签",
          dataIndex: "content_total",
          align: "center",
        },
        {
          title: "镜像描述",
          dataIndex: "class_total",
          align: "center",
        },
      ]
var searchInfo:any=reactive({
  name:'',
  is_public:1,
  state:0,

  page:1,
  limit:10,
  selectedRowKeys:[]
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{id:1}]);
var totalCount: Ref<number> = ref(0);
const initData = () => {
  const param:any={
    ...searchInfo,
    type:1,
    // state:labelSearch.state?labelSearch.state:'',
  }
  loading.value = true;
  courseList.length = 0
  httpTeachCourse.getCourseList({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page }  = res.data
    list.forEach((v: any) => {
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    courseList.push(...list)
    totalCount.value = page.totalCount
  })
};

const onChange=(page: any, pageSize: any)=> {
  searchInfo.page=page
  initData()
}
type Key = ColumnProps["key"];
const onSelectChange=(selectedRowKeys: Key[], selectedRows: Key[])=> {
  searchInfo.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
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
    }
    .item2{
      width:590px;
      .progressBox{
        justify-content: space-between;
        .progressItem{
          width: 130px;
          height: 85px;
          border-radius: 6px;
          padding: 12px;
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
    }

  }
</style>