<template>
  <div class="experiment-detail">
    <div class="top">
      <div class="crumbs">
        <breadcrumb />
      </div>
      <div class="tech-direction">
        技术方向：{{ experimentDetail.direction }}
      </div>
      <div class="name-type flexCenter">
        <div class="left">
          <span class="name">{{ experimentDetail.name }}</span>
          <span class="type">Jupyter</span>
        </div>
        <div class="right">
          <span class="pointer" @click="handleClick">{{
            true ? "添加到课程" : "编辑基本信息"
          }}</span>
          <span class="pointer">启动环境</span>
        </div>
      </div>
      <div class="info">
        <span class="level level1">中级</span>
        <span class="knowledge">知识点1 / 知识点2 / 知识点3</span>
        <span class="class-num">课时 3</span>
        <span class="report pointer" @click="reportTemplate">
          <span class="iconfont icon-fuzhiniantie"></span>
          <span>报告模板</span>
        </span>
      </div>
      <div class="user-info">
        <img src="src/assets/images/admin/home/env3.png" alt="" srcset="" />
        <span class="user-name">TEACHERNAME</span>
      </div>
    </div>
    <div class="detail-content">
      <!-- <experiment-guide></experiment-guide> -->
      <!-- <video-detail></video-detail> -->
      <!-- <file-detail></file-detail> -->
      <!-- <task-detail></task-detail>  -->
      <component :is="experimentDetail.type"></component>
    </div>
  </div>
  <add-to-course-modal v-model:isShow="isShowModal"></add-to-course-modal>
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
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue"; //
import addToCourseModal from "./component/addToCourseModal.vue";
import experimentGuide from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/experimentGuide.vue";
import videoDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/videoDetail.vue";
import fileDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/fileDetail.vue";
import taskDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskDetail.vue";
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});

const isShowModal = ref<boolean>(false);
const handleClick = () => {
  isShowModal.value = true;
};
const reportTemplate = () => {
  // isShowReport.value = true
};

let experimentDetail = reactive<IExperimentDetail>({
  id: 500096,
  name: "hello",
  direction: "",
  complexity: "1",
  knowledge_maps: ["知识点1", "知识点2", "知识点3"],
  class_hour: 2,
  username: "test",
  type: taskDetail,
  lab_proc: "实验指导",
});
const getExperimentDetail = () => {
  console.log(id);
  let obj = {
    id: 500096,
    name: "hello",
    direction: "数据挖掘",
    complexity: "1",
    knowledge_maps: ["知识点1", "知识点2", "知识点3"],
    class_hour: 2,
    username: "test",
    type: taskDetail,
    lab_proc: "实验指导",
  };
  Object.assign(experimentDetail, obj);
};

// setTimeout(() => {
//   experimentDetail.type = videoDetail
// }, 10000)
// setTimeout(() => {
//   experimentDetail.type = fileDetail
// }, 20000)
// setTimeout(() => {
//   experimentDetail.type = taskDetail
// }, 30000)

onMounted(() => {
  getExperimentDetail();
});
interface IExperimentDetail {
  id: number;
  name: string;
  direction: string;
  complexity: string;
  knowledge_maps: string[];
  class_hour: 2;
  username: string;
  type: any;
  lab_proc: string;
}
</script>
<style scoped lang="less">
.experiment-detail {
  width: var(--center-width);
  margin: 0 auto;
  .top {
    height: 200px;
    background-color: #12223a;
    padding: 0 14px;
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
        border-radius: 0px 16px 16px 0px;
        text-align: center;
      }
      .right {
        color: var(--white-100);
        span {
          display: inline-block;
          width: 170px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          text-align: center;
          margin-left: 16px;
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
      span {
        display: inline-block;
      }
      .level {
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
      .knowledge {
        color: var(--primary-color);
        background: var(--orangeyellow-7);
        border: 1px solid var(--primary-color);
        border-radius: 11px;
        padding: 0 20px;
        margin-right: 16px;
      }
      .class-num {
      }
      .report {
        color: var(--primary-color);
        position: absolute;
        top: 0;
        right: 60px;
        font-size: 14px;
        padding-bottom: 1px;
        border-bottom: 1px solid var(--primary-color);
        .iconfont {
          vertical-align: middle;
          margin-right: 4px;
        }
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
