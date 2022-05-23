<template>
  <div class="env-manage">
    <div class="tree">
      <chapter-tree 
        :Environment="true"
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
          <a-button type="primary" @click="openEnv">开启实验环境</a-button>
        </div>
      </div>
      <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="env-lists" v-if="envList.length">
        <div class="env-list" v-for="v in envList" :key="v.id">
          <card :list="v" @getList="getList" :currentExperiment="currentExperiment"></card>
        </div>
        <!-- <Empty v-if="!envListState.data.length && !envListState.loading" /> -->
        <!-- <div v-if="!envListState.data.length && !envListState.loading" class="nodata">
          {{ noDataPrompt }}
        </div> -->
      </div>
      <Empty v-if="!envList.length&&!loading" :type="EmptyType" />
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
  onUnmounted,
  computed,
} from "vue";
import { message } from "ant-design-vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter ,useRoute } from 'vue-router';
import Empty from "src/components/Empty.vue";
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
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.keyword === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  console.log(str)
  return str
})

// 查询
const onSearch = () => {
  getList();
}

function getList(type?: any, i?: any) {
  clearTimeout(Number(timer));
  envList.length = 0;
  loading.value = true;
  // console.log(searchInfo, "searchInfo");
  http.getCourseEnvirment({ param: {...searchInfo} }).then((res: IBusinessResp) => {
    loading.value = false;
    let { list, page } = res.data;
    envList.push(...list);
    // console.log("envList", envList);
    searchInfo.page = page.currentPage
    searchInfo.total = page.totalCount
    let isCorrect = false
    if (envList.length > 0) {
      // let isVms = envList.some((item: any) => {
      //   return item.vms?.vms?.length > 0;
      // });
      isCorrect = !type ? envList.every((item: any) => {
        return item.vms?.vms?.length > 0;
      }) : false
      i ? envList.forEach((v: any) => {
        if (v.uuid === i.stack_id&&type) {
          v.vms?.vms?.forEach((vv: any) => {
            if (vv.uuid === i.uuid) {
              // status: "ACTIVE" status: "SHUTOFF"
              if (type === 'closeVm') {
                vv.status === "SHUTOFF" ? isCorrect = true : ''
              } else if(type === 'startVm') {
                vv.status === "ACTIVE" ? isCorrect = true : ''
              }
            }
          })
        }
      }) : ''
      if (isCorrect) {
        message.success({ content: "请求成功!", duration: 2 });
      } else {
        timer = setTimeout(() => {
          getList(type, i);
        }, 1500);
      }
    }
  });
}
const onChangePage = (page: number) => {
  searchInfo.page = page;
  getList();
};

// 选择实验
const selectExperiment = (val: any) => {
  // console.log(val)
  Object.assign(currentExperiment, val)
  searchInfo.taskId = val.id
  searchInfo.keyword = ''
  getList();
}

onMounted(() => {
  // getList()
  getLimit();
  // let timer = setInterval(() => {
  //   clearInterval(timer)
  //   getLimit()
  // }, 60000)
});

onUnmounted(() => {
  clearTimeout(Number(timer));
})

// 开启实验环境
const openEnvNum = ref()
const limit = ref(0);
const visible = ref(false)
function getLimit() {
  http.maxLimit().then((res: IBusinessResp) => {
    limit.value = res.data.limit;
    // limit.value = 10
  });
}
function openEnv() {
  // console.log(currentExperiment)
  if (currentExperiment.is_high) {
    message.warning(`该${name}为高配${name}，无法预启动${name}环境!`);
    return;
  }
  if (!limit.value) {
    message.warning('授权人数为0，无法开启!');
    return;
  } 
  visible.value = true
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
      openEnvNum.value = 0
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
