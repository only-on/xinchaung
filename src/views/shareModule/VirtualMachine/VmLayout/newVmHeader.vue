<template>
  <div class="vm-header-box">
    <div class="left-box">
      <!--<div class="back pointer" @click="back">
        <span class="iconfont icon-fanhui1"></span>
        <span>返回</span>
      </div>-->
      <div class="selected">
        <span class="iconfont icon-zuojiantou pointer" @click="back"></span>
        <span class="name">{{ baseInfo?.base_info?.name }}</span>
      </div>
      <div class="class-test pointer" @click="openQuizModal" v-if="roleArry.includes('classTest')">
        <span>随堂测试</span>
        <span>({{ answerNum + "/" + oldQuizPaperList.length }})</span>
        <i class="sign" v-if="answerNum !== oldQuizPaperList.length"></i>
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
    <div class="right-box">
      <div
        class="ip-list"
        :class="loading ? 'none-event' : ''"
        v-if="roleArry.includes('switchVm')"
      >
        <a-select class="ip-select" v-model:value="currentVmIndex" @change="switchVm">
          <a-select-option
            v-for="(item, index) in vmsInfo.vms"
            :key="index"
            :value="index"
          >
            <span class="ip-name">{{ item.ip }}</span>
            <span class="vm-state" :class="item.status === 'ACTIVE' ? 'open' : 'close'">{{
              item.status === "ACTIVE" ? "开" : "关"
            }}</span>
          </a-select-option>
        </a-select>
      </div>
      <div
        class="delayed"
        :class="loading ? 'none-event' : ''"
        v-if="roleArry.includes('delayed')"
      >
        <span>
          {{ experimentTime?.h + ":" + experimentTime?.m + ":" + experimentTime?.s }}
        </span>
        <span class="pointer" @click="delayedTime" v-if="isShowDelayBtn">延时</span>
      </div>
      <div
        class="vnc-change pointer"
        :class="loading ? 'none-event' : ''"
        @click="showChange"
        v-if="baseInfo?.base_info?.is_webssh === 1 && roleArry.includes('switchSSH')"
      >
        切换为{{ currentInterface === "ssh" ? "VNC" : "SSH" }}
      </div>
      <div
        class="tool pointer"
        :class="loading ? 'none-event' : ''"
        v-if="roleArry.includes('tools')"
        @click="visible = !visible"
      >
        <span class="iconfont icon-gongjuxiang"></span>
        <span>工具箱</span>
      </div>
      <div
        class="switch pointer"
        :class="loading ? 'none-event' : ''"
        @click="finishExperiment"
        v-if="roleArry.includes('end')"
      >
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
      class="vm-drawer"
    >
      <div class="vm-operate">
        <ul>
          <template v-for="(list, index) in toolList" :key="index">
            <li
              class="pointer"
              @click="list.function"
              v-if="list.key == 'closeOrStart'"
              :class="roleArry.includes(list.key as any)?'':'none-event'"
            >
              <span class="iconfont" :class="list.icon"></span>
              <span v-if="vmsInfo && vmsInfo?.vms && vmsInfo?.vms.length">{{
                vmsInfo?.vms[currentVmIndex].status == "ACTIVE" ? "关机" : "开机"
              }}</span>
            </li>
            <li
              class="pointer"
              @click="list.function"
              v-if="list.key == 'record'"
              :class="roleArry.includes(list.key as any)&&currentInterface === 'vnc'?'':'none-event'"
            >
              <span class="iconfont" :class="list.icon"></span>
              <span> {{ isScreenRecording ? "结束" : "开始" }}录屏 </span>
            </li>
            <li
              v-else-if="list.name && !['record', 'closeOrStart'].includes(list.key)"
              class="pointer"
              @click="list.function"
              :class="roleArry.includes(list.key as any)?'':'none-event'"
            >
              <span class="iconfont" :class="list.icon"></span>
              <span>{{ list.name }}</span>
            </li>
          </template>
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
              <span>用户名：{{ currentVm?.ssh_user }}</span>
            </li>
            <li>
              <span class="iconfont icon-mima"></span>
              <span>密码：{{ currentVm?.ssh_pass }}</span>
            </li>
            <li>
              <span class="iconfont icon-IP"></span>
              <span>IP：{{ currentVm?.host_ip }}</span>
            </li>
            <li>
              <span class="iconfont icon-duankou"></span>
              <span
                >{{ currentVm?.classify === "Windows" ? "RDP" : "SSH" }}端口：{{
                  currentVm?.classify === "Windows"
                    ? currentVm?.rdp_port
                    : currentVm?.ssh_port
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
      <a-input v-model:value="tempVmUrl" ref="codeRef" />
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
  <a-modal
    v-model:visible="delayVisiable"
    title="提示"
    cancelText="结束"
    okText="延时"
    class="delay-end-modal"
    @cancel="finishTest"
    @ok="delayedTime"
    :closable="false"
    :maskClosable="false"
  >
    <div class="hint-delay-info">
      实验时间已到，您可以选择结束实验或通过延时继续进行实验！<span
        class="down-time-60s"
        >{{ delayTime }}</span
      >s后自动结束实验！
    </div>
    <template #footer>
      <div class="btns">
        <a-button @click="finishTest">结束</a-button>
        <a-button type="primary" v-if="delayNum < 5" @click="delayedTime">延时</a-button>
      </div>
    </template>
  </a-modal>
  <!-- 随堂测试 -->
  <a-modal
    v-model:visible="quizVisiable"
    title="随堂测试"
    cancelText="取消"
    okText="提交"
    class="quiz-modal"
    @cancel="cancelQuiz"
    @ok="submitQuiz"
    :footer="false"
    :maskClosable="false"
  >
    <div class="quiz-modal-body">
      <template v-if="currentShowType == 0">
        <div v-if="quizPaperList[currentQuizIndex]">
          <template v-if="quizPaperList[currentQuizIndex].type_id == 2">
            <div class="choice-title black-004 question-title">
              {{ quizPaperList[currentQuizIndex].question
              }}<i class="score">({{ quizPaperList[currentQuizIndex].score }}分)</i>
            </div>
            <a-checkbox-group
              class="question-options-wrap"
              v-model:value="quizPaperList[currentQuizIndex].student_answer"
              style="width: 100%"
            >
              <div
                v-for="(item, index) in quizPaperList[currentQuizIndex].options"
                :key="item.id"
                class="options-item"
              >
                <a-checkbox :value="item.id"
                  ><i>{{ numToAbc(index + 1) }}、</i>{{ item.option }}</a-checkbox
                >
              </div>
            </a-checkbox-group>
          </template>
          <template v-if="quizPaperList[currentQuizIndex].type_id == 5">
            <div class="choice-title black-004 question-title">
              {{ quizPaperList[currentQuizIndex].question
              }}<i class="score">({{ quizPaperList[currentQuizIndex].score }}分)</i>
            </div>
            <div class="question-options-wrap">
              <a-textarea
                v-model:value="quizPaperList[currentQuizIndex].student_answer[0]"
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </div>
          </template>
        </div>
      </template>
      <template v-if="[1, 2].includes(currentShowType)">
        <div>
          <div v-if="currentShowType == 2" class="static-box">
            <span>共<i>{{oldQuizPaperList.length}}</i>题</span><span>总分<i>{{totalPoints}}</i>分</span
            ><span>得分<i class="goal">{{goalNum}}</i>分</span>
          </div>
          <div v-for="item in answerPaperList" :key="item.id">
            <template v-if="item.type_id == 2">
              <div
                class="choice-title black-004 question-title"
                :class="
                  item.answer_is_right == true || item.answer_is_right == 1
                    ? 'correct-answer'
                    : 'error-answer'
                "
              >
                {{ item.question }}<i class="score">({{ item.score }}分)</i>
              </div>
              <a-checkbox-group
                class="question-options-wrap"
                :value="item.student_answer"
                style="width: 100%"
              >
                <div v-for="(it, ind) in item.options" :key="it.id" class="options-item">
                  <a-checkbox :value="Number(it.id)"
                    ><i>{{ numToAbc(ind + 1) }}、</i>{{ it.option }}</a-checkbox
                  >
                </div>
              </a-checkbox-group>
              <div class="right-answer">正确答案：{{ getChoiceAnswer(item) }}</div>
            </template>
            <template v-if="item.type_id == 5">
              <div
                class="choice-title black-004 question-title"
                :class="
                  item.answer_is_right == true || item.answer_is_right == 1
                    ? 'correct-answer'
                    : 'error-answer'
                "
              >
                {{ item.question }}<i class="score">({{ item.score }}分)</i>
              </div>
              <div class="question-options-wrap">
                <a-textarea
                  v-if="item.student_answer"
                  :value="item.student_answer[0]"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                  :disabled="true"
                />
              </div>
              <div class="right-answer">正确答案：{{ item.answer[0]?.answer }}</div>
              <div class="right-answer" v-if="item">关键字：{{ getKeyword(item) }}</div>
            </template>
          </div>
        </div>
      </template>
      <div class="quiz-footer">
        <template v-if="currentShowType == 0">
          <div>
            <a-button type="default" @click="cancelQuiz">取消</a-button>
            <a-button type="primary" v-if="currentQuizIndex != 0" @click="last"
              >上一题</a-button
            >
            <a-button
              type="primary"
              v-if="currentQuizIndex != quizPaperList.length - 1"
              @click="next"
              >下一题</a-button
            >
            <a-button
              type="primary"
              v-if="currentQuizIndex == quizPaperList.length - 1"
              @click="submitQuiz"
              >提交</a-button
            >
          </div>
        </template>
        <template v-else>
          <div>
            <a-button type="default" @click="cancelQuiz">关闭</a-button>
            <a-button type="primary" v-if="currentShowType == 1" @click="lookRecord"
              >实验随测记录</a-button
            >
          </div>
        </template>
      </div>
    </div>
  </a-modal>
  <!-- 上传文件 -->
  <a-modal
    class="vm-file-upload"
    title="文件上传"
    :visible="uploadVisible"
    :width="700"
    @cancel="uploadVisible = false"
    @ok="okUploadFile"
  >
    <a-upload-dragger
      :before-upload="beforeUpload"
      :remove="remove"
      :multiple="true"
      :fileList="uploadFile.fileList"
      class="upload"
      @change="onChange"
      :showUploadList="false"
      :action="uploadAction"
    >
      <p class="ant-upload-drag-icon">
        <span class="iconfont icon-upload"></span>
      </p>
      <p class="ant-upload-text">点击上传图标，选择要上传的文件或将文件拖拽到此</p>
      <p class="ant-upload-hint">
        (单个文件最味限制为20MB)
      </p>
      <p class="ant-upload-dir">
        默认存放目录路径为{{currentVm?.classify === "Windows" ? "C:\\simpleupload":"/simpleupload"}}
      </p>
    </a-upload-dragger>
    <div v-if="uploadFile.fileList.length" class="progress-box">
      <div class="file-base-info">
        <span>文件名称：{{ uploadFile.fileList[0].name }}</span
        ><span class="icon-shanchu iconfont" @click="remove"></span>
      </div>
      <a-progress :percent="uploadPercent" />
    </div>
    <template #footer>
      <Submit @submit="okUploadFile()" @cancel="uploadVisible = false" :loading="uploadLoading||fileLoading"></Submit>
    </template>
  </a-modal>
  <!-- 下载文件 -->
  <a-modal
    class="vm-file-download"
    title="文件下载"
    :visible="downloadVisible"
    :width="540"
    @cancel="downloadVisible = false"
    @ok="okDownloadFile"
  >
    <p class="label">请输入一个下载路径</p>
    <a-input v-model:value="downloadAdd" placeholder="" />
    <div class="tip">注：下载路径需要是一个文件或者压缩包，例如:{{currentVm?.classify === "Windows" ? "C:\\user.zip":"/home/user.zip"}}，大小限制在200M内</div>
    <template #footer>
      <Submit @submit="okDownloadFile()" @cancel="downloadVisible = false" :loading="false"></Submit>
    </template>
  </a-modal>
  <!-- 正在结束实验 -->
  <a-modal
    class="vm-finishing-experiment-modal"
    title=""
    :visible="finishingExperimentVisible"
    :footer="null"
    :closable="false"
    :destroyOnClose="true"
  >

    <img :src="loadingGif" alt="" srcset="" />
    <span>正在结束实验...</span>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, inject, Ref, onMounted, watch, nextTick, computed, createVNode } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import numberInput from "src/components/aiAnt/numberInput.vue";
import { message, Modal } from "ant-design-vue";
import { beFull } from "be-full";
import { isJsonString } from "src/utils/common";
import { copyText } from "src/utils/copySelect";
import request from "src/request/getRequest";
import { getVmConnectSetting } from "src/utils/seeting";
import { numToAbc } from "src/utils/common";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import loadingGif from "src/assets/images/vmloading.gif";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";
import getMenuRole, { menuTypeArr, experimentTypeList } from "../menuRole";
import { cloneDeep } from "lodash";
import storage from "src/utils/extStorage";
import tusFileUpload from 'src/utils/tusFileUpload'
import Submit from "src/components/submit/index.vue";
import { IBusinessResp } from "src/typings/fetch.d";

const route = useRoute();
const router = useRouter();
const vmApi = request.vmApi;
const http=(request as any).common
// const examApi = request.studentExam;
const { type, opType, taskId, topoinst_id, topoinst_uuid } = route.query;
const experType = Number(route.query.experType);

let role = storage.lStorage.get("role");
const env = process.env.NODE_ENV === "development" ? true : false;
const uploadAction = (env ? '/proxyPrefix':'')+'/api/instance/uploads/file'

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
const currentOption: any = inject("currentOption");
const evaluateData: any = inject("evaluateData");
const evaluateVisible: any = inject("evaluateVisible");
const initEvaluate: any = inject("initEvaluate");
const ws: any = inject("ws");
const sshUrl: any = inject("sshUrl")

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

const isShowDelayBtn = ref(true)

const shareVisible: Ref<boolean> = ref(false);
const tempVmUrl: Ref<string> = ref("");
const codeRef: any = ref(null);

const assistanceVisible: Ref<boolean> = ref(false);
const assistanceQuestion: Ref<string> = ref("");

const visible = ref(false);

// 随堂测试
const quizVisiable = ref(false);
const oldQuizPaperList: Ref<any> = ref([]); // 原始数据
const quizPaperList: Ref<any> = ref([]);
const currentQuizIndex: Ref<number> = ref(0);
const currentShowType: Ref<any> = ref(0); // 0 未答完 1提交结果 2 随测记录
const answerPaperList: Ref<any> = ref([]);  // 带答案的试题

const answerNum = computed(() => {
  let num = 0;
  oldQuizPaperList.value.forEach((item: any) => {
    if (item.student_answer) {
      num++;
    }
  });
  return num;
});

const goalNum = computed(() => {
  let num = 0;
  oldQuizPaperList.value.forEach((item: any) => {
    if (item.student_score) {
      num+=item.student_score;
    }
  });
  return num;
});

const totalPoints  = computed(() => {
  let num = 0;
  oldQuizPaperList.value.forEach((item: any) => {
    if (item.score) {
      num+=item.score;
    }
  });
  return num;
});

const delayVisiable = ref(false);
const delayTime = ref(60); // 实验时间结束，延时提示框倒计时
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
let historyLength = history.length;
let currentQuestionIds: any[] = []; // 存储当前答题的习题id

const toolData = [
  {
    icon: "icon-quanping",
    name: "开启 / 全屏",
    function: fullScreen,
    key: "full",
  },
  {
    icon: "icon-baocun",
    name: "保存进度",
    function: saveKvm,
    key: "save",
  },
  {
    icon: "icon-guanbi1",
    name: "",
    function: colseOrStart,
    key: "closeOrStart",
  },
  {
    icon: "icon-zhongzhi",
    name: "重置",
    function: resetVm,
    key: "reset",
  },
  {
    icon: "icon-shangchuan",
    name: "上传文件",
    function: upload,
    key: "upload",
  },
  {
    icon: "icon-xiazai",
    name: "下载文件",
    function: download,
    key: "down",
  },
  {
    icon: "icon-fuzhiniantie",
    name: "选中粘贴",
    function: copyPaste,
    key: "copy",
  },
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

// const roleArry1: menuTypeArr = ["recommend", "test", "help"].includes(opType as any)
//   ? (getMenuRole(role as any, experimentTypeList[experType].name, opType as any) as any)
//   : (getMenuRole(role as any, experimentTypeList[experType].name) as any);
const roleArry: any = ref([])

function back() {
  Modal.confirm({
    title: "提示",
    content: experType === 6 || experType === 7 ? "返回实验列表" : "返回实验列表，10分钟不继续实验虚机将关机，30分钟不继续实验虚机将删除！",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      if (experType === 6 || experType === 7) {
        router.go(historyLength - history.length - 1);
        return
      }
      if (ws && baseInfo.value?.current?.is_teamed == 1) {
        ws.value?.leave(topoinst_id + "_room");
      }
      if (opType === "test" || opType === "prepare") {
        endVmEnvirment();
      } else {
        // if (allInfo.value?.base_info?.task_type.type==4&&allInfo.value?.base_info?.task_type.programing_type==0) {
        router.go(historyLength - history.length - 1);
        // }else{
        // router.go(-1)
        // }
        // backTo(router, type, 3, routerQuery);
      }
    },
    onCancel: () => {
      // router.go(historyLength - history.length - 1);
    },
  });
}

// 下拉选择虚拟机
async function switchVm() {
  if (isScreenRecording.value) {
    await startEndRecord();
  }
  currentVm.value = vmsInfo.value.vms[currentVmIndex.value];
  currentUuid.value = currentVm.value.uuid;
  role === 4 ? await VmOperatesHandle('active') : ''  // 标记当前虚机
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
        settingCurrentVM();
        initVnc.value();
      }
    }
  } else {
    loading.value = true;
    isClose.value = false;
    // await VmOperatesHandle("startVm");
    vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
    settingCurrentVM();
    initVnc.value();
  }
}

