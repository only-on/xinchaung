<template>
  <layout :navData="navData">
    <template v-slot:right>
      <div class="ace-box">
        <div class="ace-left">
          <p><span class="icon-wenjianjia iconfont"></span>project</p>
          <ul class="webide-file-list">
            <li
              class="webide-file-item"
              v-for="(item, index) in fileListData" 
              :key="item.file_id"
              :class="currentIndex === index ? 'active' : ''"
              @click="selectFile(index)"
            >
              {{ item.file_name }}
            </li>
          </ul>
        </div>
        <div class="ace-right">
          <div class="ace-action">
            <span @click="saveFileData"><i class="iconfont icon-baocun1"></i>保存</span>
            <span @click="openBackupModal"><i class="iconfont icon-shangchuanbeifen"></i>备份</span>
            <span
              ><i class="iconfont icon-zhongzhi1"></i>
              <a-popover trigger="click" class="roll-back-popover">
                <template v-slot:title class="111">
                  <div class="roll-back-item" @click="backInit()">回到初始版本</div>
                </template>
                <template #content>
                  <ul>
                    <li
                      class="roll-back-item"
                      v-for="(item, index) in versionListData"
                      :key="index"
                      @click="rollBack(item)"
                      :class="item.id === version_id ? 'active' : ''"
                    >
                      <span class="version-name">
                        <span class="name single_ellipsis" :title="item.version_name">{{ item.version_name }}</span>
                        <span class="current" v-show="item.id === version_id">(当前版本)</span>
                      </span>
                      <i class="iconfont icon-guanbi" @click.stop="deleteVersion(item)"></i>
                    </li>
                  </ul>
                </template>
                <span @click="openRollBack">回滚</span>
              </a-popover>
            </span>
            <span @click="runCode"><i class="iconfont icon-yunhang"></i>运行</span>
          </div>
          <ace
            v-model:value="content"
            lang="html"
            theme="monokai"
            style="height: 100%"
            :options="options"
            v-if="detailLoading"
          ></ace>
          <div v-else class="loading-box">
            <SyncOutlined spin />
          </div>
          <div
            class="ace-result"
            :style="{ height: openOrCloseResultStatus ? '200px' : '35px' }"
          >
            <div class="ace-result-title">
              <span @click="openOrClose"
                >收起结果<i
                  class="iconfont"
                  :class="openOrCloseResultStatus ? 'icon-zhankai' : 'icon-shouqi'"
                ></i
              ></span>
            </div>
            <div class="ace-result-box">
              <div class="ace-result-content">
                <pre>{{ runResult }}</pre>
              </div>
            </div>
          </div>
        </div>
        <div class="loading" v-if="isRunning"><LoadingOutlined></LoadingOutlined></div>
      </div>
    </template>
  </layout>
  <a-modal
    :visible="backupVisible"
    @cancel="cancelBackupModal"
    @ok="okBackupModal"
    title="版本备份"
  >
    <a-input v-model:value="version_name" maxlength="10" placeholder="请输入版本名称，最多10个字" />
  </a-modal>
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
    :isAutoRemove="isAutoRemove"
  ></disableStudent>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, computed, WritableComputedRef } from "vue";
import layout from "../VmLayout/newLayout.vue";
import { getVmBaseInfo } from "src/utils/vncInspect";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import storage from "src/utils/extStorage";
import { wsConnect } from "src/request/websocket";
import { Modal, message } from "ant-design-vue";
import disableStudent from "../component/disableStudent.vue";
import ace from "src/components/ace/ace.vue";
import "src/components/ace/options";
import {IWmc} from "src/typings/wmc";
import { useStore } from "vuex";
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
  deleteVersionApi,
} from "src/utils/webideInspect";
import { LoadingOutlined, } from '@ant-design/icons-vue';
import { IBusinessResp } from "src/typings/fetch";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { opType, type, taskId, recommendType } = route.query;
let role = storage.lStorage.get("role");

