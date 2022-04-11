<template>
  <search-add @searchFn="searchFn" @handleMenuClick="handleMenuClick" :isShowAdd="isShowAdd"></search-add>
  <classify :list="currentTab ===1?publicClassifyList:classifyList" @change="classifyChange"></classify>
  <div>
    列表{{currentTab}}
  </div>
  <h2 @click="courseDetail(1)">课程详情入口</h2>
  <!-- <h2 @click="courseDetail(1)">公开课程详情入口</h2>
  <h2 @click="courseDetail(2)">我的教学课程详情入口</h2> -->
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item" v-for="(v, k) in 11" :key="v" :class="[1,2,5,6,9,10].includes(k)?'midItem':''">
        <div class="cover">
          <div class="top flexCenter">
            <div>未开始</div>
            <div class="flexCenter">
              <span>user</span>
              <span>系统内置</span>
            </div>
          </div>
          <div class="tabBox">
            <span>标签1/标签2/</span>
              <!-- <span>{{`${info.tags.join('/')}`}}</span> -->
          </div>
        </div>
        <div class="flexCenter">
          <a-button type="text">复用</a-button>
          <a-button type="text">删除</a-button>
        </div>
        <div class="info">
          <div>数据分析与机器学习实战</div>
          <div>
            <span>实验：20</span>
            <span>课时：20</span>
          </div>
          <div>2020/03/14 - 2021/05/16</div>
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
</template>

<script lang="ts" setup>
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
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
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

const courseDetail=(n:number)=>{
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
      width: 282px;
      flex-direction: column;
      margin-bottom: 2rem;
    }
    .midItem{
      margin: 0 18px;
    }
  }
</style>