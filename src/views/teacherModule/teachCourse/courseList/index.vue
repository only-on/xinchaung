<template>
  <search-add @searchFn="searchFn" @handleMenuClick="handleMenuClick" :isShowAdd="isShowAdd"></search-add>
  <classify :list="currentTab ===1?publicClassifyList:classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item" v-for="(v, k) in 11" @click="courseDetail()" :key="v" :class="[1,2,5,6,9,10].includes(k)?'midItem':''">
        <div class="coverBox">
          <div class="cover">
            <div class="top flexCenter">
              <div v-if="currentTab === 0" class="state state-ing">未开始</div>
              <div v-if="currentTab === 1" class="flexCenter user">
              <!-- :style="`background-image: url(${v.avatar});`" -->
                <span class="img"></span>
                <span>系统内置</span>
              </div>
            </div>
            <div class="tabBox">
              <span>标签1/标签2/</span>
                <!-- <span>{{`${info.tags.join('/')}`}}</span> -->
            </div>
          </div>
          <div class="flexCenter Projection">
            <span class="text" @click.stop="multiplexing(v)">复用</span>
            <span class="text" @click.stop="deleteFun(v)">删除</span>
            <span class="text" v-if="currentTab === 0" @click.stop="archives(v)">学情归档</span>
          </div>
        </div>
        <div class="info">
          <div class="name">数据分析与机器学习实战</div>
          <div class="date">
            <span>实验:20</span>
            <span>课时:20</span>
            <span>学生:199</span>
          </div>
          <div class="createDate flexCenter" v-if="currentTab === 0">
            <span>2020/03/14 - 2021/05/16</span>
            <div class="analysis flexCenter">
              <span>学情分析</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!courseList.length && !loading" />
      <a-pagination
        v-if="totalCount > 12"
        v-model:current="searchInfo.page"
        :pageSize="searchInfo.limit"
        :total="totalCount"
        @change="pageChange"
      />
    </div>
  </a-spin>

  <a-modal v-model:visible="Visible"  :title="`课程归档`" class="setupVisible" :width="490">
    <div class="title">课程已归档并为您导出了该课程归档数据文件</div>
    <div class="file">
      <span class="img" :style="`background-image: url(${getFileTypeIcon(activeCourse.name)});`"></span>
      <span>{{activeCourse.name}}</span>
    </div>
    <template #footer>
      <a-button @click="cancel()">取消</a-button>
      <a-button type="primary" @click="Save()">下载</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  createVNode,
} from "vue";
import { getFileType,getFileTypeIcon,readFile } from 'src/utils/getFileType'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { downloadUrl } from "src/utils/download";
const router = useRouter();
const env = process.env.NODE_ENV == "development" ? true : false;
const route = useRoute();
// const { currentTab,course_id } = route.query;
const http = (request as any).teachCourse;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "我的教学", componenttype: 0 },
    { name: "公开课程", componenttype: 1 },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
