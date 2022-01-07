<template>
  <examLayput>
    <template v-slot>
      <div class="exam-doing-content">
        <top @finsh="finshExam"></top>
        <div class="exam-content-box">
          <div class="exam-content-left">
            <div>
              <single-choice
                @answerChange="answerChange"
                v-if="
                  examQuestions[currentQuestion] &&
                  examQuestions[currentQuestion].type_id === 1
                "
                v-model="examQuestions[currentQuestion]"
                :index="currentQuestion"
              ></single-choice>
              <multiple-choice
                @answerChange="answerChange"
                v-if="
                  examQuestions[currentQuestion] &&
                  examQuestions[currentQuestion].type_id === 2
                "
                v-model="examQuestions[currentQuestion]"
                :index="currentQuestion"
              ></multiple-choice>
              <judge
                @answerChange="answerChange"
                v-if="
                  examQuestions[currentQuestion] &&
                  examQuestions[currentQuestion].type_id === 3
                "
                v-model="examQuestions[currentQuestion]"
                :index="currentQuestion"
              ></judge>
              <gap-fillings
                @answerChange="answerChange"
                v-if="
                  examQuestions[currentQuestion] &&
                  examQuestions[currentQuestion].type_id === 4
                "
                v-model="examQuestions[currentQuestion]"
                :index="currentQuestion"
              ></gap-fillings>
              <short-answer-question
                @answerChange="answerChange"
                v-if="
                  examQuestions[currentQuestion] &&
                  examQuestions[currentQuestion].type_id === 5
                "
                v-model="examQuestions[currentQuestion]"
                :index="currentQuestion"
              ></short-answer-question>
            </div>
            <div class="next-last-box">
              <a-button
                v-if="currentQuestion > 0"
                type="primary"
                @click="nextOrLast('last')"
                >上一题</a-button
              >
              <a-button
                v-if="currentQuestion < examQuestions.length - 1"
                type="primary"
                @click="nextOrLast('next')"
                >下一题</a-button
              >
            </div>
          </div>
          <div class="exam-content-right">
            <div class="exam-topic-box">
              <a-radio-group
                v-model:value="currentQuestion"
                @change="questionTypeChange"
                class="question-lengle-box scrollbar"
              >
                <ul class="question-list-box">
                  <li class="question-type-box">
                    <div class="question-type-head" @click="openCard(1)">
                      <span>选择题</span><span>1/2</span>
                    </div>
                    <ul
                      class="question-type-list"
                      :style="{ height: currentOpenCard === 1 ? 'auto' : '' }"
                    >
                      <li
                        class="question-type-item"
                        v-for="(item, index) in multipleChoices"
                        :key="index"
                      >
                        <label>
                          <span>{{ index + 1 }}</span>
                          <a-radio :value="item.index"></a-radio>
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li class="question-type-box">
                    <div class="question-type-head" @click="openCard(2)">
                      <span>判断题</span><span>1/2</span>
                    </div>
                    <ul
                      class="question-type-list"
                      :style="{ height: currentOpenCard === 2 ? 'auto' : '' }"
                    >
                      <li
                        class="question-type-item"
                        v-for="(item, index) in judges"
                        :key="index"
                      >
                        <label>
                          <span>{{ index + 1 }}</span>
                          <a-radio :value="item.index"></a-radio>
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li class="question-type-box">
                    <div class="question-type-head" @click="openCard(3)">
                      <span>填空题</span><span>1/2</span>
                    </div>
                    <ul
                      class="question-type-list"
                      :style="{ height: currentOpenCard === 3 ? 'auto' : '' }"
                    >
                      <li
                        class="question-type-item"
                        v-for="(item, index) in gapFilling"
                        :key="index"
                      >
                        <label>
                          <span>{{ index + 1 }}</span>
                          <a-radio :value="item.index"></a-radio>
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li class="question-type-box">
                    <div class="question-type-head" @click="openCard(4)">
                      <span>简答题</span><span>1/2</span>
                    </div>
                    <ul
                      class="question-type-list"
                      :style="{ height: currentOpenCard === 4 ? 'auto' : '' }"
                    >
                      <li
                        class="question-type-item"
                        v-for="(item, index) in shortAnswerQuestionS"
                        :key="index"
                      >
                        <label>
                          <span>{{ index + 1 }}</span>
                          <a-radio :value="item.index"></a-radio>
                        </label>
                      </li>
                    </ul>
                  </li>
                </ul>
              </a-radio-group>
            </div>
            <div class="finish-btn">
              <a-button type="primary" class="" @click="finshExam"
                >结束考试</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </examLayput>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  provide,
  computed,
  watch,
  ref,
  Ref,
} from "vue";
import top from "./top.vue";
import { useRouter, useRoute } from "vue-router";
import examLayput from "../examLayout.vue";
import {
  startExam,
  submitAnswer,
  endStudentAnswer,
  getExamQuestionListApi,
  startedExam
} from "../studentExam.model";
import storage from "src/utils/extStorage";
import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";
import gapFillings from "src/components/exercises/gapFillings.vue";
import shortAnswerQuestion from "src/components/exercises/shortAnswerQuestion.vue";

