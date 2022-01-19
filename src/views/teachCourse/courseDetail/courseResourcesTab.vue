<template>
  <div>
    <resources :trainId="course_id" type="course" :role="role"></resources>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import Resources from "src/views/teacherTrain/detail/resources/index.vue";
import storage from "src/utils/extStorage";

export default defineComponent({
  components: {
    Resources,
  },
  setup() {
    const course_id = inject("course_id");
    const role = storage.lStorage.get("role");
    return {
      course_id,
      role,
    };
  },
});
</script>
