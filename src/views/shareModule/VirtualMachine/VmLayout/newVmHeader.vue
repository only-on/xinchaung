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
    <div class="center-box">
      <span v-if="isScreenRecording" class="video-time"
        >录制时间:
        {{
          videoTimeText?.h + "时" + videoTimeText?.m + "分" + videoTimeText?.s + "秒"
        }}</span
      >
    </div>
    <div class="right-box" v-if="taskType !== 6 && taskType !== 7">
      <div class="ip-list">
        <a-select class="ip-select" v-model:value="currentVmIndex" @change="switchVm">
          <a-select-option
            v-for="(item, index) in vmsInfo.vms"
            :key="index"
            :value="index"
          >
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
            <template v-if="list.key == 'colseOrStart'">
              <span class="iconfont" :class="list.icon"></span>
              <span v-if="vmsInfo && vmsInfo?.vms">{{
                vmsInfo?.vms[currentVmIndex].status == "ACTIVE" ? "关机" : "开机"
              }}</span>
            </template>
            <template v-else-if="list.key == 'record'">
              <span class="iconfont" :class="list.icon"></span>
              <span>
                {{ isScreenRecording ? "结束" : "开始" }}录屏
              </span>
            </template>
            <template v-else>
              <span class="iconfont" :class="list.icon"></span>
              <span>{{ list.name }}</span>
            </template>
          </li>
        </ul>
      </div>
      <div class="vm-info">
        <h5>虚拟机信息</h5>
        <div class="neicun">
          <ul>
            <li>
              <span class="iconfont icon-neicun"></span>
              <span>内存：{{ currentVm?.ram }}G</span>
            </li>
            <li>
              <span class="iconfont icon-CPU"></span>
              <span>CPU：{{ currentVm?.cpu }}核</span>
            </li>
            <li>
              <span class="iconfont icon-xianka"></span>
              <span>GPU：{{ currentVm?.use_gpu ? "是" : "否" }}</span>
            </li>
            <li>
              <span class="iconfont icon-yingpan"></span>
              <span>硬盘：{{ currentVm?.disk }}G</span>
            </li>
          </ul>
        </div>
        <div class="user">
          <ul>
            <li class="ellipse">
              <span class="iconfont icon-yonghuming"></span>
              <span>用户名：{{ currentVm?.name }}</span>
            </li>
            <li>
              <span class="iconfont icon-mima"></span>
              <span>密码：vncpassword</span>
            </li>
            <li>
              <span class="iconfont icon-IP"></span>
              <span>IP：{{ currentVm?.host_ip }}</span>
            </li>
            <li>
              <span class="iconfont icon-duankou"></span>
              <span
                >{{ currentVm?.classify === "Linux" ? "ssh" : "rdp" }}端口：{{
                  currentVm?.classify === "Linux"
                    ? currentVm?.ssh_port
                    : currentVm?.rdp_port
                }}</span
              >
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
    <template #title>选择需要替换的实验记录</template>
    <div>
      <a-radio-group @change="progressChange" v-model:value="selectProgressData">
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

  <!--共享桌面-->
  <a-modal
    class="share-desk-modal"
    :visible="shareVisible"
    :footer="false"
    @cancel="closeShreModal"
  >
    <template #title>共享桌面</template>
    <div>
      <p>复制以下链接发给朋友，邀请他远程协助，与你共同完成实验</p>
      <a-input v-model:value="tempVmUrl" ref="codeRef"/>
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
      <numberInput
        v-model:value="assistanceQuestion"
        :auto-size="{ minRows: 2, maxRows: 6 }"
        placeholder="请输入你所遇到的问题"
        :maxlength="30"
      ></numberInput>
    </div>
  </a-modal>
  <!--倒计时为0时，提示框-->
  <a-modal :visible="delayVisiable" title="提示" cancelText="结束" okText="延时" class="delay-end-modal" @cancel="finishTest"
    @ok="delayedTime">
    <div class="hint-delay-info">
      实验时间已到，您可以选择结束实验或通过延时继续进行实验！<span class="down-time-60s">{{delayTime}}</span>s后自动结束实验！;
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, inject, Ref, onMounted, watch,nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import numberInput from "src/components/aiAnt/numberInput.vue";
import { message, Modal } from "ant-design-vue";
import { beFull } from "be-full";
import { isJsonString } from "src/utils/common";
import { copyText } from "src/utils/copySelect";
import request from "src/request/getRequest";
import { getVmConnectSetting } from "src/utils/seeting";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";

const route = useRoute();
const router = useRouter();
const vmApi = request.vmApi;
const { type, opType, taskId,topoinst_id,topoinst_uuid } = route.query;

