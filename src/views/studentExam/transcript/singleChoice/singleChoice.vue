<template>
  <div class="judge-box">
    <h2 :class="styles['answer-title']">
      {{index+1}}、{{ data.question }}
    </h2>
    <div :class="styles['question-item-box']">
      <div v-for="(item,index) in data.options" :key="index.toString()">{{numToAbc(Number(index)+1)}}、{{item.option}}</div>
    </div>
    <div :class="styles['none-answer']" v-if="data.student_answer.length===0">提示：未作答</div>
    <div :class="[styles['student-answer'],styles['error-answer']]" v-if="data.answers[0].answer!=data.student_answer[0]">回答错误：{{getStudentAnswer(data.answers,data.student_answer,data.options)}}</div>
    <div :class="[styles['question-answer'],styles['correct-answer']]" v-if="data.answers[0].answer==data.student_answer[0]">回答正确：{{getStudentAnswer(data.answers,data.student_answer,data.options)}}</div>
    <div :class="[styles['question-answer'],styles['standard-answer']]">标准答案：{{getCorrectAnswer(data.answers)}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {numToAbc,getCorrectAnswer} from "src/utils/common"
import styles from "../question.module.less"
export default defineComponent({
  props: ["data","index"],
  setup(props) {

    // 获取学生答案
    function getStudentAnswer(correct_answers:any[],student_answer:any[],options:any[]) {
      console.log(student_answer);
      console.log(options)
      let i= options.findIndex((item:any)=>{
        return item.id==student_answer[0]
      })
      console.log(i)
      return numToAbc(i+1)
    }
    return {numToAbc,styles,getCorrectAnswer,getStudentAnswer};
  },
});
</script>

<style lang="less">
.judge-box {
  
}
</style>
