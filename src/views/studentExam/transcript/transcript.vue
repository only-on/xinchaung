<template>
  <examLayout>
    <template v-slot>
      <div class="exam-transcript-content">
        <top class="transcript-top" :data="transcriptDetailData"></top>
        <div class="frist-box">
          <div class="score-detail-echarts">
            <p class="echarts-title">成绩详情</p>
            <div id="scoreDetail" class="score-detail"></div>
          </div>
          <div class="accuracy-echarts">
            <p class="echarts-title">正确率</p>
            <div id="accuracy" class="accuracy"></div>
          </div>
        </div>
        <div class="second-box">
          <p class="echarts-title">答题详情</p>
          <div class="answer-detail-box scrollbar">
            <ul class="answer-order-list">
              <li
                class="answer-order-item"
                v-for="(item, index) in transcriptDetailData.questions"
                :key="Number(index)"
                :class="
                  item.student_answer.length === 0
                    ? 'greay'
                    : item.answer_is_right === 1
                    ? 'truth'
                    : 'pink'
                "
                @click="selectQuestion(item, Number(index))"
              >
                {{ Number(index) + 1 }}
              </li>
            </ul>
            <div class="legend">
              <span><i class="legend-icon bg-truth"></i>正确题</span>
              <span><i class="legend-icon bg-pink"></i>错误题</span>
              <span><i class="legend-icon bg-greay"></i>空答案</span>
            </div>
            <div>
              <judge
                v-if="currentSelectQuestion?.type_id === 3"
                :data="currentSelectQuestion"
                :index="currentIndex"
              ></judge>
              <gap-filling
                v-if="currentSelectQuestion?.type_id === 4"
                :data="currentSelectQuestion"
                :index="currentIndex"
              ></gap-filling>
              <multiple-choice
                v-if="currentSelectQuestion?.type_id === 2"
                :data="currentSelectQuestion"
                :index="currentIndex"
              ></multiple-choice>
              <single-choice
                v-if="currentSelectQuestion?.type_id === 1"
                :data="currentSelectQuestion"
                :index="currentIndex"
              ></single-choice>
              <short-answer-question
                v-if="currentSelectQuestion?.type_id === 5"
                :data="currentSelectQuestion"
                :index="currentIndex"
              ></short-answer-question>
            </div>
          </div>
        </div>
      </div>
    </template>
  </examLayout>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  ref,
  reactive,
  toRefs,
  Ref,
} from "vue";
import top from "./top.vue";
import examLayout from "../examLayout.vue";
import { scoreDetailEcharts, accuracyEcharts } from "./echartsCanvas";
import gapFilling from "./gapFilling/gapFilling.vue";
import judge from "./judge/judge.vue";
import multipleChoice from "./multipleChoice/multipleChoice.vue";
import singleChoice from "./singleChoice/singleChoice.vue";
import shortAnswerQuestion from "./shortAnswerQuestion/shortAnswerQuestion.vue";
import { studentExamResult } from "../studentExam.model";
import { IExamResult, IDetailData, IQuestions } from "../studentExam.type";
import storage from "src/utils/extStorage";
import { useRoute } from "vue-router";

type TReactiveData = {
  transcriptDetailData: IDetailData | any;
};
export default defineComponent({
  components: {
    top,
    examLayout,
    judge,
    "gap-filling": gapFilling,
    "multiple-choice": multipleChoice,
    "single-choice": singleChoice,
    "short-answer-question": shortAnswerQuestion,
  },
  setup() {
    const route = useRoute();
    const uid = storage.lStorage.get("uid") || storage.lStorage.get("user_id");
    const paper_id: any = route.query?.exam_id;

    const currentSelectQuestion: Ref<IQuestions | undefined> = ref(); // 当前选择的题
    const currentIndex = ref(0);
    const reactiveData: TReactiveData = reactive({
      transcriptDetailData: {},
    });
    const params: IExamResult = {
      student_id: uid,
      paper_id: paper_id,
    };
    function selectQuestion(val: any, index: number) {
      currentSelectQuestion.value = val;
      currentIndex.value = index;
    }
    onMounted(async () => {
      await init();
      const scoreDetail = scoreDetailEcharts(
        document.getElementById("scoreDetail") as HTMLDivElement,
        reactiveData.transcriptDetailData.score_result
      );
      const accuracy = accuracyEcharts(
        document.getElementById("accuracy") as HTMLDivElement,
        reactiveData.transcriptDetailData.correct_rate
      );
      window.onresize = function () {
        scoreDetail.resize();
        accuracy.resize();
      };
      currentSelectQuestion.value =
        reactiveData.transcriptDetailData.questions[0];
    });
    function init() {
      return new Promise((resolve: any, reject: any) => {
        studentExamResult(params)
          .then((res) => {
            reactiveData.transcriptDetailData = res?.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    return {
      currentSelectQuestion,
      selectQuestion,
      currentIndex,
      ...toRefs(reactiveData),
    };
  },
});
</script>

<style lang="less">
.exam-transcript-content {
  width: 100%;
  height: 100%;
  padding: 0px 80px;
  box-sizing: border-box;
  background: #e6e4ff;
  display: flex;
  flex-direction: column;
  .frist-box {
    height: 300px;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 20px;
    > .score-detail-echarts {
      display: flex;
      flex-direction: column;
      width: 50%;
      #scoreDetail {
        height: 100%;
        overflow: hidden;
      }
    }
    > .accuracy-echarts {
      display: flex;
      flex-direction: column;
      width: 50%;
      #accuracy {
        height: 100%;
      }
    }
  }
  .second-box {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    height: 38%;
    .answer-detail-box {
      height: 100%;
      overflow: auto;
      .answer-order-list {
        display: flex;
        flex-wrap: wrap;
        > .answer-order-item {
          width: 66px;
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #fff;
          text-align: center;
          border: none;
          border-radius: 10px;
          display: block;
          margin-right: 20px;
          margin-bottom: 9px;
          cursor: pointer;
          background: #c3cbd9;
          &.truth {
            background: @theme-color;
          }
          &.pink {
            background: rgba(251, 118, 122, 1);
          }
          &.greay {
            background: rgba(195, 203, 217, 1);
          }
        }
      }
      > .legend {
        font-size: 12px;
        color: #6c6e72;
        margin-right: 5%;
        text-align: right;
        float: right;
        .legend-icon {
          width: 30px;
          height: 10px;
          border-radius: 8px;
          display: inline-block;
          margin-left: 12px;
          &.bg-truth {
            background: @theme-color;
          }
          &.bg-pink {
            background: rgba(251, 118, 122, 1);
          }
          &.bg-greay {
            background: rgba(195, 203, 217, 1);
          }
        }
      }
    }
  }
  .second-box,
  .frist-box {
    flex-shrink: 0;
    .echarts-title {
      color: rgba(108, 110, 114, 1);
      border-left: 4px solid rgba(108, 110, 114, 1);
      text-indent: 10px;
      font-size: 15px;
      margin-bottom: 20px;
      flex-shrink: 0;
      &::after {
        content: "";
        width: 98%;
        height: 1px;
        margin-top: 4px;
        background-color: rgba(207, 213, 223, 1);
        display: block;
        transform: translate(-5px, 10px);
      }
    }
  }
}

</style>