let ws_config = storage.lStorage.get("ws_config");
const user_id = storage.lStorage.get("uid");

const baseInfo: any = inject("baseInfo", ref({}));
const loading: any = inject("loading", ref(true));
const taskType: any = inject("taskType");
const use_time: any = inject("use_time");
const currentVm: any = inject("currentVm");
const currentUuid: any = inject("currentUuid");

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
const openOrCloseResultStatus: Ref<boolean> = ref(true);
const version_id: any = ref("");
const fileListData: any = ref([]);
const currentIndex: any = ref(0);
const version_name: any = ref("");
const detailLoading: any = ref(false);
const content: any = ref("");
const backupVisible: any = ref(false);
const versionListData: any = ref([]);
const runResult: any = ref("");

let connection_id: any = "";
let topoinst_id: any = "";
let file_name: any = "";
let file_id: any = "";
let last_version_name: any = "";
const options = {
  enableBasicAutocompletion: true,

  enableSnippets: true,

  enableLiveAutocompletion: true,
};
let ws: WritableComputedRef<IWmc> = computed({
  get: () => {
    return store.state.longWs
  },
  set: val => {
    store.commit("setLongWs",val)
  }
})
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
      baseInfo.value = res.data;
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
      resolve();
    });
  });
}

const isAutoRemove = ref(false)   // 是否是自动排课结束前15分钟，推送消息
// 初始化ws
function initWs() {
  clearTimeout(Number(timerout));
  ws.value = wsConnect({
    url: "://" + ws_config.host + ":" + ws_config.port + "/?uid=" + connection_id,
    open: () => {
      if (baseInfo.value && baseInfo.value?.current) {
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
          if (typeof(wsJsonData.data)=="string") {
            message.warn(wsJsonData.data)
          }
        }else if (wsJsonData.type=="vm_act_message"){ 
          // 分组成员在操作或教师在操作
          if (wsJsonData.data?.send_user_id!=user_id && wsJsonData.data?.uuid===currentVm.value.uuid) {
            message.warn(wsJsonData.data.msg)
          }
        }else if (wsJsonData.type=="return_message") {
          if (Object.keys(wsJsonData).length>0&&wsJsonData.data?.sender?.indexOf(connection_id)===-1) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
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
        } else if (wsJsonData.type=="auto-remove") {
          isAutoRemove.value = true
          disableVisable.value = true
          disableData.value = wsJsonData.data
        }
      }
    },
  });
}

function openOrClose() {
  openOrCloseResultStatus.value = !openOrCloseResultStatus.value;
}

