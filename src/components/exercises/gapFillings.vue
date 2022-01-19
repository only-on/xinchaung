<template>
  <div class="gap-filling-box">
    <h2 class="question-title">
      {{ index + 1 }}、{{ data.question
      }}<i class="correct-answer" v-if="isShowAnswer"
        >(正确答案：{{ getAnswer(data.answers) }})</i
      >
    </h2>
    <div class="answer-list">
      <template v-if="data.student_answer.length > 0">
        <div
          class="answer-item"
          v-for="(item, index) in data.student_answer"
          :key="index.toString()"
        >
          <label>答案{{ Number(index) + 1 }}：</label
          ><a-input v-model:value="data.student_answer[index]"></a-input>
          <div class="r-a-btns-box">
            <span
              class="remove-btn icon-shanchu-copy iconfont"
              @click="remove(Number(index))"
              title="移除"
            ></span>
            <span
              v-if="index === data.student_answer.length - 1"
              class="add-btn icon-tianjia iconfont"
              title="添加"
              @click="add()"
            ></span>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="answer-item">
          <label>答案1：</label
          ><a-input v-model:value="data.student_answer[0]"></a-input>
          <span class="add-btn icon-tianjia iconfont" @click="add()"></span>
        </div>
      </template>
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
    function remove(i: number) {
      data.value.student_answer.splice(i, 1);
    }
    function add() {
      console.log(12121);

      data.value.student_answer.push(" ");
      console.log(data.value.student_answer);
    }
    return {
      data,
      index,
      getAnswer,
      remove,
      add,
    };
  },
});
</script>

<style lang="less">
.gap-filling-box {
  .flex-row {
    display: flex;
  }
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
    display: flex;
    flex-direction: column;
    .answer-item {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
      font-size: 14px;
      width: 100%;
      .r-a-btns-box{
        width: 50px;
        flex-shrink: 0;
        cursor: pointer;
        >span{
          margin-left: 10px;
        }
      }
      > label {
        width: 80px;
        line-height: 35px;
      }
      .remove-btn {
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
}
</style>
