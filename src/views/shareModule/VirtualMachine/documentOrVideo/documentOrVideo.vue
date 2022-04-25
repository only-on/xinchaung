<template>
  <layout :navData="navData">
    <template v-slot:right>
      <div class="video-wrap" v-if="taskType == 6">
        <video
          style="width: 100%; height: 650px"
          controls="true"
          :src="env ? '/proxyPrefix'+baseInfo.base_info.content_task_files[0].file_url : baseInfo.base_info.content_task_files[0].file_url"
        ></video>
      </div>
      <div class="document-wrap setScrollbar" v-else-if="taskType == 7">
        <marked-editor
          v-if="baseInfo && baseInfo.base_info.guide"
          v-model="baseInfo.base_info.guide"
          :preview="true"
        />
        <PdfVue :url="baseInfo.base_info.content_task_files[0].file_url" v-else/>
      </div>
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
  getExperimentDetail()
  // await getVmBase();
});
// 获取实验基本信息pageinfo
function getVmBase() {
  opType = "help";
  type = "course";
  taskId = 500569;
  return new Promise((resolve: any, reject: any) => {
    let params = {
      opType: opType,
      type: type,
      taskId: taskId,
      experType
    };
    getVmBaseInfo(params).then((res: any) => {
      baseInfo.value = res.data;
      if (!res.data.current) {
        resolve();
        return;
      }

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

// 实验详情
let experimentDetail = reactive<any>({
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
  http.getExperimentDetail({urlParams: {id: taskId}}).then((res: any) => { 
    Object.assign(experimentDetail, res.data);
    baseInfo.value.base_info = res.data;
    taskType.value = res.data.task_type;
  })
};
</script>
<style lang="less" scoped>
.document-wrap, .video-wrap {
  height: 100%;
  overflow: auto;
}
</style>
