<template>
  <div class="env-manage">
    <div class="tree">
      <chapter-tree 
        :courseId="Number(courseId)"
        @selectExperiment="selectExperiment"
      > 
      </chapter-tree>
    </div>
    <div class="content">
      <div class="top-box">
        <div class="search">
          <span class="label">姓名</span>
          <a-input
            v-model:value="searchInfo.keyword"
            placeholder="请输入姓名查找"
            style="width: 224px"
            @pressEnter="onSearch"
          />
        </div>
        <div class="btns-box">
          <a-button type="primary" @click="visible = true">开启实验环境</a-button>
        </div>
      </div>
      <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="env-lists">
        <!-- envListState.data -->
        <div class="env-list" v-for="v in envList" :key="v.id">
          <card :list="v" @getList="getList"></card>
        </div>
        <!-- <Empty v-if="!envListState.data.length && !envListState.loading" /> -->
        <!-- <div v-if="!envListState.data.length && !envListState.loading" class="nodata">
          {{ noDataPrompt }}
        </div> -->
      </div>
      </a-spin>
      <a-pagination
        v-model:current="searchInfo.page"
        :pageSize="searchInfo.limit"
        :total="searchInfo.total"
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
import { useRouter ,useRoute } from 'vue-router';
const { t } = useI18n();
const route = useRoute()
const http = (request as any).teachCourse;
const courseId:any=route.query.courseId  //章节id

const currentExperiment: any = reactive({}) // 当前实验
let timer: NodeJS.Timer | null = null;
const searchInfo: any = reactive({
  total: 0,
  page: 1,
  limit: 4,
  keyword: '',
  taskId: 0,
  type: 'course'
})
const envList: any = reactive([])
const loading = ref(false)
const envListState = reactive<IListState>({
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
});
envList.push(...envListState.data)

// 查询
const onSearch = () => {
  getList();
}

// let noDataPrompt = ref('')
let noDataPrompt = ref("请选择");
function getList() {
  clearTimeout(Number(timer));
  envList.length = 0;
  loading.value = true;
  console.log(searchInfo, "searchInfo");
  http.getCourseEnvirment({ param: {...searchInfo} }).then((res: IResponseData) => {
    loading.value = false;
    if (res && res.status) {
      let { list, page } = res.data;
      envList.push(...list);
      console.log("envList", envList);
      searchInfo.page = page.currentPage
      searchInfo.total = page.totalCount
      if (envListState.data.length > 0) {
        let isVms = envList.some((item: any) => {
          return item.vms?.vms?.length > 0;
        });
        if (isVms) {
          message.success({ content: "请求成功!", duration: 2 });
        } else {
          timer = setTimeout(() => {
            getList();
          }, 1500);
        }
      }
      else {
        noDataPrompt.value = "暂无数据";
      }
    }
  });
}
const onChangePage = (page: number) => {
  searchInfo.page = page;
  getList();
};
onBeforeMount(() => {
  clearTimeout(Number(timer));
});

// 章节实验树
const ChaptersTreeList: any = reactive([])
const chartLoading = ref(false)
function getChapterList() {
  chartLoading.value = true
  ChaptersTreeList.length = 0
  http.getChaptersTree({urlParams:{courseId:courseId}}).then((res:any) => {
    const {data} = res
    chartLoading.value = false
    ChaptersTreeList.push(...data)
  })
}
// 选择实验
const selectExperiment = (val: any) => {
  console.log(val)
  Object.assign(currentExperiment, val)
  searchInfo.taskId = val.id
  getList();
}

onMounted(() => {
  getChapterList()
  // getList()
  // getLimit();
  // let timer = setInterval(() => {
  //   clearInterval(timer)
  //   getLimit()
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
  const limitParams = {
    opType: "precreate", // 预创建
    type: "course", // 学习类别：course:课程实验；train:实训
    taskId: searchInfo.taskId, // 实验ID
    count: openEnvNum.value // 要开启的虚机数量
 
  };
  http.openEnvirment({ param: limitParams }).then((res: IBusinessResp) => {
    if (res && res.status) {
      visible.value = false
      getList();
      message.success({ content: "请求成功!", duration: 2 });
    }
  });
}


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
  data: Iuser[];
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
