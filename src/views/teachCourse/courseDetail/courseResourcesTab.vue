<template>
  <div>
    <resources :trainId="course_id" type="course"></resources>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import resources from "src/views/teacherTrain/detail/resources/index.vue";

export default defineComponent({
  components: {
    resources,
  },
  setup() {
    const course_id = inject("course_id");
    return {
      course_id,
    };
  },
});
</script>
