<template>
  <div class="adminImage" v-layout-bg>
    <component :is="componentName" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  inject,
  Ref,
} from "vue";
import teacherMirror from "./teacherMirror.vue";
import prefabriMirror from "./prefabriMirror.vue";

export default defineComponent({
  name: "",
  components: {
    teacherMirror,
    prefabriMirror,
  },
  setup: (props, context) => {
    const componentNames = ["prefabriMirror", "teacherMirror"];
    const tabs = [
      { name: "预制镜像", componenttype: 0 },
      { name: "教师镜像", componenttype: 1 },
    ];
    var componentName: Ref<string> = ref("systemSetting");

    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: tabs,
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
        componentName.value = componentNames[val];
      }
    );

    onMounted(() => {});
    return { componentName };
  },
});
</script>

<style scoped lang="less"></style>
