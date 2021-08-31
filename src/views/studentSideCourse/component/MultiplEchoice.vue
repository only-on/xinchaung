<template>
  <div class="multipl-echoice-box">
    <div class="question-title">
      <span class="question-index">{{ index + 1 }}、</span>
      <span class="question-name">{{ question.question_name }}</span>
      <span class="question-score">({{ question.default_score }}分)</span>
      <span v-if="this.question.question_content" :class="question.is_true ? 'question-green' : 'question-red'">
        <!-- {{ answer }} -->
        <span v-html="answer"></span>
      </span>
    </div>
    <div>
      <div class="quesList" v-for="(item, i) in question.question_content" :key="i">
        <a-checkbox
          class="quesList-item checkbox"
          :checked="question.student_answer.includes(i.toString())"
          @change="e => multipleChoice(item, i)"
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
import { defineComponent,ref, onMounted,inject } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'MultiplEchoice',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();

    onMounted(()=>{
     
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    return { go};
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
