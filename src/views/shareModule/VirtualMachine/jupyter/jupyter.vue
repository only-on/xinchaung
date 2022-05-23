<template>
  <layout :navData="navData">
    <template v-slot:right>
      <iframe
        :src="'http://' + noteUrl"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </template>
  </layout>
  <!--禁用modal-->
  <disableStudent
    v-if="disableVisable"
    v-model:visable="disableVisable"
    :data="disableData"
    @save="saveKvm"
    :type="type"
    :uuid="currentUuid"
    :taskId="taskId"
    :opType="opType"
    :current="baseInfo?.current"
  ></disableStudent>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, computed,WritableComputedRef } from "vue";
import layout from "../VmLayout/newLayout.vue";
import { getVmBaseInfo } from "src/utils/vncInspect";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import storage from "src/utils/extStorage";
import { wsConnect } from "src/request/websocket";
import { Modal, message } from "ant-design-vue";
import disableStudent from "../component/disableStudent.vue"
import {IWmc} from "src/typings/wmc";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const { opType, type, taskId, topoinst_id, connection_id } = route.query;

let ws_config = storage.lStorage.get("ws_config");
let role = storage.lStorage.get("role");

const baseInfo: any = inject("baseInfo", ref({}));
const loading: any = inject("loading", ref(true));
const taskType: any = inject("taskType");
const use_time: any = inject("use_time");
const currentVm: any = inject("currentVm");
const currentUuid: any = inject("currentUuid");
const noteUrl: any = ref("");
const store = useStore();

const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];

let timerout: NodeJS.Timeout | null = null;
let isCurrentPage = true; // 是否是当前页面
const disableVisable: any = ref(false);
const disableData: any = ref({});

// 获取虚拟机基本信息pageinfo
function getVmBase() {
  loading.value = true;
  return new Promise((resolve: any, reject: any) => {
    let params: any = {
      opType: opType,
      type: type,
      taskId: taskId,
    };
    getVmBaseInfo(params).then((res: any) => {
      if (Number(res.data?.current?.status)>=2) {
        let modal = Modal.confirm({
          title: "提示",
          content: "该实验已结束",
          okText: "确定",
          cancelText: "取消",
          class: "vm-finish-modal",
          cancelButtonProps: {
            type: 'ghost'
          },
          onOk: () => {
            clearTimeout(timer)
            router.go(-1)
          },
        });
        let timer = setTimeout(() => {
          router.go(-1)
          clearTimeout(timer)
          modal.destroy()
        }, 5000)
        return
      }

      baseInfo.value = res.data;
      taskType.value = res.data.base_info.task_type.type;
      if (!res.data.current) {
        resolve();
        return;
      }

      if (!taskType.value) {
        use_time.value = res.data.current.used_time;
      } else {
        use_time.value = res.data.current.remaining_time;
      }
      resolve();
    }).catch((err: any) => {
      if(err.msg === "当前学生没有相应排课") {
        setTimeout(() => {
          router.go(-1);
        }, 3000)
      }
    });
  });
}
let ws: WritableComputedRef<IWmc> = computed({
  get: () => {
    return store.state.longWs
  },
  set: val => {
    store.commit("setLongWs",val)
  }
})
// 初始化ws
function initWs() {
  // if (ws.value) {
  //   ws.value.leave(topoinst_id + "_room");
  // }
  clearTimeout(Number(timerout));
  ws.value = wsConnect({
    url: "://" + ws_config.host + ":" + ws_config.port + "/?uid=" + connection_id,
    open: () => {
      if (baseInfo.value && baseInfo.value?.current) {
        console.log(11111);

        ws.value.join(topoinst_id + "_room");
      }
      if (opType == "help") {
        ws.value.join(topoinst_id + "_room");
      }
    },
    close: (ev: CloseEvent) => {
      if (ev.type === "close") {
        if (isCurrentPage) {
          if (ws.value.isReset()) {
            Modal.confirm({
              title: "提示",
              content: "改页面已在其他浏览器存在，是否替换",
              okText: "是",
              cancelText: "否",
              class: "reset-ws-modal",
              onOk: () => {
                (ws.value as any).refresh();
                initWs();
              },
            });
          } else {
            timerout = setTimeout(() => {
              initWs();
            }, 300);
          }
        }
        // message.success("ws关闭成功");
      }
    },
    message: (ev: MessageEvent) => {
      let regex = /\{.*?\}/g;
      if (typeof ev.data === "string" && regex.test(ev.data)) {
        let wsJsonData = JSON.parse(ev.data);
        if (wsJsonData.type == "base_vminfo") {
          if (JSON.parse(ev.data).data.vms && JSON.parse(ev.data).data.vms.length > 0) {
            currentVm.value = JSON.parse(ev.data).data.vms[0];
            currentUuid.value = currentVm.value.uuid;
            noteUrl.value = currentVm.value.host_ip + ":" + currentVm.value.note_port;
            loading.value = false
          }
        } else if (wsJsonData.type == "success") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            message.warn(wsJsonData.data);
          }
        } else if (wsJsonData.type == "error") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            message.warn(wsJsonData.data);
          }
        } else if (wsJsonData.type == "message") {
        } else if (wsJsonData.type == "return_message") {
          if (Object.keys(wsJsonData.data).length > 0) {
            if (wsJsonData.data?.message) {
              message.warn(wsJsonData.data.message);
            } else {
              message.warn(wsJsonData.data);
            }
          }
          // router.go(-1)
        } else if (wsJsonData.type == "recommends") {
        } else if (wsJsonData.type == "help") {
        } else if (wsJsonData.type == "delay") {
          use_time.value = wsJsonData.data.remaining_time;
        } else if (wsJsonData.type == "manual-disable") {
          // 禁用学生
          disableVisable.value = true;
          disableData.value = wsJsonData.data;
        }
      }
    },
  });
}
// saveKvm
function saveKvm() {
  
}
// 关闭ws
function closeWs() {
  (ws.value as any)?.close();
}
onBeforeRouteLeave(() => {
  isCurrentPage = false;
  clearTimeout(Number(timerout));
  closeWs();
});
onMounted(async () => {
  await getVmBase();
  if (Number(baseInfo.value?.current?.status)<2||role !== 4) {
    initWs();
  }
});
</script>

<style lang="less" scoped></style>
