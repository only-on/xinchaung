<template>{{taskType}}
  <layout :VmData="data" :reportId="reportTemid" isLeftContentShowType="line">
    <template v-slot:right>
      <video
        style="width: 100%; height: 650px"
        controls="true"
        :src="'111'"
        v-if="111"
      ></video>
      <PdfVue :url="111" v-else />
    </template>
  </layout>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  Ref,
  provide,
  watch,
  onMounted,
  toRefs,
} from "vue";
import { UnwrapNestedRefs } from "@vue/reactivity/dist/reactivity";
import layout from "../VmLayout/VmLayout.vue";
import {
  onBeforeRouteLeave,
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
} from "vue-router";
import storage from "src/utils/extStorage";
import {
  getVmBaseInfo,
  TopType,
  TStudyType,
  IStopOperatesParam,
  recommendExperiment,
  IRecommendExperiment,
  toStudyRecommendExperiment,
  secondToHHMMSS,
  backTo,
  IOperatesHandle,
  IAction,
} from "src/utils/vncInspect";
import PdfVue from "src/components/pdf/pdf.vue";

type TvmQuery = {
  opType: TopType;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: TStudyType;
  topoinst_id: string;
  routerQuery: string;
};
// connection_id=131_206
// opType=continue
// type=course
// taskId=500136
// topoinst_uuid=315bdc23-4c6e-40d1-aa40-2283946ed9ae
// topoinst_id=206
// routerQuery={"detailId":"4808","course_id":"500073"}
const reportTemid: Ref<any> = ref(0);
const route = useRoute();
const router = useRouter();
const vmQuery = route.query as any;
const role = storage.lStorage.get("role");
const ws_config = storage.lStorage.get("ws_config");
let {
  opType, // 实验学习类型
  connection_id, // 用户id_环境id
  taskId, // 实验id
  type, // 是实验还是课程
  topoinst_id,
  topoinst_uuid,
  routerQuery, // 上一个页面需要参数
}: TvmQuery = vmQuery;

const reactiveData: UnwrapNestedRefs<{
  allInfo: any;
}> = reactive({
  allInfo: {}, // 所有基本信息
});
const use_time: Ref<number> = ref(900);
let taskType = ref(6); // 实验类型  true是实验 false是实训
setTimeout(() => {
  taskType.value = 7
}, 3000)
let { allInfo } = toRefs(reactiveData);
provide("allInfo", allInfo);
provide("use_time", use_time);
provide("taskType", taskType);
provide("taskId", taskId);
let ind = 0; // 记录是否是刚进页面
// 左侧导航数据
let navData =
  role === 4
    ? type === "course"
      ? [
          { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
          { name: "实验指导", key: "guide", icon: "icon-zhidao" },
          {
            name: "实验笔记",
            key: "experimental-note",
            icon: "icon-biji1",
          },
          { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
          { name: "实验报告", key: "report", icon: "icon-baogao1" },
          { name: "随堂练习", key: "practice", icon: "icon-biji" },
          { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
        ]
      : [
          { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
          { name: "实训指导", key: "guide", icon: "icon-zhidao" },
          { name: "实训笔记", key: "train-note", icon: "icon-biji1" },
          { name: "实训课件", key: "courseware", icon: "icon-kejian1" },
          { name: "实训资源", key: "resource", icon: "icon-leixing-01" },
          { name: "实训报告", key: "train-report", icon: "icon-baogao1" },
          { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
        ]
    : [
        { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
        { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      ];
navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];
const data = reactive(navData);

onMounted(async () => {
  await getVmBase();
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
    };
    getVmBaseInfo(params).then((res: any) => {
      allInfo.value = res.data;
      if (!res.data.current) {
        resolve();
        return;
      }

      taskType.value = res.data.base_info.task_type.type;

      if (!taskType.value) {
        use_time.value = res.data.current.used_time;
      } else {
        use_time.value = res.data.current.remaining_time;
      }
      reportTemid.value = res.data.current.id;
      resolve();
    });
  });
}
</script>
<style lang="less" scoped>

</style>
