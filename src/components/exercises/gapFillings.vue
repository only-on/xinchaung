<template>
  <div class="gap-filling-box">
    <h2 class="question-title">
      {{ index + 1 }}、{{ data.question
      }}<i class="correct-answer" v-if="isShowAnswer"
        >(正确答案：{{ getAnswer(data.answers) }})</i
      >
    </h2>
    <div class="answer-list">
      <div
        class="answer-item"
        v-for="(item, index) in data.answers"
        :key="index.toString()"
      >
        <label>答案{{ Number(index) + 1 }}：</label
        ><a-input v-model:value="data.student_answer[index]"></a-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, toRefs } from "vue";

export default defineComponent({
  props: ["index", "modelValue", "isShowAnswer"],
  setup(props, { emit }) {
    const reactiveData: any = reactive({ data: props.modelValue });
    const index = ref(props.index);
    const { data } = toRefs(reactiveData);
    watch(
      props,
      () => {
        data.value = props.modelValue;
        index.value = props.index;
      },
      { deep: true, immediate: true }
    );

    watch(
      () => props.modelValue,
      () => {
        emit("answerChange", data.value);
      },
      { deep: true }
    );

    function getAnswer(answers: any) {
      let answer = "";
      answers.forEach((item: any, i: number) => {
        if (i === answers.length - 1) {
          answer += item.answer;
        } else {
          answer += item.answer + "，";
        }
      });
      return answer;
    }
    return {
      data,
      index,
      getAnswer,
    };
  },
});
</script>

<style lang="less">
.gap-filling-box {
  .question-title {
    white-space: normal;
    font-size: 14px;
    text-align: justify;
    .correct-answer {
      color: #ff8f00;
      font-style: normal;
      margin-left: 10px;
    }
  }
  .answer-list {
    .answer-item {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
      font-size: 14px;
      > label {
        width: 80px;
        line-height: 35px;
      }
    }
  }
}
</style>