interface ISearchInfo {
  init_type: number
  name: string
  limit: number
  page: number
}
var courseList: any[] = reactive([{id:1}]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const currentTab = ref<number>(0);
const isShowAdd = ref<boolean>(true);
const searchInfo = reactive<ISearchInfo>({
  init_type: 0,
  name: '',
  limit: 10,
  page: 1,
});
watch(() => { return configuration.componenttype; },
  (val) => {
    // console.log(val)
    currentTab.value = val ;
    searchInfo.init_type = currentTab.value
    searchInfo.page = 1
    // searchInfo.content_direction = 0
    // searchInfo.content_type = 0
    // searchInfo.content_level = 0
    classifyList.forEach((v: any) => {
      v.value = 0
    })
    initData();
    isShowAdd.value = val === 0;
    // console.log(isShowAdd.value)
  }
);
/**
 * 标签操作
 */
// let list1=
const classifyList: any = reactive([
  {
    title: "课程状态",
    value: 0,
    keyName: "content_type",
    data: [
      { name: "全部", value: 0 },
      { name: "未开始", value: 1 },
      { name: "进行中", value: 2 },
      { name: "已结束", value: 3 },
    ],
  },
  {
    title: "开课年份",
    value: 0,
    keyName: "content_level",
    data: [
      { name: "全部", value: 0 },
      { name: "2022年", value: 1 },
      { name: "2021年", value: 2 },
      { name: "2020年", value: 3 },
      { name: "2019年", value: 4 },
      { name: "2018年", value: 5 },
      { name: "2017年", value: 6 },
      { name: "近5-10年", value: 7 },
      { name: "10年以前", value: 8 },
    ],
  },
]);
const publicClassifyList: any = reactive([
  {
    title: "课程方向",
    value: 0,
    keyName: "CourseDirection",
    data: [
      { name: "全部", value: 0 },
      { name: "机器学习", value: 1 },
      { name: "深度学习", value: 2 },
      { name: "计算机学习", value: 3 },
    ],
  },
  {
    title: "职业方向",
    value: 0,
    keyName: "CareerDirection",
    data: [
      { name: "全部", value: 0 },
      { name: "大数据工程师", value: 1 },
      { name: "深度学习训练师", value: 2 },
      { name: "视觉工程师", value: 3 },
    ],
  },
]);
const labelSearch = reactive({
  direction: 0,
  complexity: 0,
  CourseDirection:0,
  CareerDirection:0
});
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  searchInfo.page = 1;
  initData();
};
const searchFn = (key: string) => {
  searchInfo.name = key;
  searchInfo.page = 1;
  initData();
};
const initData = () => {
  return
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  const param: ISearchInfo = Object.assign({}, {...searchInfo})
 
  loading.value = true;
  courseList.length = 0
  http.getExperimentList({param}).then((res: IBusinessResp) => {
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
const pageChange = async (current: any, pageSize: any) => {
  searchInfo.page = current;
  const { query, path } = route;
  await router.replace({
    path: path,
    query: { ...query, page: current },
  });
  initData();
};
const handleMenuClick = ({ key }: { key: string }) => {
  // router.push("/teacher/teacherExperimentResourcePool/CreateExperiment?key="+key);
  router.push({
    path: "/teacher/teacherCourse/CreateCourse",
    query: { key },
  });
};

const courseDetail=()=>{
  router.push({ path: "/teacher/teacherCourse/PublicDetail"});
  // if(n === 1){
  //   router.push({
  //   path: "/teacher/teacherCourse/PublicDetail",
  //   query: { currentTab:currentTab.value },
  // });
  // }else{
  //   router.push({ path: "/teacher/teacherCourse/PrivateDetail"});
  // }
}
const deleteFun = (val: any) => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.deleteTeacherCourse({urlParams: {imageID: val.id}}).then((res: any) => {
        message.success("删除成功");
          initData();
      });
    },
  });
};
const multiplexing=(val: any)=>{
  // router.push({ path: "/teacher/teacherCourse/PublicDetail"});    //  courseCreate
}
// 归档
var Visible: Ref<boolean> = ref(false);
var activeCourse:any=reactive({
  name:'测试课程名称.xls'
})
const archives=(val: any)=>{
  Visible.value=true
  // activeCourse.name=val.name
}
const Save=()=>{
  // let url=`${env?'/proxyPrefix':''}${activeCourse.file_url}`
  // downloadUrl(url,activeCourse.name)
  Visible.value=false
}
const cancel=()=>{
  Visible.value=false
}
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0
    configuration.componenttype = 0
  } else {
    currentTab.value = 1
    configuration.componenttype = 1
  }
  searchInfo.init_type = currentTab.value
  
  initData();
});
</script>
<style scoped lang="less">
  .mainBox{
    flex-wrap: wrap;
    .item{
      cursor: pointer;
      width: 282px;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 2rem;
      box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07); 
      border-radius: 6px;
      .coverBox{
         position: relative;
        //  cursor: pointer;
         width: 282px;
         height: 150px;
         border-radius: 6px 6px 0 0;
         .cover{
          border-radius: 6px 6px 0 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url(src/assets/images/teacherCourse/courseHeader.jpg);
          .top{
            border-radius: 6px 0px 6px 0px;
            // opacity: .5;
            padding: 3px 0;
            .state{
              background-color: rgba(0, 0, 0,.5);
              color: var(--white-70);
              padding: 3px 14px;
              &.state-ing{
                color: #37E6AE;
              }
            }
            .user{
              color: var(--white);
              background-color: rgba(0, 0, 0,.5);
              width: 100px;
              justify-content: center;
              .img{
                width: 20px;
                height: 20px;
                border-radius: 50%;
                // src/assets/images/admin/home/env3.png
                background-image: url('src/assets/images/admin/home/env3.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin: 0 6px;
              }
            }
          }
          .tabBox{
            background-color: rgba(0, 0, 0,.5);
            padding: 1px 6px;
            span{
              color: var(--white-85);
            }
          }
         }
         .Projection{
          flex-direction: column;
          justify-content: center;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          transition: .3s;
          transform: rotateY(90deg);
          background: rgba(0,0,0,0.3);
          border-radius: 6px 6px 0px 0px;
          .text{
            color: var(--white);
            padding: 10px 14px;
          }
          .text:hover{
            color: var(--primary-color);
          }
        }
        &:hover{
          .Projection{
             transform: rotateY(0deg);
          }
        }
      }
      .info{
        padding: 0 10px;
        .name{
          color: var(--black-85);
          font-size: 16px;
          padding: 10px 0;
        }
        .date{
         padding-bottom: 10px;
          span{
            color: var(--black-45);
            padding-right: 2rem;
          }
        }
        .createDate{
          border-top: 1px solid #f0f0f0;
          height: 44px;
          line-height: 44px;
          color: var(--black-45);
          justify-content: space-between;
          .analysis{
            color: var(--primary-color);
          }
        }
      }
    }
    .midItem{
      margin: 0 18px 2rem;
    }
  }
  .setupVisible{
    color: var(--black-65);
    .title{
      padding-bottom: 24px;
    }
    .file{
      display: flex;
      align-items: center;
      .img{
        width: 32px;
        height: 32px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 10px;
      }
    }
    .ant-btn{
      margin:  0 1rem;
    }
  }
</style>