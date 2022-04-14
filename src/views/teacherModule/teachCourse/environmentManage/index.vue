<template>
  <div class="env-manage">
    <div class="tree">
      <chapter-tree @selectExperiment="selectExperiment"> </chapter-tree>
    </div>
    <div class="content">
      <div class="top-box">
        <div class="search">
          <span class="label">姓名</span>
          <a-input
            v-model:value="search.stuName"
            placeholder="请输入姓名查找"
            style="width: 224px"
            @search="search.onSearch"
          />
        </div>
        <div class="btns-box">
          <a-button type="primary" @click="visible = true">开启实验环境</a-button>
        </div>
      </div>
      <div class="env-lists">
        <div class="loading" v-if="envListState.loading">
          <a-spin size="large" />
        </div>
        <!-- envListState.data -->
        <div class="env-list" v-for="v in envListState.data" :key="v.id">
          <card :list="v" @getList="getList"></card>
        </div>
        <!-- <Empty v-if="!envListState.data.length && !envListState.loading" /> -->
        <!-- <div v-if="!envListState.data.length && !envListState.loading" class="nodata">
          {{ noDataPrompt }}
        </div> -->
      </div>
      <a-pagination
        v-model:current="envListState.page.currPage"
        :pageSize="envListState.page.pageSize"
        :total="envListState.page.totals"
        @change="onChangePage"
        :hideOnSinglePage="true"
      />
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    title="设置环境数量"
    :ok-button-props="{ disabled: false }"
    :cancel-button-props="{ disabled: false }"
    @ok="handleOk"
    @Cancel="visible = false"
    cancel-text="取消"
    ok-text="确定"
    :width="400"
  >
    <a-input-number v-model:value="openEnvNum" :max="limit" :min="1"  allow-clear autofocus />
    <p class="prompt">*最多开启{{limit}}套环境</p>
  </a-modal>
</template>

<script lang="ts" setup>
import chapterTree from "src/views/teacherModule/teachCourse/courseDetail/components/Chapter/ChapterList.vue";
import card from "./card.vue";
// import modal from "./modal.vue";
import request from "src/api/index";
import { useI18n } from "vue-i18n";
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  toRefs,
  UnwrapRef,
  provide,
  inject,
  onBeforeMount,
} from "vue";
import { message } from "ant-design-vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { urlSearch } from "src/utils/common";

interface Ipage {
  totals?: number;
  pageSize: number;
  currPage: number;
  keyWord?: string;
}
interface Iparams {
  taskId?: number;
  type?: string;
  keyword?: string;
  courseId?: number;
  page: number;
  limit: number;
  grouped?: number;
}
// interface INode extends Pick<Iparams, 'taskId' | 'type' | 'name' | 'courseId' | 'grouped' >{}
interface INode {
  taskId: number;
  type: string;
  grouped: number;
  isHigh: boolean;
}

interface Ivms {
  uuid: string;
  status?: string;
  vms?: Ivms[]
}
interface Iuser {
  username: string;
  id: number;
  student_id: string;
  online: number;
  number: string;
  current: string;
  vms: Ivms;
}

interface IListState {
  loading: boolean;
  data: Iuser[];
  page: Ipage;
}

interface IselectTreeNode {
  taskId: number;
  type: string;
  name: string;
  courseId: number;
  grouped: number;
}
interface IResponseData {
  status: number;
  msg: string;
  data: any;
  error: any;
  datas: any;
}
interface Isolts {
  icon: string;
}
interface ITreeDataItem {
  id: number;
  name: string;
  sort: number;
  type: string;
  content_type?: string;
  is_high: boolean;
  slots: Isolts;
  grouped: number;
  contents: ITreeDataItem[];
}
interface ITreeData {
  data: ITreeDataItem[];
}
const { t } = useI18n();
const query = urlSearch();
// 选择实验
const selectExperiment = (val: any) => {
  console.log(val)
}
// 课程
let courseInfo: any = reactive({
  type: String(query.type),
  taskId: Number(query.taskId),
  courseType: Number(query.courseType),
  courseId: query.type === "train" ? 0 : Number(query.courseId),
  grouped: 0,
});
let timer: NodeJS.Timer | null = null;
// let courseInfo = reactive<ICourseInfo>({
//   type: 'course',      // 课程'course' 实训'train'
//   courseType: 1,
//   courseId: 501703,   // 课程id
//   taskId: 50235,         // 实验id
//   grouped: 1          // 1分组 0未分组
// })
// 实训
// let trainInfo = reactive<ICourseInfo>({
//   taskId: 50234,
//   type: 'train',
//   courseId: 0,
//   grouped: 0
// })

