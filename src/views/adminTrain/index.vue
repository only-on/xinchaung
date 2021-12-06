<template>
  <div id="adminTrain" v-layout-bg>
    <component :is="componentName" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
import TeacherTrainInfo from "./teacherTrainInfo/index.vue";
import InitTrainInfo from "./initTrainInfo/index.vue";
import ArchivingTrainInfo from "./archivingTrainInfo/index.vue";
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
  name: "adminTrain",
  components: {
    TeacherTrainInfo,
    InitTrainInfo,
    ArchivingTrainInfo,
  },
  setup: (props, context) => {
    const state: state = reactive({
      componentName: "TeacherTrainInfo",
      componentNames: ["TeacherTrainInfo", "InitTrainInfo", "ArchivingTrainInfo"],
      tabs: [
        { name: "教师实训信息管理", componenttype: 0 },
        { name: "初始实训库管理", componenttype: 1 },
        { name: "归档实训管理", componenttype: 2 },
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
    onMounted(() => {});
    return { ...toRefs(state) };
  },
});
</script>
<style lang="less" scoped>
#studentPerformance {
  height: 100%;
  overflow-y: auto;
}
</style>
