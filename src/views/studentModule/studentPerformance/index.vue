<template>
  <div id="studentPerformance" v-layout-bg>
    <component :is="componentName" />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  UnwrapRef,
  reactive,
  onMounted,
  toRefs,
  inject,
  watch,
} from "vue";
import CourseAchievement from "./CourseAchievement/index.vue";
import TrainingResults from "./TrainingResults/index.vue";
interface Iitem {
  name: string;
  componenttype: any;
}
interface state {
  tabs: Array<Iitem>;
  componentName: string;
  componentNames: Array<string>;
}
export default defineComponent({
  name: "studentPerformance",
  components: {
    CourseAchievement,
    TrainingResults,
  },
  setup: (props, context) => {
    const state: state = reactive({
      componentName: "CourseAchievement",
      componentNames: ["CourseAchievement", "TrainingResults"],
      tabs: [
        { name: "课程成绩", componenttype: 0 },
        { name: "实训成绩", componenttype: 1 },
      ],
    });

    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: state.tabs,
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    watch(
      () => {
        return configuration.componenttype;
      },
      (val) => {
        console.log(val);
        state.componentName = state.componentNames[val];
      }
    );
    onMounted(() => {
      console.log(ref, "ref");
    });
    return { ...toRefs(state) };
  },
});
</script>
<style lang="less" scoped></style>
