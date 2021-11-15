<template>
  <div class="add-experiment-tab">
    <a-tabs v-model:activeKey="currentKey" class="add-experiment-tabs">
      <a-tab-pane key="0" tab="实验" class="experiment-tabs">
        <template v-if="currentKey === '0'">
          <select-list
            v-model:value="contentDataList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-list-head">
                <a-radio-group
                  button-style="solid"
                  v-model:value="params.type"
                  @change="contentTypeChange"
                >
                  <a-radio-button :value="0"> 内置实验 </a-radio-button>
                  <a-radio-button :value="1"> 我的实验 </a-radio-button>
                </a-radio-group>
                <a-select
                  style="width: 200px"
                  v-model:value="params.content_category_id"
                  placeholder="请选择章节"
                  @change="chapterChange"
                >
                  <a-select-option
                    v-for="item in chapterList"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-button class="" type="primary" @click="selectContent(false)"
                  >选择实验</a-button
                >
                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个章节</span
                  ><span
                    >包含实验共计<i>{{ contentCount }}</i
                    >个</span
                  ><span @click="clearChecked">清空</span>
                </div>
              </div>
            </template>
            <template #icon="data">
              <span class="iconfont" :class="settingIcon(data.data)"></span>
            </template>
            <template #footer>
              <a-pagination
                :default-current="params.page"
                v-model:current="params.page"
                :default-page-size="params.limit"
                :total="totalCount"
                @change="pageChange"
              />
            </template>
          </select-list>
        </template>
      </a-tab-pane>
      <a-tab-pane key="1" tab="实训" class="experiment-tabs">
        <template v-if="currentKey === '1'">
          <select-list
            v-model:value="trainDataList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-list-head">
                <a-radio-group
                  button-style="solid"
                  v-model:value="params.type"
                  @change="contentTypeChange"
                >
                  <a-radio-button :value="0"> 内置实验 </a-radio-button>
                  <a-radio-button :value="1"> 我的实验 </a-radio-button>
                </a-radio-group>
                <a-input-search
                  style="width: 200px"
                  v-model:value="params.name"
                  placeholder="请输入关键字"
                  @search="onSearch"
                >
                </a-input-search>
                <a-button class="" type="primary" @click="selectContent(false)"
                  >选择实验</a-button
                >
                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个实训</span
                  ><span
                    >包含任务共计<i>{{ contentCount }}</i
                    >个</span
                  ><span @click="clearChecked">清空</span>
                </div>
              </div>
            </template>
            <template #icon>
              <span class="iconfont icon-shubiao"></span>
            </template>
            <template #footer>
              <a-pagination
                :default-current="params.page"
                v-model:current="params.page"
                :default-page-size="params.limit"
                :total="totalCount"
                @change="pageChange"
              />
            </template>
          </select-list>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2" tab="视频" class="experiment-tabs">
        <template v-if="currentKey === '2'">
          <select-list
            v-model:value="videosDataList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-list-head">
                <a-select
                  style="width: 200px"
                  v-model:value="params.dataset_id"
                  placeholder="请选择数据集目录"
                  @change="datasetChange"
                >
                  <a-select-opt-group
                    v-for="(val, key) in datasetList"
                    :key="key"
                  >
                    <template #label>{{
                      key === "public" ? "共有" : "私有"
                    }}</template>
                    <a-select-option v-for="(v, k) in val" :value="k" :key="k">
                      {{ v }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
                <div class="select-right">
                  <a-button type="primary" @click="openUploadModal(4)">上传</a-button>
                  <a-button
                    class=""
                    type="primary"
                    @click="selectContent(false)"
                    >选择实验</a-button
                  >
                </div>

                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个视频</span
                  ><span @click="clearChecked">清空</span>
                </div>
              </div>
            </template>
            <template #icon>
              <span class="iconfont icon-shipin"></span>
            </template>
            <template #footer>
              <a-pagination
                :default-current="params.page"
                v-model:current="params.page"
                :default-page-size="params.limit"
                :total="totalCount"
                @change="pageChange"
              />
            </template>
          </select-list>
        </template>
      </a-tab-pane>
      <a-tab-pane key="3" tab="文档" class="experiment-tabs">
        <template v-if="currentKey === '3'">
          <select-list
            v-model:value="documentDataList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-list-head">
                <a-select
                  style="width: 200px"
                  v-model:value="params.dataset_id"
                  placeholder="请选择数据集目录"
                  @change="datasetChange"
                >
                  <a-select-opt-group
                    v-for="(val, key) in datasetList"
                    :key="key"
                  >
                    <template #label>{{
                      key === "public" ? "共有" : "私有"
                    }}</template>
                    <a-select-option v-for="(v, k) in val" :value="k" :key="k">
                      {{ v }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
                <div class="select-right">
                  <a-button type="primary" @click="openUploadModal(3)">上传</a-button>
                  <a-button
                    class=""
                    type="primary"
                    @click="selectContent(false)"
                    >选择实验</a-button
                  >
                </div>

                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个文档</span
                  ><span @click="clearChecked">清空</span>
                </div>
              </div>
            </template>
            <template #icon>
              <span class="iconfont icon-wendang"></span>
            </template>
            <template #footer>
              <a-pagination
                :default-current="params.page"
                v-model:current="params.page"
                :default-page-size="params.limit"
                :total="totalCount"
                @change="pageChange"
              />
            </template>
          </select-list>
        </template>
      </a-tab-pane>
    </a-tabs>
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
      :accept="accept"
      :fileSize="fileSize"
    ></upload-data-set-file>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, inject, watch,ref } from "vue";
