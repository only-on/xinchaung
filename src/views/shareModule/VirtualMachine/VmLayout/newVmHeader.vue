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
      <div class="class-test pointer" @click="openQuizModal" v-if="role == 4">
        <span>随堂测试</span>
        <span>({{ answerNum + "/" + oldQuizPaperList.length }})</span>
        <i class="sign"></i>
      </div>
    </div>
    <div class="center-box">
      <span v-if="isScreenRecording" class="video-time"
        >录制时间:
        {{
          videoTimeText?.h +
          "时" +
          videoTimeText?.m +
          "分" +
          videoTimeText?.s +
          "秒"
        }}</span
      >
    </div>
    <div class="right-box">
      <div
        class="ip-list"
        :class="roleArry.includes('switchVm') ? '' : 'none-event'"
      >
        <a-select
          class="ip-select"
          v-model:value="currentVmIndex"
          @change="switchVm"
        >
          <a-select-option
            v-for="(item, index) in vmsInfo.vms"
            :key="index"
            :value="index"
          >
            <span class="ip-name">{{ item.host_ip }}</span>
            <span
              class="vm-state"
              :class="item.status === 'ACTIVE' ? 'open' : 'close'"
              >{{ item.status === "ACTIVE" ? "开" : "关" }}</span
            >
          </a-select-option>
        </a-select>
      </div>
      <div
        class="delayed"
        :class="roleArry.includes('delayed') ? '' : 'none-event'"
      >
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
      <div
        class="vnc-change pointer"
        @click="showChange"
        v-if="baseInfo?.base_info?.is_webssh === 1"
      >
        切换为{{ currentInterface === "ssh" ? "VNC" : "SSH" }}
      </div>
      <div
        class="tool pointer"
        v-if="roleArry.includes('tools')"
        @click="visible = !visible"
      >
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
          <template v-for="(list, index) in toolList" :key="index">
            <li
              class="pointer"
              @click="list.function"
              v-if="list.key == 'closeOrStart'"
              :class="roleArry.includes(list.key as any)?'':'none-event'"
            >
              <span class="iconfont" :class="list.icon"></span>
              <span v-if="vmsInfo && vmsInfo?.vms">{{
                vmsInfo?.vms[currentVmIndex].status == "ACTIVE"
                  ? "关机"
                  : "开机"
              }}</span>
            </li>
            <li
              class="pointer"
              @click="list.function"
              v-if="list.key == 'record'"
              :class="roleArry.includes(list.key as any)?'':'none-event'"
            >
              <span class="iconfont" :class="list.icon"></span>
              <span> {{ isScreenRecording ? "结束" : "开始" }}录屏 </span>
            </li>
            <li
              v-else-if="
                list.name && !['record', 'closeOrStart'].includes(list.key)
              "
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
  >
    <div class="hint-delay-info">
      实验时间已到，您可以选择结束实验或通过延时继续进行实验！<span
        class="down-time-60s"
        >{{ delayTime }}</span
      >s后自动结束实验！;
    </div>
  </a-modal>
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
              }}<i class="score">(10分)</i>
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
                  ><i>{{ numToAbc(index + 1) }}、</i
                  >{{ item.option }}</a-checkbox
                >
              </div>
            </a-checkbox-group>
          </template>
          <template v-if="quizPaperList[currentQuizIndex].type_id == 5">
            <div class="choice-title black-004 question-title">
              {{ quizPaperList[currentQuizIndex].question
              }}<i class="score">(10分)</i>
            </div>
            <div class="question-options-wrap">
              <a-textarea
                v-model:value="
                  quizPaperList[currentQuizIndex].student_answer[0]
                "
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </div>
          </template>
        </div>
      </template>
      <template v-if="[1, 2].includes(currentShowType)">
        <div>
          <div v-if="currentShowType == 2">
            <span>共<i>3</i>题</span><span>总分<i>100</i>分</span
            ><span>得分<i>90</i>分</span>
          </div>
          <div v-for="item in quizPaperList" :key="item.id">
            <template v-if="item.type_id == 2">
              <div class="choice-title black-004 question-title">
                {{ item.question }}<i class="score">(10分)</i>
              </div>
              <a-checkbox-group
                class="question-options-wrap"
                :value="item.student_answer"
                style="width: 100%"
              >
                <div
                  v-for="(it, ind) in item.options"
                  :key="it.id"
                  class="options-item"
                >
                  <a-checkbox :value="Number(it.id)"
                    ><i>{{ numToAbc(ind + 1) }}、</i>{{ it.option }}</a-checkbox
                  >
                </div>
              </a-checkbox-group>
              <div class="right-answer">
                正确答案：{{ getChoiceAnswer(item) }}
              </div>
            </template>
            <template v-if="item.type_id == 5">
              <div class="choice-title black-004 question-title">
                {{ item.question }}<i class="score">(10分)</i>
              </div>
              <div class="question-options-wrap">
                <a-textarea
                  :value="item.student_answer[0]"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                  :disabled="true"
                />
              </div>
              <div class="right-answer">
                正确答案：{{ item.answers[0]?.answer }}
              </div>
              <div class="right-answer">关键字：{{ getKeyword(item) }}</div>
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
            <a-button
              type="primary"
              v-if="currentShowType == 1"
              @click="lookRecord"
              >实验随测记录</a-button
            >
          </div>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  inject,
  Ref,
  onMounted,
  watch,
  nextTick,
  computed,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import numberInput from "src/components/aiAnt/numberInput.vue";
