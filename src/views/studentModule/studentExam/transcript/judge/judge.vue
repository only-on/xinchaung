<template>
  <div class="judge-box">
    <h2 :class="styles['answer-title']">
      {{ index + 1 }}、{{ data.question }}
    </h2>
    <!-- <div :class="styles['question-item-box']">
      <div>错误</div>
      <div>正确</div>
    </div> -->
    <template v-if="data.student_answer && data.student_answer.length == 0">
      <div :class="styles['none-answer']">提示：未作答</div>
    </template>
    <template v-else>
      <div v-if="data.student_answer[0]!=data.answers[0].answer" :class="[styles['student-answer'], styles['error-answer']]">
        回答错误：{{getStudentAnswer(data.student_answer,data.options)}}
      </div>
      <div v-if="data.student_answer[0]==data.answers[0].answer" class="question-answer correct-answer">回答正确：{{getStudentAnswer(data.student_answer,data.options)}}</div>
    </template>

    <div class="question-answer standard-answer">标准答案：{{getCorrectAnswers(data.answers,data.options)}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import styles from "../question.module.less";
export default defineComponent({
  props: ["data", "index"],
  setup(props) {
    // 获取标准答案
    function getCorrectAnswers(answers:any[],options:any[]) {
     let i= options.findIndex((item:any)=>{
        return item.id==answers[0].answer
      })
      return options[i].option
    }

    // 获取学生答案
    function getStudentAnswer(answers:any[],options:any[]) {
      let i= options.findIndex((item:any)=>{
        return item.id==answers[0]
      })
      return options[i].option
    }
    return { styles ,getCorrectAnswers,getStudentAnswer};
  },
});
</script>

<style lang="less">
.judge-box {
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
