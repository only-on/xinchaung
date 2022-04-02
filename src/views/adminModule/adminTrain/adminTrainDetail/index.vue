<template>
  <div class="teacherTrainDetail" v-layout-bg>
    <!-- <train-detail :trainId="trainId" :currentTab="currentTab" :role="role"></train-detail> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
import { useRoute } from "vue-router";
// import trainDetail from "src/views/teacherModule/teacherTrain/detail/trainDetail.vue";
interface State {
  trainId: any;
  currentTab: any;
  role: any;
}
export default defineComponent({
  name: "teacherTrainDetails",
  // components: { trainDetail },
  setup() {
    let router = useRoute();
    const state: State = reactive({
      trainId: router.query.id,
      currentTab: router.query.currentTab,
      role: localStorage.getItem("role"),
    });
    onMounted(() => {});
    return { ...toRefs(state) };
  },
});
</script>