// 创建实例
function createTopo() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
  };
  recommendType ? params.recommendType = recommendType : ''
  return new Promise((resolve: any, reject: any) => {
    createTopoApi(params)
      .then((res:any) => {
        connection_id = res?.data.connection_id;
        topoinst_id = res?.data.topoinst_id;
        resolve(res?.data);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch();
}

// 获取实验详情
function getTaskInfoData() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
  };
  recommendType ? params.recommendType = recommendType : ''
  getTaskInfo(params).then((res: any) => {
    if (Number(res?.data?.current?.status)>=2) {
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

    baseInfo.value = res?.data;
    // console.log(baseInfo.value);
    use_time.value = res?.data.current?.remaining_time;
    // taskType.value = res.data.base_info.task_type.type;
    taskType.value = 3

    initWs();
  });
}
// 获取版本列表
function getVersionListData() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
  };
  recommendType ? params.recommendType = recommendType : ''
  return new Promise((resolve: any, reject: any) => {
    getVersionList(params)
      .then((res:any) => {
        // console.log(res);
        resolve(res?.data);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch();
}
// 获取文件列表
function getFileListData() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    version_id: version_id.value,
    file_name: file_name,
  };
  recommendType ? params.recommendType = recommendType : ''
  return new Promise((resolve: any, reject: any) => {
    getFileList(params)
      .then((res: any) => {
        fileListData.value = res.data.file_list;
        file_id = fileListData.value[currentIndex.value].file_id;
        resolve(res.data);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch();
}
// 创建版本
function createVersionData() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    version_name: version_name.value,
  };
  recommendType ? params.recommendType = recommendType : ''
  return new Promise((resolve: any, reject: any) => {
    createVersion(params)
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch();
}
// 切换文件
function getCurrentSWitchFile() {
  detailLoading.value = false;
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    file_id: file_id,
  };
  recommendType ? params.recommendType = recommendType : ''
  switchFile(params).then((res:any) => {
    content.value = res?.data.file_content;
    detailLoading.value = true;
  });
}
function run() {
  content.value = "111111111111111111";
}

// 选择文件
function selectFile(index: number) {
  currentIndex.value = index;
  file_id = fileListData.value[currentIndex.value].file_id;
  getCurrentSWitchFile();
}

// 保存文件
function saveFileData() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    file_id: file_id,
    file_content: content.value,
  };
  recommendType ? params.recommendType = recommendType : ''
  saveFile(params).then((res: any) => {
    if (res.status === 1) {
      message.success("保存成功");
    }
  });
}

// 切换版本
function switchVersion(v_id: number, is_return: number) {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    version_id: v_id,
    is_return: is_return,
  };
  recommendType ? params.recommendType = recommendType : ''
  return new Promise((resolve: any, reject: any) => {
    switchVersionApi(params).then((res:any) => {
      fileListData.value = res?.data.file_list;
      version_id.value = res?.data.version_id;
      if (fileListData.value.length > 0) {
        file_id = res?.data.file_list[0].file_id;
        // version_name.value=res?.data.task_name
      }

      resolve();
    });
  });
}

// 打开备份modal
function openBackupModal() {
  if (versionListData.value.length >= 10) {
    message.warn("最多创建10个版本");
    return
  }
  last_version_name = version_name.value;
  version_name.value = "";
  backupVisible.value = true;
}

// 取消备份modal
function cancelBackupModal() {
  backupVisible.value = false;
  version_name.value = last_version_name;
}

// 确认备份，提交
function okBackupModal() {
  // console.log(version_name.value);

  createVersionData().then(async (res: any) => {
    console.log(res);
    if (res.status === 1) {
      message.success("备份成功");
      backupVisible.value = false;
      versionListData.value = await getVersionListData()
      rollBack(res.data)
    }
    // console.log(version_name.value);
  });
}

// 回滚
async function openRollBack() {
  let versions: any = await getVersionListData();
  versionListData.value = versions;
  // console.log(versions);
}

async function rollBack(val: any) {
  await switchVersion(val ? val.id : version_id.value, val ? 0 : 1);
  version_name.value = val.version_name;
  await getFileListData();
  getCurrentSWitchFile();
}
function backInit() {
  Modal.confirm({
    title: "提示",
    content: "是否要将当前版本恢复到初始版本？",
    okText: "确定",
    cancelText: "取消",
    zIndex: 1031,
    onOk: () => {
      rollBack('')
    }
  })
}
function deleteVersion(val: any) {
  if (val.id === version_id.value) {
    message.warn('不能删除当前版本')
    return
  }
  const param: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    version_id: val.id,
  };
  Modal.confirm({
    title: "提示",
    content: "版本删除后不可恢复，确定要删除？",
    okText: "确定",
    cancelText: "取消",
    zIndex: 1031,
    onOk: () => {
      deleteVersionApi(param).then(async (res: IBusinessResp | null) => {
        if (!res) return
        message.success('删除成功')
        versionListData.value = await getVersionListData()
      })
    }
  })
}

const isRunning = ref(false)
function runCode() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    file_id: file_id,
    file_content: content.value,
    version_id: version_id.value,
    vm_uuid: currentUuid.value,
  };
  recommendType ? params.recommendType = recommendType : ''
  isRunning.value = true
  runCodeApi(params)
    .then((res: any) => {
      isRunning.value = false
      if (res?.data?.output) {
        runResult.value = res.data.output;
      }
    })
    .catch((res:any) => {
      isRunning.value = false
    });
}
// saveKvm
function saveKvm() {}
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
  // getVmBase()
  createTopo().then(async () => {
    await getTaskInfoData();
    // if (Number(baseInfo.value?.current?.status)<2||role !== 4) {
      // initWs();
    // }
    let versions: any = await getVersionListData();
    versionListData.value = versions;
    // console.log(versions);
    if (versions.length > 0) {
      version_id.value = versions[0].id;
      version_name.value = versions[0].version_name;
    } else {
      version_name.value = "基础版本";
      let versionsData = await createVersionData();
      // console.log(versionsData);
      let versions: any = await getVersionListData();
      versionListData.value = versions;
      // console.log(versions);
      if (versions.length > 0) {
        version_id.value = versions[0].id;
        version_name.value = versions[0].version_name;
      }
    }
    await getFileListData();

    getCurrentSWitchFile();
  }).catch((err: any) => {
    if(err.msg === "当前学生没有相应排课") {
      setTimeout(() => {
        router.go(-1);
      }, 3000)
    }
    if(err.msg === "您已完成当前实验的学习") {
      setTimeout(() => {
        router.go(-1);
      }, 3000)
    }
  });
});
</script>

