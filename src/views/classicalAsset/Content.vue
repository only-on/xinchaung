<template>
  <div class="classical__container" v-layout-bg>
    <div class="classical__content--header">
      <div class="left">
        <h2>{{ detail.name }}</h2>
        <div>
          创建日期：{{ detail.createdDate }} 最后修改：{{ detail.updatedDate }}
        </div>
      </div>
      <div class="right">
        <watermark-icon icon="cipanjiedian" :title="detail.itemSize" description="文件大小"
                        style="background-color: #2CB6FA"/>
        <watermark-icon icon="wenjianshu" :title="detail.itemCount" description="文件个数"
                        style="background-color: #FFBB3C; margin-left: 25px;"/>
      </div>
    </div>
    <div class="classical__content--main">
      <div class="more-detail">
        <h3>描述</h3>
        <a-divider style="background-color: #d5d5d5;"/>
        <div>{{ detail.description }}</div>
      </div>
      <a-divider style="opacity: 0;"/>
      <div class="classical__data-list">
        <div class="classical__data-list-header">
          <h3>文件列表</h3>
          <div class="classical__data-list-space"></div>
          <div class="classical__data-list-form">
            <a-input-search v-model:value="searchKeyword" placeholder="请输入关键字查询" @search="handleSearch"/>
          </div>
          <a-button class="classical__data-list-upload" type="primary" @click="openUploadDialog">
            <span class="iconfont icon-upload"/>上传文件
          </a-button>
        </div>
        <div class="classical__data-list-content">
          <a-row :gutter="[16, 16]" class="classical__data-list-row" v-if="itemList.length > 0">
            <a-col :span="8" v-for="(item, index) in itemList" :key="'dataset-list-item-' + index">
              <file-card :title="item.file_name" :size="item.size" :preview-url="item.file_html"
                         :download-url="item.file_url" :id="item.id" :suffix="item.suffix"/>
            </a-col>
          </a-row>
          <a-row class="classical__data-list-row--no-data" v-else>
            <a-col :span="24">
              <empty/>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="uploadVisible" title="上传文件" @ok="addItem">
    <a-upload-dragger
        v-model:fileList="uploadFileList"
        accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        name="dataset"
        :data="{pageType: dataType, dataId: dataId}"
        :multiple="false"
        action="/proxyPrefix/dataset/data/upload-file"
        @change="handleUploadChange"
    >
      <p class="ant-upload-drag-icon">
        <span class="iconfont icon-upload"/>
      </p>
      <p class="ant-upload-text">点击选择文件或将文件拖拽到此处</p>
      <p class="ant-upload-hint">
        支持文件格式：ppt、pptx
      </p>
    </a-upload-dragger>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, inject, ref, reactive, onMounted, nextTick, Ref} from "vue";
import {useRoute} from 'vue-router'
import {ILayoutConfiguration} from "../../types";
import WatermarkIcon from "../../components/common/WatermarkIcon.vue";
import FileCard from "../../components/classical/FileCard.vue";
import http from 'src/api'
import Empty from 'src/components/Empty.vue'
import {MessageApi} from "ant-design-vue/lib/message";

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export default defineComponent({
  name: "Content",
  components: {
    FileCard,
    WatermarkIcon,
    Empty
  },
  setup(props, {emit}) {
    const route = useRoute()
    const uploadVisible = ref(false)
    const detail = reactive({
      name: '未知',
      createdDate: '未知',
      updatedDate: '未知',
      itemSize: '0 bytes',
      itemCount: '0 个',
      description: '未知'
    })
    // 分页组件数据
    const itemListPage = reactive({current: 1, pageSize: 10, total: 1})
    // 数据集内部的数据列表
    const itemList = ref([]) as Ref<any[]>
    const searchKeyword = ref('')
    const uploadFileList: Ref<any[]> = ref([])
    // 数据集类型
    let dataType = typeof route.query['type'] !== 'undefined' ? route.query['type'] : 3 // 3是课件
    let dataId = route.params.id

    const $message: MessageApi = inject('$message')!
    const updateNav: (config: ILayoutConfiguration) => void = inject('updataNav')!
    updateNav({
      showNav: true,
      navType: false,
      tabs: [],
      showContent: true,
      navPosition: 'outside',
      backOff: true,
      showPageEdit: true,
      pageEdit: () => {
        console.log('page edit')
      }
    })

    const openUploadDialog = function () {
      uploadVisible.value = true
    }

    const handleSearch = () => {
      getDatasetItemList(searchKeyword.value)
    }

    const handleUploadChange = (info: FileInfo) => {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        $message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        $message.error(`${info.file.name} file upload failed.`);
      }
      console.log('upload changed')
    }

    /**
     * 获取数据集详情
     */
    const getDatasetDetail = () => {
      http.classicalAsset.datasetDetail({param: {id: route.params.id}}).then(res => {
        detail.name = res?.data.name
        detail.createdDate = res?.data.created_at
        detail.updatedDate = res?.data.updated_at
        detail.itemSize = res?.data.item_size
        detail.itemCount = res?.data.item_count + ' 个'
        detail.description = res?.data.description
      })
    }

    /**
     * 获取数据集详情列表
     */
    const getDatasetItemList = (search = '') => {
      http.classicalAsset.datasetItemList({
        param: {
          dataset_id: route.params.id,
          file_name: search,
          pageSize: itemListPage.pageSize,
          page: itemListPage.current
        }
      }).then(res => {
        itemList.value = res?.data.list
      })
    }

    /**
     * 创建数据集数据条目
     */
    const addItem = () => {
      if (uploadFileList.value.length === 0) {
        return
      }
      const beAddItems: any[] = []
      uploadFileList.value.forEach((item) => {
        beAddItems.push(item.response.data)
      })
      http.classicalAsset.datasetAddItem({
        param: {
          dataset_id: dataId, items: beAddItems
        }
      }).then(res => {
        getDatasetItemList()
        uploadVisible.value = false
      })
    }
    onMounted(() => {
      getDatasetDetail()
      getDatasetItemList()
    })
    return {
      uploadVisible,
      detail,
      itemList,
      searchKeyword,
      uploadFileList,
      dataType,
      dataId,
      handleSearch,
      openUploadDialog,
      handleUploadChange,
      addItem
    }
  }
})
</script>

<style lang="less" scoped>
.classical__container {
  .classical__content--header {
    display: flex;

    .left {
      flex: 1;
    }
  }

  .classical__content--main {
    margin-top: @margin-lg + 21px;

    .classical__data-list {
      .classical__data-list-header {
        display: flex;
        align-items: center;

        .classical__data-list-space {
          flex: 1;
        }

        .classical__data-list-form {
          width: 30%;
        }

        .classical__data-list-upload {
          margin-left: @margin-md;
        }
      }

      .classical__data-list-content {
        padding: @padding-md 0px;

        .classical__data-list-row {
          width: 100%;
        }

        .classical__data-list-row--no-data {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
