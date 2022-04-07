<template>
  <div class="correct-wrap">
    <div class="left">
      <chapterTree @selectExperiment="selectExperiment">
       
      </chapterTree>
    </div>
    <div class="correct-right right">
      <div class="top">
        <div class="t-left">
          <span>提交情况：<i class="surplus">10</i>/100</span>
          <span> 评阅情况：<i class="surplus">10</i>/100 </span>
        </div>
        <div class="t-right">
          <a-button type="primary" size="" @click="autoWeight"
            >一键评阅<i class="icon-yidong iconfont"></i
          ></a-button>
          <a-button type="primary" size="">导出成绩</a-button>
        </div>
      </div>
      <div class="c-table">
        <a-table
          class="correct-table"
          :columns="columns"
          bordered
          :data-source="tabelData"
          row-key="id"
          :pagination="false"
        >
          <template #customReportTitle> 报告<i class="statistics">40%</i> </template>
          <template #customQuizTitle> 随测<i class="statistics">40%</i> </template>
          <template #customCodeTitle> 代码<i class="statistics">40%</i> </template>
          <template #customExercisesTitle> 习题 </template>
          <template #reference="{ text }">
            <span class="table-a-link" @click="clickFun('video', text)">录屏</span>
          </template>
          <template #report="{ text, record }">
            <template v-if="record.isReport">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateReport', text)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span class="table-a-link" @click="clickFun('report', text)">评阅</span>
            </template>
          </template>
          <template #code="{ text, record }">
            <template v-if="record.isReport">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateCode', text)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span class="table-a-link" @click="clickFun('code', text)">评阅</span>
            </template>
          </template>
          <template #score="{ text, record }">
            <template v-if="record.isScore">
              <span
                >{{ text
                }}<i
                  @click="clickFun('updateScore', text)"
                  class="edit-btn iconfont icon-bianji1"
                ></i
              ></span>
            </template>
            <template v-else>
              <span class="table-a-link" @click="clickFun('score', text)">评分</span>
            </template>
          </template>
        </a-table>
      </div>
      <a-pagination :total="500" class="page-wrap">
        <template #itemRender="{ page, type, originalElement }">
          <a v-if="type === 'prev'">上一页</a>
          <a v-else-if="type === 'next'">下一页</a>
          <renderVNode v-else :vnode="originalElement"></renderVNode>
        </template>
      </a-pagination>
    </div>
  </div>
  <reviewWeight
    v-if="weightVisible"
    v-model:weightVisible="weightVisible"
    :type="type"
  ></reviewWeight>
  <ratingScores
    :isEdit="isEdit"
    v-if="scoreVisible"
    v-model:visible="scoreVisible"
    v-model:data="rowData"
  ></ratingScores>
  <reportModal
    :isEdit="isEdit"
    v-if="reportVisible"
    v-model:visible="reportVisible"
    v-model:data="rowData"
  ></reportModal>
  <codeReview
    v-if="codeVisible"
    v-model:visible="codeVisible"
    v-model:data="rowData"
  ></codeReview>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref } from "vue";
import reviewWeight from "./reviewWeight.vue"; // 一键评阅弹窗
import ratingScores from "./ratingScores.vue"; // 评分弹窗
import reportModal from "./report.vue"; // 批阅报告弹框
import codeReview from "./codeReview.vue"; // 代码评阅
import {cloneDeep} from "lodash"
import chapterTree from "../Chapter/ChapterList.vue"

let type = ref(0); // 0 实操 1 视频文档 2 习题

// 控制弹窗显示隐藏visible
const weightVisible = ref(false);
const scoreVisible = ref(false);
const reportVisible = ref(false);
const codeVisible = ref(false);

// 是否是编辑状态
const isEdit = ref(false);
// 当前行数据
const rowData = ref({});
// table头信息
const oldColumns:any[]= [
  {
    title: "序号",
    width: 49,
    algin: "center",
    customRender: ({ text, record, index }: any) => {
      return index + 1;
    },
  },
  {
    title: "学号",
    dataIndex: "schoolCode",
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 65,
  },
  {
    title: "班级",
    dataIndex: "className",
  },
  {
    title: "花费时间",
    dataIndex: "expenditure",
  },
  {
    title: "评分项",
    children: [
      {
        dataIndex: "report",
        slots: { title: "customReportTitle", customRender: "report" },
        width: 74,
      },
      {
        dataIndex: "quiz",
        slots: { title: "customQuizTitle", customRender: "quiz" },
        width: 74,
      },
      {
        dataIndex: "code",
        slots: { title: "customCodeTitle", customRender: "code" },
        width: 74,
      },
      {
        dataIndex: "exercises",
        slots: { title: "customExercisesTitle", customRender: "exercises" },
        width: 74,
      },
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
    dataIndex: "score",
    width: 65,
    slots: { customRender: "score" },
  },
];
const  columns:Ref<any>=ref([])
console.log(type);

// table数据
const tabelData = ref([
  {
    id: 1,
    schoolCode: "code1",
    name: "文和",
    className: "wenhe2班",
    expenditure: "120分钟",
    report: 10,
    quiz: 10,
    code: 10,
    reference: 10,
    score: 100,
    isReport: true,
    isQuiz: true,
    isCode: true,
    isScore: true,
    exercises: 100,
  },
  {
    id: 2,
    schoolCode: "code1",
    name: "文和",
    className: "wenhe2班",
    expenditure: "120分钟",
    report: 10,
    quiz: 10,
    code: 10,
    reference: 10,
    score: 100,
    isReport: false,
    isQuiz: false,
    isCode: false,
    isScore: false,
    exercises: 99,
  },
]);

// 分页渲染dom
function renderVNode(_: any, { attrs: { vnode } }: any) {
  return vnode;
}
// 打开一键评阅modal
function autoWeight() {
  weightVisible.value = true;
}

// table操作
function clickFun(type: string, val: number) {
  console.log(val);
  if (type.indexOf("update") != -1) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
  if (["updateScore", "score"].includes(type)) {
    scoreVisible.value = true;
  }
  if (["updateReport", "report"].includes(type)) {
    reportVisible.value = true;
  }
  if (["updateCode", "code"].includes(type)) {
    codeVisible.value = true;
  }
}

// 选择tree章节
function selectExperiment(val:any) {
  console.log(val);
  
}
function select(type1: string) {
  console.log(type1);
  if (type1=='sc') {
    type.value=0
  }else if (type1=='wd') {
    type.value=1
  }else{
    type.value=2
  }
  updateTableHeader()
}

// 更新table 表头
function updateTableHeader() {
  const temp=cloneDeep(oldColumns)
  // 当是视频文档类实验时，去掉列 代码、评分参考// 0 实操 1 视频文档 2 习题

  if (type.value==0) {
    temp[5].children.splice(3, 1);
  }
  if (type.value == 1) {
    temp[5].children.splice(2, 2);
    temp.splice(6, 1);
  }
  if (type.value == 2) {
    
    temp[5].children.splice(0,3);
    temp.splice(6, 1);
  }
  columns.value=temp
}
onMounted(() => {
  updateTableHeader()
});
</script>

<style lang="less" scoped>
.correct-wrap {
  display: flex;
  height: 767px;
  width: var(--center-width);
  margin: 0 auto;
  .left,
  .right {
    background: white;
  }
  .left {
    width: 300px;
    margin-right: 16px;
    height: 100%;
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
    .iconfont {
      margin-left: 20px;
    }
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
}
</style>
