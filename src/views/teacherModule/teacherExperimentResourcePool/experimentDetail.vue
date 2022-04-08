<template>
  <div class="experiment-detail">
    <div class="top" :class="{ public: Number(currentTab) === 1 }">
      <div class="crumbs">
        <breadcrumb />
      </div>
      <div class="tech-direction">
        技术方向：{{ experimentDetail.direction }}
      </div>
      <div class="name-type flexCenter">
        <div class="left">
          <span class="name">{{ experimentDetail.name }}</span>
          <span class="type" :style="{
            color: getTypeList('-90deg')[experimentDetail.task_type].color,
            background: getTypeList('-90deg')[experimentDetail.task_type].backgroundColor,
          }">{{getTypeList('-90deg')[experimentDetail.task_type].name}}</span>
        </div>
        <div class="right">
          <span class="pointer" @click="addToCourse()">添加到课程</span>
          <a-button class="123" type="primary" size="large" :loading="openVncState" @click="openVnc">{{openVncState ? '准备中...' : '启动环境'}}</a-button>
        </div>
      </div>
      <div class="info">
        <span class="level" :class="['level' + experimentDetail.level]">{{levelList[experimentDetail.level]}}</span>
        <a-tooltip placement="top" :color="theme.cyanColor">
          <template #title>
            <div v-for="(v, index) in experimentDetail.konwledge_map" :key="index">{{v}}</div>
          </template>
          <span class="knowledge pointer">
            <span v-for="(v, index) in experimentDetail.konwledge_map" :key="index">{{
                v + (index !== experimentDetail.konwledge_map.length - 1 ? " · &nbsp;" : "")
              }}</span>
          </span>
        </a-tooltip>
        <a-tooltip placement="top" :color="theme.themeColor">
          <template #title>
            <div v-for="(v, index) in experimentDetail.tag" :key="index">{{v.name}}</div>
          </template>
          <span class="labels pointer">
            <span v-for="(v, index) in experimentDetail.tag" :key="index">{{
                v.name + (index !== experimentDetail.tag.length - 1 ? " /&nbsp;" : "")
              }}</span>
          </span>
        </a-tooltip>
        <span class="class-num">推荐课时 {{experimentDetail.class_cnt}}</span>
        <span class="report pointer" @click="reportTemplate">
          <span class="iconfont icon-fuzhiniantie"></span>
          <span>查看报告模板</span>
        </span>
        <span class="edit pointer" @click="editBaseInfo" v-if="Number(currentTab) === 0">
          <span class="iconfont icon-bianji"></span>
          <span>编辑基本信息</span>
        </span>
      </div>
      <div class="user-info" v-if="Number(currentTab) === 1">
        <img src="src/assets/images/admin/home/env3.png" alt="" srcset="" />
        <span class="user-name">TEACHERNAME</span>
      </div>
    </div>
    <div class="detail-content">
      <!-- <experiment-guide></experiment-guide> -->
      <!-- <video-detail></video-detail> -->
      <!-- <file-detail></file-detail> -->
      <!-- <task-detail></task-detail>  -->
      <component :is="components[experimentDetail.task_type]" :detail="experimentDetail"></component>
    </div>
  </div>
  <!-- 添加到课程 -->
  <add-to-course-modal v-model:isShow="isShowModal"></add-to-course-modal>
  <!-- 编辑基本信息 -->
  <a-modal
    :visible="baseInfoModal"
    title="编辑基本信息"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="900"
    :footer="null"
  >
    <base-info :detail="experimentDetail" @handleOk="handleOk" @handleCancel="handleCancel"></base-info>
  </a-modal>
</template>
<script lang="ts" setup>
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
  markRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue"; //
import addToCourseModal from "./component/addToCourseModal.vue";
import { getTypeList } from './config'
import { theme } from "src/utils/theme"
import { useStore } from "vuex"
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect"; // 打开虚拟机
import baseInfo from "src/views/teacherModule/teacherExperimentResourcePool/component/baseInfo.vue"
import experimentGuide from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/experimentGuide.vue";
import jupyterDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/jupyterDetail.vue";
import videoDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/videoDetail.vue";
import fileDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/fileDetail.vue";
import taskDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskDetail.vue";
// 1 vnc   4:jupyter 5:任务制 6:视频 7:文档
const components = ['', experimentGuide, '', '', jupyterDetail, taskDetail, videoDetail, fileDetail]
const router = useRouter();
const route = useRoute();
const store = useStore()
const routeQuery = route.query
const { id, currentTab } = route.query;
const http = (request as any).teacherExperimentResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});

// 添加到课程
const isShowModal = ref<boolean>(false);
const addToCourse = () => {
  isShowModal.value = true;
};
// 开启环境
const openVncState = ref(false)
const openVnc = () => {
  openVncState.value = true
  const param: any = {
    type: "content",  // 实验
    opType: "prepare",
    taskId: 500012,
  };
  // 文档视频实验
  if (experimentDetail.task_type === 6 || experimentDetail.task_type === 7) {
    router.push({
      path: "/vm/documentOrVideo",
      query: {
        type: param.type,
        opType: param.opType,
        taskId: param.taskId,
        routerQuery: JSON.stringify(routeQuery),
      },
    });
    return
  }
  if (experimentDetail.task_type === 3 && experimentDetail.programing_type === 1) {
    // webide
    router.push({
      path: "/vm/ace",
      query: {
        type: param.type,
        opType: param.opType,
        taskId: param.taskId,
        routerQuery: JSON.stringify(routeQuery),
      },
    });
    return
  }
  toVmConnect(router, param, routeQuery).then((res: any) => {
    openVncState.value = false
  })
}
// 报告模板
const reportTemplate = () => {
  // isShowReport.value = true
  const templateId = experimentDetail.content_template?experimentDetail.content_template.template_id : ''
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentReportTemplate",
    query: { templateId: templateId, id:  experimentDetail.id},
  });
};
// 编辑基本信息
const baseInfoModal = ref(false)
const editBaseInfo = () => {
  baseInfoModal.value = true
}
const handleOk = () => {
  baseInfoModal.value = false
  getExperimentDetail();
}
const handleCancel = () => {
  baseInfoModal.value = false
}

