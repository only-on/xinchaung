<template>
  <div class="correct-wrap">
    <div class="c-d-left">
      <chapterTree :courseId="courseId" @selectExperiment="selectExperiment" />
    </div>
    <div class="correct-right right">
      <div class="top">
        <div class="t-left">
          <span
            >提交情况：<i class="surplus">{{
              staticInfo?.submited ? staticInfo.submited : 0
            }}</i
            >/{{ total }}</span
          >
          <span>
            评阅情况：<i class="surplus">{{
              staticInfo?.ranked ? staticInfo.ranked : 0
            }}</i
            >/{{ total }}
          </span>
        </div>
        <div class="t-right">
          <a-button type="primary" class="auto-preview-btn" size="" @click="autoReview">
            <a-tooltip overlay-class-name="numeric-input">
              <template #title>
                <span>一键评阅</span>
              </template>
              <span class="preview-btn">一键评阅</span>
            </a-tooltip>
            <a-tooltip overlay-class-name="numeric-input">
              <template #title>
                <span>一键评阅权重设置</span>
              </template>
              <i
                title="设置权重"
                @click.stop="autoWeight"
                class="icon-shezhi iconfont setting-btn"
              ></i>
            </a-tooltip>
          </a-button>
          <a-button type="primary" size="" @click="exportScore">导出成绩</a-button>
        </div>
      </div>
      <div class="c-table">
        <a-config-provider>
          <a-table
          class="correct-table"
          :columns="columns"
          bordered
          :data-source="tabelData"
          row-key="user_id"
          :pagination="false"
        >
          <template #customReportTitle> 报告</template>
          <template #customQuizTitle> 随测</template>
          <template #customAutoTitle> 自动评分</template>
          <template #customExercisesTitle> 习题 </template>
          <template #reference="{ text, record, index }">
            <span :class="record.video!=null&&record.video?.length!==0?'table-a-link':'no-link'" @click="record.video!=null&&record.video?.length!==0?clickFun('video', record, index):''"
              >录屏</span
            >
          </template>
          <template #report="{ text, record, index }">
            <template v-if="record.report_score != null">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateReport', record, index)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span :class="Number(record.status)>1&&(record.report?.pdf_path || record.report?.json_content)?'table-a-link':'no-link'" @click="Number(record.status)>1&&(record.report?.pdf_path || record.report?.json_content)?clickFun('report', record, index):''"
                >评阅</span
              >
            </template>
          </template>
          <template #question="{ text, record, index }">
            <template v-if="record.question_score != null">
              <span>{{ text }}</span>
            </template>
            <template v-else>
              <div style="text-align: center">--</div>
            </template>
          </template>
          <template #autoScore="{ text, record, index }">
            <span v-if="record.auto_score!=null">{{ text }}</span>
            <span v-else>--</span>
            <!-- <template v-if="record.auto_score!=null">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateCode', record,index)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span class="table-a-link" @click="clickFun('code', record,index)">评阅</span>
            </template> -->
          </template>
          <template #score="{ text, record, index }">
            <template v-if="record.final_score != null">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateScore', record, index)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span :class="Number(record.status)<2?'no-link':'table-a-link'" @click="Number(record.status)<2?'':clickFun('score', record, index)"
                >评分</span
              >
            </template>
          </template>
        </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty" /></div>
          </template>
          </a-config-provider>
      </div>
      <a-pagination
        v-if="total>10"
        :total="total"
        v-model:current="params.page"
        v-model:pageSize="params.limit"
        class="page-wrap"
        @change="pageChange"
      >
        <!-- <template #itemRender="{ page, type, originalElement }">
          <a v-if="type === 'prev'">上一页</a>
          <a v-else-if="type === 'next'">下一页</a>
          <renderVNode v-else :vnode="originalElement"></renderVNode>
        </template> -->
      </a-pagination>
    </div>
  </div>

  <!--一键评阅-->
  <reviewWeight
    v-if="weightVisible"
    v-model:weightVisible="weightVisible"
    v-model:weightData="weightData"
    @apply="apply"
    @submit="submitWeight"
  ></reviewWeight>
  <ratingScores
    :isEdit="isEdit"
    v-if="scoreVisible"
    v-model:visible="scoreVisible"
    v-model:data="scoreData"
    @submit="submitScore"
  ></ratingScores>
  <reportModal
    :isEdit="isEdit"
    :reportType='reportType'
    v-if="reportVisible"
    v-model:visible="reportVisible"
    v-model:data="reportData"
    @submit="submitReport"
  ></reportModal>
  <!-- <codeReview
    v-if="codeVisible"
    v-model:visible="codeVisible"
    v-model:data="rowData"
  ></codeReview> -->
  <videoView
    v-if="videoVisible"
    v-model:visible="videoVisible"
    v-model:url="videoUrl"
  ></videoView>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, watch } from "vue";
