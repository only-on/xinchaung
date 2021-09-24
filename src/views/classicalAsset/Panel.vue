<template>
  <div class="classical__container" v-layout-bg>
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
                <span class="iconfont icon-sousuo"/>
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
            ><span class="iconfont icon-tianjia"></span>&nbsp;
            </template
            >
            创建目录
          </a-button>
        </div>
      </div>
      <asset-folder @click="gotoContent(1)"/>
      <asset-folder @click="gotoContent(2)"/>
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
          <a-textarea
              rows="1"
              placeholder="输入名称"
              v-model:value="folderInfo.name"
              showCount
              :maxlength="10"
              class="classical__folder-desc"
          >
          </a-textarea>
        </a-form-item>
        <a-form-item label="描述：">
          <a-textarea
              rows="4"
              placeholder="请输入描述"
              v-model:value="folderInfo.description"
              showCount
              :maxlength="500"
              class="classical__folder-desc"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, reactive, inject, watch, computed} from "vue";
import AssetFolder from "../../components/classical/AssetFolder.vue";
import DiskUsage from "../../components/classical/DiskUsage.vue";
import {ILayoutConfiguration} from "../../types";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    AssetFolder,
    DiskUsage,
  },
  setup() {
    const router = useRouter();
    const searchStr = ref("");
    const createFolderVisible = ref(false);
    const folderInfo = reactive({
      name: "",
      description: "",
    });
    const updateNav: (config: ILayoutConfiguration) => void = inject('updataNav')!
    updateNav({
      showNav: true,
      navPosition: 'outside',
      tabs: [
        {name: "公有", componenttype: 0},
        {name: "私有", componenttype: 1},
      ],
      componenttype: 0,
      navType: false
    })
    const configuration: ILayoutConfiguration = inject('configuration')!
    const showDiskUsage = computed(() => {
      return configuration.componenttype === 1
    })

    const labelCol = {span: 3};
    const wrapperCol = {span: 21};
    const handleSearch = (searchValue: string) => {
      console.log("[classical][panel] searching: ", searchValue);
    };
    const createFolder = () => {
      createFolderVisible.value = true;
    };
    const handleCreateFolder = () => {
      createFolderVisible.value = false;
    };
    const gotoContent = (id: number) => {
      console.log('[asset/panel] goto: ', id)
      router.push('/teacher/classical/content/private/232')
    }
    return {
      searchStr,
      showDiskUsage,
      createFolderVisible,
      folderInfo,
      labelCol,
      wrapperCol,
      gotoContent,
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