let experimentDetail = reactive<IExperimentDetail>({
  id: 1,
  is_init: 0,
  name: '',
  task_type: 1,
  class_cnt: 2,
  level: '2',
  direction: '',
  complexity: '2',
  konwledge_map: [],
  username: '2',
  lab_proc: "实验指导",
  tag: [],
  content_template: {},
  programing_type: 0,
});
const getExperimentDetail = () => {
  http.getExperimentDetail({urlParams: {id}}).then((res: IBusinessResp) => { 
    Object.assign(experimentDetail, res.data);
  })
};

// setTimeout(() => {
//   experimentDetail.type = videoDetail jupyterDetail
// }, 10000)
// setTimeout(() => {
//   experimentDetail.type = fileDetail
// }, 20000)
// setTimeout(() => {
//   experimentDetail.type = taskDetail
// }, 30000)

onMounted(() => {
  getExperimentDetail();
  getDirection()
});
const directionList: any = reactive([])
const getDirection = () => {
  directionList.length = 0
  http.getDirection().then((res: IBusinessResp) => {
    const data = res.data
    directionList.push(...data)
  })
}
const directionName = computed(() => {
  return directionList.filter((v: {id: number, name: string}) => {
    return v.id === Number(experimentDetail.direction)
  })[0]?.name
})
const levelList = {'1': '初级', '2': '中级', '3': '高级'}
interface IExperimentDetail {
  id: number;
  is_init: number
  name: string;
  task_type: number;
  class_cnt: number;
  level: string
  direction: string;
  complexity: string;
  konwledge_map: string[];
  username: string;
  lab_proc: string;
  tag: any[]
  content_template: any
  programing_type: number
}
</script>
<style scoped lang="less">
.experiment-detail {
  width: var(--center-width);
  margin: 0 auto;
  .top {
    height: 170px;
    background: url("src/assets/images/teacherExperimentResourcePool/base_info_bg.png")
      center no-repeat;
    // background-size: 100% 200px;
    padding: 0 14px;
    &.public {
      height: 200px;
      background-size: 100% 200px;
    }
    .crumbs {
      padding-top: 14px;
      :deep(.allWhite span) {
        color: var(--white-45);
      }
    }
    .tech-direction {
      color: var(--brightBtn);
      font-size: var(--font-size-sm);
      margin-top: 14px;
    }
    .name-type {
      margin-top: 9px;
      height: 32px;
      line-height: 32px;
      justify-content: space-between;
      .name {
        font-size: var(--font-size-24);
        color: var(--white-100);
        vertical-align: middle;
      }
      .type {
        display: inline-block;
        width: 70px;
        margin-left: 16px;
        color: #3094ef;
        background: linear-gradient(
          -90deg,
          rgba(48, 148, 239, 0.14),
          rgba(93, 178, 255, 0.14) 36%,
          rgba(19, 51, 85, 0.14)
        );
        // border-radius: 0px 16px 16px 0px;
        border-radius: 16px;
        text-align: center;
      }
      .right {
        color: var(--white-100);
        span {
          display: inline-block;
          width: 140px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          text-align: center;
          margin: 0 16px;
          &:first-child {
            background-color: var(--brightBtn);
          }
          &:last-child {
            background-color: var(--primary-color);
          }
        }
      }
    }
    .info {
      height: 20px;
      line-height: 20px;
      margin-top: 16px;
      color: var(--white-100);
      font-size: var(--font-size-sm);
      position: relative;
      .level {
        display: inline-block;
        padding: 0 20px;
        border-radius: 10px;
        margin-right: 8px;
        &.level1 {
          background-color: var(--levelcolor-1);
        }
        &.level2 {
          background-color: var(--levelcolor-2);
        }
        &.level3 {
          background-color: var(--levelcolor-3);
        }
      }
      .labels, .knowledge {
        display: inline-block;
        max-width: 200px;
        color: var(--primary-color);
        background: var(--orangeyellow-6-24);
        // border: 1px solid var(--primary-color);
        border-radius: 11px;
        padding: 0 14px;
        margin-right: 16px;
        vertical-align: bottom;
        word-break: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .knowledge {
        color: var(--cyan-100);
        background: var(--cyan-24);
      }
      .class-num {
      }
      .report, .edit {
        color: var(--primary-color);
        position: absolute;
        top: 0;
        right: 18px;
        font-size: 14px;
        padding-bottom: 1px;
        border-bottom: 1px solid var(--primary-color);
        .iconfont {
          vertical-align: middle;
          margin-right: 4px;
        }
      }
      .edit {
        color: var(--cyan-100);
        border-bottom: 1px solid var(--cyan-100);
        right: 175px;
      }
    }
    .user-info {
      height: 24px;
      line-height: 24px;
      margin-top: 16px;
      img {
        width: 24px;
        border-radius: 12px;
        margin-right: 4px;
      }
      .user-name {
        color: var(--white-100);
      }
    }
  }
  .detail-content {
    margin-top: 16px;
    background-color: var(--white-100);
    border: 1px solid var(--lightgray-3);
    padding: 0 24px;
  }
}
</style>