// inject接收块
const taskType: any = inject("taskType");
const currentVmIndex = inject("currentVmIndex", ref(0));
const vmsInfo: any = inject("vmsInfo", ref({ uuid: "", vms: [] }));
const currentInterface = inject("currentInterface", ref("vnc"));
const baseInfo: any = inject("baseInfo", ref({}));
const currentVm: any = inject("currentVm", ref({}));
const isScreenRecording: any = inject("isScreenRecording", ref(false));
const use_time: any = inject("use_time");
const currentUuid: any = inject("currentUuid");
const loading: any = inject("loading");
const isClose: any = inject("isClose");
const initVnc: any = inject("initVnc");
const novncEl: any = inject("novncEl");
const currentOption:any=inject("currentOption")
const evaluateData:any=inject("evaluateData")
const evaluateVisible:any=inject("evaluateVisible")
const initEvaluate:any=inject("initEvaluate")

// 本组件变量
const progressVisible: Ref<boolean> = ref(false);
const selectProgressData: Ref<string> = ref("");
const saveExperimentData: Ref<{
  course: any;
  train: any;
}> = ref({
  course: [],
  train: [],
});

const shareVisible:Ref<boolean>=ref(false)
const tempVmUrl:Ref<string>=ref("")
const codeRef:any=ref(null)

const assistanceVisible:Ref<boolean>=ref(false)
const assistanceQuestion:Ref<string>=ref("")
let role = 4;
const classTestVisible = ref(false);
const visible = ref(false);

const delayVisiable=ref(false)
const delayTime=ref(60) // 实验时间结束，延时提示框倒计时
let delayTimer: NodeJS.Timer | null = null; // 延时倒计时
// 随堂测试
const classTestTotal = ref<number>(5);
const testNum = ref<number>(0);
// 实验计时
let experimentTime: Ref<any> = ref({
  h: 0,
  m: 0,
  s: 0,
});
// 录屏计时
let videoTimeText: Ref<any> = ref({
  h: 0,
  m: 0,
  s: 0,
});
let viodeTimer: NodeJS.Timer | null = null; // 录屏计时器
let videoTime = ref(0); // 录屏计时总秒数
let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器

// 非响应式
let historyLength=history.length
const toolData =
  role == 3 || role == 5
    ? [
        { icon: "icon-quanping", name: "开启 / 全屏", function: fullScreen, key: "full" },
        { icon: "icon-guanbi1", name: "", function: colseOrStart, key: "colseOrStart" },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm, key: "reset" },
        // 复制 / 粘贴
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste, key: "cpoy" },
      ]
    : [
        { icon: "icon-quanping", name: "开启 / 全屏", function: fullScreen, key: "full" },
        { icon: "icon-baocun", name: "保存进度", function: saveKvm, key: "save" },
        { icon: "icon-guanbi1", name: "", function: colseOrStart, key: "colseOrStart" },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm, key: "reset" },
        { icon: "icon-shangchuan", name: "上传文件", function: upload, key: "upload" },
        { icon: "icon-xiazai", name: "下载文件", function: download, key: "download" },
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste, key: "copy" },
        {
          icon: "icon-kaishijieshuluzhi",
          name: `录制`,
          function: startEndRecord,
          key: "record",
        },
        {
          icon: "icon-gongxiangzhuomian",
          name: "桌面共享",
          function: shareDesktop,
          key: "share",
        },
        {
          icon: "icon-yuanchengxiezhu",
          name: "请求老师远程协助",
          function: remoteAssist,
          key: "help",
        },
      ];
const toolList = toolData;

watch(
  () => vmsInfo,
  () => {
    console.log(vmsInfo.value);
  },
  {
    deep: true,
  }
);
function back() {}

// 下拉选择虚拟机
async function switchVm() {
  currentVm.value = vmsInfo.value.vms[currentVmIndex.value];
  currentUuid.value = currentVm.value.uuid;
  if (isScreenRecording.value) {
      await startEndRecord()
  }
  if (currentVm.value.status == "SHUTOFF") {
    if (
      baseInfo.value &&
      baseInfo.value.base_info &&
      baseInfo.value.base_info.is_webssh === 1
    ) {
      currentInterface.value = "ssh";
    } else {
      if (currentInterface.value == "ssh") {
      } else {
        await VmOperatesHandle("startVm");
        vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
        loading.value = true;
        settingCurrentVM()
        initVnc.value();
      }
    }
  } else {
    loading.value = true;
    await VmOperatesHandle("startVm");
    vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
    settingCurrentVM()
    initVnc.value();
  }
}

// 延时
function delayedTime() {
  VmOperatesHandle("delay").then((res: any) => {
    if (res.data && res.data.remaining_time) {
      use_time.value = res.data.remaining_time;
      times();
    }
  });
}

