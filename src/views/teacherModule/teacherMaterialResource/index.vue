<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="materialTypeList"
    :isShowAdd="true"
  ></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flex-row-reverse">
      <div class="rest-disk">
        <div class="text">
          <div class="left">剩余可用磁盘</div>
          <div class="right">
            <span class="usable">30GB可用</span>
            <span class="total">共100GB</span>
          </div>
        </div>
        <div class="progress">
          <div class="progress-inner" :style="{ width: '80%' }"></div>
        </div>
      </div>
    </div>
    <div class="mainBox">
      <div
        class="item flexCenter"
        v-for="(list, k) in materialList"
        :key="list.uid"
        :style="{ marginRight: !((k + 1) % 4) ? 0 : '24px' }"
      >
        <div class="item-top">
          <img :src="list.cover" alt="" />
          <div class="labels">
            <span v-for="(v, index) in list.labels" :key="v.uid">{{
              v.name + (index !== list.labels.length - 1 ? " / " : "")
            }}</span>
          </div>
        </div>
        <div class="item-content">
          <div class="item-name single-ellipsis">{{ list.name }}</div>
          <div class="item-desc">
            <span class="type">{{ list.categorys[0].name }}</span>
            <span class="desc single-ellipsis">{{ list.description }}</span>
          </div>
          <div class="user-num">
            <div class="user" v-if="list.common">
              <img src="" alt="" srcset="" />
              <span class="name">系统内置</span>
            </div>
            <div class="num-size">
              <span class="num">数量 {{ list.amount }}</span>
              <span class="size">大小 {{ list.size }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <Empty v-if="!list.length && !loading" /> -->
      <a-pagination
        v-if="pageTotal > 6"
        v-model:current="pageInfo.page"
        :pageSize="pageInfo.pageSize"
        :total="pageTotal"
        @change="pageChange"
      />
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherMaterialResource;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "公开素材", componenttype: 0 },
    { name: "私有素材", componenttype: 1 },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

// 搜索
const searchKey = ref<string>("");
const searchFn = (key: string) => {
  searchKey.value = key;
  initData();
};
const handleMenuClick = ({ key }: { key: string }) => {
  console.log(key);
  // router.push("/teacher/teacherExperimentResourcePool/CreateExperiment?key="+key);
  // router.push({
  //   path: "/teacher/teacherExperimentResourcePool/CreateExperiment",
  //   query: { key },
  // });
};
const materialTypeList = reactive([
  { name: "数据集", key: "dataSet" },
  { name: "视频目录", key: "videoDirectory" },
  { name: "课件目录", key: "coursewareDirectory" },
  { name: "备课资料目录", key: "lessonDirectory" },
  { name: "教学指导目录", key: "guidanceDirectory" },
]);

// 标签
const classifyList: any = reactive([
  {
    title: "类型",
    value: 0,
    keyName: "type",
    data: [
      { name: "全部", value: 0 },
      { name: "数据集", value: "dataSet" },
      { name: "视频", value: "videoDirectory" },
      { name: "课件", value: "coursewareDirectory" },
      { name: "备课资料", value: "lessonDirectory" },
      { name: "教学指导", value: "guidanceDirectory" },
    ],
  },
  {
    title: "标签",
    value: 0,
    keyName: "label",
    data: [
      { name: "全部", value: 0 },
      { name: "大数据", value: 1 },
      { name: "人工智能", value: 2 },
      { name: "计算机视觉", value: 3 },
      { name: "机器学习", value: 4 },
    ],
  },
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  // console.log(labelSearch)
  // searchFn();
};
const labelSearch = reactive({
  type: 0,
  label: 0,
});

const loading = ref<boolean>(false);
const pageInfo = reactive({
  page: 1,
  pageSize: 12,
});
const pageTotal = ref<number>(0);
const pageChange = (page: number) => {
  pageInfo.page = page;
  initData();
};

const currentTab = ref<number>(0);
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    console.log(val);
    currentTab.value = val;
    initData();
  }
);

interface ILabel {
  uid: string;
  name: string;
}
interface IMaterialList {
  uid: string;
  cover: string;
  labels: ILabel[];
  name: string;
  description: string;
  common: number;
  categorys: ILabel[];
  amount: number;
  size: string;
}
let materialList = reactive<IMaterialList[]>([]);
const initData = () => {
  const param = {
    keyword: searchKey.value,
    common: currentTab.value,
    user_id: 100,
    ...pageInfo,
  };
  console.log(param);
  http.dataSets({ param }).then((res: any) => {
    console.log(res);
    const { data, total } = res;
    materialList.push(...data);
    pageTotal.value = total;
  });
};
</script>

<style lang="less" scoped>
.mainBox {
  // flex-wrap: wrap;
  // justify-content: space-between;
  .item {
    width: 282px;
    height: 265px;
    margin-bottom: 27px;
    margin-right: 24px;
    display: inline-block;
    background: var(--white-70);
    &:hover {
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    }
    &-top {
      height: 150px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .labels {
        width: 100%;
        position: absolute;
        bottom: 0;
        height: 24px;
        line-height: 24px;
        background: var(--black-5);
        font-size: var(--font-size-sm);
        color: var(--white-85);
        padding-left: 9px;
      }
    }
    &-content {
      padding: 10px 8px;
    }
    &-name {
      font-size: var(--font-size-16);
      color: var(--black-85);
      margin-bottom: 8px;
    }
    &-desc {
      height: 31px;
      line-height: 20px;
      display: flex;
      padding-bottom: 11px;
      border-bottom: 1px solid #f0f0f0;
      .type {
        display: inline-block;
        padding: 0 7px;
        background: #ff6554;
        border-radius: 2px;
        font-size: var(--font-size-sm);
        color: var(--white-100);
        margin-right: 4px;
      }
      .desc {
        flex: 1;
        color: var(--black-45);
        vertical-align: middle;
      }
    }
    .user-num {
      height: 20px;
      line-height: 20px;
      margin-top: 13px;
      display: flex;
      justify-content: space-between;
      color: var(--black-45);
      .user {
        img {
          width: 20px;
          height: 20px;
          background-color: pink;
          margin-right: 4px;
        }
      }
      .num-size {
        .num {
          margin-right: 16px;
        }
      }
    }
  }
}
.rest-disk {
  width: 282px;
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-sm);
  color: var(--black-65);
  margin-bottom: 16px;
  .text {
    display: flex;
    justify-content: space-between;
    .usable {
      color: var(--brightBtn);
    }
  }
  .progress {
    width: 100%;
    height: 4px;
    background: #f3f3f3;
    border-radius: 2px;
    &-inner {
      width: 200px;
      height: 100%;
      background: var(--brightBtn);
      border-radius: 2px;
    }
  }
}
.flex-row-reverse {
  display: flex;
  flex-direction: row-reverse;
}
</style>
