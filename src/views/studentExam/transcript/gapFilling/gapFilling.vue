<template>
  <div class="gap-filling-box">
    <h2 :class="styles['answer-title']">{{ index }}、{{ data.name }}</h2>
    <div :class="[styles['student-answer'], styles['error-answer']]">回答错误：{{getStudentTranscriptAnswer(data.options,'content')}}</div>
    <div :class="[styles['question-answer'], ['correct-answer']]">回答正确：{{getStudentTranscriptAnswer(data.options,'content')}}</div>
    <div :class="[styles['question-answer'] ,styles['standard-answer']]">标准答案：{{getStudentTranscriptAnswer(data.answers,'content')}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import styles from "../question.module.less"
import {getStudentTranscriptAnswer} from "src/utils/common"
export default defineComponent({
  props: ["data", "index"],
  setup() {
      
      return {
          styles,
          getStudentTranscriptAnswer
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
