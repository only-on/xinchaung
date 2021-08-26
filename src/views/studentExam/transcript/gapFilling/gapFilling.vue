<template>
  <div class="gap-filling-box">
    <h2 class="answer-title">{{ index }}、{{ data.name }}</h2>
    <div class="student-answer error-answer">回答错误：{{getStudentAnswer(data.options)}}</div>
    <div class="question-answer correct-answer">回答正确：{{getStudentAnswer(data.options)}}</div>
    <div class="question-answer standard-answer">标准答案：{{getStandardAnswer(data.answers)}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["data", "index"],
  setup() {
      function getStudentAnswer(answers:Array<any>){
          let answer=""
          return  answer
      }
       function getStandardAnswer(answers:Array<any>){
          let answer=""
          return  answer
      }
      return {
          getStudentAnswer,
          getStandardAnswer
      }
  },
});
</script>

<style lang="less">
.gap-filling-box{
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