import reviewWeight from "./reviewWeight.vue"; // 一键评阅弹窗
import ratingScores from "./ratingScores.vue"; // 评分弹窗
import reportModal from "./report.vue"; // 批阅报告弹框
// import codeReview from "./codeReview.vue"; // 代码评阅
import videoView from "./videoView.vue";
import { cloneDeep } from "lodash";
import chapterTree from "../Chapter/ChapterList.vue";
import request from "src/api/index";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { saveAs } from "file-saver";

const route = useRoute();
const courseId: any = Number(route.query.courseId); //章节id

const scoreApi = request.teachCourse;

// 控制弹窗显示隐藏visible
const weightVisible = ref(false);
const scoreVisible = ref(false);
const reportVisible = ref(false);
const codeVisible = ref(false);
const videoVisible = ref(false);

// 查看列表参数
const params = ref({
  limit: 10,
  page: 1,
});

const chartLoading: any = ref(false);
const ChaptersTreeList: any = ref([]);
const experitId: any = ref(""); //实验id

// 权重数据
const weightData: Ref<any> = ref({});

// 成绩数据
const scoreData: Ref<any> = ref({});

// 报告数据
const reportData: Ref<any> = ref({});
// 当前操作行
let currentRow: any = "";
const total: Ref<number> = ref(0);
// 是否是编辑状态
const isEdit = ref(false);
// 当前学习id
let currentStudyId: any = "";
// 当前行数据
const rowData = ref({});

// 头部统计
const staticInfo: Ref<any> = ref({});

// 评分参考视频url地址
const videoUrl: Ref<any> = ref("");

//报告类型
const reportType:any=ref()
// table头信息
const oldColumns: any[] = [
  {
    title: "序号",
    width: 49,
    algin: "center",
    customRender: ({ text, record, index }: any) => {
      return index+1;
    },
  },
  {
    title: "学号",
    dataIndex: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 90,
  },
  {
    title: "班级",
    dataIndex: "classname",
  },
  {
    title: "花费时间",
    dataIndex: "used_time",
    width:130,
  },
  {
    title: "评分项",
    children: [
      {
        dataIndex: "report_score",
        slots: { title: "customReportTitle", customRender: "report" },
        width: 74,
        align:'center'
      },
      {
        dataIndex: "question_score",
        slots: { title: "customQuizTitle", customRender: "question" },
        width: 74,
        align:'center'
      },
      { 
        dataIndex: "auto_score",
        slots: { title: "customAutoTitle", customRender: "autoScore" },
        width: 74,
        align:'center'
      }
      // {
      //   dataIndex: "exercises",
      //   slots: { title: "customExercisesTitle", customRender: "exercises" },
      //   width: 74,
      // },
    ],
  },
  {
    title: "评分参考",
    dataIndex: "reference",
    width: 75,
    slots: { customRender: "reference" },
  },
  {
    title: "成绩",
    dataIndex: "final_score",
    key: "final_score",
    width: 65,
    slots: { customRender: "score" },
  },
];
const columns: Ref<any> = ref([]);

// table数据
const tabelData = ref([]);

// 获取数据
function getTeacherEvaluates() {
  tabelData.value=[]
  total.value=0
  Object.assign(params.value, { taskId: experitId.value });
  scoreApi.getTeacherEvaluatesApi({ param: params.value }).then((res: any) => {
    tabelData.value = res.data.list;
    total.value = res.data.page.totalCount;
    staticInfo.value = res.data.statistics;
    updateTableHeader(res.data.show);
  });
}


