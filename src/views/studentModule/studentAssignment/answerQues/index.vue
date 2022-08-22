<template>
  <div class="answerQues">
    <div class="answerQuesCom">
      <div class="list">
        <Outline
          :title="headerObj.title"
          :explain="headerObj.explain"
          :explainText="headerObj.explainText"
        />
        <TopicDisplay 
        :list="questionsList" 
        :purpose="purpose === 'IsStuAnswer' ? 'IsStuAnswer' : 'achievement'" 
        :loading="listLoading" />
      </div>
      <div v-if="purpose === 'IsStuAnswer'" class="answer_list">
        <submit-answer
          :showCountDown="name === '考试' ? true : false"
          :dataList="questionsList"
        ></submit-answer>
      </div>
      <div v-else>
        <score-ranking></score-ranking>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import answerQuesCom from "../answerQuesCom/index.vue";
import TopicDisplay from "src/components/TopicDisplay/index.vue";
import Outline from "src/components/TopicDisplay/outline.vue";
import scoreRanking from "src/components/scoreRanking/index.vue";
import submitAnswer from "src/components/submitAnswer/index.vue";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teacherExamination;
const route = useRoute();
const router = useRouter();
const { id,purpose,name } = route.query;
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name:
       purpose == "achievement"
          ? "查看成绩"
          : route.query.name == "作业"
          ? "作业答题"
          : "开始考试",
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const typeNames = ["单选题", "判断题", "填空题", "解答题", "编程题", "模型题"];
const deadline = Date.now() + 1000 * 60 * 60 * 2 + 1000 * 30;
const headerObj: any = reactive({
  title: "",
  explain: "考试说明",
  explainText:"",
});
const dataList: any = reactive({
  title:
    "单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码",
  list: [
    {
      type: 1,
      quesList: [
        {
          ques: "在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。",
          quesAnswer: [
            "旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合。",
            "新版图标采取断点式风格，在转角处做圆润倒角处理",
            "与主站首页风格保持统一的前提下也延续了频道的整体调性。",
            "configurations.xh",
          ],
        },
        {
          ques: "22222在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。",
          quesAnswer: [
            "22旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合。",
            "22新版图标采取断点式风格，在转角处做圆润倒角处理",
            "22与主站首页风格保持统一的前提下也延续了频道的整体调性。",
            "222configurations.xh",
          ],
        },
      ],
    },
    {
      type: 2,
      quesList: [
        {
          ques: "判断在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。",
        },
      ],
    },
    {
      type: 3,
      quesList: [
        {
          ques: "解答判断在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。",
          quesAnswer: ["q1", "222"],
        },
      ],
    },
    {
      type: 4,
      quesList: [
        {
          ques: "解答判断在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。",
          quesAnswer: ["q1", "222"],
        },
      ],
    },
    {
      type: 5,
      quesList: [
        {
          ques: "任务描述本关任务：编写一个筛选出列表中的奇数的程序。任务要求：1、从键盘输入（以空格分隔）包含若干个元素（数量不固定）的数值列表，筛选出列表中的奇数存入新的列表，并输出结果。编程要求根据提示，在代码文件中Begin-End区间补充代码1、从键盘输入（以空格分隔）包含若干个元素（数量不固定）的数值列表，筛选出列表中的奇数存入新的列使其输出结果与测试说明中的结果一致，其他代码不动。2、注意：输出格式中的冒号和逗号为中文冒号和中文逗号。测试说明平台会对你编写的代码进行测试：输入数据以空格分开测试输入：536841113249预期输出：奇数列表：[5,3,11,13,9]",
        },
      ],
    },
    {
      type: 6,
      quesList: [
        {
          ques: "在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。 在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。",
          quesAnswer: ["q1", "222"],
        },
      ],
    },
  ],
});
const questionsList:any=reactive([])
var listLoading:Ref<boolean> = ref(false);
const getExamDetail = () => {
  listLoading.value=true
  http.examDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
    questionsList.length=0
    const {data}=res
    headerObj.title=data.name
    // headerObj.explain=data.note
    headerObj.explainText=data.note
    let questions_info=data.questions_info
    Object.keys(questions_info).map((v:any)=>{
      let obj={
        type:v,
        question:questions_info[v]
      }
      questionsList.push(obj)
    })
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
onMounted(()=>{
  getExamDetail()
})
</script>
<style lang="less" scoped>
.answerQues {
  // display: flex;
  .answerQuesCom {
    display: flex;
    justify-content: space-between;
    .list{
      flex: 1;
      margin-right: 12px;
    }
  }
}
</style>