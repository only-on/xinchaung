<template>
  <div class="trainDetail" v-layout-bg>
    <div class="top-info">
      <div class="row">
        <div><span>实训名称：</span>{{}}</div>
        <div><span>任课老师：</span>{{}}</div>
      </div>
      <div class="row">
        <div><span>实验数：</span>{{}}</div>
        <div><span>课时数：</span>{{}}</div>
      </div>
      <div class="row">
        <div><span>创建时间：</span>{{}}</div>
        <div><span>更新时间：</span>{{}}</div>
      </div>
    </div>
    <div class="nav-tabs">
      <a-tabs type="card" default-active-key="0" @change="callback">
        <a-tab-pane v-for="item in tabs" :key="item.key">
          <template #tab>
            <div v-if="item.key !== 2">
              {{ item.tab }}
            </div>
            <div v-else>
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  {{ item.tab }}
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu @click="onClickDrop">
                    <a-menu-item v-for="it in item.childTabs" :key="it.key">
                      {{ it.item }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div>
        <component :is="componentName"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, inject, ref, Ref } from "vue";
import { useRouter } from "vue-router";
import BasicInfo from "../../components/basicInfo.vue";
import assignment from "../../components/assignment.vue";
import trainingGuide from "../../components/trainingGuide.vue";
import trainingCourseware from "../../components/trainingCourseware.vue";
import courseSchedule from "../../components/courseSchedule.vue";
import groupInfo from "../../components/groupInfo.vue";
import trainEnvir from "../../components/trainEnvir.vue";
import { DownOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "trainDetail",
  components: {
    BasicInfo,
    assignment,
    trainingGuide,
    trainingCourseware,
    courseSchedule,
    groupInfo,
    trainEnvir,
    DownOutlined,
  },
  setup: (props, context) => {
    const router = useRouter();
    const tabs = [
      { key: 1, tab: "基础信息", componentName: "BasicInfo" },
      {
        key: 2,
        tab: "内容",
        childTabs: [
          { key: 1, item: "实训任务书", componentName: "assignment" },
          { key: 2, item: "实训指导", componentName: "trainingGuide" },
          { key: 3, item: "实训课件", componentName: "trainingCourseware" },
          { key: 4, item: "实训环境", componentName: "trainEnvir" },
        ],
      },
      { key: 3, tab: "排课信息", componentName: "courseSchedule" },
      { key: 4, tab: "分组信息", componentName: "groupInfo" },
    ];
    const componentName: Ref<string | undefined> = ref("BasicInfo");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: false,
      backOff: false,
      showPageEdit: false,
    });
    const methods = {
      callback(key: any) {
        if (key !== 2) {
          componentName.value = tabs[key - 1].componentName;
        }
      },
      onClickDrop(selectInfo: any) {
        const dropdownTab: any = tabs[1].childTabs;
        componentName.value = dropdownTab[selectInfo.key - 1].componentName;
      },
    };
    onMounted(() => {
      //   console.log(router.currentRoute.value.query.id, "kkkkkkkkk");
    });
    return { tabs, ...methods, componentName };
  },
});
</script>
<style lang="less">
.trainDetail {
  .row {
    display: flex;
    width: 100%;
    border-bottom: 1px dashed @avatar-bg;
    margin-bottom: 10px;
    > div {
      width: 30%;
      padding: 8px;
    }
    span {
      display: inline-block;
      width: 80px;
      vertical-align: top;
      text-align: right;
      font-weight: bold;
    }
  }
  .nav-tabs {
    margin-top: 5px;
    .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
      border-top: 2px solid @theme-color;
    }
    .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
      border-radius: 0px;
      border-right: none;
    }
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0px;
  }
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    box-shadow: none;
  }
  a {
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    a {
      color: @theme-color;
    }
  }
}
</style>