import selectList from "./components/selectList.vue";
import {
  getAllChapterListApi,
  getContentListApi,
  getTrainListApi,
  getVideosListApi,
  getDocumentsListApi,
  saveContentToChapterApi,
  getDataSetCatalogApi,
  addDataSetFileApi
} from "./api";
import { message } from "ant-design-vue";
import uploadDataSetFile from "./components/uploadDataSetFile.vue";

type TreactiveData = {
  currentKey: string;
  contentDataList: any[];
  trainDataList: any[];
  videosDataList: any[];
  documentDataList: any[];
  columns: {
    key: string; // id
    name: string; // 展示name字段
    typeName?: string; // 类型字段
    count?: string; // 统计数量字段
    is_selected: string; // 已选中字段
    selected: string; // 选中字段
  };
  keys: any[];
  params: {
    type?: number;
    course_id?: number;
    limit?: number;
    page?: number;
    name?: string;
    content_category_id?: number | undefined;
    dataset_id?: number | undefined;
  };
  totalCount: number;
  chapterParams: {
    type: string;
    limit: number;
  };
  chapterList: any[];
  chapterCount: number;
  contentCount: number;
  initChapterCount: number;
  initContentCount: number;
  datasetList: any;
  datasetType: number;
  uploadVisible: boolean;
  fileInfo: {
    file_name: string;
    file_url: string;
    suffix: string;
    size: number;
  };
  dataset_id:number
  accept:string
  fileSize:string
};
export default defineComponent({
  components: {
    "select-list": selectList,
    "upload-data-set-file": uploadDataSetFile,
  },
  setup() {
    const course_id = inject("course_id") as number;
    const chapter_id: any = inject("chapter_id");
    const updateTree: any = inject("updateTree");
    const reactiveData: TreactiveData = reactive({
      currentKey: "0",
      contentDataList: [],
      trainDataList: [],
      videosDataList: [],
      documentDataList: [],
      columns: {
        key: "id", // id
        name: "name", // 展示name字段
        typeName: "课时", // 类型字段
        count: "class_cnt", // 统计数量字段
        is_selected: "is_selected", // 已选中字段
        selected: "selected", // 选中字段
      },
      keys: [],
      params: {
        type: 0,
        course_id: course_id,
        limit: 10,
        page: 1,
        name: "",
        content_category_id: undefined,
        dataset_id: undefined,
      },
      totalCount: 0,
      chapterParams: {
        type: "1",
        limit: 500,
      },
      chapterList: [],
      chapterCount: 0,
      contentCount: 0,
      initChapterCount: 0,
      initContentCount: 0,
      datasetList: {},
      datasetType: -1,
      uploadVisible: false,
      fileInfo: {
        file_name: "",
        file_url: "",
        suffix: "",
        size: 0,
      },
      dataset_id:-1,
      accept:"",
      fileSize:""
    });
    const uploadRef=ref(null)
    const initData = {
      "0": {
        init: () => {
          reactiveData.columns = {
            key: "id", // id
            name: "name", // 展示name字段
            typeName: "课时", // 类型字段
            count: "class_cnt", // 统计数量字段
            is_selected: "is_selected", // 已选中字段
            selected: "selected", // 选中字段
          };
          reactiveData.params = {};
          reactiveData.params.course_id = course_id;
          reactiveData.params.type = 0;
          reactiveData.params.limit = 10;
          reactiveData.params.page = 1;
          reactiveData.params.name = "";
          getAllChapterList();
          getContentList();
        },
      },
      "1": {
        init: () => {
          reactiveData.columns = {
            key: "id", // id
            name: "name", // 展示name字段
            typeName: "任务", // 类型字段
            count: "task_total", // 统计数量字段
            is_selected: "is_selected", // 已选中字段
            selected: "selected", // 选中字段
          };
          reactiveData.params = {};
          reactiveData.params.course_id = course_id;
          reactiveData.params.type = 0;
          reactiveData.params.limit = 10;
          reactiveData.params.page = 1;
          reactiveData.params.name = "";
          getTrainList();
        },
      },
      "2": {
        init: () => {
          reactiveData.columns = {
            key: "id", // id
            name: "file_name", // 展示name字段
            is_selected: "is_selected", // 已选中字段
            selected: "selected", // 选中字段
          };
          reactiveData.params = {};
          reactiveData.params.course_id = course_id;
          reactiveData.params.type = 0;
          reactiveData.params.limit = 10;
          reactiveData.params.page = 1;
          reactiveData.params.dataset_id = undefined;
          getDataSetCatalog();
          getVideosList();
        },
      },
      "3": {
        init: () => {
          reactiveData.columns = {
            key: "id", // id
            name: "file_name", // 展示name字段
            is_selected: "is_selected", // 已选中字段
            selected: "selected", // 选中字段
          };
          reactiveData.params = {};
          reactiveData.params.course_id = course_id;
          reactiveData.params.type = 0;
          reactiveData.params.limit = 10;
          reactiveData.params.page = 1;
          reactiveData.params.dataset_id = undefined;
          getDataSetCatalog();
          getDocumentsList();
        },
      },
    };
    watch(
      () => reactiveData.currentKey,
      () => {
        initData[reactiveData.currentKey].init();
      },
      { deep: true, immediate: true }
    );
    watch(
      () => reactiveData.keys,
      () => {
        if (reactiveData.currentKey === "0") {
          const countObj = filterData(
            reactiveData.contentDataList,
            reactiveData.keys,
            "class_cnt"
          );
          reactiveData.chapterCount =
            reactiveData.initChapterCount + countObj.count;
          reactiveData.contentCount =
            reactiveData.initContentCount + countObj.counts;
        }
        if (reactiveData.currentKey === "1") {
          const countObj = filterData(
            reactiveData.trainDataList,
            reactiveData.keys,
            "task_total"
          );
          reactiveData.chapterCount =
            reactiveData.initChapterCount + countObj.count;
          reactiveData.contentCount =
            reactiveData.initContentCount + countObj.counts;
        }
        if (reactiveData.currentKey === "2") {
          const countObj = filterData(
            reactiveData.videosDataList,
            reactiveData.keys,
            ""
          );
          reactiveData.chapterCount =
            reactiveData.initChapterCount + countObj.count;
        }
        if (reactiveData.currentKey === "3") {
          const countObj = filterData(
            reactiveData.documentDataList,
            reactiveData.keys,
            ""
          );
          reactiveData.chapterCount =
            reactiveData.initChapterCount + countObj.count;
        }
      }
    );
    // 获取章节列表
    function getAllChapterList() {
      getAllChapterListApi(reactiveData.chapterParams, {
        course_id: course_id,
      }).then((res: any) => {
        reactiveData.chapterList = res.data.list;
      });
    }
    // 获取数据集目录树
    function getDataSetCatalog() {
      if (reactiveData.currentKey === "2") {
        reactiveData.datasetType = 4;
      }
      if (reactiveData.currentKey === "3") {
        reactiveData.datasetType = 3;
      }

      getDataSetCatalogApi({ type: reactiveData.datasetType }).then(
        (res: any) => {
          reactiveData.datasetList = res.data;
        }
      );
    }
    // 获取实验列表
    function getContentList() {
      getContentListApi(getNewObj(reactiveData.params)).then((res: any) => {
        reactiveData.contentDataList = res.data.list;
        reactiveData.totalCount = res.data.page.totalCount;
        reactiveData.initContentCount = 0;
        const selectedContent = reactiveData.contentDataList.filter(
          (item: any) => {
            if (item.is_selected) {
              reactiveData.initContentCount += item.class_cnt;
            }
            return item.is_selected === true;
          }
        );
        reactiveData.initChapterCount = selectedContent.length;
        reactiveData.chapterCount = reactiveData.initChapterCount;
        reactiveData.contentCount = reactiveData.initContentCount;
      });
    }

    // 获取实训列表
    function getTrainList() {
      getTrainListApi(getNewObj(reactiveData.params)).then((res: any) => {
        reactiveData.trainDataList = res.data.list;
        reactiveData.totalCount = res.data.page.totalCount;
        reactiveData.initContentCount = 0;
        const selectedContent = reactiveData.trainDataList.filter(
          (item: any) => {
            if (item.is_selected) {
              reactiveData.initContentCount += item.task_total;
            }
            return item.is_selected === true;
          }
        );
        reactiveData.initChapterCount = selectedContent.length;
        reactiveData.chapterCount = reactiveData.initChapterCount;
        reactiveData.contentCount = reactiveData.initContentCount;
      });
    }

    // 获取视频列表
    function getVideosList() {
      getVideosListApi(getNewObj(reactiveData.params)).then((res: any) => {
        reactiveData.videosDataList = res.data.list;
        reactiveData.totalCount = res.data.page.totalCount;
        const selectedContent = reactiveData.videosDataList.filter(
          (item: any) => {
            return item.is_selected === true;
          }
        );
        reactiveData.initChapterCount = selectedContent.length;
        reactiveData.chapterCount = reactiveData.initChapterCount;
      });
    }
    // 获取文档列表
    function getDocumentsList() {
      getDocumentsListApi(getNewObj(reactiveData.params)).then((res: any) => {
        reactiveData.documentDataList = res.data.list;
        reactiveData.totalCount = res.data.page.totalCount;
        const selectedContent = reactiveData.documentDataList.filter(
          (item: any) => {
            return item.is_selected === true;
          }
        );
        reactiveData.initChapterCount = selectedContent.length;
        reactiveData.chapterCount = reactiveData.initChapterCount;
      });
    }
    // 分页发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.params.page = page;
      reactiveData.params.limit = pageSize;
      if (reactiveData.currentKey === "0") {
        getContentList();
      }
      if (reactiveData.currentKey === "1") {
        getTrainList();
      }
      if (reactiveData.currentKey === "2") {
        getVideosList();
      }
      if (reactiveData.currentKey === "3") {
        getDocumentsList();
      }
    }
    // 章节发生变化时
    function chapterChange() {
      reactiveData.params.page = 1;
      reactiveData.params.limit = 10;
      getContentList();
    }

    // 分类发生变化
    function contentTypeChange() {
      reactiveData.params.page = 1;
      reactiveData.params.limit = 10;
      (reactiveData.params as any).content_category_id = undefined;
      (reactiveData.chapterParams as any).type = reactiveData.params.type;
      if (reactiveData.currentKey === "0") {
        getAllChapterList();
        getContentList();
      }
      if (reactiveData.currentKey === "1") {
        getTrainList();
      }
    }

    // 数据目录发生变化时
    function datasetChange() {
      reactiveData.params.page = 1;
      reactiveData.params.limit = 10;
      (reactiveData.params as any).content_category_id = undefined;
      (reactiveData.chapterParams as any).type = undefined;
      if (reactiveData.currentKey === "2") {
        getVideosList();
      }
      if (reactiveData.currentKey === "3") {
        getDocumentsList();
      }
    }
    // 搜索
    function onSearch() {
      reactiveData.params.page = 1;
      reactiveData.params.limit = 10;
      (reactiveData.params as any).content_category_id = undefined;
      getTrainList();
    }
    // 选择实验
    function selectContent(val: any) {
      if (!val && reactiveData.keys.length === 0)
        return message.warn("请选择数据");
      const types = {
        "0": 1,
        "1": 2,
        "2": 3,
        "3": 4,
      };
      saveContentToChapterApi(
        {
          content_ids: val ? [val] : reactiveData.keys,
          type: types[reactiveData.currentKey],
        },
        { course_id: course_id, chapter_id: chapter_id.value as any }
      ).then((res) => {
        if (reactiveData.currentKey === "0") {
          getContentList();
        }
        if (reactiveData.currentKey === "1") {
          getTrainList();
        }
        if (reactiveData.currentKey === "2") {
          getVideosList();
        }
        if (reactiveData.currentKey === "3") {
          getDocumentsList();
        }
        updateTree();
      });
    }
    // 单个选择按钮
    function selectBtn(val: any) {
      selectContent(val.id);
    }
    // 清空选择
    function clearChecked() {
      if (reactiveData.currentKey === "0") {
        reactiveData.contentDataList.map((item: any) => {
          item.selected = false;
        });
      }
      if (reactiveData.currentKey === "1") {
        reactiveData.trainDataList.map((item: any) => {
          item.selected = false;
        });
      }
      if (reactiveData.currentKey === "2") {
        reactiveData.videosDataList.map((item: any) => {
          item.selected = false;
        });
      }
      if (reactiveData.currentKey === "3") {
        reactiveData.documentDataList.map((item: any) => {
          item.selected = false;
        });
      }
    }

    // 移除对象undefined字段
    function getNewObj(obj: any) {
      let newObj = obj;
      for (const key in newObj) {
        if (Object.prototype.hasOwnProperty.call(newObj, key)) {
          if (newObj[key] === undefined) {
            delete newObj[key];
          }
        }
      }
      return newObj;
    }
    // 设置图标
    function settingIcon(data: any) {
      if (data.task_type === 1) {
        return "icon-zhuomianshiyan";
      }
      if (data.task_type === 4) {
        return "icon-program";
      }
    }

    // 筛选出当前选中的项
    function filterData(dataList: any[], keys: any[], countType: string) {
      let i = 0;
      return {
        count: dataList.filter((item: any) => {
          if (countType && item.selected) {
            i += item[countType];
          }
          return item.selected && keys.includes(item.id);
        }).length,
        counts: i,
      };
    }
    // 提交数据集
    function submitFileToDataset() {
      if ((uploadRef.value as any).upload) {
        message.warn("文件上传中，请稍后提交");
        return;
      }
      const body=new FormData();
      body.append("items[0][file_name]",reactiveData.fileInfo.file_name)
      body.append("items[0][file_url]",reactiveData.fileInfo.file_url)
      body.append("items[0][suffix]",reactiveData.fileInfo.suffix)
      body.append("items[0][size]",reactiveData.fileInfo.size as any)
      body.append("dataset_id",reactiveData.dataset_id as any)
      addDataSetFileApi(body).then((res: any) => {
        reactiveData.fileInfo = {
          file_name: "",
          file_url: "",
          suffix: "",
          size: 0,
        };
        reactiveData.uploadVisible = false;
        let item_id=res.data.count[0]
        selectContent(item_id)
      });
    }
    // 打开上传modal
    function openUploadModal(val:number) {
      reactiveData.datasetType=val
      if (reactiveData.datasetType===4) {
        reactiveData.accept=".mp4"
        reactiveData.fileSize="500m"
      }
      if (reactiveData.datasetType===3) {
        reactiveData.accept=".ppt,.pptx"
        reactiveData.fileSize=""
      }
      reactiveData.uploadVisible=true
    }
    // 关闭上传modal
    function closeUploadModal() {
      reactiveData.uploadVisible=false
    }
    return {
      ...toRefs(reactiveData),
      pageChange,
      settingIcon,
      chapterChange,
      contentTypeChange,
      clearChecked,
      selectContent,
      selectBtn,
      onSearch,
      datasetChange,
      submitFileToDataset,
      uploadRef,
      openUploadModal,
      closeUploadModal
    };
  },
});
</script>

