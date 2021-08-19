<template>
  <div class="classical__container">
    <div class="classical__card">
      <nav-tab :tabs="tabs" @tabSwitch="tabSwitch" style="width: auto" />
      <disk-usage></disk-usage>
      <div class="classical__search-form">
        <a-input-search
          class="classical_search-input"
          v-model:value="searchStr"
          placeholder="请输入目录名称关键字查询"
          @search="handleSearch"
        />
        <a-button type="primary">
          <template #icon
            ><span class="iconfont icon-tianjia"></span>&nbsp;</template
          >
          创建目录
        </a-button>
      </div>
      <asset-folder></asset-folder>
      <asset-folder></asset-folder>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
// import http from "src/api/index";
import { ITab } from "src/components/NavTab.vue";
import AssetFolder from "../../components/classical/AssetFolder.vue";
import DiskUsage from '../../components/classical/DiskUsage.vue';
export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    AssetFolder,
    DiskUsage
  },
  setup() {
    const searchStr = ref("");
    const tabs = [
      { name: "公有", componenttype: 0 },
      { name: "私有", componenttype: 1 },
    ];

    // http.classicalAsset.datasetList({
    //   param: {
    //     type: 3,
    //     page: 1,
    //     pageSize: 10,
    //     is_public: 1,
    //     name: "",
    //   },
    //   success: (resp) => {
    //     console.log("got resp: ", resp);
    //   },
    // });

    const tabSwitch = (tab: ITab) => {
      console.log(tab);
    };
    const handleSearch = (searchValue: string) => {
      console.log("[classical][panel] searching: ", searchValue);
    };
    return { tabs, searchStr, tabSwitch, handleSearch };
  },
});
</script>
<style lang="less">
.classical__container {
  width: @center-width;
  margin: 0 auto;
  min-height: 750px;
  background: none !important;
  .classical__card {
    width: 100%;
    height: 100%;
    .classical__search-form {
      margin-top: @margin-md;
      padding: @padding-md 0px;
      display: flex;
      justify-content: space-between;
      .classical_search-input {
        width: 50%;
      }
    }
  }
}
</style>
