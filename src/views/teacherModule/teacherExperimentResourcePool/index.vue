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
      <div class="item flexCenter" :class="{self: currentTab === 0}" v-for="(v) in experimentList" :key="v.id">
        <div
          class="exper-type"
          :style="{
            color: v.type_obj.color,
            background: v.type_obj.backgroundColor,
          }"
        >
          {{ v.type_obj.name }}
        </div>
        <div class="exper-name pointer" @click="detail(v.id)">{{ v.name }}</div>
        <div class="class-time">推荐课时 {{v.class_cnt}}</div>
        <div class="user-info" v-if="currentTab === 1">
          <!-- is_init :1 就是内置数据 -->
          <img src="src/assets/images/admin/home/env3.png" alt="" srcset="" />
          <span class="user-name" v-if="v.user">{{v.is_init === 1 ? '内置实验' : v.user.username}}</span>
        </div>
        <div class="operate" v-if="currentTab === 0">
          <!-- is_share:1 就是共享数据 -->
          <span class="share pointer" @click.stop="share(v.id, v.is_share)">{{
            v.is_share === 1 ? "取消共享" : "共享"
          }}</span>
          <span class="delete pointer" @click.stop="delet(v.id)">删除</span>
        </div>
        <!-- <a-tooltip placement="top">
          <template #title>
            <div v-for="(vv, i) in v.tag" :key="i">{{vv.name}}</div>
          </template>
          <div class="label pointer">
            <span class="labels single-ellipsis">
              <span v-for="(list, index) in v.tag" :key="index">{{
                  list.name + (index !== v.tag.length - 1 ? " / &nbsp; " : "")
                }}</span>
            </span>
          </div>
        </a-tooltip> -->
        <div class="label pointer">
          <a-tooltip placement="top">
            <template #title>
              <div v-for="(vv, i) in v.tag" :key="i">{{vv.name}}</div>
            </template>
            <div style="width: max-content;">
              <span class="labels single-ellipsis">
                <span v-for="(list, index) in v.tag" :key="index">{{
                    list.name + (index !== v.tag.length - 1 ? " / &nbsp; " : "")
                  }}</span>
              </span>
            </div>
          </a-tooltip>
        </div>
      </div>
      <Empty v-if="!experimentList.length && !loading" />
        <!-- -->
      <a-pagination 
        v-if="totalCount > 10"
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
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { getTypeList } from './config'
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherExperimentResourcePool;
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
    currentTab.value = Number(val) ? 0 : 1;
    // searchInfo.init_type = currentTab.value
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
    title: "技术方向",
    value: 0,
    keyName: "content_direction",
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
    keyName: "content_type",
    data: [
      { name: "全部", value: 0 },
      { name: "桌面实验", value: 1 },
      { name: "命令行实验", value: 7 },
      { name: "Jupyter实验", value: 2 },
      { name: "IDE实验", value: 6 },
      { name: "任务制实验", value: 3 },
      { name: "文档实验", value: 4 },
      { name: "视频实验", value: 5 },
    ],
  },
  {
    title: "实验难度",
    value: 0,
    keyName: "content_level",
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
  searchInfo.name = key;
  searchInfo.page = 1;
  initData();
};

/**
 * 列表
 */
interface ISearchInfo {
  init_type: number
  name: string
  limit: number
  page: number
  content_type?: number
  content_direction?: number
  content_level?: number
}
const searchInfo = reactive<ISearchInfo>({
  init_type: 0,
  name: '',
  limit: 10,
  page: 1,
  content_type: 0,
  content_direction: 0,
  content_level: 0,
});
interface Iuser {
  username: string
}
interface IExperimentList {
  id: number
  name: string
  task_type: number
  class_cnt: number
  is_init: number
  user: Iuser
  is_share: number
  type_obj?: any
  tag: any[]
}
var experimentList: IExperimentList[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const initData = () => {
  // const param = {
    // direction: labelSearch.direction,				// 技术方向 1.数据采集 2.数据挖掘 3.自动化处理
    // type: labelSearch.type ,					// 实验类型
    // complexity: labelSearch.level,				// 实验难度
    // keyword: "搜索关键词",			// 搜索框内容
    // myexper:true,				// 我的实验
  // }
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  searchInfo.init_type = currentTab.value
  const param: ISearchInfo = Object.assign({}, {...searchInfo})
  param.content_direction ? '' : delete param.content_direction
  param.content_level ? '' : delete param.content_level
  param.content_type ? '' : delete param.content_type
  loading.value = true;
  experimentList.length = 0
  http.getExperimentList({param}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page }  = res.data
    list.forEach((v: IExperimentList) => {
      v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    experimentList.push(...list)
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

const share = (id: number, is_share: number) => {
  // is_share:1 就是共享数据
  // 传0 开启共享 传1代表关闭共享
  const param = {
    share_type: is_share,
    id
  }
  http.experimentShare({param}).then((res: IBusinessResp) => {
    initData()
  })
};
const delet = (id: number) => {
  Modal.confirm({
    title: "确定要删除这个实验吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.deleteExperiment({urlParams: {id}}).then(() => {
        initData();
      })
    },
  });
};
const detail = (id: number) => {
  // router.push("/teacher/teacherExperimentResourcePool/experimentDetail");
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentDetail",
    query: {
      id,
      currentTab: currentTab.value,
    },
  });
};

onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 1
    configuration.componenttype = 0
  } else {
    currentTab.value = 0
    configuration.componenttype = 1
  }
  // searchInfo.init_type = currentTab.value
  
  initData();
  // 获取技术方向列表
  getDirection()
});

const getDirection = () => {
  http.getDirection().then((res: IBusinessResp) => {
    const data = res.data
    data.forEach((v: any) => {
      v.value = v.id
    })
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
    padding-right: 40px;
    &.self:hover {
      box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.14);
      .label {
        display: none;
      }
      .operate {
        display: inline-block;
      }
    }
    .exper-type {
      width: 64px;
      text-align: center;
      margin-right: 16px;
      border-radius: 32px 0px 0px 32px;
      color: var(--brightBtn);
      background: linear-gradient(
        90deg,
        rgba(28, 178, 179, 0.14),
        rgba(85, 218, 219, 0.14) 36%,
        rgba(255, 255, 255, 0.14)
      );
    }
    .exper-name {
      // width: 800px;
      color: var(--black-85);
      font-size: var(--font-size-16);
      flex: 1;
      padding-right: 14px;
    }
    .class-time {
      width: 120px;
      color: var(--black-45);
      // flex: 1;
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
      width: 233px;
      color: var(--primary-color);
      // margin-right: 43px;
      display: none;
      text-align: right;
      padding-right: 30px;
      .share {
        margin-right: 24px;
      }
    }
    .label {
      width: 233px;
      height: 24px;
      line-height: 24px;
    }
    .labels {
      max-width: 233px;
      padding: 0 14px;
      background: rgba(255,149,68,0.07);
      border-radius: 2px;
      color: rgba(255,149,68,0.85);
      font-size: var(--font-size-sm);
    }
  }
}
</style>
