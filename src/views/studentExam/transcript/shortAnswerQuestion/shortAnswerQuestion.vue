<template>
  <div class="short-answer-question-box">
    <h2 :class="styles['answer-title']">{{ index+1 }}、{{ data.question }}</h2>
    <div :class="[styles['student-answer'], styles['error-answer']]" v-if="!contrastAnswers(data.answers,data.student_answer)">回答错误：{{data.student_answer.join(",")}}</div>
    <div :class="[styles['question-answer'], ['correct-answer']]" v-if="contrastAnswers(data.answers,data.student_answer)">回答正确：{{data.student_answer.join(",")}}</div>
    <div :class="[styles['question-answer'] ,styles['standard-answer']]">标准答案：{{getCorrectAnswer(data.answers,'content')}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import styles from "../question.module.less"
import {getCorrectAnswer} from "src/utils/common"
export default defineComponent({
  props: ["data", "index"],
  setup() {
      // 对比答案
      function contrastAnswers(correct_answers:any[],stu_answers:any[]) {
        if (correct_answers.length!=stu_answers.length) {
          return false
        }
        let isCorrect=true;
        for (let i = 0; i < correct_answers.length; i++) {
          if (!stu_answers.includes(correct_answers[i].answer)) {
            isCorrect=false
            break;
          }
        }
        return isCorrect
      }
      return {
          contrastAnswers,
          styles,
          getCorrectAnswer
      }
  },
});
</script>

<style lang="less">
.short-answer-question-box{
  .answer-title {
    font-size: @font-size-sm;
    color: #838ca5;
  }
  .question-item-box {
    padding-left: 22px;
    font-size: @font-size-sm;
    color: #838ca5;
  }
  .student-answer {
    padding-left: 22px;
    margin-top: 10px;
  }
  .question-answer {
    padding-left: 22px;
    margin-top: 10px;
  }
  .error-answer {
    font-size: @font-size-sm;
    color: #de2829;
  }
  .correct-answer {
    font-size: @font-size-sm;
    color: #2288fa;
  }
  .standard-answer {
    font-size: @font-size-sm;
    color: #1db98f;
  }
}
</style>
