<template>
  <!-- v-layout-bg="{ size: '234px', bg: bg }" -->
  <div class="TeacherCourseDetailBox">
    <div class="heardBox">
      <top></top>
    </div>
    <div class="TeacherCourseDetail">
      <a-tabs
        default-active-key="1"
        @change="tabChange"
        class="course-detail-tabs"
        v-model:activeKey="activeKey"
      >
        <a-tab-pane key="1" tab="课程实验" v-if="tabs.includes('courseExperimentTab')">
          <template v-if="activeKey === '1'">
            <course-experiment-tab></course-experiment-tab>
          </template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程成员" v-if="tabs.includes('courseMembersTab')">
          <template v-if="activeKey === '2'">
            <course-members-tab></course-members-tab>
          </template>
        </a-tab-pane>
        <a-tab-pane key="3" tab="分组信息" v-if="tabs.includes('groupInfoTab')">
          <template v-if="activeKey === '3'">
            <group-info-tab></group-info-tab>
          </template>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程资源" v-if="tabs.includes('courseResourcesTab')">
          <template v-if="activeKey === '4'">
            <course-resources-tab></course-resources-tab>
          </template>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  provide,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import bg from "src/assets/images/studentcourse/course-detail_bg.jpg";
import top from "./top.vue";
import storage from "src/utils/extStorage";
import { useRoute } from "vue-router";
import courseExperimentTab from "./courseExperimentTab.vue";
import courseMembersTab from "./courseMembersTab.vue";
import groupInfoTab from "./groupInfoTab.vue";
import courseResourcesTab from "./courseResourcesTab.vue";

type TreactiveData = {
  tabs: any[];
  activeKey: string;
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
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "",
      navType: true,
      showContent: false,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const route = useRoute();
    const currentRole: number = storage.lStorage.get("role");
    const currentTab = route.query.currentTab;
    const course_id = route.query.course_id;
    const type = route.query.type;
    const reactiveData: TreactiveData = reactive({
      tabs: [],
      activeKey: "1",
    });
    if (type === "resource") {
      reactiveData.activeKey = "4";
    }
    const tab = ref(-1);
    watch(
      () => currentTab,
      () => {
        if (currentTab) {
          if (currentTab === "myCourse") {
            tab.value = 0;
          }
          if (currentTab === "initCourse") {
            tab.value = 1;
          }
        } else {
          tab.value = 0;
        }
      },
      {
        immediate: true,
      }
    );
    provide("course_id", course_id);
    provide("tab", tab);
    onMounted(() => {
      reactiveData.tabs = settingTab();
    });
    function tabChange(key: string) {}

    function settingTab() {
      if (![1, 3, 2].includes(currentRole)) {
        return [];
      } else {
        if (currentRole == 1 || (currentRole == 3 && currentTab === "initCourse")) {
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
        if (currentRole == 2) {
          if (!type) {
            return [
              "courseExperimentTab",
              "courseResourcesTab",
              "groupInfoTab",
              "courseMembersTab",
            ];
          } else {
            return ["courseExperimentTab", "courseResourcesTab"];
          }
        }
        return [];
      }
    }

    return {
      tabChange,
      bg,
      ...toRefs(reactiveData),
      provide,
    };
  },
});
</script>

<style lang="less" scoped>
.heardBox {
  background-image: url(/src/assets/images/studentcourse/course-detail_bg.jpg);
  background-size: 100% 234px;
  background-repeat: no-repeat;
  padding-top: 32px;
  margin-top: -32px;
}
.TeacherCourseDetail {
  // height: calc(100% - 24px);
  // height: 1100px;
  // overflow: hidden;
  width: @center-width;
  margin: 0 auto;
  // overflow: auto;
}
:deep(.ant-tabs.course-detail-tabs) {
  // height:calc(100% - 200px) ;
  // overflow: auto;
  // overflow: hidden;
}
:deep(.ant-tabs-top-content.ant-tabs-content.ant-tabs-content-animated) {
  // height:calc(100% - 68px) ;
  // overflow-y: auto;
}
.course-detail-tabs {
  height: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  > .ant-tabs-top-content {
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
