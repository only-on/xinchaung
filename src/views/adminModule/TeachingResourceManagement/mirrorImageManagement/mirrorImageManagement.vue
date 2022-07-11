<template>
  <div class="courseManagement">
    <div class="Statistics flexCenter">
      <div class="item">
        <StatisticsPie :title="'镜像统计'"  :data="[{ value:analysisObj.teacherImagesCount, name: '教师镜像',color:'#00CBC2' }, { value:analysisObj.initImagesCount, name: '内置镜像' ,color:'#FF9544'}]" />
      </div>
      <div class="item item2">
        <h3 class="statisticalTitle">镜像类型</h3>
        <div class="progressBox flexCenter">
          <div class="progressItem progressItem1">
            <div class="text flexCenter">
              <span class="iconfont icon-cpu"></span>
              <span class="num">{{analysisObj.armImagesCount}}</span>
            </div>
            <div class="type">ARM</div>
          </div>
          <div class="progressItem progressItem2">
            <div class="text flexCenter">
              <span class="iconfont icon-docker"></span>
              <span class="num">{{analysisObj.dockerImagesCount}}</span>
            </div>
            <div class="type">Docker</div>
          </div>
          <div class="progressItem progressItem3">
            <div class="text flexCenter">
              <span class="iconfont icon-linux"></span>
              <span class="num">{{analysisObj.kvmLinuxImagesCount}}</span>
            </div>
            <div class="type">KVM-Linux</div>
          </div>
          <div class="progressItem progressItem4">
            <div class="text flexCenter">
              <span class="iconfont icon-windows"></span>
              <span class="num">{{analysisObj.kvmWindowImagesCount}}</span>
            </div>
            <div class="type">KVM-Windows</div>
          </div>
        </div>
      </div>
      <div class="item item4">
        <h3 class="statisticalTitle">镜像占用</h3>
        <div class="flexCenter proportion">
          <div class="left flexCenter">
            <span class="left1">{{analysisObj.diskRatio}}%</span>
            <span class="left2">{{analysisObj.imageUsedDisk}}/{{analysisObj.allTotalDisk}}G</span>
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
            <span>镜像名称：</span>
            <a-input v-model:value="searchInfo.imageName" placeholder="请输入关键字搜索" @keyup.enter="searchList"  />
          </div>
          <div  class="item">
            <span>镜像所属：</span>
            <a-input v-model:value="searchInfo.imageGroup" placeholder="请输入镜像所属" @keyup.enter="searchList"  />
          </div>
          <div class="item">
            <span>镜像类型：</span>
            <a-select v-model:value="searchInfo.imageType" placeholder="请选择镜像类型"  @change="courseStatechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="ARM">ARM</a-select-option>
              <a-select-option value="Docker">Docker</a-select-option>
              <a-select-option value="KVM-Linux">KVM-Linux</a-select-option>
              <a-select-option value="KVM-Windows">KVM-Windows</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-button type="primary" @click="BatchDelete()"> 批量删除 </a-button>
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
              :row-selection="{ selectedRowKeys: searchInfo.selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps}"
              rowKey="id">
              <template #action="{record}">
                <a-button type="link" @click="dleDelete(record)" :disabled="!record.imageCanDelete">删除</a-button>
                <!-- <span class="action detail" @click="dleDelete(record)">删除</span> -->
              </template>
            </a-table>
            <template #renderEmpty>
              <div v-if="!loading"><Empty type="tableEmpty" /></div>
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
import { Modal, message } from "ant-design-vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import StatisticsPie from '../components/StatisticsPie.vue'
const http = (request as any).TeachingResourceManagement;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "镜像管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const columns= [
        {
          title: "镜像名称",
          dataIndex: "imageName",
          align: "left",
          ellipsis: true,
        },
        {
          title: "镜像所属",
          dataIndex: "imageGroup",
          align: "center",
          width:160,
          ellipsis: true,
        },
        {
          title: "镜像类型",
          dataIndex: "imageType",
          align: "center",
        },
        {
          title: "镜像大小",
          dataIndex: "imageSize",
          align: "center",
        },
        {
          title: "镜像标签",
          dataIndex: "imageTagsText",
          align: "center",
          width:160,
          ellipsis: true,
          // slots: { customRender: "imageTags" },
        },
        {
          title: "镜像描述",
          dataIndex: "imageDescription",
          align: "center",
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          slots: { customRender: 'action' },
        }
      ]
var searchInfo:any=reactive({
  imageName:'',
  imageGroup:'',
  imageType:'',
  page:1,
  limit:10,
  selectedRowKeys:[],
  analysis:{}
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{id:1}]);
var totalCount: Ref<number> = ref(0);
var analysisObj:any=reactive({})
const initData = () => {
  const param:any={
    'search[imageName]':searchInfo.imageName,
    'search[imageGroup]':searchInfo.imageGroup,
    'search[imageType]':searchInfo.imageType,
    page:searchInfo.page,
    limit:searchInfo.limit
  }
  loading.value = true;
  courseList.length = 0
  http.imageslist({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,analysis }  = res.data
    list.forEach((v: any) => {
      v.imageTagsText=v.imageTags?.length?v.imageTags.join(' / '):''       // .imageTags.join(' / ')
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
}
const onShowSizeChange=(page: any, pageSize: any)=> {
  searchInfo.page=1
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
type Key = ColumnProps["key"];
const onSelectChange=(selectedRowKeys: Key[], selectedRows: Key[])=> {
  searchInfo.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
  console.log(searchInfo.selectedRowKeys);
}
const getCheckboxProps=(record: any) => ({
    disabled: record.imageCanDelete === false, // Column configuration not to be checked
    name: record.name,
  })
// disabled: record.imageCanDelete === true
const courseStatechange=(val: any)=> {
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
      http.imageBatchDelete({param:{image_ids:[item.id]}}).then((res: any) => {
        message.success("删除成功"); //
        initData();
      });
    },
  });
}
const BatchDelete=()=>{
  // return
  if(!searchInfo.selectedRowKeys?.length){
    message.warning('请至少选择一条数据！')
    return
  }
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.imageBatchDelete({param:{image_ids:searchInfo.selectedRowKeys}}).then((res: any) => {
        message.success("删除成功"); //
        searchInfo.selectedRowKeys=[]
        initData();
      });
    },
  });
}
const searchList=()=> {
  searchInfo.page=1
  initData()
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
      width:590px;
      .progressBox{
        justify-content: space-between;
        margin-top: 24px;
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
           width:270px;
          .ant-select,.ant-input{
            width: 200px;
          }
        }
      }
      .right{
        .ant-btn{
          background: var(--brightBtn);
          border-color: var(--brightBtn);
        }
        .ant-btn:nth-child(1){
          margin-right: 12px;
        }
      }
    }
    .tableContent{
      margin-top: 2rem;
      .action{
        color: var(--primary-color);
        cursor: pointer;
      }
    }

  }
</style>