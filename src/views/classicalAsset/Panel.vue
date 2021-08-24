<template>
  <div class="classical__container">
    <nav-tab :tabs="tabs" @tabSwitch="tabSwitch" style="width: auto"></nav-tab>
    <a-card class="classical__card">
      <div class="classical__search-form">
        <div class="classical__search">
          <a-input
            class="classical_search-input"
            v-model:value="searchStr"
            placeholder="请输入目录名称关键字查询"
            @search="handleSearch"
          >
            <template #prefix>
              <a-button type="text" class="classical__search-form--prefix">
                <span class="iconfont icon-sousuo" />
              </a-button>
            </template>
          </a-input>
        </div>
        <div class="classical_op">
          <disk-usage
            v-show="showDiskUsage"
            class="classical__disk-usage--container"
          ></disk-usage>
          <a-button type="primary" @click="createFolder">
            <template #icon
              ><span class="iconfont icon-tianjia"></span>&nbsp;</template
            >
            创建目录
          </a-button>
        </div>
      </div>
      <asset-folder></asset-folder>
      <asset-folder></asset-folder>
    </a-card>
    <a-modal
      v-model:visible="createFolderVisible"
      title="创建目录"
      @ok="handleCreateFolder"
    >
      <a-form
        :model="folderInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="名称：">
          <a-input
            placeholder="输入名称"
            v-model:value="folderInfo.name"
            showCount
            maxlength="10"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="描述：">
          <a-textarea
            rows="1"
            placeholder="请输入描述"
            v-model:value="folderInfo.description"
            showCount
            :maxlength="100"
            class="classical__folder-desc"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import http from "src/api/index";
import { ITab } from "src/components/NavTab.vue";
import AssetFolder from "../../components/classical/AssetFolder.vue";
import DiskUsage from "../../components/classical/DiskUsage.vue";
export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    AssetFolder,
    DiskUsage,
  },
  setup() {
    const searchStr = ref("");
    const showDiskUsage = ref(false);
    const createFolderVisible = ref(false);
    const folderInfo = reactive({
      name: "",
      description: "",
    });
    const labelCol = { span: 3 };
    const wrapperCol = { span: 21 };

    const tabs = [
      { name: "公有", componenttype: 0 },
      { name: "私有", componenttype: 1 },
    ];

    http.classicalAsset.fakeRequest({
      param: {
        fake: 'yes'
      },
      urlParams: {
        name: 'xiaowang'
      }
    })
    http.classicalAsset.fakeRequestNoUrlParam({
      param: {
        fake: 'yes'
      },
    })
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
      showDiskUsage.value = tab.componenttype === 1;
    };
    const handleSearch = (searchValue: string) => {
      console.log("[classical][panel] searching: ", searchValue);
    };
    const createFolder = () => {
      createFolderVisible.value = true;
    };
    const handleCreateFolder = () => {
      createFolderVisible.value = false;
    };
    return {
      tabs,
      searchStr,
      showDiskUsage,
      createFolderVisible,
      folderInfo,
      labelCol,
      wrapperCol,
      tabSwitch,
      handleSearch,
      createFolder,
      handleCreateFolder,
    };
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
    margin-top: @margin-lg;
    box-shadow: 0 3px 6px 0px @shadow-color;
    .ant-card-body {
      padding: 40px 50px;
    }
    .classical__disk-usage--container {
      margin-right: @margin-lg;
    }
    .classical__search-form {
      padding: 0px 0px @padding-md 0px;
      display: flex;
      justify-content: space-between;
      .classical__search-form--prefix {
        padding: 0;
      }
      .classical_search-input {
        width: 400px;
      }
      .classical_op {
        display: flex;
      }
    }
  }
}
.classical__folder-desc {
  textarea {
    resize: none;
  }
}
</style>
