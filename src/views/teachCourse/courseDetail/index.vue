<template>
  <div
    v-layout-bg="{ size: '234px', bg: bg }"
    style="height: calc(100% - 24px)"
  >
    <top></top>
    <a-tabs
      default-active-key="1"
      @change="tabChange"
      class="course-detail-tabs"
    >
      <a-tab-pane
        key="1"
        tab="课程实验"
        v-if="tabs.includes('courseExperimentTab')"
      >
        <course-experiment-tab></course-experiment-tab>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="课程成员"
        force-render
        v-if="tabs.includes('courseMembersTab')"
      >
        <course-members-tab></course-members-tab>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="分组信息"
        force-render
        v-if="tabs.includes('groupInfoTab')"
      >
        <group-info-tab></group-info-tab>
      </a-tab-pane>
      <a-tab-pane
        key="4"
        tab="课程资源"
        force-render
        v-if="tabs.includes('courseResourcesTab')"
      >
        <course-resources-tab></course-resources-tab>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, reactive, toRefs } from "vue";
import bg from "src/assets/common/course-detail_bg.jpg";
import top from "./top.vue";
import storage from "src/utils/extStorage";
import { useRoute } from "vue-router";
import courseExperimentTab from "./courseExperimentTab.vue";
import courseMembersTab from "./courseMembersTab.vue";
import groupInfoTab from "./groupInfoTab.vue";
import courseResourcesTab from "./courseResourcesTab.vue";

type TreactiveData = {
  tabs: any[];
};
export default defineComponent({
  components: {
    top,
    "course-experiment-tab": courseExperimentTab,
    "course-members-tab": courseMembersTab,
    "group-info-tab": groupInfoTab,
    "course-resources-tab": courseResourcesTab,
  },
  setup() {
    const route = useRoute();
    const currentRole: number = storage.lStorage.get("role");
    const currentTab = route.query.currentTab;
    const reactiveData: TreactiveData = reactive({
      tabs: [],
    });
    onMounted(() => {
      reactiveData.tabs = settingTab();
    });
    function tabChange(key: string) {
      console.log(key);
    }

    function settingTab() {
      if (![1, 3].includes(currentRole)) {
        return [];
      } else {
        if (
          currentRole == 1 ||
          (currentRole == 3 && currentTab === "initCourse")
        ) {
          return ["courseExperimentTab", "courseResourcesTab"];
        }
        if (currentRole == 3 && currentTab === "myCourse") {
          return [
            "courseExperimentTab",
            "courseResourcesTab",
            "groupInfoTab",
            "courseMembersTab",
          ];
        }
        return [];
      }
    }

    return {
      tabChange,
      bg,
      ...toRefs(reactiveData),
    };
  },
});
</script>

<style lang="less">
.course-detail-tabs {
  height: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  >.ant-tabs-top-content {
    height: calc(100% - 60px);
  }
  .ant-tabs-bar {
    flex-shrink: 0;
  }
  // .ant-tabs-content {
  //   height: 100%;
  // }
}
</style>
