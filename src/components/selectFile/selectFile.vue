<template>
  <div class="select-video">
    <div class="search-info">
      <a-select
        v-model:value="searchInfo.dataId"
        placeholder="请选择目录"
        @change="datasetChange"
        style="width: 240px; margin-right: 16px"
      >
        <a-select-option v-for="v in videoDirectoryList" :value="v.id" :key="v.id">{{v.name}}</a-select-option>
      </a-select>
      <a-input-search 
        v-model:value="searchInfo.file_name"
        placeholder="请输入要搜索的关键字"
        style="width: 240px"
        @search="onSearch"
      />
    </div>
    <div class="video-content">
      <div
        class="video-list"
        v-for="list in props.fileList"
        :key="list.id"
        :class="{ selected: list.id === props.selectId }"
      >
        <div class="file-name single_ellipsis" :title="list.file_name">
          <img
            :src="iconList[list.suffix]"
            alt=""
            srcset=""
          />
          <span>{{ list.file_name }}</span>
        </div>
        <div class="file-size">{{ bytesToSize(list.size) }}</div>
        <div class="operate pointer">
          <span v-if="list.id !== props.selectId" @click="selectFileHandle(list)"
            >选择</span
          >
          <span v-else>取消</span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <a-pagination
        v-model:current="searchInfo.page"
        :total="10"
        :pageSize="searchInfo.limit"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { bytesToSize } from "src/utils/common"
import iconList from "src/utils/iconList";
const http = request.teacherMaterialResource;
interface ISearchInfo {
  dataId: number
  file_name: string
  page: number
  limit: number
}
const searchInfo = reactive<ISearchInfo>({
  dataId: 0,
  file_name: '',
  page: 1,
  limit: 10,
});
const onSearch = () => {
  console.log(searchInfo);
  emit("getFileList", searchInfo);
};
const datasetChange = () => {
  console.log(searchInfo);
  emit("getFileList", searchInfo);
};
const pageChange = (page: number, pageSize: number) => {
  console.log(searchInfo);
  emit("getFileList", searchInfo);
};
// 获取视频列表
interface IVideoList {
  id: number;
  file_name: string;
  size: string;
  isSelected: boolean;
  suffix: string
}

// 获取视频/文档目录列表
const videoDirectoryList = reactive<IVideoDirectoryList[]>([]);
const getVideoDirectory = () => {
  // 1：数据集；2：应用软件；3：课件；4：视频；5：备课资料；6：教学指导
  http.getSelectResourceList({urlParams: {typeID: props.type==='video' ? 4:6}}).then((res: any) => {
    videoDirectoryList.push(...res.data.private)
    searchInfo.dataId = videoDirectoryList[0].id
    emit("getFileList", searchInfo);
  });
};
onMounted(async () => {
  await getVideoDirectory();
  // getVideoList();
});

interface Props {
  fileList: any;
  type: string,
  selectId: number
}
const props = withDefaults(defineProps<Props>(), {
  fileList: () => [],
  type: 'video',
  selectId: 0
});
const emit = defineEmits<{
  (e: "selectFileHandle", obj: any): void;
  (e: "getFileList", obj: any): void;
}>();
// 选择
const selectFileHandle = (v: any) => {
  emit("selectFileHandle", v);
};

interface IDirectoryList {
  [key: number]: string;
}
interface IVideoDirectoryList {
  id: number
  name: string
}
</script>

<style lang="less" scoped>
.select-video {
  .video-content {
    margin-top: 24px;
    .video-list {
      height: 54px;
      line-height: 54px;
      background-color: var(--black-20);
      margin-bottom: 16px;
      padding: 0 20px;
      display: flex;
      &:hover {
        background-color: rgba(255, 238, 216, 0.24);
        .operate span {
          display: block;
        }
      }
      &.selected {
        background: #fffbf6;
        border: 1px solid #ffcaa1;
        .operate span {
          display: block;
        }
      }
      .file-name {
        flex: 1;
        padding-right: 16px;
        img {
          width: 32px;
          height: 32px;
          margin-right: 14px;
        }
      }
      .file-size {
        flex: 1;
      }
      .operate {
        width: 30px;
        color: var(--primary-color);
        span {
          display: none;
        }
      }
    }
  }
  .pagination {
    text-align: center;
  }
}
</style>
