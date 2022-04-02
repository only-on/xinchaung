<template>
  <div class="trainResult" v-layout-bg>
    <!-- <archive-training-detail :trainId="trainId" role="2"></archive-training-detail> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, createVNode, inject, onMounted } from "vue";
import request from "src/api/index";
import { useRoute } from "vue-router";
// import archiveTrainingDetail from "src/views/teacherModule/teacherTrain/detail/archiveTrainingDetail/index.vue";

interface Istate {
  trainId: any;
  role: any;
}
export default defineComponent({
  name: "trainResult",
  components: {
    // archiveTrainingDetail,
  },
  setup() {
    let route = useRoute();
    console.log(route.query);
    console.log(request.teacherTrain);
    var updata = inject("updataNav") as Function;
    var configuration: any = inject("configuration");
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const state: Istate = reactive({
      trainId: route.query.trainId,
      role: localStorage.getItem("role"),
    });
    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
});
</script>
