<template>
  <div class="resourceManagement">
    <div class="Statistics flexCenter">
      <div class="item">
        <statistics-pie title="素材资源统计" :data="[{ value:analysisObj.teacherImagesCount, name: '私有资源',color:'#00CBC2' }, { value:analysisObj.teacherImagesCount, name: '公开资源',color:'#FF9544' }]"></statistics-pie>
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
      <div class="search flexCenter">
        <div class="left flexCenter">
          <div class="item">
            <span>素材名称：</span>
            <a-input v-model:value="searchInfo.imageName" placeholder="请输入关键字搜索" @keyup.enter="searchList"  />
          </div>
          <div class="item">
            <span>素材属性：</span>
            <a-select v-model:value="searchInfo.imageAttr" placeholder="请选择素材属性"  @change="courseStatechange">
              <a-select-option :value="0">公开素材</a-select-option>
              <a-select-option :value="1">私有素材</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span>素材类型：</span>
            <a-select v-model:value="searchInfo.imageType" placeholder="请选择素材类型"  @change="courseStatechange">
              <a-select-option value="">全部</a-select-option>
              <a-select-option  v-for="list in materialTypeList" :key="list.id" :value="list.name">{{list.name}}</a-select-option>
              <!-- <a-select-option value="Docker">Docker</a-select-option>
              <a-select-option value="KVM-Linux">KVM-Linux</a-select-option>
              <a-select-option value="KVM-Windows">KVM-Windows</a-select-option> -->
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
              <template #imageTags="{ record }">
                <div>{{(record.imageTags && record.imageTags.length)?`${record.imageTags.join(' / ')}`:''}}</div>
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
import { inject,ref, toRefs, onMounted ,Ref,reactive} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import StatisticsPie from './../components/StatisticsPie.vue'
const http = (request as any).TeachingResourceManagement;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "素材资源管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const materialTypeList: any = reactive([
  {id: 1, name: "数据集", count: 9, class: 'progressItem1', icon: 'icon-shujuji'},
  {id: 2, name: "视频", count: 9, class: 'progressItem2', icon: 'icon-shipinbofang'},
  {id: 3, name: "课件", count: 9, class: 'progressItem3', icon: 'icon-a-zu8851'},
  {id: 4, name: "备课资料", count: 9, class: 'progressItem4', icon: 'icon-a-zu8852'},
  {id: 5, name: "教学指导", count: 9, class: 'progressItem1', icon: 'icon-a-zu8853'},
  {id: 6, name: "实验文档", count: 9, class: 'progressItem2', icon: 'icon-a-zu8854'},
])
const columns= [
  {
    title: "目录名称",
    dataIndex: "imageName",
    align: "left",
    ellipsis: true,
  },
  {
    title: "素材属性",
    dataIndex: "imageGroup",
    align: "center",
  },
  {
    title: "素材所属",
    dataIndex: "imageGroup",
    align: "center",
  },
  {
    title: "素材类型",
    dataIndex: "imageType",
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "imageSize",
    align: "center",
  },
  {
    title: "大小",
    dataIndex: "imageSize",
    align: "center",
  },
  {
    title: "标签",
    dataIndex: "imageTags",
    align: "center",
    ellipsis: true,
    slots: { customRender: "imageTags" },
  },
  {
    title: "描述",
    dataIndex: "imageDescription",
    align: "center",
    ellipsis: true,
  },
]
var searchInfo:any=reactive({
  imageName:'',
  imageGroup:'',
  imageType:'',
  imageAttr: 0,
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
  // resourceslist
  http.imageslist({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,analysis }  = res.data
    list.forEach((v: any) => {
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    Object.assign(analysisObj,analysis)
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
const courseStatechange=(val: any)=> {
  searchInfo.page=1
  initData()
}
const searchList=()=> {
  searchInfo.page=1
  initData()
}
const statisticList: any = reactive([])
onMounted(() => {
  // statisticList.push(...[{ value:100, name: '私有资源',color:'#00CBC2' }, { value:50, name: '公开资源',color:'#FF9544' }])
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