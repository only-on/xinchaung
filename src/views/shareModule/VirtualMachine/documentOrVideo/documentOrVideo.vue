<template>
  <layout :navData="navData">
    <template v-slot:right>
      <div style="height: 100%;" v-if="baseInfo.base_info&&baseInfo.base_info.files&&baseInfo.base_info.files.length || baseInfo.base_info&&baseInfo.base_info.guide">
      <div class="video-wrap" v-if="taskType == 6">
        <video
          style="width: 100%; height: 650px"
          controls="true"
          v-if="baseInfo.base_info.files.length"
          :src="env ? '/proxyPrefix'+baseInfo.base_info.files[0].file_url : baseInfo.base_info.files[0].file_url"
        ></video>
      </div>
      <div class="document-wrap setScrollbar" v-else-if="taskType == 7">
        <marked-editor
          v-if="baseInfo && baseInfo.base_info.guide"
          v-model="baseInfo.base_info.guide"
          :preview="true"
        />
        <PdfVue :url="baseInfo.base_info.files[0].file_url" v-else/>
      </div>
      </div>
      <empty v-else> </empty>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, inject } from "vue";
import layout from "../VmLayout/newLayout.vue";
import { useRoute, useRouter } from "vue-router";
import storage from "src/utils/extStorage";
import { getVmBaseInfo, TopType, TStudyType } from "src/utils/vncInspect";
import PdfVue from "src/components/pdf/pdf.vue";
import { message } from "ant-design-vue";
import request from "src/api/index";
import markedEditor from "src/components/editor/markedEditor.vue";
import {
  getTaskInfo,
  getVersionList,
  getFileList,
  createVersion,
  switchFile,
  saveFile,
  switchVersionApi,
  runCodeApi,
  createTopoApi,
} from "src/utils/webideInspect";
const http = (request as any).teacherExperimentResourcePool;
const env = process.env.NODE_ENV == "development" ? true : false;

type TvmQuery = {
  opType: TopType;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: TStudyType;
  topoinst_id: string;
  routerQuery: string;
  experType: number
};
const route = useRoute();
const router = useRouter();
const vmQuery = route.query as any;
const role = storage.lStorage.get("role");
const ws_config = storage.lStorage.get("ws_config");
let {
  opType, // 实验学习类型
  taskId, // 实验id
  type, // 是实验还是课程
  experType,
}: TvmQuery = vmQuery;

const baseInfo: any = inject("baseInfo", ref({}));
const taskType: any = inject("taskType");
// 左侧导航数据

const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];

onMounted(async () => {
  await createTopo()
  await getVmBase();
});
// 创建实例
function createTopo() {
  console.log(12121);

  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
  };
  return new Promise((resolve: any, reject: any) => {
    createTopoApi(params)
      .then((res:any) => {
        console.log(res);
        // connection_id = res?.data.connection_id;
        // topoinst_id = res?.data.topoinst_id;
        resolve(res?.data);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch();
}
// 获取实验基本信息pageinfo
function getVmBase() {
  // opType = "help";
  // type = "course";
  // taskId = 500569;
  return new Promise((resolve: any, reject: any) => {
    let params = {
      opType: opType,
      type: type,
      taskId: taskId,
      experType
    };
    getVmBaseInfo(params).then((res: any) => {
      baseInfo.value = res.data;
      // if (!res.data.current) {
      //   resolve();
      //   return;
      // }

      taskType.value = res.data.base_info.task_type.type;
      resolve();
    });
  });
}

// 返回
function black() {
  router.go(-1);
}

// 结束实验
function finish() {
  message.success("结束实验成功");
}
</script>
<style lang="less" scoped>
.document-wrap, .video-wrap {
  height: 100%;
  overflow: auto;
  .demo__container {
    height: 100%;
  }
}
</style>
