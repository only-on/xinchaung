<template>
  <div class="experiment-detail">
    <div class="top" :class="{ public: Number(currentTab) === 1 }" :style="`background: url(${systemImages.experBan})`">
      <div class="crumbs">
        <breadcrumb />
      </div>
      <div class="tech-direction">
        技术方向：{{ experimentDetail.direction }}
      </div>
      <div class="name-type flexCenter">
        <div class="left flexCenter">
          <span class="type" :style="{
            color: getTypeList('-90deg')[experimentDetail.content_type].color,
            background: getTypeList('-90deg')[experimentDetail.content_type].detailebBackgroundColor,
          }">{{getTypeList('-90deg')[experimentDetail.content_type].name}}</span>
          <span v-if="experimentDetail.is_high" class="iconfont icon-gaopei gaopeiColor"></span>
          <span class="name">{{ experimentDetail.name }}</span>
        </div>
        <div class="right">
          <span class="pointer" v-if="type !== 'recommend' && (role === 3 || role===5)" @click="addToCourse()">添加到课程</span>
          <!-- 视频、文档类实验不显示启动环境 -->
          <a-button v-if="![6, 7].includes(experimentDetail.task_type) && role!==2" class="123" type="primary" size="large" @click="openVnc" :loading="((currentState===2&&connectStatus===1) || currentState===3)">
            {{currentState===1||!connectStatus?'启动环境':currentState===2&&connectStatus===1?'准备中...':'进入'}}
          </a-button>
        </div>
      </div>
      <div class="info">
        <span class="level" :class="['level' + experimentDetail.level]">{{levelList[experimentDetail.level]}}</span>
        <a-tooltip placement="top" :color="theme.cyanColor" v-if="experimentDetail.konwledge_map?.length">
          <template #title>
            <div v-for="(v, index) in experimentDetail.konwledge_map" :key="index">{{v}}</div>
          </template>
          <span class="knowledge pointer">
            <span v-for="(v, index) in experimentDetail.konwledge_map" :key="index">{{
                v + (index !== experimentDetail.konwledge_map.length - 1 ? " · &nbsp;" : "")
              }}</span>
          </span>
        </a-tooltip>
        <a-tooltip placement="top" :color="theme.themeColor" v-if="experimentDetail.tag?.length">
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
        <span class="edit pointer" @click="editBaseInfo" v-if="Number(currentTab) === 0&&type!=='recommend'">
          <span class="iconfont icon-bianji"></span>
          <span>编辑基本信息</span>
        </span>
        <span class="save pointer" @click="saveTomy" v-else-if="experimentDetail.save_my_content&&(role==3||role==5)&&type!=='recommend'">
          <span class="iconfont icon-baocun1"></span>
          <span>保存到我的</span>
        </span>
      </div>
      <div class="user-info" v-if="Number(currentTab) === 1||role === 2">
        <img :src="experimentDetail.user_profile.portrait||defaultAvatar" alt="" srcset="" />
        <span class="user-name">{{experimentDetail.user_profile.name||'TEACHERNAME'}}</span>
      </div>
    </div>
    <div class="detail-content" :class="experimentDetail.content_type===4?'jupterDetail-content':''">
      <!-- <experiment-guide></experiment-guide> -->
      <!-- <video-detail></video-detail> -->
      <!-- <file-detail></file-detail> -->
      <!-- <task-detail></task-detail>  -->
      <component :is="components[experimentDetail.content_type]" :detail="experimentDetail" @getExperimentDetail="getExperimentDetail"></component>
    </div>
  </div>
  <!-- 添加到课程 -->
  <add-to-course-modal v-model:isShow="isShowModal" v-if="isShowModal"></add-to-course-modal>
  <!-- 编辑基本信息 -->
  <a-modal
    v-if="baseInfoModal"
    :visible="baseInfoModal"
    title="编辑基本信息"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1100"
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
import extStorage from "src/utils/extStorage";
import defaultAvatar from 'src/assets/images/admin/home/env3.png'
import { toVmConnect, IEnvirmentsParam, prepareEnv, goToVm, connectEnv, inspectEnv } from "src/utils/vncInspect"; // 打开虚拟机
import {getThemeData} from 'src/utils/theme'
import baseInfo from "src/views/teacherModule/teacherExperimentResourcePool/component/baseInfo.vue"
import experimentGuide from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/experimentGuide.vue";
import jupyterDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/jupyterDetail.vue";
import videoDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/videoDetail.vue";
import fileDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/fileDetail.vue";
import taskDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskDetail.vue";
// 1 vnc   4:jupyter 5:任务制 6:视频 7:文档
const components = ['', experimentGuide, experimentGuide, experimentGuide, jupyterDetail, taskDetail, videoDetail, fileDetail]
const router = useRouter();
const route = useRoute();
const store = useStore()
const routeQuery = route.query
const { id, currentTab, type, sign } = route.query;
const { lStorage } = extStorage;
const role = lStorage.get("role") || 3;
const currentUid = lStorage.get('uid')
const http = (request as any).teacherExperimentResourcePool;
const {systemImages} = getThemeData()
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
let isWsConnect = computed({
  get: () => {
    return store.state.isWsConnect
  },
  set: val => {
    store.commit("setIsWsConnect",val)
  }
})
let connectStatus = computed({
  get: () => {
    return store.state.connectStatus
  },
  set: val => {
    store.commit('setConnectStatus', val)
  }
})
const openVncState = ref(false)
const currentState = ref(1)// 1未开始学习  2准备中   3准备完成 待进入
const openVnc = () => {
  // console.log(experimentDetail)
  let {id, task_type, content_type} = experimentDetail
  if (experimentDetail.programing_type == 1) {
    task_type = 3
  }
  const param: any = {
    type: type ? "course":"content",  // 实验
    opType: type && role === 4 ? type : "prepare",
    taskId: experimentDetail.id,
    experType: task_type
  };
  if (type) {
    param.recommendType = 'content'
  }
  // ide
  if (task_type === 3) {
    inspectEnv(param).then(() => {
      router.push({
        path: "/vm",
        query: param,
      });
    })
    return
  }
  // 视频 文档
  if (task_type === 6 || task_type === 7) {
    router.push({
      path: "/vm",
      query: param,
    });
    return
  }

  if (currentState.value === 2&& connectStatus.value===2) {
    currentState.value = 3
    Object.assign(param, {
      connection_id: createExamplesInfo.connection_id,
      topoinst_uuid: createExamplesInfo.topoinst_uuid,
      topoinst_id: createExamplesInfo.topoinst_id,
    })
    createExamplesInfo.connection_id ? router.push({path: "/vm",query: param}):goToVm(router, routeQuery)
    return
  }
  connectStatus.value = 1
  // 准备环境
  if (currentState.value === 1) {
    // currentState.value = 2
    prepareEnv(param).then(() =>{
      currentState.value = 2
    }).catch(() => {
      currentState.value = 1
      connectStatus.value = 0
    })
    return
  }
}
// 报告模板
const reportTemplate = () => {
  // isShowReport.value = true
  const templateId = experimentDetail.content_template?experimentDetail.content_template.template_id : ''
  sign == 'direction' ? 
  router.push({
    path: "/admin/TeachingResourceManagement/DirectionPlanning/reportTemplate",
    query: { templateId: templateId, id:  experimentDetail.id, createExperUserId: experimentDetail.user_id, type, currentTab},
  }):
  role === 2 ?
  router.push({
    path: "/admin/TeachingResourceManagement/experimentManagement/reportTemplate",
    query: { templateId: templateId, id:  experimentDetail.id, createExperUserId: experimentDetail.user_id, type, currentTab},
  }):
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentReportTemplate",
    query: { templateId: templateId, id:  experimentDetail.id, createExperUserId: experimentDetail.user_id, type, currentTab},
  });
};
// 编辑基本信息
const baseInfoModal = ref(false)
const editBaseInfo = () => {
  baseInfoModal.value = true
  getExperimentDetail();
}
const handleOk = () => {
  baseInfoModal.value = false
  getExperimentDetail();
}
const handleCancel = () => {
  baseInfoModal.value = false
}
// 保存到我的
const saveTomy = () => {
  http.savedMycontent({param: {id: experimentDetail.id}}).then((res:IBusinessResp) => {
    message.success('保存成功')
  })
}