// 延时
function delayedTime() {
  if (use_time.value > 600) {
    message.warn('延迟操作只能在剩余时间小于10分钟时执行')
    return
  }
  if (delayNum.value >= 5) {
    message.warn('延时次数已达5次上限')
    return
  }
  clearInterval(Number(timer));
  VmOperatesHandle("delay").then((res: any) => {
    delayVisiable.value = false
    clearInterval(Number(delayTimer));
    if (res?.data && res.data.remaining_time) {
      message.success("延时成功");
      use_time.value = res.data.remaining_time;
      delayNum.value ++
      times();
    } 
  });
}

// 切换webssh、vnc
async function showChange() {
  // currentvm.value=baseInfo.value.data.vms[vmCurrentIndex.value]
  let cureentIp = location.protocol+"//"+location.hostname
  loading.value=false
  if (currentInterface.value==="vnc") {
    if (isScreenRecording.value) {
      await startEndRecord();
    }
    currentInterface.value="ssh"
    sshUrl.value=""
    setTimeout(()=>{
      sshUrl.value=getVmConnectSetting.SSHHOST+":2222/ssh/host/"+currentVm.value.host_ip+"/"+currentVm.value.ssh_port
      loading.vaue=true
    },2000)
    return
  }
  if (currentInterface.value==="ssh") {
    currentInterface.value="vnc"
    let param={
      action:"switch2Vnc",
      params:{
        type:type,
        opType:opType,
        uuid:currentUuid.value,
        taskId:taskId
      }
    }
    vmApi.switchInterfaceApi({param:{...param}})
  }
}