// 分页发生变化
function pageChange(page: number, pageSize: number) {
  getTeacherEvaluates();
}
// 分页渲染dom
function renderVNode(_: any, { attrs: { vnode } }: any) {
  return vnode;
}
// 打开一键评阅modal
async function autoWeight() {
  await getWeight(experitId.value);
  weightVisible.value = true;
}

// 获取评阅权重数据
async function getWeight(taskId: any) {
  await scoreApi.getWeightApi({ urlParams: { taskId: taskId } }).then((res: any) => {
    weightData.value = res.data;
  });
}

// 应用到本课程
function apply() {
  scoreApi
    .applyWeightApi({
      param: {
        auto: weightData.value.calc.auto,
        report: weightData.value.calc.report,
        question: weightData.value.calc.question,
      },
      urlParams: { taskId: experitId.value },
    })
    .then((res: any) => {
      message.success(res.msg);
      weightVisible.value = false;
    });
}

// 保存权重
function submitWeight() {
  scoreApi
    .saveWeightApi({
      param: {
        auto: weightData.value.calc.auto,
        report: weightData.value.calc.report,
        question: weightData.value.calc.question,
      },
      urlParams: { taskId: experitId.value },
    })
    .then((res: any) => {
      message.success(res.msg);
      weightVisible.value = false;
    });
}

// 一键评分
function autoReview() {
  scoreApi.autoReviewApi({ urlParams: { taskId: experitId.value } }).then((res: any) => {
    message.success(res.msg);
    getTeacherEvaluates();
  });
}
const content_id:any=ref()
// table操作
function clickFun(type: string, val: any, index: number) {
  currentRow = index;
  // if (type.indexOf("update") != -1) {
  //   isEdit.value = true;
  // } else {
  //   isEdit.value = false;
  // }
  content_id.value=val?.course_student_content_id
  // content_id.value=val?.course_content_record_id
  if (["updateScore", "score"].includes(type)) {
    setScore(type, val.course_student_content_id);
  }
  if (["updateReport", "report"].includes(type)) {
    reportReview(type, val.course_student_content_id);
    console.log(val,'hhhhhhh')
    reportType.value=val?.report?.template_type
  }
  if (["updateCode", "code"].includes(type)) {
    codeVisible.value = true;
  }
  if (type == "video") {
    scoreRefer(val.course_student_content_id);
  }
}

// 评分成绩
async function setScore(type: string, studyId: number) {
  await getScore(type, studyId);
  currentStudyId = studyId;
  scoreVisible.value = true;
}

// 获取评分成绩
async function getScore(type: string, studyId: number) {
  if (type == "score") {
    isEdit.value = false;
    scoreData.value={}
  } else {
    isEdit.value = true;
    await scoreApi.getScoreApi({ urlParams: { id: studyId } }).then((res: any) => {
      scoreData.value = res.data;
    });
  }
}

// 提交成绩评分
function submitScore() {
  if (scoreData.value.score > 100) {
    message.warn("分数不能大于100");
    return;
  }
  scoreApi
    .setScoreApi({ urlParams: { id: currentStudyId }, param: scoreData.value })
    .then((res: any) => {
      (tabelData as any).value[currentRow].final_score = res.data.score;
      scoreVisible.value = false;
      scoreData.value.score=''
    });
}

// 导出成绩
function exportScore() {
  let aLink=document.createElement('a')
  aLink.href="/api/operate/teacherExports/export?ids=&id="+experitId.value
  aLink.download=""
  aLink.click()
}

// 操作报告评阅
async function reportReview(type: string, studyId: number) {
  if (type == "report") {
    isEdit.value = false;
  } else {
    isEdit.value = true;
  }
  const res: any = await getReportOrVideo(studyId, "report");
  reportData.value = res;
  reportVisible.value = true;
}

// 评分参考
async function scoreRefer(studyId: number) {
  const res: any = await getReportOrVideo(studyId, "video");
  videoUrl.value = res;
  videoVisible.value = true;
}
// 获取报告、视频
async function getReportOrVideo(studyId: number, type: "video" | "report") {
  return await scoreApi
    .getCourseExperimentReportVideoApi({ param: { id: studyId, type: type } })
    .then((res: any) => {
      return res.data;
    });
}

