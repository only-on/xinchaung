<template>
  <div class="gap-filling-box">
    <h2 class="question-title">
      {{ index + 1 }}、{{ data.question
      }}<i class="correct-answer" v-if="isShowAnswer"
        >(正确答案：{{ data.answers[0] }})</i
      >
    </h2>
    <div class="answer-list">
      <label>答案：</label
      ><a-textarea v-model:value="data.student_answer[0]"></a-textarea>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from "vue";

export default defineComponent({
  props: ["index", "modelValue",'isShowAnswer'],
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
    return {
      data,
      index,
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
    .correct-answer{
            color: #FF8F00;
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
