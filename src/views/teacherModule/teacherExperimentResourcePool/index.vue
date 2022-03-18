<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="ExperimentTypeList"
    :isShowAdd="isShowAdd"
  ></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item flexCenter" v-for="(v, k) in experimentList" :key="v.id">
        <div
          class="exper-type"
          :style="{
            color: v.type_obj.color,
            background: v.type_obj.backgroundColor,
          }"
        >
          {{ v.type_obj.name }}
        </div>
        <div class="exper-name pointer" @click="detail(v.id)">{{ v.title }}</div>
        <div class="class-time">推荐课时 {{v.class_hour}}</div>
        <div class="user-info" v-if="currentTab === 0">
          <img src="src/assets/images/admin/home/env3.png" alt="" srcset="" />
          <span class="user-name">{{v.username}}</span>
        </div>
        <div class="operate" v-if="currentTab === 1">
          <span class="share pointer" @click.stop="share(v.id)">{{
            k === 0 ? "共享" : "取消共享"
          }}</span>
          <span class="delete pointer" @click.stop="delet(v.id)">删除</span>
        </div>
      </div>
      <!-- <Empty v-if="!list.length && !loading" /> -->
      <a-pagination
        v-if="totalCount > 6"
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
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherExperimentResourcePool;
console.log(http)
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "公开实验", componenttype: 0 },
    { name: "我的实验", componenttype: 1 },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const currentTab = ref<number>(0);
const isShowAdd = ref<boolean>(true);
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    console.log(val, 1);
    currentTab.value = val;
    searchInfo.keyword = ''
    searchInfo.page = 1
    searchInfo.direction = 0
    searchInfo.type = 0
    searchInfo.complexity = 0
    classifyList.forEach((v: any) => {
      v.value = 0
    })
    initData();
    isShowAdd.value = currentTab.value === 1;
  }
);

/**
 * 标签操作
 */
