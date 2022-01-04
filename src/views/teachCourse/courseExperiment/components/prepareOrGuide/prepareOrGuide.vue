<template>
  <div v-if="prepareShowTab === 'loading'" class="prepare-lessons-loading">
    <a-spin />
  </div>
  <div v-if="prepareShowTab === 'pdf'" class="chapter-intro">
    <div class="action-box" v-role="[tab]">
      <a-button type="primary" @click="remove">移除</a-button>
      <a-button type="primary" @click="openUploadModal">上传</a-button>
      <a-button type="primary" @click="selectFile">选择</a-button>
    </div>
    <iframe
      :src="`${env?'':'/frontend'}/pdfjs-2.5.207/web/viewer.html?file=${
        env ? '/proxyPrefix' + introFile[0].file_html : introFile[0].file_html
      }`"
      frameborder="0"
    ></iframe>
  </div>
  <div v-if="prepareShowTab === 'none'" class="chapter-intro-none">
    <empty text="暂无数据，可从数据中心选择或本地上传文件"> </empty>
    <div class="action-btn" v-role="[tab]">
      <a-button type="primary" @click="openUploadModal">上传</a-button>
      <a-button type="primary" @click="selectFile">选择</a-button>
    </div>
  </div>
  <div v-if="prepareShowTab === 'select'" class="select-data-set-box">
    <div class="select-head">
      <before-icon :icon="group12">
      <a-select
        v-model:value="tableParams.dataset_id"
        placeholder="请选择数据集目录"
        @change="datasetChange"
        style="width: 200px"
      >
        <a-select-opt-group v-for="(val, key) in datasetList" :key="key">
          <template #label>
            <span>
              {{ key === "public" ? "共有" : "私有" }}
            </span>
          </template>
          <a-select-option v-for="(v, k) in val" :key="k" :value="k">{{
            v
          }}</a-select-option>
        </a-select-opt-group>
      </a-select>
      </before-icon>
      <before-icon :icon="group6">
      <a-input
        class="p-file-name"
        placeholder="请输入关键字"
        v-model:value="tableParams.file_name"
        @keyup.enter="searchBtn"
      />
      </before-icon>
      <!-- <a-button type="primary" @click="searchBtn">查询</a-button> -->
      <a-button type="primary" class="back-btn" @click="backBtn">返回</a-button>
    </div>
    <a-config-provider>
    <a-table :pagination="false" :columns="columns" :dataSource="tableList">
      <template #action="{ text }"
        ><span @click="selectData(text)">选择</span></template
      >
    </a-table>
    <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
  </div>
  <a-modal
    class="upload-modal"
    v-model:visible="uploadVisible"
    @ok="submitFileToDataset"
    @cancel="closeUploadModal"
  >
    <template #title>上传数据集文件</template>
    <upload-data-set-file
      :type="datasetType"
      v-model:value="fileInfo"
      v-model:dataset_id="dataset_id"
      ref="uploadRef"
      accept=".doc,.docx"
    ></upload-data-set-file>
  </a-modal>
</template>
<script lang="ts">
// import { SyncOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  reactive,
  inject,
  onMounted,
  toRefs,
  watch,
  ref,
} from "vue";
import {
  getPreparingDataApi,
  getDataSetListApi,
  getDataSetFileApi,
  savePrepareLessonsFileApi,
  removePrepareLessonsFileApi,
  getDataSetGuideApi,
  addDataSetFileApi,
} from "../../api";
import empty from "src/components/Empty.vue";
import uploadDataSetFile from "../uploadDataSetFile.vue";
import beforeIcon from "src/components/aiAnt/beforeIcon.vue"
import { message } from "ant-design-vue";
import group12 from "src/assets/images/screenicon/Group12.png"
import group6 from "src/assets/images/screenicon/Group6.png"
type TreactiveData = {
  introFile: any[];
  prepareShowTab: string;
  selectParams: {
    type: number;
    name: string;
  };
  datasetList: {
    public: {};
    self: {};
  };
  tableParams: {
    course_id: number;
    chapter_id: number;
    dataset_id: undefined | number;
    file_name: string;
    page: number;
    pageSize: number;
  };
  tableList: any[];
  uploadVisible: boolean;
  dataset_id: number;
};
export default defineComponent({
  components: {
    empty,
    // SyncOutlined,
    "upload-data-set-file": uploadDataSetFile,
    "before-icon":beforeIcon
  },
  props: ["activeKey"],
  setup(props) {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const course_id: any = inject("course_id");
    const chapter_id: any = inject("chapter_id");
    const tab: any = inject("tab");
    const activeKey = props.activeKey;
    const datasetType = ref(-1);
    if (activeKey === "2") {
      datasetType.value = 5;
    }
    if (activeKey === "3") {
      datasetType.value = 6;
    }
    const columns = [
      {
        title: "文件名称",
        dataIndex: "file_name",
      },
      {
        title: "大小",
        dataIndex: "size",
      },
      {
        title: "操作",
        slots: { customRender: "action" },
      },
    ];
    const reactiveData: TreactiveData = reactive({
      introFile: [],
      prepareShowTab: "loading",
      selectParams: {
        type: datasetType,
        name: "",
      },
      datasetList: {
        public: {},
        self: {},
      },
      tableParams: {
        course_id: course_id,
        chapter_id: chapter_id,
        dataset_id: undefined,
        file_name: "",
        page: 1,
        pageSize: 10000,
      },
      tableList: [],
      uploadVisible: false,
      dataset_id: -1,
    });
    const fileInfo = ref({
      file_name: "",
      file_url: "",
      suffix: "",
      size: 0,
    });
    const uploadRef = ref(null);
    onMounted(() => {
      getDataSetFileDetail();
    });
    // 获取备课资料
    function getDataSetFileDetail() {
      let params = {
        query: {
          course_id: course_id,
          chapter_id: chapter_id.value,
        },
        pageinfo: {
          index: 1,
          size: 10,
        },
      };
      if (datasetType.value === 5) {
        getPreparingDataApi(params).then((res: any) => {
          reactiveData.introFile = res.data.data;
          if (reactiveData.introFile.length > 0) {
            reactiveData.prepareShowTab = "pdf";
          } else {
            reactiveData.prepareShowTab = "none";
          }
        });
        return;
      }
      if (datasetType.value === 6) {
        getDataSetGuideApi(params).then((res: any) => {
          reactiveData.introFile = res.data.data;
          if (reactiveData.introFile.length > 0) {
            reactiveData.prepareShowTab = "pdf";
          } else {
            reactiveData.prepareShowTab = "none";
          }
        });
        return;
      }
    }
    // 获取数据集列表
    function getDataSetList() {
      return new Promise((resolve, reject) => {
        getDataSetListApi(reactiveData.selectParams).then((res: any) => {
          reactiveData.datasetList = res.data;
          loop: for (const key in reactiveData.datasetList) {
            if (
              Object.prototype.hasOwnProperty.call(
                reactiveData.datasetList,
                key
              )
            ) {
              for (const key1 in reactiveData.datasetList[key]) {
                if (
                  Object.prototype.hasOwnProperty.call(
                    reactiveData.datasetList[key],
                    key1
                  )
                ) {
                  (reactiveData.tableParams as any).dataset_id = key1;
                  break loop;
                }
              }
            }
          }

          resolve(true);
        });
      });
    }
    // 获取数据集文件列表
    function getDataSetFile() {
      reactiveData.tableParams;
      let params:any = {
        course_id: reactiveData.tableParams.course_id,
        chapter_id: reactiveData.tableParams.chapter_id,
        dataset_id: reactiveData.tableParams.dataset_id
          ? reactiveData.tableParams.dataset_id
          : "",
        file_name: reactiveData.tableParams.file_name,
        page: reactiveData.tableParams.page,
        pageSize: reactiveData.tableParams.pageSize,
      };
      getDataSetFileApi(params).then((res: any) => {
        reactiveData.tableList = res.data.list;
      });
    }
    // 打开上传modal
    function openUploadModal() {
      reactiveData.uploadVisible = true;
    }
    // 选择按钮
    function selectFile() {
      getDataSetList().then(() => {
        getDataSetFile();
      });
      reactiveData.prepareShowTab = "select";
    }
    // 数据集类型发生变化
    function datasetChange() {
      getDataSetFile();
    }

    // 查询
    function searchBtn() {
      getDataSetFile();
    }
    // 返回
    function backBtn() {
      getDataSetFileDetail();
    }
    // 选择数据
    function selectData(val: any) {
      savePrepareLessonsFileApi({
        course_id: course_id,
        chapter_id: chapter_id.value,
        item_id: val.id,
      }).then((res) => {
        getDataSetFileDetail();
      });
    }
    // 移除
    function remove() {
      removePrepareLessonsFileApi({
        aid: (reactiveData.introFile as any)[0].aid,
      }).then(() => {
        getDataSetFileDetail();
      });
    }

    // 提交文件到数据集
    function submitFileToDataset() {
      if ((uploadRef.value as any).upload) {
        message.warn("文件上传中，请稍后提交");
        return;
      }
      const body = new FormData();
      body.append("items[0][file_name]", fileInfo.value.file_name);
      body.append("items[0][file_url]", fileInfo.value.file_url);
      body.append("items[0][suffix]", fileInfo.value.suffix);
      body.append("items[0][size]", fileInfo.value.size as any);
      body.append("dataset_id", reactiveData.dataset_id as any);
      addDataSetFileApi(body).then((res: any) => {
        fileInfo.value = {
          file_name: "",
          file_url: "",
          suffix: "",
          size: 0,
        };
        reactiveData.uploadVisible = false;
        let item_id = res.data.count[0];
        selectData({ id: item_id });
      });
    }
    // 关闭文件上传弹框
    function closeUploadModal() {
      (uploadRef.value as any).remove();
      reactiveData.uploadVisible = false;
    }
    return {
      ...toRefs(reactiveData),
      openUploadModal,
      selectFile,
      columns,
      env,
      datasetChange,
      searchBtn,
      backBtn,
      selectData,
      remove,
      submitFileToDataset,
      closeUploadModal,
      fileInfo,
      uploadRef,
      datasetType,
      tab,
      group12,
      group6
    };
  },
});
</script>

<style lang="less">
.chapter-intro {
  .action-box {
    width: 100%;
    text-align: right;
    margin-bottom: 15px;
    > button {
      margin-left: 10px;
    }
  }
}

.prepare-lessons-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > .anticon-sync {
    font-size: 50px;
  }
}
.select-data-set-box {
  .select-head {
    display: flex;
    margin-bottom: 15px;
    .p-file-name {
      width: 200px;
    }
    > * {
      margin-right: 15px;
    }
    .back-btn {
      margin-left: auto;
    }
  }
}
.upload-modal {
  .ant-modal-footer {
    text-align: center;
  }
}
.chapter-intro-none {
  margin-top: 80px;
  .action-btn {
    width: 100%;
  }
}
</style>
