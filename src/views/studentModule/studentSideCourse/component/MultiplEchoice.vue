<template>
  <div class="multipl-echoice-box">
    <div class="question-title">
      <span class="question-index">{{ index + 1 }}、</span>
      <span class="question-name">{{ question.question_name }}</span>
      <span class="question-score">({{ question.default_score }}分)</span>
      <span v-if="question.question_content" :class="question.is_true ? 'question-green' : 'question-red'">
        <span v-html="answer"></span>
      </span>
    </div>
    <div>
      <div class="quesList" v-for="(item,i) in question.question_content" :key="item.id">
        <a-checkbox
          class="quesList-item checkbox"
          :checked="question.student_answer.includes(i.toString())"
          @change="multipleChoice(item, i)"
        >
          <span class="quesList-item">
            {{ numToAbc(i) }}、
            <span class="quesList-item-content">{{ htmlDecode(item.value) }}</span>
          </span>
        </a-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject,reactive,watch, computed,Ref } from 'vue'
import { useRouter } from 'vue-router';
import { htmlDecode } from 'src/utils/common'
import request from '../../../api/index'
import { IBusinessResp} from '../../../typings/fetch.d';
import {message } from 'ant-design-vue';
export default defineComponent({
  name: 'MultiplEchoice',
  components: {
   
  },
  props: {
    data: {
      default: {},
    },
    index: {
      default: 0,
    },
  },
  setup: (props,{emit}) => {
    const http=(request as any).studentCourse
    const router = useRouter();
    var question:any=reactive({})
    var index:Ref<number>=ref(0)
    watch(()=>{return props},(val:any)=>{
        // Object.assign(question,val.data)
        // index.value=props.index
    })
    Object.assign(question,props.data)
    index.value=props.index
    var answer=computed(()=>{
      let str:string=''
      let arr:string[]=['A','B','C','D']
      question.question_content.length?question.question_content.forEach((v:any,k:string)=>{
        if(v.is_ansewr === '1'){
            str+=`${arr[k]}`
        }
      }):''
      return str?`(${str})`:str
    })
    function multipleChoice(val:any,index:any){
        if (question.student_answer.includes(index.toString())) {
        question.student_answer.splice(question.student_answer.indexOf(index.toString()), 1)
      } else {
        question.student_answer.push(index.toString())
      }
     
      submitQuesAnswer(index)
    }
    function submitQuesAnswer(index:any) {
      let obj={
        course_id:question.course_id,
        chapter_id:question.chapter_id,
        question:{
          question_id:question.quest_list_questions_id,
          student_answer:[...question.student_answer]
        },
      }
      console.log(obj)
      http.submitQuest({param:{...obj}}).then((res:IBusinessResp)=>{
          if(res){
             message.success('操作成功')
          }else{
            if (question.student_answer.includes(index.toString())) {
              question.student_answer.splice(question.student_answer.indexOf(index.toString()), 1)
            } else {
              question.student_answer.push(index.toString())
            }
          }
      })
    }
    function numToAbc(i:any) {
      let arr=['A','B','C','D','']
      return arr[i]
    }
    onMounted(()=>{
     
    })
    return {question,index,multipleChoice,answer,numToAbc,htmlDecode};
  },
})
</script>

<style scoped lang="less">
.multipl-echoice-box {
  .question-title {
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    background: #f4f4f4;
    padding: 10px;
    line-height: 30px;
    .question-index {
      font-size: 14px;
    }
    .question-score {
      color: #ff9300;
      margin-left: 20px;
      font-size: 14px;
    }
    .question-green {
      margin-left: 15px;
      color: #62cb2b;
    }
    .question-red {
      margin-left: 15px;
      color: red;
    }
  }
} 



</style>
