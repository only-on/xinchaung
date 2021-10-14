<template>
  <div class="classical__container" v-layout-bg>
    <div class="classical__card">
      <div class="classical__search-form">
        <div class="classical__search">
          <a-input
              class="classical_search-input"
              v-model:value="searchStr"
              placeholder="请输入目录名称关键字查询"
              @keypress.enter="handleSearch"
          >
            <template #prefix>
              <a-button type="text" class="classical__search-form--prefix" @click="handleSearch">
                <span class="iconfont icon-sousuo"/>
              </a-button>
            </template>
          </a-input>
        </div>
        <div class="classical_op">
          <disk-usage
              :available="diskUsage.available"
              :total="diskUsage.total"
              :ratio="diskUsage.ratio"
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
      <div class="data" v-if="data.length > 0">
        <asset-folder v-for="(item, key) in data" :key="'dataset-dir-' + key"
                      :title="item.name"
                      :date="item.created_at"
                      :size="typeof item.item_size !== 'undefined' ? item.item_size : ''"
                      :count="(typeof item.item_count !== 'undefined' ? item.item_count : '') + '个'"
                      @click="gotoContent(item.id, item.is_public)"/>
      </div>
      <div class="data" v-else>
        <empty/>
      </div>
      <div class="page" v-if="data.length > 0">
        <a-pagination
            show-size-changer
            v-model:current="dataPage.current"
            :pageSize="dataPage.pageSize"
            :total="dataPage.total"
            @change="handlePageChange"
        />
      </div>
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
import {defineComponent, ref, reactive, inject, computed, Ref, onMounted} from "vue";
import AssetFolder from "../../components/classical/AssetFolder.vue";
import DiskUsage from "../../components/classical/DiskUsage.vue";
import {ILayoutConfiguration} from "../../types";
import {useRoute, useRouter} from "vue-router";
import http from '../../api'
import Empty from 'src/components/Empty.vue'

export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    AssetFolder,
    DiskUsage,
    Empty
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchStr = ref("");
    const createFolderVisible = ref(false);
    const nameFocused = ref(false);
    const descFocused = ref(false);
    const folderInfo = reactive({
      name: "",
      description: "",
    });
    const data = ref([]) as Ref<any[]>;
    // 分页组件数据
    const dataPage = reactive({current: 1, pageSize: 10, total: 1})
    // 数据集类型
    let dataType = typeof route.query['type'] !== 'undefined' ? route.query['type'] : 3 // 3是课件
    // 磁盘利用情况
    const diskUsage = reactive({available: '0GB', total: '0GB', ratio: 0})

    const updateNav: (config: ILayoutConfiguration) => void = inject('updataNav')!
    updateNav({
      showNav: true,
      navPosition: 'outside',
      tabs: [
        {name: "公有", componenttype: 0},
        {name: "私有", componenttype: 1},
      ],
      componenttype: 1,
      showContent: true,
      navType: false,
      backOff: false,
      showPageEdit: false,
      pageEdit: () => {
      }
    })
    const configuration: ILayoutConfiguration = inject('configuration')!
    const showDiskUsage = computed(() => {
      return configuration.componenttype === 1
    })
    const dataIsPublic = computed(() => {
      return configuration.componenttype === 1 ? 0 : 1
    })

    const labelCol = {span: 3};
    const wrapperCol = {span: 21};
    const handleSearch = (e: Event) => {
      getDataSetList(1, 10, searchStr.value)
    };
    const createFolder = () => {
      createFolderVisible.value = true;
    };
    const handleCreateFolder = () => {
      createFolderVisible.value = false;
    };
    /**
     * 前往数据详情页面
     * @param {number} id 数据集id
     * @param {number} open 是否公开
     */
    const gotoContent = (id: number, open: number) => {
      console.log('[asset/panel] goto: ', id, open)
      router.push('/teacher/classical/content/' + open + '/' + id)
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

    // 获取数据
    const getDataSetList = (page: number = 1, pageSize: number = 10, name = '') => {
      http.classicalAsset.datasetList({
        param: {
          type: dataType,
          is_public: dataIsPublic.value,
          name: name,
          page: page,
          pageSize: pageSize,
        }
      }).then(res => {
        console.log('datasetList: ', res)
        data.value = res!.data.list

        dataPage.current = res!.data.page.currentPage
        dataPage.pageSize = res!.data.page.perPage
        dataPage.total = res!.data.page.totalCount
      })
    }

    // 获取磁盘信息
    const getDiskInfo = () => {
      http.classicalAsset.diskInfo({}).then(res => {
        diskUsage.available = res!.data.un_used
        diskUsage.total = res!.data.total
        diskUsage.ratio = parseFloat(res!.data.used_accuracy)
      })
    }

    // 处理翻页
    const handlePageChange = (page: number, pageSize: number) => {
      getDataSetList(page, pageSize, searchStr.value)
    }

    onMounted(() => {
      getDataSetList()
      getDiskInfo()
    })

    return {
      searchStr,
      showDiskUsage,
      createFolderVisible,
      folderInfo,
      labelCol,
      wrapperCol,
      nameFocused,
      descFocused,
      data,
      dataPage,
      diskUsage,
      gotoContent,
      handleSearch,
      createFolder,
      handleCreateFolder,
      handleNameFocused,
      handleDescriptionFocused,
      handleNameBlurred,
      handleDescriptionBlurred,
      handlePageChange
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

    .page {
      display: flex;
      justify-content: center;
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