// 提交报告评阅
function submitReport() {
  const body = new FormData();
  // body.append("csc_id", experitId.value);
  body.append("csc_id",content_id.value);
  body.append("score", reportData.value.score);
  scoreApi.setReportScoreApi({ param: body }).then((res: any) => {
    (tabelData as any).value[currentRow].report_score = res.data.score;
    reportVisible.value = false;
  });
}
// 选择tree章节
function selectExperiment(val: any) {
  if (!experitId.value||experitId.value!=val.id) {
    experitId.value = val.id;
    getTeacherEvaluates();
  }
}

// 更新table 表头
function updateTableHeader(val: any[]) {
  const temp = cloneDeep(oldColumns);
  // 当是视频文档类实验时，去掉列 代码、评分参考// 0 实操 1 视频文档 2 习题
  if (!val.includes("report")) {
    let i = temp[5].children.findIndex((item: any) => {
      return item.dataIndex == "report_score";
    });
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("question")) {
    let i = temp[5].children.findIndex((item: any) => {
      return item.dataIndex == "question_score";
    });
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("auto")) {
    let i = temp[5].children.findIndex((item: any) => {
      return item.dataIndex == "auto_score";
    });
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("video")) {
    let i = temp.findIndex((item: any) => {
      return item.dataIndex == "reference";
    });
    temp.splice(i, 1);
  }
  // if (type.value==0) {
  //   temp[5].children.splice(3, 1);
  // }
  // if (type.value == 1) {
  //   temp[5].children.splice(2, 2);
  //   temp.splice(6, 1);
  // }
  // if (type.value == 2) {

  //   temp[5].children.splice(0,3);
  //   temp.splice(6, 1);
  // }
  columns.value = temp;
}
onMounted(() => {

});
</script>

<style lang="less" scoped>
.correct-wrap {
  display: flex;
  height: 767px;
  width: var(--center-width);
  margin: 0 auto;
  .c-d-left {
    padding-top: 24px;
    width: 300px;
    margin-right: 16px;
    height: 100%;
    background: white;
    :deep(.chapterList) {
      .title {
        padding: 0 24px;
      }
      .list {
        .itemTit {
          padding: 0 26px;
        }
      }
    }
  }
  .left,
  .right {
    background: white;
  }
  .left {
    // width: 300px;
    // margin-right: 16px;
    // height: 100%;
  }
  .correct-right {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }
  .right {
    flex: 1;
    padding: 26px 24px;
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  i {
    font-style: normal;
  }
  .t-left {
    .surplus {
      color: var(--primary-color);
      font-size: var(--font-size-18);
    }
    > span {
      &:nth-child(1) {
        margin-right: 28px;
      }
    }
  }
  .t-right {
    // .iconfont {
    //   margin-left: 20px;
    // }
    button {
      margin-left: 10px;
    }
  }
  .c-table {
    margin-top: 24px;
    :deep(.ant-pagination-item) {
      border: none;
    }
  }
  .page-wrap {
    margin-top: auto;
  }
  .correct-table {
    :deep(.ant-table-thead > tr > th),
    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
    }
    .statistics {
      font-size: 12px;
      color: var(--black-45);
      margin-left: 2px;
    }
  }
  .a-link-btn {
    color: var(--primary-color);
  }
  .edit-btn {
    margin-left: 4px;
    color: var(--brightBtn);
    cursor: pointer;
  }
  button.auto-preview-btn {
    padding: 0 !important;
    .preview-btn {
      padding: 0 10px 0 27px;
      background: var(--primary-6);
      height: 100%;
      line-height: 33.99px;
      border-top-left-radius: 17px;
      border-bottom-left-radius: 17px;
      display: inline-block;
      &:hover {
        background: var(--primary-5);
      }
    }
    .setting-btn {
      padding: 0 27px 0 10px;
      background: var(--primary-6);
      line-height: 33.99px;
      border-top-right-radius: 17px;
      border-bottom-right-radius: 17px;
      height: 100%;
      display: inline-block;
      &:hover {
        background: var(--primary-5);
      }
    }
  }
}
.no-link{
  cursor:not-allowed;
  color:var(--black-45);
}
</style>
