<template>
  <div class="judge-box">
    <h2 :class="styles['answer-title']">
      {{index+1}}、{{ data.name }}
    </h2>
    <div :class="styles['question-item-box']">
      <div>错误</div>
      <div>正确</div>
    </div>
    <div :class="[styles['student-answer'],styles['error-answer']]">回答错误：正确</div>
    <div class="question-answer correct-answer">回答正确：正确</div>
    <div class="question-answer standard-answer">标准答案：正确</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import styles from "../question.module.less"
export default defineComponent({
  props: ["data","index"],
  setup(props) {
    return {styles};
  },
});
</script>

<style lang="less">
.judge-box {
  .answer-title {
    font-size: @font-size-sm;
    color: #838ca5;
  }
  .question-item-box{
      padding-left: 22px;
      font-size: @font-size-sm;
      color: #838CA5;
  }
  .student-answer{
       padding-left: 22px;
       margin-top: 10px;
  }
  .question-answer{
      padding-left: 22px;
      margin-top: 10px;
  }
  .error-answer{
      font-size: @font-size-sm;
      color: #de2829;
  }
  .correct-answer{
      font-size: @font-size-sm;
      color: #2288fa;
  }
  .standard-answer{
      font-size: @font-size-sm;
      color: #1db98f
  }
}
</style>
