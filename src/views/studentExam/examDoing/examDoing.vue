<template>
  <examLayput>
    <template v-slot>
      <div class="exam-doing-content">
        <top></top>
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
  getQuestionsListApi,
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

    const examQuestionsData = {
      code: 1,
      status: 1,
      msg: "成功",
      data: [
        {
          id: 17,
          question: "测试习题17",
          type_id: 1,
          level_id: 3,
          pool_id: 2,
          default_score: 35,
          user_id: 105,
          created_at: "2021-08-26 18:18:40",
          updated_at: "2021-08-26 18:18:40",
          relation_id: 2,
          type: {
            id: 1,
            name: "单选题",
          },
          level: {
            id: 3,
            name: "困难",
          },
          options: [
            {
              id: 10,
              option: "A",
            },
            {
              id: 11,
              option: "B",
            },
            {
              id: 12,
              option: "C",
            },
            {
              id: 13,
              option: "D",
            },
            {
              id: 14,
              option: "E",
            },
          ],
          answers: [
            {
              id: 4,
              answer: "12",
            },
          ],
          keywords: [],
        },
        {
          id: 7,
          question: "测试习题7",
          type_id: 2,
          level_id: 2,
          pool_id: 2,
          default_score: 21,
          user_id: 105,
          created_at: "2021-08-24 10:34:17",
          updated_at: "2021-08-24 10:34:20",
          relation_id: 8,
          type: {
            id: 2,
            name: "多选题",
          },
          level: {
            id: 2,
            name: "中等",
          },
          options: [
            {
              id: 18,
              option: "A",
            },
            {
              id: 19,
              option: "B",
            },
          ],
          answers: [
            {
              id: 11,
              answer: "19",
            },
          ],
          keywords: [],
        },
        {
          id: 2,
          question: "测试习题5",
          type_id: 2,
          level_id: 2,
          pool_id: 2,
          default_score: 15,
          user_id: 105,
          created_at: "2021-08-18 17:58:24",
          updated_at: "2021-08-18 17:58:24",
          relation_id: 6,
          type: {
            id: 2,
            name: "多选题",
          },
          level: {
            id: 2,
            name: "中等",
          },
          options: [
            {
              id: 1,
              option: "A",
            },
            {
              id: 2,
              option: "B",
            },
            {
              id: 3,
              option: "C",
            },
            {
              id: 4,
              option: "D",
            },
          ],
          answers: [
            {
              id: 1,
              answer: "1",
            },
            {
              id: 2,
              answer: "3",
            },
          ],
          keywords: [],
        },
        {
          id: 18,
          question: "测试习题18",
          type_id: 3,
          level_id: 3,
          pool_id: 2,
          default_score: 10,
          user_id: 105,
          created_at: "2021-08-31 16:01:42",
          updated_at: "2021-08-31 16:01:42",
          relation_id: 12,
          type: {
            id: 3,
            name: "判断题",
          },
          level: {
            id: 3,
            name: "困难",
          },
          options: [
            {
              id: 15,
              option: "正确",
            },
            {
              id: 16,
              option: "错误",
            },
          ],
          answers: [
            {
              id: 5,
              answer: "16",
            },
          ],
          keywords: [],
        },
        {
          id: 19,
          question: "测试习题19",
          type_id: 4,
          level_id: 3,
          pool_id: 2,
          default_score: 10,
          user_id: 105,
          created_at: "2021-08-31 16:06:38",
          updated_at: "2021-08-31 16:06:38",
          relation_id: 13,
          type: {
            id: 4,
            name: "填空题",
          },
          level: {
            id: 3,
            name: "困难",
          },
          options: [],
          answers: [
            {
              id: 6,
              answer: "填空答案1",
            },
            {
              id: 7,
              answer: "填空答案2",
            },
            {
              id: 8,
              answer: "填空答案3",
            },
            {
              id: 9,
              answer: "填空答案4",
            },
            {
              id: 10,
              answer: "填空答案5",
            },
          ],
          keywords: [],
        },
        {
          id: 20,
          question: "测试习题20",
          type_id: 5,
          level_id: 3,
          pool_id: 2,
          default_score: 30,
          user_id: 105,
          created_at: "2021-08-31 16:11:23",
          updated_at: "2021-08-31 16:11:23",
          relation_id: 14,
          type: {
            id: 5,
            name: "简答题",
          },
          level: {
            id: 3,
            name: "困难",
          },
          options: [],
          answers: [],
          keywords: [
            {
              id: 1,
              keyword: "关键词1",
            },
            {
              id: 2,
              keyword: "关键词2",
            },
            {
              id: 3,
              keyword: "关键词3",
            },
            {
              id: 4,
              keyword: "填空答案4",
            },
          ],
        },
      ],
    };

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
      await getStartExam();
      getQuestionsList();
    });
    // 获取试卷习题
    function getQuestionsList() {
      getQuestionsListApi(
        { entity_type: "paper", entity_id: reactiveData.paper_id },
        { include: "answers" }
      ).then((res:any) => {
        reactiveData.examQuestions=res?.data
      });
    }
    // 结束考试
    function finshExam() {
      let params = {
        urlParams: {
          student_id: uid,
          exam_id: exam_id,
        },
      };
      endStudentAnswer(params).then((res: any) => {
        router.push({
          path: "/studentExam",
        });
      });
    }

    // 开始考试
    function getStartExam() {
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
      background-image: url("../../../assets/exam/answer-card.png");
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
              font-size: @font-size-sm;
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