import { message, Modal } from "ant-design-vue";
import { beFull } from "be-full";
import { isJsonString } from "src/utils/common";
import { copyText } from "src/utils/copySelect";
import request from "src/request/getRequest";
import { getVmConnectSetting } from "src/utils/seeting";
import { numToAbc } from "src/utils/common";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";
import getMenuRole, { menuTypeArr } from "../menuRole";
import { cloneDeep } from "lodash";
import storage from "src/utils/extStorage";

const route = useRoute();
const router = useRouter();
const vmApi = request.vmApi;
const examApi = request.studentExam;
const { type, opType, taskId, topoinst_id, topoinst_uuid } = route.query;

let role = storage.lStorage.get("role");

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

const answerNum = computed(() => {
  let num = 0;
  oldQuizPaperList.value.forEach((item: any) => {
    if (item.student_answer.length > 0) {
      num++;
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

const roleArry: menuTypeArr = ["recommend", "test"].includes(opType as any)
  ? (getMenuRole(role as any, "vnc", opType as any) as any)
  : (getMenuRole(role as any, "vnc") as any);
console.log(roleArry);

watch(
  () => vmsInfo,
  () => {
    console.log(vmsInfo.value);
  },
  {
    deep: true,
  }
);

// 获取随堂测试习题·
function getQuestionList() {
  oldQuizPaperList.value = [
    {
      id: 545,
      question: "创建多选2",
      type_id: 2,
      level_id: 3,
      pool_id: 87,
      origin_score: 2,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1734,
      student_answer: [1723, 1725],
      note: "",
      points: {
        knowledge_name: "node2,node3",
        knowledge_names: [
          ["大数据", "node", "node2"],
          ["大数据", "node", "node3"],
        ],
        knowledge_ids: [50002, 50003],
      },
      type: {
        id: 2,
        name: "多选题",
      },
      level: {
        id: 3,
        name: "困难",
      },
      options: [
        {
          id: 1723,
          option: "无所谓",
        },
        {
          id: 1724,
          option: "税务师我说unnuuunu",
        },
        {
          id: 1725,
          option: "是我swsswsw",
        },
        {
          id: 1726,
          option: "上午我说我说",
        },
      ],
      keywords: [],
      answers: [
        {
          id: 690,
          answer: "1723",
        },
        {
          id: 691,
          answer: "1724",
        },
        {
          id: 692,
          answer: "1725",
        },
        {
          id: 693,
          answer: "1726",
        },
      ],
    },
    {
      id: 542,
      question: "dedehuedhdeudeudehu",
      type_id: 2,
      level_id: 1,
      pool_id: 87,
      origin_score: 2,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1735,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "node2,node3",
        knowledge_names: [
          ["大数据", "node", "node2"],
          ["大数据", "node", "node3"],
        ],
        knowledge_ids: [50003, 50002],
      },
      type: {
        id: 2,
        name: "多选题",
      },
      level: {
        id: 1,
        name: "简单",
      },
      options: [
        {
          id: 1575,
          option: "ededde",
        },
        {
          id: 1576,
          option: "dddededededeed",
        },
        {
          id: 1577,
          option: "dedede",
        },
        {
          id: 1578,
          option: "hufrhrf",
        },
      ],
      keywords: [],
      answers: [
        {
          id: 650,
          answer: "1578",
        },
        {
          id: 651,
          answer: "1577",
        },
      ],
    },
    {
      id: 509,
      question: "多选题222",
      type_id: 2,
      level_id: 1,
      pool_id: 87,
      origin_score: 2,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1736,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "",
        knowledge_names: [],
      },
      type: {
        id: 2,
        name: "多选题",
      },
      level: {
        id: 1,
        name: "简单",
      },
      options: [
        {
          id: 1453,
          option: "w w w",
        },
        {
          id: 1454,
          option: "呜呜呜呜呜",
        },
        {
          id: 1455,
          option: "www我",
        },
        {
          id: 1456,
          option: "让反反复复",
        },
      ],
      keywords: [],
      answers: [
        {
          id: 609,
          answer: "1454",
        },
        {
          id: 610,
          answer: "1453",
        },
        {
          id: 611,
          answer: "1455",
        },
      ],
    },
    {
      id: 508,
      question: "多选题测试111",
      type_id: 2,
      level_id: 1,
      pool_id: 87,
      origin_score: 1,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1737,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "",
        knowledge_names: [],
      },
      type: {
        id: 2,
        name: "多选题",
      },
      level: {
        id: 1,
        name: "简单",
      },
      options: [
        {
          id: 1449,
          option: "兑现1",
        },
        {
          id: 1450,
          option: "多虚啊2",
        },
        {
          id: 1451,
          option: "多选3",
        },
        {
          id: 1452,
          option: "多选4",
        },
      ],
      keywords: [],
      answers: [
        {
          id: 606,
          answer: "1449",
        },
        {
          id: 607,
          answer: "1450",
        },
        {
          id: 608,
          answer: "1452",
        },
      ],
    },
    {
      id: 575,
      question: "ggyyyyyyyyygy",
      type_id: 5,
      level_id: 3,
      pool_id: 87,
      origin_score: 5,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1738,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "node2,node3",
        knowledge_names: [
          ["大数据", "node", "node2"],
          ["大数据", "node", "node3"],
        ],
        knowledge_ids: [50002, 50003],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 3,
        name: "困难",
      },
      options: [],
      keywords: [
        {
          id: 474,
          keyword: "gyyyyy",
        },
      ],
      answers: [
        {
          id: 747,
          answer: "fttttttttt",
        },
      ],
    },
    {
      id: 566,
      question: "解答题知识点",
      type_id: 5,
      level_id: 2,
      pool_id: 87,
      origin_score: 3,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1739,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "node2,node3,111",
        knowledge_names: [
          ["大数据", "node", "node2"],
          ["大数据", "node", "node3"],
          ["大数据", "node", "node1", "df", "111"],
        ],
        knowledge_ids: [50002, 50003, 50005],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 2,
        name: "中等",
      },
      options: [],
      keywords: [
        {
          id: 471,
          keyword: "的的额度",
        },
      ],
      answers: [
        {
          id: 736,
          answer: "的的的",
        },
      ],
    },
    {
      id: 564,
      question: "rfrffrfrrffhuhfhfhaa叫啊叫姐姐哈哈哈哈哈哈哈哈哈",
      type_id: 5,
      level_id: 2,
      pool_id: 87,
      origin_score: 31,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1740,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "node2,node3",
        knowledge_names: [
          ["大数据", "node", "node2"],
          ["大数据", "node", "node3"],
        ],
        knowledge_ids: [50003, 50002],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 2,
        name: "中等",
      },
      options: [],
      keywords: [
        {
          id: 470,
          keyword: "edededede",
        },
      ],
      answers: [
        {
          id: 735,
          answer: "哈哈哈dededededxssxsx",
        },
      ],
    },
    {
      id: 562,
      question: "rfrffrrfffrfrfrrfrfrffrrffr",
      type_id: 5,
      level_id: 2,
      pool_id: 87,
      origin_score: 5,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1741,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "",
        knowledge_names: [],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 2,
        name: "中等",
      },
      options: [],
      keywords: [
        {
          id: 464,
          keyword: "rffrfr",
        },
      ],
      answers: [
        {
          id: 726,
          answer: "rffrfrfrffr",
        },
      ],
    },
    {
      id: 555,
      question: "解答题哈哈哈啊哈哈wswguuuguuggugugu",
      type_id: 5,
      level_id: 3,
      pool_id: 87,
      origin_score: 41,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1742,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "111,ddddd",
        knowledge_names: [
          ["大数据", "node", "node1", "df", "111"],
          ["大数据", "node", "node1", "df", "ddddd"],
        ],
        knowledge_ids: [50006, 50005],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 3,
        name: "困难",
      },
      options: [],
      keywords: [
        {
          id: 465,
          keyword: "ededdeeddeed",
        },
      ],
      answers: [
        {
          id: 727,
          answer: "dedddededed33333",
        },
      ],
    },
    {
      id: 523,
      question: "ssswwsswdede",
      type_id: 5,
      level_id: 1,
      pool_id: 87,
      origin_score: 1,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1743,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "",
        knowledge_names: [],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 1,
        name: "简单",
      },
      options: [],
      keywords: [
        {
          id: 466,
          keyword: "啊uuu",
        },
      ],
      answers: [
        {
          id: 728,
          answer:
            "huedh哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊阿啊de",
        },
      ],
    },
    {
      id: 522,
      question: "解答题",
      type_id: 5,
      level_id: 1,
      pool_id: 87,
      origin_score: 1,
      ordered_answer: 0,
      user_id: 100,
      relation_id: 1744,
      student_answer: [],
      note: "",
      points: {
        knowledge_name: "111,ddddd",
        knowledge_names: [
          ["大数据", "node", "node1", "df", "111"],
          ["大数据", "node", "node1", "df", "ddddd"],
        ],
        knowledge_ids: [50005, 50006],
      },
      type: {
        id: 5,
        name: "简答题",
      },
      level: {
        id: 1,
        name: "简单",
      },
      options: [],
      keywords: [
        {
          id: 475,
          keyword: "dedede",
        },
      ],
      answers: [
        {
          id: 748,
          answer:
            "话 hu hu f h vu g别别扭扭河南女孩发染发烦人烦人烦人烦人染发111",
        },
      ],
    },
  ];
  console.log(oldQuizPaperList.value.length);

  let param = {
    page: 1,
    limit: "all",
  };
  vmApi
    .getQuestionListApi({ param: param, urlParams: { content_id: taskId } })
    .then((res: any) => {
      console.log(res);
      oldQuizPaperList.value = res.data;
    });
}
function back() {
  Modal.confirm({
    title: "提示",
    content:
      "返回实验列表，10分钟不继续实验虚机将关机，30分钟不继续实验虚机将删除！",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      if (ws && baseInfo.value?.current?.is_teamed == 1) {
        ws.value.leave(topoinst_id + "_room");
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
      router.go(historyLength - history.length - 1);
    },
  });
}

