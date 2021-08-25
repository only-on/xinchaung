<template>
  <div v-for="(item,index) in data" :key="index.toString()" class="test-paper-question-list">
    <judge
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type === 1"
    ></judge>
    <single-choice
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type === 2"
    ></single-choice>
    <multiple-choice
      class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type === 3"
    ></multiple-choice>
    <gap-fillings
        class="experimental-exercises-item"
      v-model="data[index]"
      :index="index"
      v-if="item.type === 4"
      >
      </gap-fillings>
  </div>
</template>

<script lang="ts">
import { defineComponent,reactive,watch } from "vue";

import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";
import gapFillings from "src/components/exercises/gapFillings.vue";
export default defineComponent({
  components: {
    judge,
    "single-choice": singleChoice,
    "multiple-choice": multipleChoice,
    "gap-fillings": gapFillings,
  },
  props: ["modelValue"],
  setup(props) {
    const data=reactive(props.modelValue)
    return {data}
  },
});
</script>
