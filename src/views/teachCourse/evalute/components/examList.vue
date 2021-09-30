<template>
  <div class="examItem" v-for="(item,index) in examList" :key="index">
    <div class="title">
      <span>{{index + 1}}、 {{item.question}} （）</span>
      <span>（{{item.default_score}}分）</span>
    </div>
    <ul class="answer">
      <li v-for="(option, oIndex) in item.options" 
        :key="String(oIndex)" 
        :class="setColor(option.id, item.answers, item.student_answer)">
        <span v-if="getItemType(item.id) != 'Judge'">{{setSerial(oIndex)}}.</span> {{option.option}}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref, onMounted } from 'vue'

export default defineComponent({
  props: ['examData'],
  setup(props) {
    console.log(props.examData)
    var examList = reactive<any[]>(props.examData)
    function setColor (optionId:any, answers:any, stuAnswers:any) {
      let ids:any[] = []
      answers.forEach((item:any) => {
        ids.push(item.answer)
      })
      if (ids.join() == stuAnswers.join() && stuAnswers.includes(optionId.toString())) {
        return 'right'
      } else if (stuAnswers.includes(optionId.toString())) {
        return 'wrong'
      }
    }
    function getItemType (type:number) {
      return type == 1 ? 'Judge' : type == 2 ? 'Rdaio' : 'Mul'
    }
    function setSerial(num:any) {
      if (num == 0) {
          return "A"
      } else if (num == 1) {
          return "B"
      } else if (num == 2) {
          return "C"
      } else if (num == 3) {
          return "D"
      } else if (num == 4) {
          return "E"
      }
    }
    console.log(props.examData)
    return {
      examList,
      setSerial,
      setColor,
      getItemType
    }
  },
})
</script>
<style lang="less" scoped>
.examItem{
  font-size: 14px;
  .title{
    background: #f4f4f4;
    padding-left: 30px;
    line-height: 30px;
    word-break: break-all;
    &>span:last-child{
      margin-left: 20px;
      color: @theme-color;
    }
  }
  .answer{
    li{
      padding: 5px 50px;
      line-height: 20px;
      word-break: break-all;
      &.right{
        color: green;
      }
      &.wrong{
        color: #e60707;
      }
    }
  }
}
</style>