watch(
  () => currentInterface.value,
  (val) => {
    if (experType === 1 || experType === 2) {
      const roleArry1 = ["recommend", "test", "help"].includes(opType as any)
        ? (getMenuRole(role as any, val as any, opType as any) as any)
        : (getMenuRole(role as any, val as any) as any);
      roleArry.value = roleArry1
    }
  },
  { deep: true, immediate: true }
);

// 结束实验
let finishingExperimentVisible = ref(false)
function finishExperiment() {
  let modal = Modal.confirm({
    title: `确认结束${opType === "help" ? "演示" : role === 4 ? "实验" : "备课"}吗？`,
    okText: "确认",
    onOk: async () => {
      // 文档视频实验
      // if (experType === 6 || experType === 7) {
      //   router.go(historyLength - history.length - 1);
      //   return;
      // }
      finishingExperimentVisible.value = true
      await finishTest();
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
    }).catch((err) => {
      finishingExperimentVisible.value = false
    });
  } else {
    endVmEnvirment();
  }
}
// 结束实验
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
  if (role === 3 || role === 5) {
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
          // initEvaluate();
        });
        router.go(historyLength - history.length-1);
        // router.replace({
        //   path: '/student/studentCourse/Detail',
        //   query: {...JSON.parse(routerQuery)}
        // })
      } else {
        // backTo(router, type, 3, routerQuery);
        router.go(historyLength - history.length - 1);
      }
      // message.success("结束成功");
    }).catch((err) => {
      finishingExperimentVisible.value = false
    });
  }, 3000);
}
// 结束脚本
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
  // console.log("visible", bool);
}

