<template>
  <div>
    <div class="examItem" v-for="(item,index) in examList" :key="index">
      <div class="title">
        <span>{{index + 1}}、 {{item.title}} （）</span>
        <span>（{{item.score}}分）</span>
      </div>
      <ul class="answer">
        <li v-for="(option, oIndex) in getOptions(item.options)" 
          :key="String(oIndex)" 
          :class="setColor(option.is_ansewr, index, oIndex, getItemType(item.type), getMulIndex(getOptions(item.options)))">
          <span v-if="getItemType(item.type) != 'Judge'">{{setSerial(oIndex)}}.</span> {{option.value}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref } from 'vue'

export default defineComponent({
  props: ['examData', 'type'],
  setup(props) {
    var examList = reactive<any[]>(props.examData.examItems)
    var answer = reactive<any>(props.examData.question_result[props.type])
    var dataType = ref<number>(props.examData.type)

    function getOptions (options:any) {
      return typeof options == "string" ? eval('(' + options + ')') : options 
    }
    function setColor (isAnswer:any, index:any, oIndex:any, type:string, rightArr:any) {
      if (!answer[index] || !answer[index].length) return
      if (type == 'Mul') {
        // 多选
        /* 这里需要注意   只要学生提交答案错误，学生答案就标注红色；学生提交答案完全正确，学生答案就标注绿色；*/
        let stuAnswer = dataType.value == 1 ? answer[index].split(',') : answer[index]
        if (rightArr.join('') == stuAnswer.join('')) {
          for (let i =0;i < stuAnswer.length; i++) {
            if (stuAnswer[i] == oIndex) {
              return 'right'
            }
          }
        } else {
          for (let i =0;i < stuAnswer.length; i++) {
            if (stuAnswer[i] == oIndex) {
              return 'wrong'
            }
          }
        }
      } else {
        let stuAnswer = dataType.value == 1 ? answer[index] : answer[index][0]
        // 单选或判断
        if (isAnswer == 1 && stuAnswer == oIndex) {
          return 'right'
        } else if (stuAnswer == oIndex) {
          return 'wrong'
        }
      }
    }
    function getItemType (type:number) {
      if (dataType.value === 1) {
        return type == 1 ? 'Judge' : type == 2 ? 'Rdaio' : 'Mul'
      } else {
        return type == 1 ? 'Radio' : type == 2 ? 'Mul' : 'Judge'
      }
    }
    // 多选题正确答案的下标
    function getMulIndex (options:any) {
      let arr = []
      for (let i =0;i < options.length;i++) {
        if (options[i].is_ansewr == 1) {
          arr.push(i)
        }
      }
      return arr
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
      }
    }
    watch(props.examData, (newVal) => {
      console.log(newVal)
    })
    return {
      examList,
      getOptions,
      setSerial,
      setColor,
      getItemType,
      getMulIndex
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