// 切换webssh、vnc
function showChange() {}

// 结束实验
function finishExperiment() {
  let modal = Modal.confirm({
        title: `确认结束${opType === "help" ? "演示" : role === 4 ? '实验' : "备课"}吗？`,
        okText: "确认",
        onOk: async () => {
          await finishTest()
          modal.destroy();
        },
        cancelText: "取消",
        onCancel: () => {
          modal.destroy();
        },
      });
}

// 检查脚本并结束实验
    async function finishTest() {
      if (isScreenRecording.value) {
            await startEndRecord();
          }
          if (["recommend", "prepare", "help"].includes(opType as any)) {
            endVmEnvirment();
            return;
          }
          if (
            baseInfo &&
            baseInfo.value &&
            baseInfo.value.base_info &&
            baseInfo.value.base_info.step_score_exists
          ) {
            endVmOperates().then((res: any) => {
              // evaluateVisible.value = true;
              // recommendExperimentData.value = res.data;
              endVmEnvirment();
            });
          } else {
            endVmEnvirment();
          }
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
      if (role === 3||role === 5) {
        params = {
          opType: opType,
          type: type,
          taskId: taskId,
        };
      }

      setTimeout(() => {
        endExperiment(params).then((res: any) => {
          if (
            role == 4 &&
            !["recommend", "test", "help"].includes(opType as any) &&
            !["train"].includes(type as any)
          ) {
            // 自评推荐写在此处
            evaluateData.value = res.data;
            evaluateVisible.value = true;
            nextTick(() => {
            //   histogramCharts(evaluateData.value)
              initEvaluate()
            });
          } else {
            // backTo(router, type, 3, routerQuery);
            router.go(historyLength-history.length-1)
          }
          // message.success("结束成功");
        });
      }, 3000);
    }
    // 结束实验
    async function endVmOperates() {
      let param: any = {
        type: type,
        taskId: taskId,
        opType: opType,
        action: "recommend",
        topoinst_id: topoinst_uuid,
      };
      return await endOperates(param);
    }
// 切换抽屉时动画结束后的回调
function afterVisibleChange(bool: boolean) {
  console.log("visible", bool);
}

// 工具箱操作

function fullScreen() {
  beFull(document.getElementById("vncDom") as any);
}
// 关机
function colseOrStart() {
  if (vmsInfo.value.vms[currentVmIndex.value].status == "ACTIVE") {
    console.log("关机");
    closeVm();
  } else {
    console.log("开机");
    startVm();
  }
}

// 关机
async function closeVm() {
  if (isScreenRecording.value) {
      await startEndRecord()
  }
  await VmOperatesHandle("closeVm");
  vmsInfo.value.vms[currentVmIndex.value].status = "SHUTOFF";
  console.log(vmsInfo.value.vms);

  isClose.value = true;

  message.success("操作成功");
}
// 开机
async function startVm() {
  console.log("开机");
  await VmOperatesHandle("startVm");
  vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
  isClose.value = false;
  initVnc.value();
  message.success("操作成功");
}
// 重置
async function resetVm() {
  if (isScreenRecording.value) {
      await startEndRecord()
  }
  await VmOperatesHandle("resetVm");
  loading.value = true;
  message.success("操作成功");
}

// 选中粘贴
function copyPaste() {
  console.log("选择发送");
  novncEl.value.sendSelectContent(copyText);
}

// 保存进度
function saveKvm() {
  Modal.confirm({
    title: "提示",
    content: "是否确认保存进度？",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      VmOperatesHandle("saveKvm").then((res: any) => {
        if (res.data) {
          if (baseInfo.value?.current?.is_teamed == 0) {
            router.go(-1);
            // backTo(router, type, 3, routerQuery);
          }
        } else {
          saveExperimentData.value = {
            course: [],
            train: [],
          };
          if (isJsonString(res.msg)) {
            progressVisible.value = true;
            let jsonData = JSON.parse(res.msg);
            saveExperimentData.value = jsonData;
          }
        }
      });
    },
  });
}

function upload() {}

function download() {}

async function startEndRecord() {
  console.log("开始录屏");
  if (isScreenRecording.value) {
    // 结束录屏
    const res:any= await VmOperatesHandle("stopRecord");
    if (res.status==0) {
      return;
    }
    isScreenRecording.value = false;
    videoTime.value = 0;
    clearInterval(Number(viodeTimer));
    videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
    message.success("结束录屏成功")
  } else {
    // 开始录屏
    const res:any= await VmOperatesHandle("startRecord");
    if (res.status==0) {
      return;
    }
    isScreenRecording.value = true;
    videoTime.value = 0;
    viodeTimer = setInterval(() => {
      videoTime.value++;
      videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
    }, 1000);
    message.success("开始录屏")
  }
}

