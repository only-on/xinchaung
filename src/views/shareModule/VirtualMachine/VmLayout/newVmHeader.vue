<template>
  <div class="vm-header-box">
    <div class="left-box">
      <div class="back pointer" @click="back">
        <span class="iconfont icon-fanhui1"></span>
        <span>返回</span>
      </div>
      <div class="selected pointer">
        <span class="name">{{ baseInfo?.base_info?.name }}</span>
      </div>
      <div class="class-test pointer" @click="classTestVisible = true" v-if="role == 4">
        <span>随堂测试</span>
        <span>({{ !classTestTotal ? 0 : testNum + "/" + classTestTotal }})</span>
        <i class="sign"></i>
      </div>
    </div>
    <div class="right-box" v-if="taskType !== 6 && taskType !== 7">
      <div class="ip-list">
        <a-select class="ip-select" v-model:value="currentVmIndex" @change="ipChange">
          <a-select-option v-for="(item, index) in vmsInfo" :key="index" :value="index">
            <span class="ip-name">{{ item.host_ip }}</span>
            <span class="vm-state" :class="item.status === 'ACTIVE' ? 'open' : 'close'">{{
              item.status === "ACTIVE" ? "开" : "关"
            }}</span>
          </a-select-option>
        </a-select>
      </div>
      <div class="delayed" v-if="role == 4">
        <span>
          {{ experimentTime?.h + ":" + experimentTime?.m + ":" + experimentTime?.s }}
        </span>
        <span class="pointer" @click="delayedTime">延时</span>
      </div>
      <div
        class="vnc-change pointer"
        @click="showChange"
        v-if="baseInfo?.base_info?.is_webssh === 1"
      >
        切换为{{ currentInterface === "ssh" ? "VNC" : "SSH" }}
      </div>
      <div class="tool pointer" @click="visible = !visible">
        <span class="iconfont icon-gongjuxiang"></span>
        <span>工具箱</span>
      </div>
      <div class="switch pointer" @click="finishExperiment">
        <span class="iconfont icon-guanbi1"></span>
      </div>
    </div>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      v-model:visible="visible"
      :after-visible-change="afterVisibleChange"
      :drawer-style="{ backgroundColor: '#192843' }"
      :mask-style="{ opacity: 0 }"
      :width="'216px'"
    >
      <div class="vm-operate">
        <ul>
          <li
            class="pointer"
            v-for="(list, index) in toolList"
            :key="index"
            @click="list.function"
          >
            <span class="iconfont" :class="list.icon"></span>
            <span>{{ list.name }}</span>
          </li>
        </ul>
      </div>
      <div class="vm-info">
        <h5>虚拟机信息</h5>
        <div class="neicun">
          <ul>
            <li>
              <span class="iconfont icon-neicun"></span>
              <span>内存：{{ currentVm.ram }}G</span>
            </li>
            <li>
              <span class="iconfont icon-CPU"></span>
              <span>CPU：{{ currentVm.cpu }}核</span>
            </li>
            <li>
              <span class="iconfont icon-xianka"></span>
              <span>GPU：{{ currentVm.use_gpu ? "是" : "否" }}</span>
            </li>
            <li>
              <span class="iconfont icon-yingpan"></span>
              <span>硬盘：{{ currentVm.disk }}G</span>
            </li>
          </ul>
        </div>
        <div class="user">
          <ul>
            <li class="ellipse">
              <span class="iconfont icon-yonghuming"></span>
              <span>用户名：{{ currentVm.name }}</span>
            </li>
            <li>
              <span class="iconfont icon-mima"></span>
              <span>密码：vncpassword</span>
            </li>
            <li>
              <span class="iconfont icon-IP"></span>
              <span>IP：{{ currentVm.host_ip }}</span>
            </li>
            <li>
              <span class="iconfont icon-duankou"></span>
              <span
                >{{ currentVm.classify === "Linux" ? "ssh" : "rdp" }}端口：{{
                  currentVm.classify === "Linux" ? currentVm.ssh_port : currentVm.rdp_port
                }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, inject, Ref, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { Modal } from "ant-design-vue";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";

const props = defineProps({
  taskType: {
    default: "",
  },
  currentVmIndex: {
    default: 0,
  },
  vmsInfo: {
    default: [],
  },
});
const taskType: any = inject("taskType");
const currentVmIndex = inject("currentVmIndex", ref(0));
const vmsInfo: any = inject("vmsInfo", ref([]));
const currentInterface = inject("currentInterface", ref("vnc"));
const baseInfo: any = inject("baseInfo", ref({}));
const currentVm: any = inject("currentVm", ref({}));
const isScreenRecording: any = inject("isScreenRecording", ref(false));
const use_time: any = inject("use_time");
let role = 4;
const classTestVisible = ref(false);
const visible = ref(false);
// 随堂测试
const classTestTotal = ref<number>(5);
const testNum = ref<number>(0);
let experimentTime: Ref<any> = ref({
  h: 0,
  m: 0,
  s: 0,
});

let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
const toolData =
  role == 3 || role == 5
    ? [
        { icon: "icon-quanping", name: "开启 / 全屏", function: fullScreen },
        { icon: "icon-guanbi1", name: "关机", function: closeVm },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm },
        // 复制 / 粘贴
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste },
      ]
    : [
        { icon: "icon-quanping", name: "开启 / 全屏" },
        { icon: "icon-baocun", name: "保存进度", function: saveKvm },
        { icon: "icon-guanbi1", name: "关机", function: closeVm },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm },
        { icon: "icon-shangchuan", name: "上传文件", function: upload },
        { icon: "icon-xiazai", name: "下载文件", function: download },
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste },
        {
          icon: "icon-kaishijieshuluzhi",
          name: `${isScreenRecording.value ? "结束" : "开始"}录制`,
          function: startEndRecord,
        },
        { icon: "icon-gongxiangzhuomian", name: "桌面共享", function: shareDesktop },
        {
          icon: "icon-yuanchengxiezhu",
          name: "请求老师远程协助",
          function: remoteAssist,
        },
      ];
