<template>
  <search-add @searchFn="searchFn" @handleMenuClick="handleMenuClick" :isShowAdd="isShowAdd"></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <div>
    列表
  </div>
  <h2 @click="courseDetail(1)">公开课程详情入口</h2>
  <h2 @click="courseDetail(2)">我的教学课程详情入口</h2>
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
const { editId } = route.query;
const http = (request as any).teacherExperimentResourcePool;
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
  content_type?: number
  content_direction?: number
  content_level?: number
}
var courseList: any[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const currentTab = ref<number>(0);
const isShowAdd = ref<boolean>(true);
const searchInfo = reactive<ISearchInfo>({
  init_type: 0,
  name: '',
  limit: 10,
  page: 1,
  content_type: 0,
  content_direction: 0,
  content_level: 0,
});
watch(() => { return configuration.componenttype; },
  (val) => {
    currentTab.value = val ? 0 : 1;
    searchInfo.init_type = currentTab.value
    searchInfo.page = 1
    searchInfo.content_direction = 0
    searchInfo.content_type = 0
    searchInfo.content_level = 0
    classifyList.forEach((v: any) => {
      v.value = 0
    })
    initData();
    isShowAdd.value = currentTab.value === 0;
  }
);
/**
 * 标签操作
 */
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
const searchFn = (key: string) => {
  searchInfo.name = key;
  searchInfo.page = 1;
  initData();
};
const initData = () => {
  // const param = {
    // direction: labelSearch.direction,				// 技术方向 1.数据采集 2.数据挖掘 3.自动化处理
    // type: labelSearch.type ,					// 实验类型
    // complexity: labelSearch.level,				// 实验难度
    // keyword: "搜索关键词",			// 搜索框内容
    // myexper:true,				// 我的实验
  // }
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  const param: ISearchInfo = Object.assign({}, {...searchInfo})
  param.content_direction ? '' : delete param.content_direction
  param.content_level ? '' : delete param.content_level
  param.content_type ? '' : delete param.content_type
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
const labelSearch = reactive({
  type: 0,
  direction: 0,
  complexity: 0,
});
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  Object.assign(searchInfo, obj)
  searchInfo.page = 1;
  initData();
};
const courseDetail=(n:number)=>{
  if(n === 1){
    router.push({ path: "/teacher/teacherCourse/PublicDetail"});
  }else{
    router.push({ path: "/teacher/teacherCourse/PrivateDetail"});
  }
}
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 1
    configuration.componenttype = 0
  } else {
    currentTab.value = 0
    configuration.componenttype = 1
  }
  searchInfo.init_type = currentTab.value
  
  initData();
});
</script>
<style scoped lang="less">

</style>