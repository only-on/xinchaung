<template>
  <div class="exper">
    <div class="test" v-for="(item, index) in detailInfo" :key="index.toString()">
      <div class="title">
        <span>{{ Number(index) + 1 }}、{{ item.question }}（）</span>
        <span class="score"
          >{{ item.student_score }}
          <span class="origin_score">({{ item.origin_score }}分)</span></span
        >
      </div>
      <div v-if="item.type.id === 1 || 2 || 3" class="answer">
        <div
          v-for="(it, j) in item.options"
          :class="
            ifAnswerTrue(item, it)
              ? 'correct'
              : ifAnswerTrue(item, it) === false
              ? 'wrong'
              : ''
          "
          :key="j.toString()"
        >
          {{ optionItemName[j] }}.{{ it.option }}
        </div>
      </div>
      <div v-if="item.type.id === 4">
        <div
          v-for="(it, j) in item.answers"
          :key="j.toString()"
          :class="
            ifAnswerTrue(item, it)
              ? 'correct'
              : ifAnswerTrue(item, it) === false
              ? 'wrong'
              : ''
          "
        >
          答案{{ Number(j) + 1 }}. {{ it.answer }}
        </div>
      </div>
      <div v-if="item.type.id === 5">
        <div
          v-for="(it, j) in item.answers"
          :key="j.toString()"
          :class="
            ifAnswerTrue(item, it)
              ? 'correct'
              : ifAnswerTrue(item, it) === false
              ? 'wrong'
              : ''
          "
        >
          答案:{{ it.answer }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
interface Istate {
  data: any[];
  answerClass: string;
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
    });
    const methods = {
      ifAnswerTrue(item: any, it: any) {
        const allanswer: any = [];
        const rightIndex: any = [];
        const wrongIndex: any = [];
        item.answers.forEach((opt: any) => {
          allanswer.push(opt.answer);
          // 所有正确答案
        });
        item.student_answer.forEach((it: any, i: any) => {
          if (allanswer.indexOf(it) !== -1) {
            rightIndex.push(it);
          } else {
            wrongIndex.push(it);
          }
        });
        if (rightIndex.indexOf(it.id.toString()) !== -1) {
          return true;
        } else if (wrongIndex.indexOf(it.id.toString()) !== -1) {
          return false;
        }
      },
    };
    return { ...toRefs(state), optionItemName, ...methods };
  },
});
</script>
<style lang="less" scoped>
.testTitle {
  color: var(--purpleblue-6);
  padding: 15px;
  border-bottom: 1px solid @normal-color;
}
.test {
  padding: 20px;
  .title {
    background-color: @descriptions-bg;
  }
  .score {
    margin-left: 30px;
    color: var(--purpleblue-6);
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
</style>
