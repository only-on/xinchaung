<template>
  <div class="Statistics">
    <div class="item">
      <span>共</span>
      <span class="one mid">{{detailInfo && detailInfo.length}}</span>
      <span>题</span>
    </div>
    <div class="item">
      <span>总分</span>
      <span class="one mid">{{origin_score}}</span>
      <span>分</span>
    </div>
    <div class="item">
      <span>得分</span>
      <span class="two mid">{{student_score}}</span>
      <span>分</span>
    </div>
  </div>
  <div class="exper">
    <div class="test" v-for="(item, index) in detailInfo" :key="index.toString()">
      <div :class="item.answer_is_right?'title':'redtitlt'">
        <span>{{ item.question }}</span>
        <span class="score"
          >
          <!-- {{ item.student_score }} -->
          <span class="origin_score">({{ item.origin_score }}分)</span></span
        >
      </div>
      <div v-if="[1, 3].includes(item.type.id)" class="answer">
        <div
          v-for="(it, j) in item.options"
          :class="
            ifAnswerTrue(item, it,index)
              ? 'correct'
              : ifAnswerTrue(item, it,index) === false
              ? 'wrong'
              : ''
          "
          :key="j.toString()"
        >
          {{ optionItemName[j] }}.{{ it.option }}
        </div>
      </div>
      
      <div v-if="item.type.id === 2 " class="answer">
        <a-checkbox-group name="checkboxgroup" class="radio_group"
              v-model:value="item.student_answer">
        <!-- <div
          v-for="(it, j) in item.options"
          :class="
            item.student_answer.includes(it.id.toString())?item.answer_is_right?'correct':'wrong':''
          "
          :key="j.toString()"
        >
        <a-checkbox :value="j">
          {{ optionItemName[j] }}.{{ it.option }}
        </a-checkbox> 
        </div> -->
        <div
          v-for="(it, j) in item.options"
          :class="
            ifAnswerTrue(item, it,index)
              ? 'correct'
              : ifAnswerTrue(item, it,index) === false
              ? 'wrong'
              : ''
          "
          :key="j.toString()"
        >
        <a-checkbox :value="it.id" :disabled='true'>
          {{ optionItemName[j] }}.{{ it.option }}
        </a-checkbox> 
        </div>
      </a-checkbox-group>
        <div class="correctAnswers">
          <span class="answerLabel">正确答案:</span>
          <span>{{correctAnswer(item)}}</span>
        </div>
      </div>
      <div v-if="item.type.id === 4" class="jdt-options">
        <div
          v-for="(it, j) in item.answers"
          :key="j.toString()"
          :class="
            ifAnswerTrue(item, it,index)
              ? 'correct'
              : ifAnswerTrue(item, it,index) === false
              ? 'wrong'
              : ''
          "
        >
          答案{{ Number(j) + 1 }}. {{ it.answer }}
        </div>
      </div>
      <div v-if="item.type.id === 5" class="jdt-options">
        <!-- :class="
            ifAnswerTrue(item, it,index)
              ? 'correct'
              : ifAnswerTrue(item, it,index) === false
              ? 'wrong'
              : ''
          " -->
        <a-textarea v-model:value="item.student_answer[0]" disabled />
        <div
          v-for="(it, j) in item.answers"
          :key="j.toString()"
          class="corrctAnswer"
        >
          <span class="label">正确答案:</span>
          <span>{{ it.answer }}</span>
        </div>
        <div class="keywordColor">
          <span class="label">关键词:</span>
          <span v-for="(it,i) in item?.keywords" :key="i">
            {{it?.keyword}}
            <span v-show="i !== (item?.keywords && item?.keywords.length - 1)">,</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch,ref } from "vue";
interface Istate {
  data: any[];
  answerClass: string;
  origin_score:number;
  student_score:number;
}
export default defineComponent({
  name: "exper",
  props: ["detailInfo"],
  setup: (props, context) => {
    const optionItemName: any[] = ["A", "B", "C", "D"];
    const state: Istate = reactive({
      data: [
        {
          title: "问题1（）",
          score: 100,
          answer: [
            { id: 1, item: "正确" },
            { id: 2, item: "错误" },
          ],
        },
      ],
      answerClass: "",
      origin_score:0,
      student_score:0,
    });
    const methods = {
      ifAnswerTrue(item: any, it: any,index:any) {
        return true
        // const allanswer: any = [];
        // const rightIndex: any = [];
        // const wrongIndex: any = [];
        // item.answers.forEach((opt: any) => {
        //   allanswer.push(Number(opt.answer));
        //   // 所有正确答案
        // });
        // item.student_answer.forEach((it: any, i: any) => {
        //   if (allanswer.indexOf(it) !== -1) {
        //     rightIndex.push(it);
        //   } else {
        //     wrongIndex.push(it);
        //   }
        // });
        // console.log(rightIndex,'rightIndex')
        // props.detailInfo[index].correctAnswer=rightIndex
        // if (rightIndex.indexOf(it.id.toString()) !== -1) {
        //   return true;
        // } else if (wrongIndex.indexOf(it.id.toString()) !== -1) {
        //   return false;
        // }
      },
      correctAnswer(item:any){
        const allanswer: any = [];
        const rightIndex: any = [];
        const wrongIndex: any = [];
        if(item.type_id==2){
          item.answers.forEach((opt: any) => {
            allanswer.push(Number(opt.answer));
            // 所有正确答案
          });
         item.options.forEach((it:any,i:any)=>{
           if(allanswer.indexOf(it.id) !== -1){
            rightIndex.push(optionItemName[i])
           }
         })
        }
        // console.log(allanswer,rightIndex)
        return rightIndex.join(',')
      }
    };
    console.log(props.detailInfo)
    watch(()=>{return props.detailInfo},(val:any)=>{
      if(val.length){
        state.origin_score=0
        state.student_score=0
        val.forEach((v:any)=>{
          state.origin_score+=Number(v.origin_score)
          state.student_score+=Number(v.student_score)
        })
      }
    },{immediate:true,deep:true})
    return { ...toRefs(state), optionItemName, ...methods};
  },
});
</script>
<style lang="less" scoped>
.jdt-options{
  margin-top: 10px;
}
.testTitle {
  color: var(--purpleblue-6);
  padding: 15px;
  border-bottom: 1px solid var(--gray-5);
}
.test {
  padding: 20px;
  .title {
    background-color:#DDF9F3;
    line-height: 36px;
    padding-left: 10px;
  }
  .redtitlt{
    background-color:#FFF3F3;
    line-height: 36px;
    padding-left: 10px;
  }
  .score {
    // margin-left: 30px;
    // color: var(--purpleblue-6);
    color: var(--primary-color);
    .origin_score {
      margin-left: 10px;
    }
  }
  .answer {
    margin-top: 10px;
    margin-left: 30px;
    .correct {
      color: green;
    }
    .wrong {
      color: red;
    }
  }
}
.correctAnswers{
  margin-top: 10px;
  color:#1CB2B3;
  .answerLabel{
    margin-right: 10px;
  }
}
.keywordColor{
  color:#1CB2B3;
  margin-top: 10px;
}
.corrctAnswer{
  color:#1CB2B3;
  margin-top: 10px;
}
.label{
    margin-right: 10px;
    margin-left: 10px;
  }
.Statistics{
  display: flex;
  padding: 0 20px;
  .item{
    margin-right: 16px;
    color: var(--black-45);
    .mid{
      padding:0 6px
    }
    .one{
      color:var(--primary-color)
    }
    .two{
      color: var(--brightBtn);
    }
  }
}  
</style>
