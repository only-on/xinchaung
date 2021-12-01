<template>
  <div class="multiple-choice-box">
    <h2 :class="styles['answer-title']">
      {{index+1}}、{{ data.question }}
    </h2>
    <div :class="styles['question-item-box']">
      <div v-for="(item,index) in data.options" :key="index.toString()">{{numToAbc(Number(index)+1)}}、{{item.option}}</div>
    </div>
    <div :class="styles['none-answer']" v-if="data.student_answer&&data.student_answer.length==0">提示：未作答</div>
    <div :class="[styles['student-answer'],styles['error-answer']]" v-if="getStudentAnswer(data.student_answer,data.options)!=getCorrectAnswer(data.answers)">回答错误：{{getStudentAnswer(data.student_answer,data.options)}}</div>
    <div :class="[styles['question-answer'],styles['correct-answer']]" v-if="getStudentAnswer(data.student_answer,data.options)==getCorrectAnswer(data.answers)">回答正确：{{getStudentAnswer(data.student_answer,data.options)}}</div>
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
    function getStudentAnswer(student_answer:any[],options:any) {
      let answer=""
      options.forEach((item:any,index:number) => {
        if (student_answer.includes(item.id.toString())) {
          answer+=numToAbc(index+1)
        }
      });
      return answer
    }
    return {numToAbc,styles,getCorrectAnswer,getStudentAnswer};
  },
});
</script>

<style lang="less">
.multiple-choice-box {
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
