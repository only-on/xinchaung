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
        <watermark-icon
          icon="cipanjiedian"
          :title="detail.itemSize"
          description="文件大小"
          :style="{ backgroundColor: '#2cb6fa' }"
        />
        <watermark-icon
          icon="wenjianshu"
          :title="detail.itemCount"
          description="文件个数"
          :style="{ backgroundColor: '#ffbb3c', marginLeft: '25px' }"
        />
      </div>
    </div>
    <div class="classical__content--main">
      <div class="more-detail">
        <h3>描述</h3>
        <a-divider style="background-color: #d5d5d5" />
        <div class="description">{{ detail.description }}</div>
        <a-divider :style="{ backgroundColor: '#d5d5d5' }" />
        <div>{{ detail.description }}</div>
      </div>
      <a-divider style="opacity: 0" />
      <div class="classical__data-list">
        <div class="classical__data-list-header">
          <h3>文件列表</h3>
          <div class="classical__data-list-space"></div>
          <div class="classical__data-list-form">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="请输入关键字查询"
              @search="handleSearch"
            />
          </div>
          <a-button
            v-if="powerType === 0 ? false : true"
            class="classical__data-list-upload"
            type="primary"
            @click="openUploadDialog"
          >
            <span class="iconfont icon-upload" />上传文件
          </a-button>
        </div>
        <div class="classical__data-list-content">
          <a-row
            class="classical__data-list-row"
            v-if="itemList.length > 0"
          >
            <a-col
              class="col"
              :span="8"
              v-for="(item, index) in itemList"
              :key="'dataset-list-item-' + index"
            >
              <file-card
                class="fileCard"
                :title="item.file_name"
                :size="item.size"
                :preview-url="item.file_html"
                :download-url="item.file_url"
                :id="item.id"
                :suffix="item.suffix"
                @removed="handleRemoved"
              />
            </a-col>
          </a-row>
          <a-row class="classical__data-list-row--no-data" v-else>
            <a-col :span="24">
              <empty />
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="uploadVisible" title="上传文件" @ok="addItem">
    <a-upload-dragger
      v-model:fileList="uploadFileList"
      name="dataset"
      :accept="accept"
      :data="{ pageType: dataType, dataId: dataId }"
      :multiple="false"
      :before-upload="handleBeforeUpload"
      :action="
        env
          ? '/proxyPrefix/dataset/data/upload-file'
          : '/dataset/data/upload-file'
      "
      @change="handleUploadChange"
    >
      <p class="ant-upload-drag-icon">
        <span class="iconfont icon-upload" />
      </p>
      <p class="ant-upload-text">点击选择文件或将文件拖拽到此处</p>
      <p class="ant-upload-hint">
        <span v-if="supportedSuffix">支持文件格式：{{ supportedSuffix }}</span>
        <span v-if="supportedSize"
          >，支持文件大小：{{ supportedSize }}以内</span
        >
      </p>
    </a-upload-dragger>
  </a-modal>
  <a-modal
    v-model:visible="editContentVisible"
    title="创建目录"
    @ok="handleUpdateFolder"
    class="classical__create"
  >
    <a-form :model="folderInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="名称：">
        <!-- <div
          class="classical__input--count-inner"
          :class="{ 'classical__input--focused': nameFocused }"
        >
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
        </div> -->
        <number-input v-model:value="folderInfo.name" showCount style="height:32px" :maxlength="100"></number-input>
      </a-form-item>
      <a-form-item label="描述：">
        <div
          class="classical__input--count-inner"
          :class="{ 'classical__input--focused': descFocused }"
        >
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
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  reactive,
  onMounted,
  nextTick,
  Ref,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { ILayoutConfiguration } from "../../types";