const classifyList: any = reactive([
  {
    title: "技术方向",
    value: 0,
    keyName: "direction",
    data: [
      { name: "全部", value: 0 },
      // { name: "数据采集", value: 1 },
      // { name: "数据挖掘", value: 2 },
      // { name: "自动化处理", value: 3 },
    ],
  },
  {
    title: "实验类型",
    value: 0,
    keyName: "type",
    data: [
      { name: "全部", value: 0 },
      { name: "桌面实验", value: 1 },
      // { name: "命令行实验", value: 2 },
      { name: "Jupyter实验", value: 3 },
      // { name: "IDE实验", value: 4 },
      { name: "任务制实验", value: 5 },
      { name: "文档实验", value: 6 },
      { name: "视频实验", value: 7 },
    ],
  },
  {
    title: "实验难度",
    value: 0,
    keyName: "complexity",
    data: [
      { name: "全部", value: 0 },
      { name: "初级", value: 1 },
      { name: "中级", value: 2 },
      { name: "高级", value: 3 },
    ],
  },
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  Object.assign(searchInfo, obj)
  searchInfo.page = 1;
  initData();
};
const labelSearch = reactive({
  type: 0,
  direction: 0,
  complexity: 0,
});
const searchFn = (key: string) => {
  console.log(key);
  searchInfo.keyword = key;
  searchInfo.page = 1;
  initData();
};

/**
 * 列表
 */
interface ISearchInfo {
  keyword: string
  limit: number
  page: number
  type: number
  direction: number
  complexity: number
}
const searchInfo = reactive<ISearchInfo>({
  keyword: '',
  limit: 6,
  page: 1,
  type: 0,
  direction: 0,
  complexity: 0,
});
interface IExperimentList {
  id: number
  title: string
  type: number
  class_hour: number
  username: string
  type_obj?: any
}
var experimentList: IExperimentList[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(7);
const initData = () => {
  console.log(labelSearch)
  // const param = {
    // direction: labelSearch.direction,				// 技术方向 1.数据采集 2.数据挖掘 3.自动化处理
    // type: labelSearch.type ,					// 实验类型
    // complexity: labelSearch.level,				// 实验难度
    // keyword: "搜索关键词",			// 搜索框内容
    // myexper:true,				// 我的实验
  // }
  const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  loading.value = true;
  experimentList.length = 0
  // http.getExperimentList().then((res: IBusinessResp) => {
  http.getExperimentList({param}).then((res: {data: IExperimentList[], page: {totalCount: number}}) => {
    console.log(res)
    const { data, page }  = res
    totalCount.value = page.totalCount
  }).catch(() => {
    const arr = [
      {id: 1, title: "实验标题", type: 1, class_hour:1, username:"test/内置"}
    ]
    experimentList.push(...arr)
    experimentList.push(
      ...[
        {
          id: 1,
          title: "基于入侵检测的告警分析",
          class_hour: 2,
          type: 1,
          type_obj: {},
          username:"test"
        },
        {
          id: 2,
          title: "基于入侵检测的告警分析",
          class_hour: 2,
          type: 2,
          type_obj: {},
          username:"test"
        },
        {
          id: 3,
          title: "基于入侵检测的告警分析",
          class_hour: 2,
          type: 3,
          type_obj: {},
          username:"test"
        },
        {
          id: 4,
          title: "基于入侵检测的告警分析",
          class_hour: 2,
          type: 4,
          type_obj: {},
          username:"test"
        },
        {
          id: 5,
          title: "基于入侵检测的告警分析",
          class_hour: 2,
          type: 5,
          type_obj: {},
          username:"test"
        },
      ]
    );
    experimentList.forEach((v) => {
      v.type_obj = Object.assign({}, typeList[v.type]);
    });
    console.log(experimentList);
    loading.value = false;
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

const ExperimentTypeList = reactive([
  { name: "桌面实验", key: "desktop" },
  { name: "Jupyter实验", key: "Jupyter" },
  { name: "任务制实验", key: "task" },
  { name: "文档实验", key: "text" },
  { name: "视频实验", key: "video" },
]);
/**
 * 添加
 */
const handleMenuClick = ({ key }: { key: string }) => {
  // router.push("/teacher/teacherExperimentResourcePool/CreateExperiment?key="+key);
  router.push({
    path: "/teacher/teacherExperimentResourcePool/CreateExperiment",
    query: { key },
  });
};

const share = (v: number) => {
  console.log(v);
};
const delet = (v: number) => {
  console.log(v);
};
const detail = (id: number) => {
  console.log(id);
  // router.push("/teacher/teacherExperimentResourcePool/experimentDetail");
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentDetail",
    query: {
      id,
      currentTab: currentTab.value,
    },
  });
};

let typeList = {
  1: {
    name: "桌面",
    color: "#ff9544",
    backgroundColor:
      "linear-gradient(90deg,rgba(255,149,68,0.14), rgba(255,199,156,0.14) 36%, rgba(255,255,255,0.14))",
  },
  2: {
    name: "命令行",
    color: "#1cb2b3",
    backgroundColor:
      "linear-gradient(90deg,rgba(28,178,179,0.14), rgba(85,218,219,0.14) 36%, rgba(255,255,255,0.14))",
  },
  3: {
    name: "Jupyter",
    color: "#3094EF",
    backgroundColor:
      "linear-gradient(90deg,rgba(48,148,239,0.14), rgba(93,178,255,0.14) 36%, rgba(255,255,255,0.14))",
  },
  4: {
    name: "IDE",
    color: "#06B434",
    backgroundColor:
      "linear-gradient(90deg,rgba(28,179,53,0.14), rgba(110,227,141,0.14) 36%, rgba(255,255,255,0.14))",
  },
  5: {
    name: "步骤",
    color: "#834CE4",
    backgroundColor:
      "linear-gradient(90deg,rgba(111,48,239,0.14), rgba(162,124,228,0.14) 36%, rgba(255,255,255,0.14))",
  },
};
onMounted(() => {
  // initData();
  // 获取技术方向列表
  getDirection()
});

const getDirection = () => {
  http.getDirection().then((res: IBusinessResp) => {
    console.log(res)
    const data = res.data
    data.forEach((v: any) => {
      v.value = v.id
    })
    console.log(data)
    classifyList[0].data.push(...data)
  })
}
</script>
<style scoped lang="less">
.mainBox {
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 100%;
    height: 64px;
    line-height: 64px;
    margin-bottom: 24px;
    border-radius: 32px;
    background: var(--white-65);
    .exper-type {
      width: 64px;
      text-align: center;
      margin-right: 16px;
      border-radius: 32px 0px 0px 32px;
      color: #1cb2b3;
      background: linear-gradient(
        90deg,
        rgba(28, 178, 179, 0.14),
        rgba(85, 218, 219, 0.14) 36%,
        rgba(255, 255, 255, 0.14)
      );
    }
    .exper-name {
      width: 800px;
      color: var(--black-85);
      font-size: var(--font-size-16);
    }
    .class-time {
      color: var(--black-45);
      flex: 1;
    }
    .user-info {
      width: 188px;
      img {
        width: 24px;
        height: 24px;
        background: #192843;
        border-radius: 50%;
        margin-right: 4px;
      }
      .user-name {
        color: var(--black-45);
      }
    }
    .operate {
      color: var(--primary-color);
      margin-right: 43px;
      .share {
        margin-right: 24px;
      }
    }
  }
}
</style>
