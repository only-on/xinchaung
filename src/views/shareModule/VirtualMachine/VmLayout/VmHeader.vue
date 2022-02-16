<template>
  <div class="vm-header-box">
    <div class="left-box">
      <div
        class="selected pointer"
        @click="isShowExperiment = !isShowExperiment"
      >
        <span class="name">3-4 基于入侵检测的告警分析-外网</span>
        <span class="iconfont icon-zhankai"></span>
      </div>
      <div class="select-list scrollbar" v-if="isShowExperiment">
        <div class="list" v-for="item in courseList" :key="item.id">
          <div class="course-desc">{{ item.name }}</div>
          <div
            class="experiment pointer"
            v-for="list in item.experimentList"
            :key="list.id"
            :class="{ current: list.id === currentTaskId }"
            @click="ExperimentChange(list.id)"
          >
            {{ list.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="delayed">
        <span>
          {{
            experimentTime?.h +
            ":" +
            experimentTime?.m +
            ":" +
            experimentTime?.s
          }}
        </span>
        <span class="pointer" @click="delayedTime">延时</span>
      </div>
      <div class="vnc-change pointer" @click="showChange">
        切换为{{ currentInterface === "ssh" ? "VNC" : "SSH" }}
      </div>
      <div class="tool pointer" @click="visible = !visible">
        <span class="iconfont icon-gongjuxiang"></span>
        <span>工具箱</span>
      </div>
      <div class="switch pointer" @click="closeVm">
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
              <span>内存：2G</span>
            </li>
            <li>
              <span class="iconfont icon-CPU"></span>
              <span>CPU：2核</span>
            </li>
            <li>
              <span class="iconfont icon-xianka"></span>
              <span>GPU：2核</span>
            </li>
            <li>
              <span class="iconfont icon-yingpan"></span>
              <span>硬盘：30G</span>
            </li>
          </ul>
        </div>
        <div class="user">
          <ul>
            <li>
              <span class="iconfont icon-yonghuming"></span>
              <span>用户名：root</span>
            </li>
            <li>
              <span class="iconfont icon-mima"></span>
              <span>密码：sshpassword</span>
            </li>
            <li>
              <span class="iconfont icon-IP"></span>
              <span>IP：192.168.101.154</span>
            </li>
            <li>
              <span class="iconfont icon-duankou"></span>
              <span>SSH端口：23706</span>
            </li>
          </ul>
        </div>
      </div>
    </a-drawer>
  </div>
  <!--保存进度modal-->
  <a-modal
    class="save-progress-modal"
    :visible="progressVisible"
    @cancel="closeProgress"
    @ok="okProgress"
  >
    <div>
      <a-radio-group
        @change="progressChange"
        v-model:value="selectProgressData"
      >
        <div v-for="(key, val) in saveExperimentData" :key="val.toString()">
          <div v-for="item in saveExperimentData[val]" :key="item.id">
            <a-radio
              :value="val.toString() + '、' + item.id"
              :key="val.toString() + '、' + item.id"
              >{{ item.name }}</a-radio
            >
          </div>
        </div>
      </a-radio-group>
    </div>
  </a-modal>
  <!--分享弹窗-->
  <a-modal
    class="share-desk-modal"
    :visible="shareVisible"
    :footer="false"
    @cancel="closeShreModal"
  >
    <template #title>共享桌面</template>
    <div>
      <p>复制以下链接发给朋友，邀请他远程协助，与你共同完成实验</p>
      <a-input v-model:value="vmUrl" />
      <a-button @click="selectUrl" type="primary" style="margin-top: 10px"
        >选中链接</a-button
      >
    </div>
  </a-modal>
  <!--请求协助modal-->
  <a-modal
    class="assistance-modal"
    title="消息提示"
    :visible="assistanceVisible"
    @cancel="closeAssistance"
    @ok="okAssistance"
  >
    <div>
      <p>请简单的描述你的问题，30字以内</p>
      <a-textarea
        v-model:value="assistanceQuestion"
        :auto-size="{ minRows: 2, maxRows: 6 }"
      ></a-textarea>
    </div>
  </a-modal>
</template>

<script lang="tsx">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
  PropType,
  Ref,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { message, Modal } from "ant-design-vue";
import { getVmConnectSetting } from "src/utils/seeting";
import request from "src/request/getRequest";
import { copyText } from "src/utils/copySelect";
import storage from "src/utils/extStorage";
import { isJsonString } from "src/utils/common";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";
import { IBusinessResp } from "src/typings/fetch";

type TvmQuery = {
  opType: string;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: string;
  topoinst_id: string;
  routerQuery: string;
};
export default defineComponent({
  name: "",
  components: {},
  emit: [],
  setup() {
    const vmApi = request.vmApi;
    const route = useRoute();
    const router = useRouter();
    let vmQuery = route.query as any;
    const {
      opType,
      connection_id,
      topoinst_uuid,
      taskId,
      type,
      topoinst_id,
      routerQuery,
    }: TvmQuery = vmQuery;
    console.log("opType", opType);
    let role = storage.lStorage.get("role");

    const isShowExperiment = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const novncEl: any = inject("novncEl");
    const uuid: any = inject("uuid");
    let use_time: any = inject("use_time");
    let taskType: any = inject("taskType");
    let allInfo: any = inject("allInfo");
    const vmOptions: any = inject("vmOptions");
    const vmInfoData: any = inject("vmInfoData");
    const vmCurrentIndex: any = inject("vmCurrentIndex");
    const sshUrl: any = inject("sshUrl");
    const currentInterface: any = inject("currentInterface");
    const vncLoading: any = inject("vncLoading");
    const isConnect: any = inject("isConnect");

    onMounted(() => {
      clearInterval(Number(timer));
      times();
    });
    let currentTaskId = ref<number>(0);
    let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
    let experimentTime: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });

    let viodeTimer: NodeJS.Timer | null = null; // 录屏计时
    let videoTime = ref(0);
    let videoTimeText: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });
    const isScreenRecording = ref(false); // 是否录屏
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      clearInterval(Number(timer));
      clearInterval(Number(viodeTimer));
    });
    // 轮询实验时间
    function times() {
      timer = setInterval(() => {
        experimentTime!.value = secondToHHMMSS(Number(use_time.value));
        // console.log(taskType.value);

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
                endVmEnvirment();
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
    // 切换实验
    var ExperimentalChange = inject("ExperimentChange") as Function;
    function ExperimentChange(id: number) {
      currentTaskId.value = id;
      isShowExperiment.value = false;
      ExperimentalChange(id);
      // router.replace({
      //   path: path,
      //   query: { ...vmQuery, taskId: currentTaskId },
      // });
    }
    // vnc和ssh切换
    function showChange() {
      console.log(vmInfoData.value.data.vms);
      let currentvm = vmInfoData.value.data.vms[vmCurrentIndex.value];
      let cureentIp = location.protocol + "//" + location.hostname;

      // console.log(cureentIp);
      if (currentInterface.value === "vnc") {
        currentInterface.value = "ssh";
        console.log(currentInterface.value);
        sshUrl.value =
          getVmConnectSetting.SSHHOST +
          ":2222/ssh/host/" +
          currentvm.host_ip +
          "/" +
          currentvm.ssh_port;
        return;
      }
      if (currentInterface.value === "ssh") {
        currentInterface.value = "vnc";
        console.log(currentInterface.value);
        if (currentvm.switch === 1) {
          vmOptions.value.password = getVmConnectSetting.VNCPASS;
          vmOptions.value.wsUrl =
            getVmConnectSetting.VNCPROTOC +
            "://" +
            currentvm.host_ip +
            ":" +
            getVmConnectSetting.VNCPORT +
            "/websockify?vm_uuid=" +
            currentvm.uuid;
        } else {
          let param = {
            action: "switch2Vnc",
            params: {
              type: type,
              opType: opType,
              uuid: uuid.value,
              taskId: taskId,
            },
          };
          // vmApi.switchInterfaceApi({param:{...param}})
        }
      }
    }
    // 延时
    function delayedTime() {
      use_time.value = 1000;
      times();
      // VmOperatesHandle("delay").then((res:any) => {
      //   console.log(res);
      //   if (res.data&&res.data.remaining_time) {
      //     use_time.value=res.data.remaining_time
      //     times()
      //   }
      // });
    }
    // 保存进度
    function saveKvm() {
      VmOperatesHandle("saveKvm").then((res: any) => {
        console.log(res);
        if (res.data) {
          backTo(router, type, 3, routerQuery);
        } else {
          saveExperimentData.value = {
            course: [],
            train: [],
          };
          if (isJsonString(res.msg)) {
            progressVisible.value = true;
            let jsonData = JSON.parse(res.msg);
            console.log(jsonData);
            saveExperimentData.value = jsonData;
          }
        }
      });
    }
    // 关机
    function closeVm() {
      VmOperatesHandle("closeVm").then((res) => {
        console.log(res);
        message.success("操作成功");
        console.log(isConnect);
        isConnect.value = false;
      });
    }
    // 重置
    function resetVm() {
      VmOperatesHandle("resetVm");
    }
    // 上传文件
    function upload() {}
    // 下载文件
    function download() {}
    // 复制 / 粘贴
    function copyPaste() {
      novncEl.value.sendCtrlAltDel(); // 复制
      novncEl.value.sendSelectContent(copyText); // 粘贴
      return;
    }
    // 开始 / 结束录制
    function startEndRecord() {
      if (isScreenRecording.value) {
        VmOperatesHandle("stopRecord").then((res: any) => {
          isScreenRecording.value = false;
          videoTime.value = 0;
          clearInterval(Number(viodeTimer));
          videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
        });
      } else {
        VmOperatesHandle("startRecord").then((res: any) => {
          isScreenRecording.value = true;
          videoTime.value = 0;
          viodeTimer = setInterval(() => {
            videoTime.value++;
            videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
          }, 1000);
        });
      }
    }
    // 共享桌面
    function shareDesktop() {
      console.log("共享桌面");
      Modal.confirm({
        title: "消息提示",
        class: "share-modal vm-modal",
        content: <h2>确认共享桌面吗？</h2>,
        okText: "是",
        cancelText: "否",
        onOk: () => {
          shareVisible.value = true;
        },
        onCancel: () => {},
      });
    }
    // 请求老师远程协助
    function remoteAssist() {
      console.log("请求老师远程协助");
      assistanceVisible.value = true;
    }

    // 操作虚拟机
    function VmOperatesHandle(actionType: IAction) {
      return new Promise((resolve: any, reject: any) => {
        console.log(uuid.value);
        let params: any = {
          action: actionType,
          params: {
            type: type,
            opType: opType,
            uuid: uuid.value,
            taskId: taskId,
          },
        };
        operatesHandle(params)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }
    // 结束脚本入口
    function endVmEnvirment() {
      let params: any = null;
      if (role === 4) {
        params = {
          opType: opType,
          type: type,
          taskId: taskId,
          topoinst_id: topoinst_id,
        };
      }
      if (role === 3) {
        params = {
          opType: opType,
          type: type,
          taskId: taskId,
        };
      }

      // setTimeout(() => {
      //   endExperiment(params).then((res: any) => {
      //     console.log(res);
      //     if (res.data.length > 0) {
      //       recommendExperimentData.value = res.data;
      //       recommendVisible.value = true;
      //     }
      //     message.success("结束成功");
      //     backTo(router, type, 3, routerQuery);
      //   });
      // }, 3000);
      console.log("结束脚本入口");
    }
    // 切换抽屉时动画结束后的回调
    function afterVisibleChange(bool: boolean) {
      console.log("visible", bool);
    }
    const toolList = [
      {
        icon: "icon-quanping",
        name: "开启 / 全屏",
      },
      {
        icon: "icon-baocun",
        name: "保存进度",
        function: saveKvm,
      },
      {
        icon: "icon-guanbi1",
        name: "关机",
        function: closeVm,
      },
      {
        icon: "icon-zhongzhi",
        name: "重置",
        function: resetVm,
      },
      {
        icon: "icon-shangchuan",
        name: "上传文件",
        function: upload,
      },
      {
        icon: "icon-xiazai",
        name: "下载文件",
        function: download,
      },
      {
        icon: "icon-fuzhiniantie",
        name: "复制 / 粘贴",
        function: copyPaste,
      },
      {
        icon: "icon-kaishijieshuluzhi",
        name: "开始 / 结束录制",
        function: startEndRecord,
      },
      {
        icon: "icon-gongxiangzhuomian",
        name: "桌面共享",
        function: shareDesktop,
      },
      {
        icon: "icon-yuanchengxiezhu",
        name: "请求老师远程协助",
        function: remoteAssist,
      },
    ];

    // 保存进度 modal
    const progressVisible = ref(false);
    const selectProgressData = ref("");
    const saveExperimentData: any = ref({
      course: [],
      train: [],
    });
    function okProgress() {
      console.log(selectProgressData);
      if (!selectProgressData.value) {
        return;
      }
      let tempArry = selectProgressData.value.split("、");
      let params: any = {
        action: "saveKvm",
        params: {
          type: type,
          opType: opType,
          uuid: uuid.value,
          taskId: taskId,
          replace_id: tempArry[1],
          replace_type: tempArry[0],
        },
      };
      operatesHandle(params)
        .then((res: any) => {
          if (res.data) {
            backTo(router, type, 3, routerQuery);
            progressVisible.value = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    function closeProgress() {
      progressVisible.value = false;
      selectProgressData.value = "";
    }
    function progressChange(key: any) {
      console.log(key);
    }

    // 桌面共享
    const shareVisible = ref(false);
    const vmUrl = ref("");
    function selectUrl() {
      let env = process.env.NODE_ENV === "development" ? true : false;
      vmUrl.value = `${window.location.protocol}//${window.location.host}${
        env ? "/#/" : "/frontend/#/"
      }vm/vm?wsUrl=${vmOptions.value.wsUrl}`;
    }
    function closeShreModal() {
      shareVisible.value = false;
      vmUrl.value = "";
    }

    // 发送协助信息
    const assistanceVisible = ref(false);
    const assistanceQuestion = ref("");
    function okAssistance() {
      console.log(assistanceQuestion.value);
      if (assistanceQuestion.value.length === 0) {
        message.warn("请输入请求协助内容");
        return;
      }
      let param = {
        action: "question",
        params: {
          type: type,
          opType: opType,
          taskId: taskId,
          question: assistanceQuestion.value,
        },
      };
      vmApi.studentQuestionApi({ param: { ...param } }).then((res) => {
        console.log(res);
        assistanceVisible.value = false;
        message.success("请求发送成功");
      });
    }
    // 关闭协助modal
    function closeAssistance() {
      assistanceVisible.value = false;
      assistanceQuestion.value = "";
    }
    return {
      isShowExperiment,
      visible,
      afterVisibleChange,
      toolList,
      showChange,
      currentInterface,
      ExperimentChange,
      delayedTime,
      currentTaskId,
      isScreenRecording,
      experimentTime,
      closeVm,
      courseList,
      progressVisible,
      selectProgressData,
      saveExperimentData,
      okProgress,
      closeProgress,
      progressChange,
      shareVisible,
      vmUrl,
      selectUrl,
      closeShreModal,
      assistanceVisible,
      assistanceQuestion,
      okAssistance,
      closeAssistance,
    };
  },
});

let courseList = [
  {
    id: 1,
    name: "第一章 课程介绍",
    experimentList: [
      { id: 1, name: "1-1 基于入侵检测的告警分析-外网" },
      { id: 2, name: "1-2 基于入侵检测的告警分析-外网" },
      { id: 3, name: "1-3 基于入侵检测的告警分析-外网" },
      { id: 4, name: "1-4 基于入侵检测的告警分析-外网" },
      { id: 5, name: "1-5 基于入侵检测的告警分析-外网" },
    ],
  },
  {
    id: 2,
    name: "第二章 课程介绍",
    experimentList: [
      { id: 6, name: "2-1 基于入侵检测的告警分析-外网" },
      { id: 7, name: "2-2 基于入侵检测的告警分析-外网" },
      { id: 8, name: "2-3 基于入侵检测的告警分析-外网" },
      { id: 9, name: "2-4 基于入侵检测的告警分析-外网" },
      { id: 10, name: "2-5 基于入侵检测的告警分析-外网" },
    ],
  },
];
</script>

<style lang="less" scoped>
.vm-header-box {
  display: flex;
  margin-left: 62px;
  margin-right: 50px;
  justify-content: space-between;
  .left-box {
    color: var(--white-100);
    padding: 22px 0;
    position: relative;
    .selected {
      height: 26px;
      line-height: 26px;
      font-size: var(--font-size-20);
      .name {
        padding: 0 10px;
      }
    }
    .select-list {
      width: 389px;
      height: 381px;
      background: #192843;
      padding: 0 28px;
      position: absolute;
      left: 0;
      top: 72px;
      z-index: 1;
      overflow-y: auto;
      .list {
        margin-top: 16px;
        .course-desc {
          height: 16px;
          line-height: 16px;
          color: var(--white-45);
          font-size: var(--font-size-sm);
        }
        .experiment {
          height: 35px;
          line-height: 35px;
          &.current {
            color: var(--primary-color);
          }
        }
      }
    }
  }
  .right-box {
    padding: 25px 0;
    display: flex;
    height: 70px;
    line-height: 20px;
    .delayed,
    .tool,
    .switch,
    .vnc-change {
      padding: 0 20px;
      border-left: 1px solid #2c3a54;
    }
    .delayed {
      border: none;
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
</style>
