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
              <!-- <span>{{ item.tab }}</span> -->
              <a-select class="select" default-value="内容" @change="handleChange">
                <a-select-option
                  v-for="it in item.childTabs"
                  :key="it.key"
                  :value="it.key"
                >
                  {{ it.item }}
                </a-select-option>
              </a-select>
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div></div>
    </div>
  </div>
</template>
<script lang="ts">
import router from "src/routers";
import { defineComponent, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import BasicInfo from "../../components/basicInfo.vue";
import groupInfo from "../../components/groupInfo.vue";
export default defineComponent({
  name: "trainDetail",
  components: { BasicInfo, groupInfo },
  setup: (props, context) => {
    const router = useRouter();
    const tabs = [
      { key: 1, tab: "基础信息" },
      {
        key: 2,
        tab: "内容",
        childTabs: [
          { key: 1, item: "实训任务书" },
          { key: 2, item: "实训指导" },
          { key: 3, item: "实训课件" },
          { key: 4, item: "实训环境" },
        ],
      },
      { key: 3, tab: "排课信息" },
      { key: 4, tab: "分组信息" },
    ];
    const componentsNames = {
      1: "BasicInfo",
      2: { content: {} },
      3: "stu",
      4: "groupInfo",
    };
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
        console.log(key);
      },
      handleChange(value: any) {
        console.log(value);
      },
    };
    onMounted(() => {
      //   console.log(router.currentRoute.value.query.id, "kkkkkkkkk");
    });
    return { tabs, ...methods, componentsNames };
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
  //   .ant-select-single .ant-select-selector .ant-select-selection-item {
  //     position: relative;
  //     left: -43px !important;
  //   }
  //   .ant-select-arrow {
  //     position: absolute;
  //     right: 20px;
  //   }
  //   .ant-select-single.ant-select-show-arrow .ant-select-selection-item,
  //   .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  //     opacity: 0;
  //   }
}
</style>
