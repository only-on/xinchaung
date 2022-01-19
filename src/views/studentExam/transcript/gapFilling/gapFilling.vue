<template>
  <div class="gap-filling-box">
    <h2 :class="styles['answer-title']">{{ index+1 }}、{{ data.question }}</h2>
    <div :class="[styles['student-answer'], styles['error-answer']]" v-if="!contrastAnswers(data.answers,data.student_answer)">回答错误：{{data.student_answer.join(",")}}</div>
    <div :class="[styles['question-answer'], ['correct-answer']]" v-if="contrastAnswers(data.answers,data.student_answer)">回答正确：{{data.student_answer.join(",")}}</div>
    <div :class="[styles['question-answer'] ,styles['standard-answer']]">标准答案：{{getCorrectAnswer(data.answers)}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import styles from "../question.module.less"

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
      // 获取标准答案
      function getCorrectAnswer(answers:any[]) {
        let code=""
        answers.forEach((item:any,index:number)=>{
          code+=item.answer
          // options.forEach((it:any,ind:number)=>{
          //   if (item.answer==it.id) {
          //     code+=item.option
          //   }
          // })
        })
        return code
      }
      return {
          styles,
          getCorrectAnswer,
          contrastAnswers
      }
  },
});
</script>

<style lang="less">
.gap-filling-box{
  .answer-title {
    font-size: var(--base-font-size);
    color: #838ca5;
  }
  .question-item-box {
    padding-left: 22px;
    font-size: var(--base-font-size);
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
    font-size: var(--base-font-size);
    color: #de2829;
  }
  .correct-answer {
    font-size: var(--base-font-size);
    color: #2288fa;
  }
  .standard-answer {
    font-size: var(--base-font-size);
    color: #1db98f;
  }
}
</style>