import WatermarkIcon from "../../components/common/WatermarkIcon.vue";
import FileCard from "../../components/classical/FileCard.vue";
import http from "src/api";
import Empty from "src/components/Empty.vue";
import { MessageApi } from "ant-design-vue/lib/message";
import numberInput from "src/components/aiAnt/numberInput.vue"

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
    Empty,
    numberInput
  },
  setup(props, { emit }) {
    var route = useRoute();
    const uploadVisible = ref(false);
    const editContentVisible = ref(false);
    const nameFocused = ref(false);
    const descFocused = ref(false);
    const folderInfo = reactive({
      name: "",
      description: "",
    });

    const env = process.env.NODE_ENV === "development";
    const originalFolderInfo = { name: "", description: "" };

    const labelCol = { span: 3 };
    const wrapperCol = { span: 21 };

    const detail = reactive({
      name: "未知",
      createdDate: "未知",
      updatedDate: "未知",
      itemSize: "0 bytes",
      itemCount: "0 个",
      description: "未知",
    });
    // 分页组件数据
    const itemListPage = reactive({ current: 1, pageSize: 10, total: 1 });
    // 数据集内部的数据列表
    const itemList = ref([]) as Ref<any[]>;
    const searchKeyword = ref("");
    const uploadFileList: Ref<any[]> = ref([]);
    // 数据集类型
    let dataType: number = parseInt(route.params.type as string); // 3是课件
    let powerType: number = parseInt(route.params.powerType as string); //私有还是共有
    let dataId: number = parseInt(route.params.id as string);

    const $message: MessageApi = inject("$message")!;
    const updateNav: (config: ILayoutConfiguration) => void =
      inject("updataNav")!;
    updateNav({
      showNav: true,
      navType: false,
      tabs: [],
      showContent: true,
      navPosition: "outside",
      backOff: true,
      showPageEdit: powerType === 0 ? false : true,
      pageEdit: () => {
        folderInfo.name = originalFolderInfo.name;
        folderInfo.description = originalFolderInfo.description;
        editContentVisible.value = true;
      },
    });

    const fileRequirements = {
      3: {
        suffix: ["ppt", "pptx"],
        mime: [
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
        size: 1024 * 1024 * 5, // 5MB
      },
      4: {
        suffix: ["mp4"],
        mime: ["video/mp4"],
        size: 1024 * 1024 * 500, // 视频-500MB
      },
      5: {
        suffix: ["doc", "docx"],
        mime: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        size: 1024 * 1024 * 5, // 5MB
      },
      6: {
        suffix: ["doc", "docx"],
        mime: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        size: 1024 * 1024 * 5, // 5MB
      },
    };
    const acceptMap = {
      3: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation", // 课件
      4: ".mp4,video/mp4", // 视频
      5: ".doc,docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", // 备课资料
      6: ".doc,docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", // 教学指导
    };
    const accept = computed(() => {
      return acceptMap[dataType] || acceptMap[3];
    });

    const supportedSuffixMap = {
      3: "ppt、pptx",
      4: "mp4",
      5: "doc、docx",
      6: "doc、docx",
    };
    const supportedSuffix = computed(() => {
      return supportedSuffixMap[dataType] || supportedSuffixMap[3];
    });

    const supportedSizeMap = {
      3: "",
      4: "500MB",
      5: "",
      6: "",
    };
    const supportedSize = computed(() => {
      return supportedSizeMap[dataType] || "";
    });

    const openUploadDialog = function () {
      uploadVisible.value = true;
    };

    const handleSearch = () => {
      getDatasetItemList(searchKeyword.value);
    };

    const handleUploadChange = (info: FileInfo) => {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        // $message.success(`${info.file.name} file uploaded successfully.`);
        $message.success(`上传成功`);
      } else if (status === "error") {
        $message.error(`${info.file.name} file upload failed.`);
      }
      console.log("upload changed");
    };

    /**
     * 获取数据集详情
     */
    const getDatasetDetail = () => {
      http.classicalAsset
        .datasetDetail({ param: { id: route.params.id } })
        .then((res) => {
          detail.name = res?.data.name;
          detail.createdDate = res?.data.created_at;
          detail.updatedDate = res?.data.updated_at;
          detail.itemSize = res?.data.item_size;
          detail.itemCount = res?.data.item_count + " 个";
          detail.description = res?.data.description;

          folderInfo.name = res?.data.name;
          folderInfo.description = res?.data.description;

          originalFolderInfo.name = res?.data.name;
          originalFolderInfo.description = res?.data.description;
        });
    };

    /**
     * 获取数据集详情列表
     */
    const getDatasetItemList = (search = "") => {
      http.classicalAsset
        .datasetItemList({
          param: {
            dataset_id: route.params.id,
            file_name: search,
            pageSize: itemListPage.pageSize,
            page: itemListPage.current,
          },
        })
        .then((res) => {
          itemList.value = res?.data.list;
        });
    };

    /**
     * 创建数据集数据条目
     */
    const addItem = () => {
      if (uploadFileList.value.length === 0) {
        return;
      }
      const beAddItems: any[] = [];
      uploadFileList.value.forEach((item) => {
        beAddItems.push(item.response.data);
      });
      http.classicalAsset
        .datasetAddItem({
          param: {
            dataset_id: dataId,
            items: beAddItems,
          },
        })
        .then((res) => {
          getDatasetItemList();
          uploadVisible.value = false;
        });
    };

    /**
     * 处理文件删除之后的逻辑
     */
    const handleRemoved = () => {
      getDatasetItemList();
    };

    /**
     * 更新文件夹
     */
    const handleUpdateFolder = () => {
      http.classicalAsset
        .datasetFolderCreate({
          param: {
            type: dataType,
            id: dataId,
            name: folderInfo.name,
            description: folderInfo.description,
          },
        })
        .then((res) => {
          if (!res) {
            $message.error("更新失败！");
            return;
          }
          editContentVisible.value = false;
          getDatasetDetail();
        });
    };

    const handleNameFocused = (e: FocusEvent) => {
      console.log("[classical/panel] name focused");
      nameFocused.value = true;
    };
    const handleDescriptionFocused = (e: FocusEvent) => {
      console.log("[classical/panel] description focused");
      descFocused.value = true;
    };
    const handleNameBlurred = (e: Event) => {
      console.log("[classical/panel] name blurred");
      nameFocused.value = false;
    };
    const handleDescriptionBlurred = (e: Event) => {
      console.log("[classical/panel] description blurred");
      descFocused.value = false;
    };

    const checkSuffix = (dataType: number, file: File) => {
      const suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      return fileRequirements[dataType].suffix.includes(suffix);
    };

    const checkSize = (dataType: number, file: File) => {
      return file.size <= fileRequirements[dataType].size;
    };

    const checkMime = (dataType: number, file: File) => {
      console.log(file.name, file.name.split("."));
      // return fileRequirements[dataType].mime.includes(file.type);
      return fileRequirements[dataType].suffix.includes(
        file.name.split(".")[file.name.split(".").length - 1]
      );
    };

    /**
     * 上传文件前进行检查，返回false则不上传；
     * 支持返回promise，对于promise，只有在resolve之后才上传
     * @param file
     * @param fileList
     */
    const handleBeforeUpload = (file: File, fileList: File[]) => {
      console.log(
        "[handleBeforeUpload] file: ",
        file,
        ", fileList: ",
        fileList
      );
      if (!checkSuffix(dataType, file)) {
        $message.warning(
          "文件后缀名不符合要求，要求为：" +
            fileRequirements[dataType].suffix.join("")
        );
        return false;
      }
      // if (!checkSize(dataType, file)) {
      //   $message.warning(
      //     "文件大小不符合要求，要求为：" +
      //       fileRequirements[dataType].size / 1024 / 1024 +
      //       "MB"
      //   );
      //   return false;
      // }
      if (!checkMime(dataType, file)) {
        console.log(dataType, file);
        $message.warning(
          "文件类型不符合要求，要求为：" +
            fileRequirements[dataType].mime.join("")
        );
        return false;
      }
    };
    onMounted(() => {
      getDatasetDetail();
      getDatasetItemList();
    });

    return {
      env,
      uploadVisible,
      detail,
      itemList,
      searchKeyword,
      uploadFileList,
      dataType,
      powerType,
      dataId,
      labelCol,
      wrapperCol,
      editContentVisible,
      folderInfo,
      nameFocused,
      descFocused,
      accept,
      supportedSuffix,
      supportedSize,
      handleSearch,
      openUploadDialog,
      handleUploadChange,
      addItem,
      handleRemoved,
      handleUpdateFolder,
      handleNameFocused,
      handleDescriptionFocused,
      handleNameBlurred,
      handleDescriptionBlurred,
      handleBeforeUpload,
    };
  },
});
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
    margin-top: 45px;
    .description{
      color:rgba(0, 0, 0, 0.65);
    }
    margin-top: 45px;
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
          margin-left: var(--margin-md);
          .icon-upload{
            font-size: 14px;
            margin-right: 4px;
          }
          margin-left: var(--margin-md);
        }
      }
      .classical__data-list-content {
        padding: var(--padding-md) 0px;
        .classical__data-list-row {
          // width: 100%;
          .fileCard{
            margin-right: 14px;
            margin-top: 14px;
          }
          .col:nth-child(3n) .fileCard{
            margin-right: 0px;
          }
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

.classical__input--count-inner {
  border: 1px solid var(--black-85);
  border-radius: var(--border-radius-default);

  :deep(.ant-input) {
    border: none;
    resize: none;
  }

  :deep(.ant-input:focus) {
    box-shadow: none;
  }

  :deep(.ant-input-textarea-show-count::after) {
    margin-bottom: 0;
    font-size: 12px;
    color:rgba(0, 0, 0, 0.25);
  }

  &:hover {
    border: 1px solid var(--purpleblue-6);
  }

  &.classical__input--focused {
    border: 1px solid var(--purpleblue-6);
    box-shadow: 0 0 0 2px var(--purpleblue-1);
  }
}
.ant-upload-drag-icon .icon-upload{
  color:var(--purpleblue-6);
}
.ant-upload-text{
  font-size: 14px!important;
}
.ant-upload-hint{
  font-size: 12px!important;
}
</style>
