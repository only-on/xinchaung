<template>
  <div v-for="(item,index) in data" :key="index.toString()" class="test-paper-question-list">
    <single-choice
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type_id === 1"
      :isShowAnswer="isShowAnswer"
    ></single-choice>
    <multiple-choice
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type_id === 2"
      :isShowAnswer="isShowAnswer"
    ></multiple-choice>
    <judge
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type_id === 3"
      :isShowAnswer="isShowAnswer"
    ></judge>
    
    <gap-fillings
        class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type_id === 4"
      :isShowAnswer="isShowAnswer"
      >
      </gap-fillings>
      <short-answer-question
        class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type_id === 5"
      :isShowAnswer="isShowAnswer"
      >
      </short-answer-question>
  </div>
</template>

<script lang="ts">
import { defineComponent,reactive,watch } from "vue";

import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";
import gapFillings from "src/components/exercises/gapFillings.vue";
import shortAnswerQuestion from "src/components/exercises/shortAnswerQuestion.vue";
export default defineComponent({
  components: {
    judge,
    "single-choice": singleChoice,
    "multiple-choice": multipleChoice,
    "gap-fillings": gapFillings,
    "short-answer-question":shortAnswerQuestion
  },
  props: ["modelValue","isShowAnswer"],
  setup(props) {
    const data=props.modelValue
    return {data}
  },
});
</script>