// 工具箱操作

function fullScreen() {
  beFull(document.getElementById("vncDom") as any);
}
// 关机
function colseOrStart() {
  if (vmsInfo.value.vms[currentVmIndex.value].status == "ACTIVE") {

    closeVm();
  } else {
    startVm();
  }
}

// 关机
async function closeVm() {
  if (isScreenRecording.value) {
    await startEndRecord();
  }
  await VmOperatesHandle("closeVm");
  vmsInfo.value.vms[currentVmIndex.value].status = "SHUTOFF";
  isClose.value = true;

  message.success("操作成功");
}
// 开机
async function startVm() {
  await VmOperatesHandle("startVm");
  vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
  isClose.value = false;
  initVnc.value();
  message.success("操作成功");
}
// 重置
async function resetVm() {
  if (isScreenRecording.value) {
    await startEndRecord();
  }
  await VmOperatesHandle("resetVm");
  loading.value = true;
  message.success("操作成功");
}

// 选中粘贴
function copyPaste() {
  novncEl.value.sendSelectContent(copyText);
  visible.value = false;
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


// 文件上传
const uploadVisible = ref(false)
const uploadFile: any = reactive({
  fileList: []
})
const uploadPercent = ref(0)
const uploadFilePath = ref('')
const uploadLoading = ref(false)
const fileLoading = ref(false)
function upload() {
  uploadVisible.value = true
  uploadFile.fileList = []
  uploadFilePath.value = ''
}
const okUploadFile = () => {
  if (!uploadFilePath.value) {
    message.warn("请选择上传文件");
    return
  }
  uploadLoading.value = true
  const params: any = {
    action: 'upload',
    params: {
      uuid: currentUuid.value,
      path: uploadFilePath.value
    },
  };
  operatesHandle(params).then((res:any) => {
    uploadLoading.value = false
    uploadVisible.value = false
  })
}
const beforeUpload = (file: any) => {
  if (file.size > 20*1024*1024) {
    message.warn("文件大小不能超过20MB");
    return
  }
  const postfix = (file && file.name).split(".")[1];
  let obj:any={
    uid: file.uid,
    file_url:'',
    name:file.name
  }
  uploadFile.fileList[0] = obj
  // const fd = new FormData()
  // fd.append('file', file)
  // fd.append('upload_path', 'simpleupload')
  // fd.append('default_name', '1')
  // http.uploadsFile({param:fd}).then((res: IBusinessResp)=>{
  //   uploadFilePath.value = res.data.full_url
  // })
  // return false;
  fileLoading.value = true
}
const remove = () => {
  uploadFile.fileList = []
  uploadFilePath.value = ''
}
const onChange = (info: any) => {
  // console.log(info)
  const {event, file} = info
  if (event) {
    if (event.percent===100) {
      return
    } else {
      uploadPercent.value = Math.floor(event.percent)
    }
  }
  if (file.status === 'done') { // 上传成功
    fileLoading.value = false
    uploadPercent.value = 100
    uploadFilePath.value = file.response?.data?.full_url
  }
}

// 文件下载
const downloadVisible = ref(false)
const downloadAdd = ref('')
function download() {
  downloadVisible.value = true
}
const okDownloadFile = () => {
  if (!downloadAdd.value) {
    message.warn("请输入下载路径");
    return
  }
  const fileNames = downloadAdd.value.split('/')
  const fileName = downloadAdd.value[fileNames.length - 1]
  const params: any = {
    action: 'download',
    params: {
      uuid: currentUuid.value,
      path: downloadAdd.value
    },
  };
  operatesHandle(params).then((res:any) => {
    setTimeout(() => {
      downloadVisible.value = false
    }, 1000)
    let aLink = document.createElement('a')
    aLink.href = res.data.file_path
    aLink.download = ""
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
  })
  // /simpleupload/myfile.pdf
}

async function startEndRecord() {
  if (isScreenRecording.value) {
    // 结束录屏
    const res: any = await VmOperatesHandle("stopRecord");
    if (res.status == 0) {
      return;
    }
    isScreenRecording.value = false;
    videoTime.value = 0;
    clearInterval(Number(viodeTimer));
    videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
    message.success("结束录屏成功");
  } else {
    // 开始录屏
    const res: any = await VmOperatesHandle("startRecord");
    if (res.status == 0) {
      return;
    }
    isScreenRecording.value = true;
    videoTime.value = 0;
    viodeTimer = setInterval(() => {
      videoTime.value++;
      videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
    }, 1000);
    message.success("开始录屏");
  }
}

function shareDesktop() {
  Modal.confirm({
    title: "消息提示",
    content: "确认共享桌面吗？",
    okText: "是",
    cancelText: "否",
    onOk: () => {
      tempVmUrl.value = "";
      shareVisible.value = true;
      let env = process.env.NODE_ENV === "development" ? true : false;
      tempVmUrl.value = `${window.location.protocol}//${window.location.host}/#/vm/vm?wsUrl=${currentOption.value.wsUrl}`;
    },
  });
}

function remoteAssist() {
  assistanceQuestion.value = "";
  assistanceVisible.value = true;
}

// 轮询实验时间
function times() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  timer = setInterval(() => {
    experimentTime!.value = secondToHHMMSS(Number(use_time.value));
    if (!taskType.value) {
      use_time.value++;
    } else {
      if (use_time.value === 600 && delayNum.value < 5 && isShowDelayBtn.value) {
        // clearInterval(Number(timer));
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

      if (use_time.value === 0 && isShowDelayBtn.value) {
        clearInterval(Number(timer));
        delayTime.value = 60;
        delayVisiable.value = true;
        clearInterval(Number(delayTimer));
        delayTimer = setInterval(() => {
          delayTime.value--;
          if (delayTime.value == 0) {
            clearInterval(Number(delayTimer));
            finishTest();
          }
        }, 1000);
        return
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
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
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
}

// 保存进度单选发生变化
function progressChange() {}

// 关闭共享桌面modal
function closeShreModal() {
  shareVisible.value = false;
}

// 选中链接
function selectUrl(e: any) {
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
  if (assistanceQuestion.value.length >= 30) {
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
  vmApi.studentQuestionApi({ param: { ...param } }).then((res:any) => {
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

//
// 打开随堂测试
async function openQuizModal() {
  if (oldQuizPaperList.value.length == answerNum.value) {

    // await getQuestionList(true);
    await getAnswerList()
    quizPaperList.value=cloneDeep(oldQuizPaperList.value)
    currentShowType.value = 1;
  } else {
    await getQuestionList(false);
    currentQuestionIds = [];
    let tempData: any[] = cloneDeep(oldQuizPaperList.value);
    tempData = tempData.filter((item: any) => {
      return !item.student_answer;
    });
    for (let i = 0; i < tempData.length; i++) {
      currentQuestionIds.push(tempData[i].id);
      if (!tempData[i].student_answer) {
        tempData[i].student_answer = [];
      }
    }
    quizPaperList.value = tempData;
    currentQuizIndex.value = 0;
    currentShowType.value = 0;
  }
  quizVisiable.value = true;
}
// 获取随堂测试习题.
async function getQuestionList(needs_answer: boolean = false) {
  let param = {
    page: 1,
    limit: "all",
    needs_answer: needs_answer,
  };
  return vmApi
    .getQuestionListApi({ param: param, urlParams: { content_id: taskId } })
    .then((res: any) => {
      if (!res) return
      oldQuizPaperList.value = res.data;
      return res.data;
    });
}
// 获取有答案的随堂测试习题.
async function getAnswerList(needs_answer: boolean = false) {
  let param = {
    page: 1,
    limit: "all",
    // needs_answer: needs_answer,
  };
  return vmApi
    .getAnswerListApi({ param: param, urlParams: { content_id: taskId } })
    .then((res: any) => {
      if (!res) return
      answerPaperList.value = res.data;
      return res.data;
    });
}
// 提交
function submitQuiz() {
  let params: any = {
    course_student_content_id: baseInfo.value.current.id,
    answer: [],
  };
  for (let i = 0; i < quizPaperList.value.length; i++) {
    let answer = {
      relation_id: quizPaperList.value[i].relation_id,
      answers: quizPaperList.value[i].student_answer,
    };
    params.answer.push(answer);
  }

  vmApi.submitAnswerApi({ param: params }).then(async (res: any) => {
    message.success("提交成功");
    let questionTemp: any[] = await getAnswerList();
    quizPaperList.value = questionTemp.filter((item: any) => {
      return currentQuestionIds.includes(item.id);
    });
    currentShowType.value = 1;
    currentQuestionIds=[]
  });
}

// 取消随堂测试
function cancelQuiz() {
  quizVisiable.value = false;
}

// 上一题
function last() {
  currentQuizIndex.value--;
}

// 下一题
function next() {
  currentQuizIndex.value++;
}

// 实验随测记录
function lookRecord() {
  currentShowType.value = 2;
  quizPaperList.value = cloneDeep(oldQuizPaperList.value);
}
// 获取多选题答案
function getChoiceAnswer(val: any) {
  const newAnswerArry = val.answer
    ? val.answer.flatMap((item: any) => {
        return Number(item.answer);
      })
    : [];
  let answer = "";

  val.options.forEach((item: any, index: number) => {
    if (newAnswerArry.includes(Number(item.id))) {
      answer += numToAbc(index + 1) + " ";
    }
  });
  return answer;
}

// 获取关键字
function getKeyword(val: any) {
  var keywords = val.keywords
    ? val.keywords.flatMap((item: any) => {
        return item.keyword;
      })
    : [];
  return keywords.join(" , ");
}
let questionTimer: NodeJS.Timer | null = null;

const delayNum = ref(0)
// f
watch(
  () => vmsInfo.value,
  async(val) => {
    if (val.vms?.length && role===4) {
      await VmOperatesHandle('active')  // 标记当前虚机  只在学生端
    }
  },
  { deep: true, immediate: true }
);
// f
watch(
  () => baseInfo.value,
  async() => {
    if (roleArry.value.includes('delayed')&&Number(baseInfo.value?.current?.status)<2) {
      times();
    }
    delayNum.value = baseInfo.value?.current?.delay_num
    if (role === 4&&baseInfo.value?.current?.is_teamed == 1&&baseInfo.value?.current?.is_lead == 0) {  // 高配分组 非组长
      isShowDelayBtn.value = !(baseInfo.value?.current?.is_teamed == 1&&baseInfo.value?.current?.is_lead == 0)
      roleArry.value = getMenuRole(4, experimentTypeList[experType].name, 'highGroup') as any // 高配分组 非组长
      // console.log('roleArry2',roleArry.value)
    } else {
      const roleArry1: menuTypeArr = ["recommend", "test", "help"].includes(opType as any)
        ? (getMenuRole(role as any, experimentTypeList[experType].name, opType as any) as any)
        : (getMenuRole(role as any, experimentTypeList[experType].name) as any);
        roleArry.value = roleArry1
    }
  },
  { deep: true, immediate: true }
);
onMounted(() => {

  clearInterval(Number(viodeTimer));
  clearInterval(Number(timer));
  clearInterval(Number(delayTimer));
  clearInterval(Number(questionTimer));
  // if (roleArry.includes('delayed')&&Number(baseInfo.value?.current?.status)<2) {
    // times();
  // }
  if (roleArry.value.includes('classTest')) {
    getQuestionList(false);
    questionTimer = setInterval(() => {
      getQuestionList(false);
    }, 3000)
  }
}),
  onBeforeRouteLeave(() => {
    // console.log("离开页面");
    clearInterval(Number(timer));
    clearInterval(Number(viodeTimer));
    clearInterval(Number(delayTimer));
    clearInterval(Number(questionTimer));
  });

// function test(){
//   evaluateVisible.value = true;
//   initEvaluate()
// }
</script>

<style lang="less" scoped>
i {
  font-style: normal;
}
.delay-end-modal {
  .hint-delay-info {
    // text-indent: 2em;
    .down-time-60s {
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
  height: 45px;
  line-height: 45px;
  .back {
    margin: 0 15px;
    color: var(--white-65);
    .iconfont {
      margin-right: 4px;
    }
  }
  .left-box {
    color: var(--white-100);
    // padding: 22px 0;
    position: relative;
    display: flex;
    width: 550px;
    .selected {
      // width: 460px;
      // height: 26px;
      // line-height: 26px;
      font-size: var(--font-size-20);
      margin-left: 24px;
      .name {
        padding: 0 10px;
      }
      .iconfont {
        font-size: 20px;
        vertical-align: middle;
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
        top: 12px;
        right: -6px;
      }
    }
  }
  .center-box {
    flex-shrink: 0;
    // line-height: 70px;
    .video-time {
      height: 35px;
      color: #ffba49;
    }
  }
  .right-box {
    &>div {
      margin-top: 12px;
      height: 21px;
      line-height: 21px;
    }
    // padding: 25px 0;
    display: flex;
    // height: 70px;
    // line-height: 20px;
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
.ant-drawer.vm-drawer {
  top: 45px;
  color: var(--white-45);
  .iconfont {
    font-size: var(--base-font-size);
  }
  .ant-drawer-body {
    height: calc(100% - 45px);
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
  .ant-drawer-header {
    display: none;
  }
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
.none-event {
  pointer-events: none;
  cursor: not-allowed;
  color: #5c5c5c;
}
.quiz-modal {
  .ant-modal-body {
    padding-top: 0;
  }
  .quiz-modal-body {
    max-height: 600px;
    overflow-y: auto;
  }
  .black-004 {
    background: var(--black-0-4);
  }
  .question-title {
    line-height: 35px;
    padding-left: 12px;
    .score {
      color: var(--primary-color);
      margin-left: 5px;
    }
  }
  .question-options-wrap {
    padding: 12px 12px 0 12px;
    .options-item {
      line-height: 35px;
      font-size: 14px;
    }
  }
  .quiz-footer {
    text-align: center;
    margin-top: 40px;
    button {
      margin-left: 15px;
    }
  }
  .right-answer {
    margin-bottom: 20px;
    padding-left: 12px;
    color: var(--green-7);
  }
  .correct-answer {
    background: var(--cyan-1);
  }
  .error-answer {
    background: var(--alert-error);
  }
}
.static-box{
  margin-bottom: 8px;
  color: var(--black-45);
  span{
    margin-right: 20px;
    i{
      margin: 0 5px;
      font-style: normal;
      color: var(--primary-color);
      &.goal{
        color: var(--green-7);
      }
    }
  }
}

.vm-file-upload {
  .ant-modal-body {
    padding: 40px;
  }
  .ant-upload {
    height: 170px;
    background: var(--white);
    border-radius: 4px;
    .ant-upload-drag-container {
      color: var(--black-45);
      .ant-upload-drag-icon {
        margin-bottom: 0px;
        color: var(--primary-color);
        .iconfont {
          font-size: var(--font-size-24);
        }
      }
      .ant-upload-text, .ant-upload-dir {
        font-size: var(--font-size-16);
      }
      .ant-upload-hint {
        color: var(--black-25);
        margin-bottom: 14px;
      }
    }
  }
  .progress-box {
    margin-top: 24px;
    .file-base-info {
      display: flex;
      justify-content: space-between;
      padding-right: 14px;
    }
  }
}
.vm-file-download {
  .label {
    margin-bottom: 8px;
    color: var(--black-65);
  }
  .tip {
    margin-top: 8px;
    color: var(--primary-color);
  }
}
.vm-finishing-experiment-modal {
  top: 50%;
  .ant-modal-content {
    background-color: rgba(255, 255, 255, 0);
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 0;
    text-align: center;
    font-size: 20px;
    color: var(--white-65);
    .ant-modal-confirm-btns {
      display: none;
    }
    .img {
      margin-right: 8px;
    }
  }
}
</style>
