<template>
  <div class="single-echoice-box">
    <div class="question-title">
      <span class="question-index">{{ index + 1 }}、</span>
      <span class="question-name">{{ question.question_name }}</span>
      <span class="question-score">({{ question.default_score }}分)</span>
      <span
        v-if="question.question_content"
        :class="question.is_true ? 'question-green' : 'question-red'"
      >
        <span v-html="answer"></span>
      </span>
    </div>
    <a-radio-group
      class="selectItem"
      style="width: 100%; padding-right: 10px"
      name="radioGroup"
      @change="submitQuesAnswer"
      v-model:value="question.student_answer_format"
    >
      <div
        class="quesList"
        v-for="(item, i) in question.question_content"
        :key="item.id"
      >
        <a-radio class="quesList-item" :value="i.toString()">
          <span class="quesList-item">
            {{ numToAbc(i) }}、
            <span class="quesList-item-content">{{ item.value }}</span>
          </span>
        </a-radio>
      </div>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  watch,
  Ref,
  reactive,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "",
  components: {},
  props: {
    data: {
      default: {},
    },
    index: {
      default: 0,
    },
  },
  setup: (props, { emit }) => {
    const http = (request as any).studentCourse;
    const router = useRouter();
    var question: any = reactive({});
    var last_student_answer: Ref<string> = ref("");
    var index: Ref<number> = ref(0);
    watch(
      () => props,
      (val: any) => {
        //  console.log(val)
      }
    );
    Object.assign(question, props.data);
    index.value = props.index;
    last_student_answer.value = question.student_answer_format;

    var answer = computed(() => {
      let str: string = "";
      let arr: string[] = ["A", "B", "C", "D"];
      question.question_content.length
        ? question.question_content.forEach((v: any, k: string) => {
            if (v.is_ansewr === "1") {
              str += `${arr[k]}`;
            }
          })
        : "";
      return str ? `(${str})` : str;
    });
    function submitQuesAnswer() {
      let obj = {
        course_id: question.course_id,
        chapter_id: question.chapter_id,
        question: {
          question_id: question.quest_list_questions_id,
          student_answer: [...question.student_answer_format],
        },
      };
      console.log(obj);
      http.submitQuest({ param: { ...obj } }).then((res: IBusinessResp) => {
        if (res) {
          message.success("操作成功");
          last_student_answer = question.student_answer_format;
        } else {
          question.student_answer_format = last_student_answer;
        }
      });
    }
    function numToAbc(i: any) {
      let arr = ["A", "B", "C", "D", ""];
      return arr[i];
    }
    onMounted(() => {});
    return { index, answer, submitQuesAnswer, question, numToAbc };
  },
});
</script>

<style scoped lang="less">
.single-echoice-box {
  .question-title {
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    background: #f4f4f4;
    padding: 10px;
    line-height: 30px;
    .question-index {
      font-size: 14px;
    }
    .question-score {
      color: #ff9300;
      margin-left: 20px;
      font-size: 14px;
    }
    .question-green {
      margin-left: 15px;
      color: #62cb2b;
    }
    .question-red {
      margin-left: 15px;
      color: red;
    }
  }
}
</style>