const toolList = toolData;
function back() {}

// 下拉选择虚拟机
function ipChange() {}

// 延时
function delayedTime() {}

// 切换webssh、vnc
function showChange() {}

// 结束实验
function finishExperiment() {}

// 切换抽屉时动画结束后的回调
function afterVisibleChange(bool: boolean) {
  console.log("visible", bool);
}
function fullScreen() {}

function closeVm() {}

function resetVm() {}

function copyPaste() {}

function saveKvm() {}

function upload() {}

function download() {}

function startEndRecord() {}

function shareDesktop() {}

function remoteAssist() {}

// 轮询实验时间
function times() {
  timer = setInterval(() => {
    experimentTime!.value = secondToHHMMSS(Number(use_time.value));
    if (!taskType.value) {
      use_time.value++;
    } else {
      if (use_time.value === 600) {
        clearInterval(Number(timer));
        Modal.confirm({
          title: "是否延时？",
          okText: "确认",
          onOk: () => {
            delayedTime();
          },
          cancelText: "取消",
          onCancel: () => {
            times();
          },
        });
      }
      if (use_time.value === 0) {
        clearInterval(Number(timer));
        Modal.confirm({
          title: "实验时间已到，您可以选择结束实验或通过延时继续进行实验！",
          okText: "延时",
          onOk: () => {
            delayedTime();
          },
          cancelText: "结束",
          onCancel: () => {
            // endVmEnvirment();
          },
        });
      }
      if (use_time.value < 0) {
        use_time.value = 0;
      }
      use_time.value--;
    }
  }, 1000);
}

onMounted(() => {
  if (taskType.value !== 6 && taskType.value !== 7 && role === 4) {
    clearInterval(Number(timer));
    times();
  }
}),
  onBeforeRouteLeave(() => {
    console.log("离开页面");
    clearInterval(Number(timer));
  });
</script>