type TreactiveData = {
  startExamInfoData: any;
  examQuestions: any;
  multipleChoices: any[];
  judges: any[];
  gapFilling: any[];
  shortAnswerQuestionS: any[];
  paper_id:number
};
export default defineComponent({
  components: {
    top,
    examLayput,
    judge,
    "single-choice": singleChoice,
    "multiple-choice": multipleChoice,
    "gap-fillings": gapFillings,
    "short-answer-question": shortAnswerQuestion,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const uid = storage.lStorage.get("uid") || storage.lStorage.get("user_id");
    const exam_id: any = route.query.exam_id ? route.query.exam_id : "";
    const reactiveData: TreactiveData = reactive({
      startExamInfoData: {},
      examQuestions: [],
      multipleChoices: [],
      judges: [],
      gapFilling: [],
      shortAnswerQuestionS: [],
      paper_id:-1
    });
    const currentQuestion = ref(0);
    const lastQuestion = ref(0);
    const currentOpenCard = ref(1);
    const isChange = ref(false);

    let {
      startExamInfoData,
      examQuestions,
      multipleChoices,
      judges,
      gapFilling,
      shortAnswerQuestionS,
    } = toRefs(reactiveData);

    watch(
      examQuestions,
      () => {
        if (!examQuestions.value.length) return;
        multipleChoices.value = [];
        judges.value = [];
        gapFilling.value = [];
        shortAnswerQuestionS.value = [];

        examQuestions.value.forEach((item: any, index: number) => {
          if (item.type_id === 2 || item.type_id === 1) {
            item.index = index;
            multipleChoices?.value.push(item);
          }
          if (item.type_id === 3) {
            item.index = index;
            judges?.value.push(item);
          }
          if (item.type_id === 4) {
            item.index = index;
            gapFilling?.value.push(item);
          }
          if (item.type_id === 5) {
            item.index = index;
            shortAnswerQuestionS?.value.push(item);
          }
        });
      },
      { deep: true }
    );

    provide("startExamInfoData", startExamInfoData);
    onMounted(async() => {
      await startExamSetting()
      await getTopExamInfo();
      getQuestionsList();
    });
    // 获取试卷习题
    function getQuestionsList() {
      getExamQuestionListApi({exam_id:exam_id}
      ).then((res:any) => {
        reactiveData.examQuestions=res?.data
      });
    }
    // 结束考试
    async function finshExam() {
      let params = {
        urlParams: {
          student_id: uid,
          exam_id: exam_id,
        },
      };
      await submitExamAnswer(currentQuestion.value);
      endStudentAnswer(params).then((res: any) => {
        router.push({
          path: "/studentExam",
        });
      });
    }

    // 开始考试
    function getTopExamInfo() {
      return new Promise((resolve: any, reject: any) => {
        startExam({
          urlParams: {
            student_id: uid,
          },
        }).then((res: any) => {
          reactiveData.startExamInfoData = res.data;
          if (reactiveData.startExamInfoData.id) {
            reactiveData.paper_id=res.data.paper_id
          }
          
          resolve();
        });
      });
    }

    function startExamSetting() {
      return new Promise((resolve: any, reject: any) => {
        startedExam({
          urlParams: {
            student_id: uid,
            exam_id:exam_id
          },
        }).then((res: any) => {
          resolve();
        });
      });
    }
    // 当前试题变化
    async function questionTypeChange(val: number) {
      if (isChange.value) {
        try {
          let res: any = await submitExamAnswer(lastQuestion.value);
          if (res.status === 1) {
            lastQuestion.value = currentQuestion.value;
            isChange.value = false;
          }
        } catch (err) {
          currentQuestion.value = lastQuestion.value;
        }
      } else {
        lastQuestion.value = currentQuestion.value;
        isChange.value = false;
      }
    }

    // 答案发生变化时
    function answerChange(val: any) {
      isChange.value = true;
    }
    function openCard(i: number) {
      currentOpenCard.value = i;
    }

    // 上一题下一题
    async function nextOrLast(type: string) {
      if (currentQuestion.value === 0 && type === "last") return;
      if (
        currentQuestion.value === examQuestions.value.length - 1 &&
        type === "next"
      )
        return;
      if (isChange.value) {
        try {
          let res: any = await submitExamAnswer(currentQuestion.value);
          if (res.status === 1) {
            type === "next" ? currentQuestion.value++ : currentQuestion.value--;
            isChange.value = false;
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        type === "next" ? currentQuestion.value++ : currentQuestion.value--;
        isChange.value = false;
      }
    }

    // 提交答案

    async function submitExamAnswer(index: number) {
      let answers: Array<number | string> = [];
      let params = {
        param: {
          relation_id: examQuestions.value[index].relation_id,
          answers: examQuestions.value[index].student_answer,
        },
        urlParams: { student_id: uid, exam_id: exam_id },
      };
      return await submitAnswer(params);
    }
    return {
      finshExam,
      provide,
      ...toRefs(reactiveData),
      questionTypeChange,
      currentQuestion,
      currentOpenCard,
      openCard,
      answerChange,
      nextOrLast,
    };
  },
});
</script>


<style lang="less">
.exam-doing-content {
  width: 100%;
  height: 100%;
  padding: 0px 80px;
  box-sizing: border-box;
  background: #e6e4ff;
  display: flex;
  flex-direction: column;
  .exam-content-box {
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 0;
    .exam-content-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 24px;
      .next-last-box {
        margin-bottom: 74px;
        > button {
          margin-right: 20px;
        }
      }
    }
    .exam-content-right {
      padding: 50px 10px 50px 0px;
      width: 460px;
      background-image: url("../../../assets/images/exam/answer-card.png");
      background-position: center 0px;
      background-repeat: no-repeat;
      background-origin: content-box;
      display: flex;
      flex-direction: column;
      .exam-topic-box {
        flex: 1;
        margin-top: 80px;
        width: 300px;
        margin-left: 83px;
        .question-lengle-box {
          width: 100%;
          height: 328px;
          overflow: auto;
          .question-type-box {
            .question-type-head {
              background: #f0f3f2;
              font-size: var(--base-font-size);
              line-height: 35px;
              padding: 0 15px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin: 10px 0;
            }
            .question-type-list {
              display: flex;
              flex-wrap: wrap;
              height: 0;
              overflow: hidden;
              .question-type-item {
                margin-left: 10px;
                > label {
                  > span {
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
      > .finish-btn {
        margin-top: auto;
        margin-bottom: 80px;
        text-align: center;
      }
    }
  }
}
</style>