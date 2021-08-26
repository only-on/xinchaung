<template>
  <div class="judge-box">
    <h2 :class="styles['answer-title']">
      {{index+1}}、{{ data.name }}
    </h2>
    <div :class="styles['question-item-box']">
      <div v-for="(item,index) in data.options" :key="index.toString()">{{numToAbc(Number(index)+1)}}、{{item.content}}</div>
    </div>
    <div :class="styles['none-answer']">提示：未作答</div>
    <div :class="[styles['student-answer'],styles['error-answer']]">回答错误：{{getStudentTranscriptAnswer(data.answers)}}</div>
    <div :class="[styles['question-answer'],styles['correct-answer']]">回答正确：{{getStudentTranscriptAnswer(data.answers)}}</div>
    <div :class="[styles['question-answer'],styles['standard-answer']]">标准答案：{{getStudentTranscriptAnswer(data.answers)}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {numToAbc,getStudentTranscriptAnswer} from "src/utils/common"
import styles from "../question.module.less"
export default defineComponent({
  props: ["data","index"],
  setup(props) {
      console.log(props.data);
      console.log(styles);
    return {numToAbc,styles,getStudentTranscriptAnswer};
  },
});
</script>

<style lang="less">
.judge-box {
  
}
</style>
