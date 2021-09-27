<template>
  <div class="class-practice-box scrollbar">
    <div v-if="data.length===0"><empty></empty></div>
    <div v-else v-for="(item, index) in data" :key="index" class="test-paper-item">
      <h2 class="test-paper-title">{{ item?.name }}</h2>
      <div class="test-paper-count">
        <span class="question-count"
          >共<i>{{ item?.questions_count }}</i
          >题</span
        >
        <span class="question-score"
          >满分<i>{{ item?.score_total }}</i
          >分</span
        >
        <span class="open-close-btn" @click="openOrClose(index, item?.id)"
          >{{ openIndexs.includes(index) ? "收起" : "展开"
          }}<i
            class="iconfont"
            :class="openIndexs.includes(index) ? 'icon-shouqi' : 'icon-zhankai'"
          ></i
        ></span>
      </div>
      <div
        class="test-paper-question-box"
        :style="{ height: openIndexs.includes(index) ? '100%' : '0' }"
        :class="item.is_submited ? 'is-submit' : ''"
      >
        <test-paper
          v-if="openIndexs.includes(index)"
          v-model="questions[index]"
          :isShowAnswer="item.is_submited"
        ></test-paper>
        <div :class="item.is_submited ? 'hide' : ''">
          <a-button type="primary" @click="submitAnswer(index)">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  toRefs,
  onMounted,
  toRef,
} from "vue";
import testPaper from "./testPaper.vue";
import request from "src/request/getRequest";
import { useRoute } from "vue-router";
import empty from "src/components/Empty.vue"

