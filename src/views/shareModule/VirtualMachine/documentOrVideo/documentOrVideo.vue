<template>
  {{ taskType }}
  <layout :navData="navData">
    <template v-slot:right>
      <div class="document-or-video-wrap" v-if="taskType">
        <video
          style="width: 100%; height: 650px"
          controls="true"
          :src="'111'"
          v-if="false"
        ></video>
        <PdfVue :url="111" v-else />
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

type TvmQuery = {
  opType: TopType;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: TStudyType;
  topoinst_id: string;
  routerQuery: string;
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
</script>
<style lang="less" scoped>
.document-or-video-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.d-v-header-wrap {
  height: 70px;
  background: #2c2e45;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0 20px 0px 28px;
  .d-v-left {
    display: flex;
    flex-direction: row;
    .icon-zuojiantou {
      cursor: pointer;
    }
    .test-btn-wrap {
      margin-left: 184px;
      cursor: pointer;
    }
  }
  .test-name {
    margin-left: 5px;
  }
  .d-v-right {
    color: red;
    cursor: pointer;
  }
}
</style>
