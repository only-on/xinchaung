<template>
  <div class="select-video">
    <div class="search-info">
      <a-select
        v-model:value="searchInfo.type"
        placeholder="请选择目录"
        @change="datasetChange"
        style="width: 240px; margin-right: 16px"
      >
        <a-select-opt-group v-for="(val, key) in videoDirectoryList" :key="key">
          <template #label>
            <span>
              {{ key === "public" ? "公有" : "私有" }}
            </span>
          </template>
          <a-select-option v-for="(v, k) in val" :key="k" :value="k">{{
            v
          }}</a-select-option>
        </a-select-opt-group>
      </a-select>
      <a-input-search
        v-model:value="searchInfo.name"
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
        :class="{ selected: list.isSelected }"
      >
        <div class="file-name">
          <img
            :src="'src/assets/images/file/' + list.type + '.png'"
            alt=""
            srcset=""
          />
          <span>{{ list.file_name }}</span>
        </div>
        <div class="file-size">{{ list.size }}</div>
        <div class="operate pointer">
          <span v-if="!list.isSelected" @click="selectVideoHandle(list)"
            >选择</span
          >
          <span v-else>取消</span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <a-pagination
        v-model:current="searchInfo.page"
        :total="searchInfo.total"
        :pageSize="searchInfo.pageSize"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const courseApi = request.teachCourse;
interface ISearchInfo {
  name: string;
  type: number | undefined;
  page: number;
  pageSize: number;
  total: number;
}
const searchInfo = reactive<ISearchInfo>({
  name: "",
  type: undefined,
  page: 1,
  pageSize: 10,
  total: 15,
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
}
const videoList = reactive<IVideoList[]>([]);
const getVideoList = () => {
  let param = {
    course_id: 1,
    chapter_id: 1,
    dataset_id: searchInfo.type,
    file_name: searchInfo.name,
    page: searchInfo.page,
    pageSize: searchInfo.pageSize,
  };
  courseApi.getDataSetFileApi({ param }).then((res: IBusinessResp | null) => {
    console.log(res);
  });
  videoList.push(
    ...[
      { id: 1, file_name: "shipin1", size: "110kb", isSelected: false },
      { id: 2, file_name: "视频2", size: "120kb", isSelected: true },
      { id: 3, file_name: "shipin3", size: "130kb", isSelected: false },
    ]
  );
};

// 获取视频目录列表
const getVideoDirectory = () => {
  courseApi
    .getDataSetListApi({ param: { ...searchInfo } })
    .then((res: IBusinessResp | null) => {
      console.log(res);
    });
  videoDirectoryList.public = {
    1: "公1",
    2: "公2",
  };
  videoDirectoryList.self = {
    3: "私1",
    4: "私2",
  };
};
onMounted(async () => {
  await getVideoDirectory();
  getVideoList();
});

interface Props {
  fileList: any;
}
const props = withDefaults(defineProps<Props>(), {
  fileList: () => [],
});
const emit = defineEmits<{
  (e: "selectVideoHandle", obj: any): void;
  (e: "getFileList", obj: any): void;
}>();
// 选择
const selectVideoHandle = (v: any) => {
  emit("selectVideoHandle", v);
};

interface IDirectoryList {
  [key: number]: string;
}
interface IVideoDirectoryList {
  public: IDirectoryList;
  self: IDirectoryList;
}
const videoDirectoryList = reactive<IVideoDirectoryList>({
  public: {},
  self: {},
});
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