<style lang="less" scoped>
.ace-loading {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(#515151, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--black-100);
}
.ace-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--black-45);
    margin-right: 6px;
    font-size: 30px;
    color: var(--primary-color);
    text-align: center;
    .anticon {
      margin-top: 300px;
    }
  }
}
.ace-left {
  width: 200px;
  flex-shrink: 0;
  background: #272822;
  order: 1;
  color: #fff;
  padding: 10px;
  p {
    margin-bottom: 0;
    span {
      margin-right: 5px;
    }
  }
  .webide-file-list {
    padding: 0 10px;
    .webide-file-item {
      line-height: 30px;
      padding: 0 10px;
      &.active {
        background: #000000;
        cursor: pointer;
      }
      &:hover {
        background: #000000;
        cursor: pointer;
      }
    }
  }
}
.ace-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #2f3129;
  order: 0;
  .loading-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--black-100);
    font-size: 50px;
  }
  .ace-action {
    flex-shrink: 0;
    color: #fff;
    padding-left: 20px;
    line-height: 35px;
    white-space: nowrap;
    word-break: break-all;
    > span {
      font-size: 14px;
      margin-right: 25px;
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        color: var(--purpleblue-6);
      }
      > i {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
  .ace-result {
    height: 235px;
    padding-left: 10px;
    background: #2f3129;
    display: flex;
    flex-direction: column;
    transition: 0.2s;
    .ace-result-title {
      color: var(--black-100);
      font-size: 12px;
      padding-left: 10px;
      line-height: 35px;
      flex-shrink: 0;
      cursor: pointer;
      .iconfont {
        font-size: 12px;
        margin-left: 3px;
      }
    }
    .ace-result-box {
      height: calc(100% - 35px);
      background: #000000;
      flex: 1;
      color: #b3b2b2;
      padding: 10px;
      overflow: auto;
    }
  }
}
.roll-back-item {
  width: 190px;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  .version-name {
    flex: 1;
    display: flex;
    .name {
      flex: 1;
    }
  }
  .iconfont {
    opacity: 0.2;
    font-size: 14px;
    margin-left: 24px;
  }
  &:hover {
    color: var(--primary-color);
    .iconfont {
      opacity: 1;
    }
  }
  &.active {
    color: var(--primary-color);
    .iconfont {
      opacity: 1;
    }
  }
}
.reset-ws-modal {
  .ant-modal-confirm-btns {
    > button:nth-child(1) {
      display: none;
    }
  }
}
</style>