<style lang="less" scoped>
.vm-header-box {
  display: flex;
  // margin-left: 62px;
  margin-right: 50px;
  justify-content: space-between;
  background: #192843;
  width: 100%;
  .back {
    margin: 0 15px;
    color: var(--white-65);
    .iconfont {
      margin-right: 4px;
    }
  }
  .left-box {
    color: var(--white-100);
    padding: 22px 0;
    position: relative;
    display: flex;
    .selected {
      width: 460px;
      height: 26px;
      line-height: 26px;
      font-size: var(--font-size-20);
      .name {
        padding: 0 10px;
      }
    }
    .class-test {
      position: relative;
      .sign {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ff0000;
        position: absolute;
        top: 1px;
        right: -6px;
      }
    }
  }
  .right-box {
    padding: 25px 0;
    display: flex;
    height: 70px;
    line-height: 20px;
    .ip-list {
      padding: 0 20px;
      // border-left: 1px solid #2c3a54;
      .ant-select {
        // border: 1px solid var(--cyan-100);
        color: var(--cyan-100);
        margin-top: -3px;
        :deep(.ant-select-selector) {
          border: 1px solid var(--cyan-100);
          border-radius: 10px;
          color: var(--cyan-100);
          background: rgba(0, 0, 0, 0);
          width: 200px;
          height: 24px;
          line-height: 24px;
          .ant-select-selection-item {
            line-height: 22px;
          }
        }
        &.ant-select-open :deep(.ant-select-selection-item) {
          color: var(--cyan-100);
        }
        :deep(.ant-select-arrow) {
          color: var(--cyan-100);
        }
      }
    }
    .delayed,
    .tool,
    .switch,
    .vnc-change {
      padding: 0 20px;
      border-left: 1px solid #2c3a54;
    }
    .delayed {
      // border: none;
      color: var(--primary-color);
      span:last-child {
        height: 20px;
        line-height: 20px;
        padding: 0 21px;
        color: var(--white-100);
        background-color: var(--primary-color);
        margin-left: 8px;
        border-radius: 10px;
      }
    }
    .tool {
      color: var(--brightBtn);
      .iconfont {
        margin-right: 4px;
        font-size: var(--font-size-20);
        vertical-align: middle;
      }
    }
    .switch {
      .iconfont {
        font-size: var(--font-size-20);
        color: #ff4a3d;
      }
    }
    .vnc-change {
      color: #3094ef;
    }
  }
}
</style>
<style lang="less">
.ant-drawer {
  top: 70px;
  color: var(--white-45);
  .iconfont {
    font-size: var(--base-font-size);
  }
  .ant-drawer-body {
    height: calc(100% - 70px);
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .vm-operate {
    ul {
      margin-top: 4px;
    }
    li {
      height: 43px;
      line-height: 43px;
      padding-left: 20px;
      &:hover {
        color: var(--brightBtn);
      }
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .vm-info {
    height: 330px;
    border-top: 1px solid #2c3a54;
    color: var(--white-85);
    padding: 8px 16px 0 12px;
    h5 {
      color: var(--primary-color);
      font-size: var(--font-size-16);
      padding: 10px 0;
    }
    li {
      height: 31px;
      line-height: 19px;
      padding: 6px 0;
      .iconfont {
        margin-right: 5px;
      }
    }
    .neicun li:last-child {
      margin-bottom: 4px;
    }
    .user li:first-child {
      margin-top: 8px;
    }
  }
}
.ant-drawer-header {
  display: none;
}

.ant-select-dropdown {
  .ant-select-item {
    .ip-name {
    }
    .vm-state {
      display: inline-block;
      width: 24px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: var(--cyan-100);
      border-radius: 2px;
      margin-left: 10px;
      color: var(--white);
      &.open {
        background: var(--cyan-100);
      }
      &.close {
        background: var(--black-45);
      }
    }
  }
}

.vm-class-test-modal {
  .ant-modal-body {
    padding: 10px 40px;
    .subject {
      padding: 8px 12px;
      background: #f4f4f4;
    }
    .right-answer,
    .keyword {
      margin-left: 12px;
      color: var(--brightBtn);
      padding: 8px 0;
    }
    .choice {
      .answer-list {
        padding-left: 12px;
        .list {
          padding: 8px 0;
        }
      }
    }
    .answer {
      .keyword {
        padding: 0;
      }
      .ant-input {
        margin: 8px 0;
      }
    }
  }
}
</style>