// 下拉选择虚拟机
async function switchVm() {
  currentVm.value = vmsInfo.value.vms[currentVmIndex.value];
  currentUuid.value = currentVm.value.uuid;
  if (isScreenRecording.value) {
    await startEndRecord();
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
        settingCurrentVM();
        initVnc.value();
      }
    }
  } else {
    loading.value = true;
    await VmOperatesHandle("startVm");
    vmsInfo.value.vms[currentVmIndex.value].status = "ACTIVE";
    settingCurrentVM();
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
    title: `确认结束${
      opType === "help" ? "演示" : role === 4 ? "实验" : "备课"
    }吗？`,
    okText: "确认",
    onOk: async () => {
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
          initEvaluate();
        });
      } else {
        // backTo(router, type, 3, routerQuery);
        router.go(historyLength - history.length - 1);
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
    await startEndRecord();
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
    await startEndRecord();
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
      tempVmUrl.value = `${window.location.protocol}//${window.location.host}${
        env ? "/#/" : "/frontend/#/"
      }vm/vm?wsUrl=${currentOption.value.wsUrl}`;
    },
  });
}

function remoteAssist() {
  assistanceQuestion.value = "";
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

//
// 打开随堂测试
function openQuizModal() {
  quizVisiable.value = true;
  quizPaperList.value = cloneDeep(oldQuizPaperList.value);
  currentQuizIndex.value = 0;
  if (quizPaperList.value.length == answerNum.value) {
    currentShowType.value = 1;
  } else {
    currentShowType.value = 0;
  }
}
// 提交
function submitQuiz() {
  console.log(quizPaperList.value);
  let params: any = {
    answer: [],
  };
  for (let i = 0; i < quizPaperList.value.length; i++) {
    let answer = {
      relation_id: quizPaperList.value[i].relation_id,
      answers: quizPaperList.value[i].student_answer,
    };
    params.answer.push(answer);
  }
  currentShowType.value = 1;
  examApi.submitAnswerApi({ param: params }).then(async (res: any) => {
    message.success("提交成功");
    getQuestionList();
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
}
// 获取多选题答案
function getChoiceAnswer(val: any) {
  const newAnswerArry = val.answers.flatMap((item: any) => {
    return Number(item.answer);
  });
  let answer = "";
  console.log(newAnswerArry);

  val.options.forEach((item: any, index: number) => {
    console.log(item);

    if (newAnswerArry.includes(Number(item.id))) {
      answer += numToAbc(index + 1) + " ";
    }
  });
  return answer;
}

// 获取关键字
function getKeyword(val: any) {
  var keywords = val.keywords.flatMap((item: any) => {
    return item.keyword;
  });
  return keywords.join(" , ");
}
// f
onMounted(() => {
  getQuestionList();
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
        top: 1px;
        right: -6px;
      }
    }
  }
  .center-box {
    flex-shrink: 0;
    line-height: 70px;
    .video-time {
      height: 35px;
      color: #ffba49;
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
}
</style>
