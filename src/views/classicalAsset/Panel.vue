<template>
  <nav-tab :tabs="tabs" @tabSwitch="tabSwitch" />
  <p>资源面板</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import http from "src/api/index";
import NavTab, { ITab } from "src/components/NavTab.vue";
export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    NavTab
  },
  setup() {
    const tabs = [
      { name: "公有", componenttype: 0 },
      { name: "私有", componenttype: 1 },
    ];

    http.classicalAsset.datasetList({
      param: {
        type: 3,
        page: 1,
        pageSize: 10,
        is_public: 1,
        name: "",
      },
      success: (resp) => {
        console.log("got resp: ", resp);
      },
    });

    const tabSwitch = (tab: ITab) => {
      console.log(tab);
    };
    return { tabs, tabSwitch };
  },
});
</script>