interface TreactiveData {
  data: any[];
  questions: any;
}
export default defineComponent({
  components: {
    "test-paper": testPaper,
    empty
  },
  setup() {
    const examApi = request.studentExam;
    let route = useRoute();
    let course_id = JSON.parse(route.query.routerQuery as any).course_id;
    const paper = [
      {
        paperName: "测试试卷1",
        count: 5,
        score: 70,
        question: [
          {
            name: "判断题",
            type: 1,
            options: [
              {
                id: 1,
                option: "正确",
              },
              {
                id: 2,
                option: "错误",
              },
            ],
            answers: [
              {
                id: 2,
                answer: "正确",
              },
            ],
          },
          {
            name: "单选题名称",
            type: 2,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的2",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧2",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢2",
              },
              {
                id: 4,
                option: "D:改变别人之前，先改变自己吧2",
              },
            ],
            answers: [
              {
                id: 3,
                answer: "正确",
              },
            ],
          },
          {
            name: "多选题名称",
            type: 3,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 4,
                answer: "改变别人之前，先改变自己吧",
              },
              {
                id: 1,
                answer: "A:好设计是诚实的",
              },
            ],
          },
        ],
      },
      {
        paperName: "测试试卷2",
        count: 51,
        score: 122,
        question: [
          {
            name: "判断题",
            type: 1,
            options: [
              {
                id: 1,
                option: "正确",
              },
              {
                id: 2,
                option: "错误",
              },
            ],
            answers: [
              {
                id: 2,
                answer: "正确",
              },
            ],
          },
          {
            name: "单选题名称",
            type: 2,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "D:改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 3,
                answer: "正确",
              },
            ],
          },
          {
            name: "多选题名称",
            type: 3,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 4,
                answer: "改变别人之前，先改变自己吧",
              },
              {
                id: 1,
                answer: "A:好设计是诚实的",
              },
            ],
          },
        ],
      },
      {
        paperName: "测试试卷3",
        count: 12,
        score: 170,
        question: [
          {
            name: "判断题",
            type: 1,
            options: [
              {
                id: 1,
                option: "正确",
              },
              {
                id: 2,
                option: "错误",
              },
            ],
            answers: [
              {
                id: 2,
                answer: "正确",
              },
            ],
          },
          {
            name: "单选题名称",
            type: 2,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "D:改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 3,
                answer: "正确",
              },
            ],
          },
          {
            name: "多选题名称",
            type: 3,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 4,
                answer: "改变别人之前，先改变自己吧",
              },
              {
                id: 1,
                answer: "A:好设计是诚实的",
              },
            ],
          },
        ],
      },
      {
        paperName: "测试试卷4",
        count: 12,
        score: 170,
        question: [
          {
            name: "判断题",
            type: 1,
            options: [
              {
                id: 1,
                option: "正确",
              },
              {
                id: 2,
                option: "错误",
              },
            ],
            answers: [
              {
                id: 2,
                answer: "正确",
              },
            ],
          },
          {
            name: "单选题名称",
            type: 2,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "D:改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 3,
                answer: "正确",
              },
            ],
          },
          {
            name: "多选题名称",
            type: 3,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
              },
            ],
            answers: [
              {
                id: 4,
                answer: "改变别人之前，先改变自己吧",
              },
              {
                id: 1,
                answer: "A:好设计是诚实的",
              },
            ],
          },
          {
            name: "填空题名称",
            type: 4,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
                score: 10,
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
                score: 21,
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
                score: 31,
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
                score: 41,
              },
            ],
            answers: [
              {
                id: 4,
                answer: "改变别人之前，先改变自己吧",
              },
              {
                id: 1,
                answer: "A:好设计是诚实的",
              },
            ],
          },
        ],
      },
    ];
    const reactiveData: TreactiveData = reactive({
      data: paper,
      questions: {},
    });

    const openIndexs: Array<number> = reactive([]);
    let paperParams = {
      type: "test",
      course_id: course_id,
      limit: 100,
      page: 1,
    };

    let answerState: any[] = [];
    onMounted(() => {
      getStudentExamPaper();
    });
    // 获取试卷列表
    function getStudentExamPaper() {
      examApi.getExamListApi({ param: paperParams }).then((res: any) => {
        console.log(res);
        reactiveData.data = res.data.list;
      });
    }
    // 获取习题列表
    function getQuestionsList(entity_id: number) {
      let params = {
        entity_id: entity_id,
        entity_type: "test",
      };
      return new Promise((resolve: any, reject: any) => {
        examApi
          .getQuestionsListApi({
            param: { include: "answers" },
            urlParams: params,
          })
          .then((res) => {
            console.log(res);
            resolve(res?.data);
          })
          .catch((err) => {
            reject(err);
          })
          .catch();
      });
    }
    async function openOrClose(i: number, id: number) {
      if (openIndexs.includes(i)) {
        openIndexs.splice(openIndexs.indexOf(i), 1);
      } else {
        reactiveData.questions[i] = await getQuestionsList(id);
        getExperimentStatus(id).then((res: any) => {
          console.log(res);
          answerState[i] = res;
          console.log(answerState);
        });
        openIndexs.push(i);
        console.log(reactiveData.questions);
      }
    }
    watch(reactiveData.data, () => {
      console.log(reactiveData.data);
    });

    // 提交答案
    function submitAnswer(index: number) {
      console.log(reactiveData.questions[index]);
      let params: any = {
        answer: [],
      };
      for (let i = 0; i < reactiveData.questions[index].length; i++) {
        let answer = {
          relation_id: reactiveData.questions[index][i].relation_id,
          answers: reactiveData.questions[index][i].student_answer,
        };
        params.answer.push(answer);
      }
      console.log(params);

      examApi.submitAnswerApi({ param: params }).then((res: any) => {
        console.log(res);
      });
    }

    function getExperimentStatus(entity_id: number) {
      return new Promise((resolve: any, reject: any) => {
        let params = {
          entity_id: entity_id,
          entity_type: "test",
        };
        examApi
          .getExperimentStatusApi({ urlParams: params })
          .then((res: any) => {
            if (res.data && res.data.has_submit_answer) {
              resolve(res.data.has_submit_answer);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    return {
      ...toRefs(reactiveData),
      openIndexs,
      openOrClose,
      submitAnswer,
      answerState,
    };
  },
});
</script>

<style lang="less">
.class-practice-box {
  height: calc(100% - 30px);
  padding: 8px;
  margin-right: 8px;
  overflow: auto;
  box-sizing: content-box;
  white-space: normal;

  .test-paper-item {
    background: linear-gradient(270deg, #ecf0ff 0%, #fdf5ff);
    margin-bottom: 12px;
    padding: 0 15px;
    &.is-submit {
      pointer-events: none;
    }
    .test-paper-title {
      font-size: 16px;
    }
    .test-paper-count {
      margin-right: 15px;
      //   padding-bottom: 12px;
      border-bottom: 1px dashed rgba(187, 156, 214, 0.24);
      //   margin-bottom: 12px;
      display: flex;
      flex-direction: row;
      > span {
        font-size: 12px;
        color: rgba(5, 1, 1, 0.45);
        > i {
          font-style: normal;
          margin: 0 5px;
        }
        &.question-score {
          margin-left: 24px;
        }
        &.open-close-btn {
          margin-left: auto;
          font-size: 14px;
          color: @theme-color;
          cursor: pointer;
        }
      }
    }
    .test-paper-question-box {
      overflow: hidden;
      box-sizing: border-box;
      &.is-submit {
        pointer-events: none;
      }
      .test-paper-question-list {
        margin-top: 12px;
      }
    }
  }
  .hide {
    display: none;
  }
  .forbidden {
    pointer-events: none;
  }
}
</style>