function shareDesktop() {
  Modal.confirm({
    title:"消息提示",
    content:"确认共享桌面吗？",
    okText:"是",
    cancelText:"否",
    onOk:()=>{
      tempVmUrl.value=""
      shareVisible.value=true
      let env=process.env.NODE_ENV==="development"?true:false
      tempVmUrl.value=`${window.location.protocol}//${window.location.host}${env?'/#/':'/frontend/#/'}vm/vm?wsUrl=${currentOption.value.wsUrl}`
    },
  })
}

function remoteAssist() {
  assistanceQuestion.value=""
  assistanceVisible.value = true;
}

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
            delayTime.value=60
            delayVisiable.value=true
            clearInterval(Number(delayTimer));
            delayTimer=setInterval(()=>{
              delayTime.value--
              if (delayTime.value==0) {
                clearInterval(Number(delayTimer));
                finishTest();
              }
            },1000)
      }
      if (use_time.value < 0) {
        use_time.value = 0;
      }
      use_time.value--;
    }
  }, 1000);
}

// 操作虚拟机
function VmOperatesHandle(actionType: any) {
  return new Promise((resolve: any, reject: any) => {
    let params: any = {
      action: actionType,
      params: {
        type: type,
        opType: opType,
        uuid: currentUuid.value,
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

// modal操作区域
// 关闭保存进度modal
function closeProgress() {
  progressVisible.value = false;
  selectProgressData.value = "";
}

// 确认保存进度modal
function okProgress() {
  if (!selectProgressData.value) {
    return;
  }
  let tempArry = selectProgressData.value.split("、");
  let params: any = {
    action: "saveKvm",
    params: {
      type: type,
      opType: opType,
      uuid: currentUuid.value,
      taskId: taskId,
      replace_id: tempArry[1],
      replace_type: tempArry[0],
    },
  };
  operatesHandle(params)
    .then((res: any) => {
      if (res.data) {
        // backTo(router, type, 3, routerQuery);
        router.go(-1);
        progressVisible.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// 保存进度单选发生变化
function progressChange() {}

// 关闭共享桌面modal
function closeShreModal(){
  shareVisible.value=false
}

// 选中链接
    function selectUrl(e:any) {
      e.preventDefault();
        (codeRef.value as any).select();
        document.execCommand("Copy"); //
    }

    // 关闭协助modal
    function closeAssistance() {
      assistanceVisible.value = false;
      assistanceQuestion.value = "";
    }
    // 发送协助信息
    function okAssistance() {
      if (assistanceQuestion.value.length === 0) {
        message.warn("请输入请求协助内容");
        return;
      }
      if (assistanceQuestion.value.length>=30) {
        message.warn("请将你的问题用少于30个字来描述");
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
        assistanceVisible.value = false;
        message.success("请求发送成功");
      });
    }

    function settingCurrentVM() {
      currentOption.value.password = getVmConnectSetting.VNCPASS;
      currentOption.value.wsUrl =
        getVmConnectSetting.VNCPROTOC +
        "://" +
        currentVm.value.base_ip +
        ":" +
        getVmConnectSetting.VNCPORT +
        "/websockify?vm_uuid=" +
        currentVm.value.uuid;
        
    }
    //  // 绘制自评
    // function histogramCharts(data:any) {
    //   isClose.value=true
    //   try {
    //     histogram(histogramEchart1, data);
    //   } catch (error) {
    //     histogram(histogramEchart1, data);
    //   }
    // }
onMounted(() => {
  clearInterval(Number(viodeTimer));
  clearInterval(Number(timer));
  clearInterval(Number(delayTimer));
  if (taskType.value !== 6 && taskType.value !== 7 && role === 4) {
    times();
  }
}),
  onBeforeRouteLeave(() => {
    console.log("离开页面");
    clearInterval(Number(timer));
    clearInterval(Number(viodeTimer));
    clearInterval(Number(delayTimer));
  });

  // function test(){
  //   evaluateVisible.value = true;
  //   initEvaluate()
  // }
</script>

<style lang="less" scoped>
.delay-end-modal{
  .hint-delay-info{
    // text-indent: 2em;
    .down-time-60s{
      color: red;
    }
  }
}
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
    width: 550px;
    .selected {
      // width: 460px;
      height: 26px;
      line-height: 26px;
      font-size: var(--font-size-20);
      .name {
        padding: 0 10px;
      }
    }
    .class-test {
      position: relative;
      margin-left: auto;
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
  .center-box{
    flex-shrink: 0;
    line-height: 70px;
    .video-time{
      height: 35px;
      color: #FFBA49;
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
