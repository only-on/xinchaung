<template>
  <div class="correct-wrap">
    <div class="c-d-left">
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
          <template #customReportTitle> 报告</template>
          <template #customQuizTitle> 随测</template>
          <template #customAutoTitle> 自动评分</template>
          <template #customExercisesTitle> 习题 </template>
          <template #reference="{ text }">
            <span class="table-a-link" @click="clickFun('video', text)">录屏</span>
          </template>
          <template #report="{ text, record }">
            <template v-if="record.report_score!=null">
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
          <template #question="{ text, record }">
            <template v-if="record.question_score!=null">
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
          <template #autoScore="{ text, record }">
            <template v-if="record.auto_score!=null">
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
      <a-pagination :total="total" v-model:current="params.page" v-model:pageSize="params.limit" class="page-wrap" @change="pageChange">
        <!-- <template #itemRender="{ page, type, originalElement }">
          <a v-if="type === 'prev'">上一页</a>
          <a v-else-if="type === 'next'">下一页</a>
          <renderVNode v-else :vnode="originalElement"></renderVNode>
        </template> -->
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
import request from "src/api/index"


const scoreApi=request.teachCourse
let type = ref(0); // 0 实操 1 视频文档 2 习题

// 控制弹窗显示隐藏visible
const weightVisible = ref(false);
const scoreVisible = ref(false);
const reportVisible = ref(false);
const codeVisible = ref(false);

// 查看列表参数
const params=ref({
  taskId:501770,
  limit:10,
  page:1
})

const total:Ref<number>=ref(0)
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
    dataIndex: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 65,
  },
  {
    title: "班级",
    dataIndex: "classname",
  },
  {
    title: "花费时间",
    dataIndex: "used_time",
  },
  {
    title: "评分项",
    children: [
      {
        dataIndex: "report_score",
        slots: { title: "customReportTitle", customRender: "report" },
        width: 74,
      },
      {
        dataIndex: "question_score",
        slots: { title: "customQuizTitle", customRender: "question" },
        width: 74,
      },
      {
        dataIndex: "auto_score",
        slots: { title: "customAutoTitle", customRender: "autoScore" },
        width: 74,
      },
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
    dataIndex: "score",
    width: 65,
    slots: { customRender: "score" },
  },
];
const  columns:Ref<any>=ref([])
console.log(type);

// table数据
const tabelData = ref([]);

// 获取数据
function getTeacherEvaluates() {
  scoreApi.getTeacherEvaluatesApi({param:params.value}).then((res:any)=>{
    console.log(res);
    tabelData.value=res.data.list
    total.value=res.data.page.totalCount
    updateTableHeader(res.data.show)
  })
}

// 分页发生变化
function pageChange(page:number,pageSize:number){
  console.log(page,pageSize);
  getTeacherEvaluates()
}
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

// 更新table 表头
function updateTableHeader(val:any[]) {
  const temp=cloneDeep(oldColumns)
  // 当是视频文档类实验时，去掉列 代码、评分参考// 0 实操 1 视频文档 2 习题
  console.log(val);
  console.log(temp);
  
  console.log(temp[5].children);
  if (!val.includes('report')) {
    
    let i =temp[5].children.findIndex((item:any)=>{
      return item.dataIndex=="report_score"
    })
    console.log(i);
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("question")) {
    console.log(temp[5].children);
    let i =temp[5].children.findIndex((item:any)=>{
      return item.dataIndex=="question_score"
    })
    console.log(i);
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("auto")) {
    console.log(temp[5].children);
    let i =temp[5].children.findIndex((item:any)=>{
      return item.dataIndex=="auto_score"
    })
    console.log(i);
    temp[5].children.splice(i, 1);
  }
  if (!val.includes("video")) {
    let i =temp.findIndex((item:any)=>{
      return item.dataIndex=="reference"
    })
    console.log(i);
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
  columns.value=temp
}
onMounted(() => {
  
  getTeacherEvaluates()
});
</script>

<style lang="less" scoped>
.correct-wrap {
  display: flex;
  height: 767px;
  width: var(--center-width);
  margin: 0 auto;
.c-d-left{
  padding-top: 24px;
  width: 300px;
  margin-right: 16px;
  height: 100%;
  background: white;
  :deep(.chapterList){
    .title{
      padding: 0 24px;
    }
    .list{
      .itemTit{
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
