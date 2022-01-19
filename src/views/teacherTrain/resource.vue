<template>
  <div class="resource" v-layout-bg>
    <search-resource :trainId="trainId" :isMyself="isMyself"></search-resource>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, createVNode, inject, onMounted } from "vue";
import request from "src/api/index";
import { useRoute } from "vue-router";
import searchResource from "src/views/teacherTrain/components/searchResource/index.vue";

interface Istate {
  trainId: any;
  isMyself: boolean;
}
export default defineComponent({
  name: "resource",
  components: {
    searchResource,
  },
  setup() {
    let route = useRoute();
    console.log(route.query);
    console.log(request.teacherTrain);
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