var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  navPosition: "outside",
  navType: false,
  showContent: false,
  componenttype: undefined,
});
// 是否默认选中章节
const isDefaultSelectChapter = ref(false);
provide("courseInfo", courseInfo);
const http = (request as any).teachCourse;
const envListState = reactive<IListState>({
  loading: false,
  data: [
    {
      username: '钱学森',
      id: 1,
      student_id: 'xfhd',
      online: 0,
      number: '123456789',
      current: '0',
      vms: {uuid: 'ajuywefvJeuoqiw', vms: [{status: 'ACTIVE', uuid: 'jhfalkwefbHJgsdkasdf'},{status: '', uuid: 'kajshiwejcnbxvf'}]}
    },
    {
      username: '钱学森',
      id: 2,
      student_id: 'xfhd',
      online: 0,
      number: '123456789',
      current: '0',
      vms: {uuid: 'ajuywefvJeuoqiw', vms: [{status: '', uuid: 'jhfalkwefbHJgsdkasdf'}]}
    },
    {
      username: '钱学森',
      id: 3,
      student_id: 'xfhd',
      online: 0,
      number: '123456789',
      current: '0',
      vms: {uuid: 'ajuywefvJeuoqiw', vms: [{status: 'ACTIVE', uuid: 'jhfalkwefbHJgsdkasdf'}]}
    },
  ],
  page: {
    totals: 0,
    pageSize: courseInfo.type === "train" ? 8 : 6,
    currPage: 1,
    keyWord: "",
  },
});
//  courseId: courseInfo.courseId,
// grouped: courseInfo.grouped
const params = reactive<Iparams>({
  taskId: courseInfo.taskId,
  type: courseInfo.type,
  keyword: "",
  page: envListState.page.currPage,
  limit: envListState.page.pageSize,
});

// tree
let selectedNodes = reactive<INode>({
  taskId: 1,
  type: "",
  isHigh: false,
  grouped: 0,
});

// 查询
const search = reactive({
  stuName: "",
  onSearch: (val: string) => {
    if (!params.taskId) {
      message.warning("请先选择一个实验!");
      return;
    }
    params.keyword = search.stuName;
    getList();
  },
});

// let noDataPrompt = ref('')
let noDataPrompt = ref("请选择");
function getList() {
  clearTimeout(Number(timer));
  let type =
    courseInfo.type === "train"
      ? "实训"
      : courseInfo.courseType == 2
      ? "课程"
      : "实验";
  envListState.data = [];
  envListState.loading = true;
  console.log(params, "params");
  http.getPre({ param: params }).then((res: IResponseData) => {
    if (res && res.status) {
      // let { data, page } = res.datas.data;
      envListState.data = res.data.list;
      envListState.page.totals = res.data.page.totalCount;
      envListState.loading = false;
      console.log("envListState", envListState);
      if (envListState.data.length > 0) {
        let isVms = envListState.data.some((item: any) => {
          return item.vms.vms.length > 0;
        });
        if (isVms) {
          message.success({ content: "请求成功!", duration: 2 });
          envListState.loading = false;
        } else {
          envListState.loading = true;
          timer = setTimeout(() => {
            getList();
          }, 1500);
        }
      }

      // envListState.data[0].vms.push(data[0].vms[0])
      // let taskType = res.datas.task_type;
      if (params.keyword !== "") {
        envListState.loading = false;
        noDataPrompt.value = "暂无相关数据";
      }
      // else if (taskType === 1) {
      //   envListState.loading = false;
      //   noDataPrompt.value = `尚未开启${type}环境`;
      // } else if (taskType === 4) {
      //   envListState.loading = false;
      //   noDataPrompt.value = "交互编程类型实验不支持开启虚拟机环境";
      // }
      else {
        envListState.loading = false;
        noDataPrompt.value = "暂无数据";
      }
    }
  });
}
const onChangePage = (page: number) => {
  envListState.page.currPage = page;
  params.page = page;
  getList();
};
onBeforeMount(() => {
  clearTimeout(Number(timer));
});
onMounted(() => {
  // getList()
  // getLimit();
  // let timer = setInterval(() => {
  // clearInterval(timer)
  // getLimit()
  // }, 60000)
});

// 开启实验环境
const openEnvNum = ref()
const limit = ref(100);
const visible = ref(false)
function getLimit() {
  http.preLimit().then((res: IBusinessResp) => {
    limit.value = res.data;
    // limit.value = 10
  });
}
function handleOk(num: number) {
  // const limitParams = reactive<IlimitParams>({
  // limit: limit.value,
  // courseId: params.courseId
  const limitParams = {
    opType: "precreate",
    type: params.type,
    taskId: params.taskId,
    count: num,
  };
  http.saveTopoinst({ param: limitParams }).then((res: IBusinessResp) => {
    if (res && res.status) {
      getList();
      message.success({ content: "请求成功!", duration: 2 });
    }
  });
}
</script>

<style lang="less" scoped>
.env-manage {
  border-radius: 10px;
  display: flex;
  .tree {
    width: 470px;
    height: 714px;
    padding: 24px;
    margin-right: 16px;
    background-color: var(--white-100);
  }
  .content {
    flex: 1;
    padding: 24px;
    background-color: var(--white-100);
    .top-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .search {
      .label {
        margin-right: 8px;
      }
    }
    .env-lists {
      // height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .env-list {
        // display: inline-block;
        width: 320px;
        height: 240px;
        // margin-right: 24px;
        background: var(--brightBtn-14);
        border-radius: 4px;
        margin-bottom: 24px;
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
      .loading {
        text-align: center;
      }
      .nodata {
        height: 600px;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: var(--purpleblue-6);
        padding-top: 250px;
      }
    }
  }
}

.ant-input-number {
  width: 324px;
}
.prompt {
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  margin-top: 10px;
  margin-bottom: 0;
}

</style>
