<template>
  <div>
    <grouping-infor :trainId="course_id" type="course"></grouping-infor>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import groupingInfor from "src/views/teacherTrain/detail/groupingInfor/index.vue";

export default defineComponent({
  components: {
    "grouping-infor":groupingInfor
  },
  setup() {
    const course_id = inject("course_id");
    return {
      course_id,
    };
  },
});
</script>