let experimentDetail = reactive<IExperimentDetail>({
  id: 1,
  user_id: 0,
  is_init: 0,
  is_share: 0,
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
  user_profile: {
    portrait: '',
    name: ''
  },
  content_type: 1,
  is_webssh: 0,
  is_high:false,
  save_my_content: true
});
const getExperimentDetail = () => {
  let params = {urlParams: {id}}
  type=='recommend' ? Object.assign(params, {param: {type: 'recommend'}}) : ''
  http.getExperimentDetail(params).then((res: IBusinessResp) => { 
    Object.assign(experimentDetail, res.data);
    const type = experimentDetail.is_webssh ? 2 
      : (experimentDetail.task_type===4&&experimentDetail.programing_type) ? 3
        : experimentDetail.task_type
    experimentDetail.content_type = type
    
    // ide、视频、文档不准备环境 直接进入
    if (type === 3) { 
      currentState.value = 2
      connectStatus.value =2
    }
    // if (![3, 6, 7].includes(experimentDetail.task_type)) {
    //   getPrepareEnv()
    // }
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
  getPrepareEnv()
});
const vmApi = request.vmApi;
const createExamplesInfo: any = reactive({})
const getPrepareEnv = () => {
  const param = {
    "type": "content",
    "taskId": id
  }
  vmApi.getPrepareEnv({param}).then((res: any) => {
    if (res?.data[Number(id)]) {
      const {topoinst_id, is_feedback} = res?.data[Number(id)]
      if (topoinst_id && is_feedback == 1) {
        currentState.value = 2
        connectStatus.value = 2
        Object.assign(createExamplesInfo, res.data[Number(id)])
      } else if (topoinst_id && is_feedback == 0) {
        currentState.value = 2
        connectStatus.value = 1
      }
    }
  })
}
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
  user_id: number;
  is_init: number
  is_share: number;
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
  user_profile: any
  content_type: number
  is_webssh: number
  is_high:boolean
  save_my_content: boolean
}
</script>
<style scoped lang="less">
.experiment-detail {
  width: var(--center-width);
  margin: 0 auto;
  .top {
    height: 190px;
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
      .icon-gaopei{
        font-size: 20px;
        margin-right: 8px;
      }
      .type {
        display: inline-block;
        width: 70px;
        margin-right: 16px;
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
      .report, .edit, .save {
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
      .save{
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
    min-height: 570px;
    margin-top: 16px;
    background-color: var(--white-100);
    border: 1px solid var(--lightgray-3);
    padding: 0 24px 24px;
  }
  .jupterDetail-content{
    padding: 0 0 24px;
    border: 0;
  }
}
</style>

