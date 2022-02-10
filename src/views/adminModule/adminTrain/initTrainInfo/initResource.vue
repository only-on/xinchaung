<template>
  <div class="initResource" v-layout-bg>
    <div>deededdeededed</div>
    <search-resource :trainId="trainId" :isMyself="isMyself"></search-resource>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, createVNode, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import searchResource from "src/views/teacherModule/teacherTrain/components/searchResource/index.vue";

interface Istate {
  trainId: any;
  isMyself: boolean;
}
export default defineComponent({
  name: "initResource",
  components: {
    searchResource,
  },
  setup() {
    let route = useRoute();
    const state: Istate = reactive({
      trainId: route.query.trainId,
      isMyself: route.query.trainType === "0",
    });
    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
});
</script>