<style lang="less">
.add-experiment-tab {
  height: 100%;
  background: @white;
  padding: 15px;
  .add-experiment-tabs {
    height: 100%;
    > .ant-tabs-top-content {
      height: calc(100% - 58px);
      >.ant-tabs-tabpane{
        height: calc(100% - 28px);
      }
      .select-list-head {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        > div {
          margin-right: 15px;
        }
        > button {
          margin-left: auto;
        }
        .select-right {
          margin-left: auto;
          > button {
            margin-left: 15px;
          }
        }
        margin-bottom: 10px;
        .statistics-box {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: row;
          line-height: 40px;
          background: #fdfaff;
          border: 1px solid #ebdbfa;
          border-radius: 3px;
          margin-top: 17px;
          padding: 0 20px;
          margin-bottom: 10px;
          > span {
            margin-right: 20px;
            font-size: 14px;
            > i {
              margin: 0 5px;
              font-style: normal;
              color: @theme-color;
            }
            &:last-child {
              margin-right: 0;
              margin-left: auto;
              color: @theme-color;
              cursor: pointer;
            }
          }
        }
      }
      .select-list {
        width: 100%;
        .list-box {
          .list-item {
            .title-name {
              .iconfont {
                background: unset;
                color: @theme-color;
              }
            }
          }
        }
      }
      .ant-pagination {
        margin-top: 15px;
        text-align: center;
      }
    }
  }
}
</style>
