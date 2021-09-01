<template>
  <div class="judge-box">
    <div class="question-title">
      <span class="question-index">{{ index + 1 }}、</span>
      <span class="question-name">{{ question.question_name }}</span>
      <span class="question-score">({{ question.default_score }}分)</span>
      <span v-if="question.question_content" :class="question.is_true ? 'question-green' : 'question-red'">
        {{ judgeAnswer() }}
      </span>
    </div>
    <a-radio-group name="radioGroup" @change="submitQuesAnswer" v-model:value="question.student_answer_format">
      <div class="quesList" v-for="(item, i) in question.question_content" :key="item.id">
        <a-radio :value="i.toString()">
          <span>{{ item.value }}</span>
        </a-radio>
      </div>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject,reactive,Ref,watch } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Judge',
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
    const router = useRouter();
    var question:any=reactive({})
    var last_student_answer:Ref<string>=ref('')
    var index:Ref<number>=ref(0)  
    watch(()=>{return props},(val:any)=>{
       
       
    })
    Object.assign(question,props.data)
    index.value=props.index
    last_student_answer.value = question.student_answer_format
    onMounted(()=>{
     
    })
    function submitQuesAnswer(){
      // console.log(path);
      // router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    function judgeAnswer() {
      if ('is_ansewr' in question.question_content[0]) {
        if (question.question_content[0].is_ansewr === '1') {
          return '(正确)'
        }
        if (question.question_content[1].is_ansewr === '1') {
          return '(错误)'
        }
      }
    }
    return { index,question,submitQuesAnswer,judgeAnswer};
  },
})
</script>

<style scoped lang="less">
.judge-box {
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
