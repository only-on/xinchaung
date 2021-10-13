<template>
  <div class="classical__container" v-layout-bg>
    <div class="classical__card">
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
    </div>
    <a-modal
        v-model:visible="createFolderVisible"
        title="创建目录"
        @ok="handleCreateFolder"
        class="classical__create"
    >
      <a-form
          :model="folderInfo"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item label="名称：">
          <div class="classical__input--count-inner" :class="{'classical__input--focused': nameFocused}">
            <a-textarea
                rows="1"
                placeholder="输入名称"
                v-model:value="folderInfo.name"
                showCount
                :maxlength="10"
                class="classical__folder-desc"
                @focus="handleNameFocused"
                @blur="handleNameBlurred"
            />
          </div>
        </a-form-item>
        <a-form-item label="描述：">
          <div class="classical__input--count-inner" :class="{'classical__input--focused': descFocused}">
            <a-textarea
                rows="4"
                placeholder="请输入描述"
                v-model:value="folderInfo.description"
                showCount
                :maxlength="500"
                class="classical__folder-desc"
                @focus="handleDescriptionFocused"
                @blur="handleDescriptionBlurred"
            />
          </div>
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
    const nameFocused = ref(false);
    const descFocused = ref(false);
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
      showContent:true,
      navType: false,
      backOff: false,
      showPageEdit: false,
      pageEdit: () => {}
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
    const handleNameFocused = (e: FocusEvent) => {
      console.log('[classical/panel] name focused');
      nameFocused.value = true;
    }
    const handleDescriptionFocused = (e: FocusEvent) => {
      console.log('[classical/panel] description focused')
      descFocused.value = true
    }

    const handleNameBlurred = (e: Event) => {
      console.log('[classical/panel] name blurred');
      nameFocused.value = false;
    }
    const handleDescriptionBlurred = (e: Event) => {
      console.log('[classical/panel] description blurred')
      descFocused.value = false
    }
    return {
      searchStr,
      showDiskUsage,
      createFolderVisible,
      folderInfo,
      labelCol,
      wrapperCol,
      nameFocused,
      descFocused,
      gotoContent,
      handleSearch,
      createFolder,
      handleCreateFolder,
      handleNameFocused,
      handleDescriptionFocused,
      handleNameBlurred,
      handleDescriptionBlurred
    };
  },
});
</script>
<style lang="less" scoped>
.classical__container {
  margin: 0 auto;
  min-height: 750px;
  background: none !important;

  .classical__card {
    width: 100%;
    height: 100%;

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

.classical__input--count-inner {
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  :deep(.ant-input) {
    border: none;
    resize: none;
  }
  :deep(.ant-input:focus) {
    box-shadow: none;
  }

  :deep(.ant-input-textarea-show-count::after) {
    margin-bottom: 0;
  }

  &:hover {
    border: 1px solid @theme-color;
  }

  &.classical__input--focused {
    border: 1px solid @theme-color;
    box-shadow: 0 0 0 2px @theme-scroll;
  }
}

</style>
