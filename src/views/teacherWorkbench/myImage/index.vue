<template>
  <div class="my-image-tab">
    <div class="my-image-search">
      <a-input-search
        placeholder="请输入关键字查询"
        v-model:value="params.name"
        style="width: 506px"
        @search="onSearch"
      />
      <a-button type="primary" @click="createImage">创建镜像</a-button>
    </div>
    <div class="my-image-box">
      <div
        class="my-image-item"
        v-for="(item, index) in myImageList"
        :key="index"
      >
        <card v-model="myImageList[index]"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { getMyImageApi } from "../api";
import card from "./card.vue";

export default defineComponent({
  components: {
    card,
  },
  setup() {
    const router = useRouter();
    const reactiveData: {
      params: any;
      myImageList: any[];
      pageCount: number;
    } = reactive({
      params: {
        name: "",
        limit: 16,
        withs: "image,config,image.classify",
        page: 1,
      },
      myImageList: [],
      pageCount: 0,
    });

    onMounted(() => {
      init();
    });

    function init() {
      reactiveData.params = {
        name: "",
        limit: 16,
        withs: "image,config,image.classify",
        page: 1,
        is_init:0,
        type:""
      };
      getMyImage();
    }
    // 获取我的镜像列表
    function getMyImage() {
      getMyImageApi(reactiveData.params).then((res) => {
        reactiveData.myImageList = res?.data.list;
        reactiveData.params.page = res?.data.page.currentPage;
        reactiveData.params.limit = res?.data.page.perPage;
        reactiveData.pageCount = res?.data.page.pageCount;
      });
    }
    // 创建镜像
    function createImage() {
      console.log("创建");
      router.push({ path: "/teacher/Workbench/createImage" });
    }
    // 搜索
    function onSearch() {}
    return {
      ...toRefs(reactiveData),
      createImage,
      onSearch,
    };
  },
});
</script>

<style lang="less">
.my-image-tab {
  height: 100%;
  .my-image-search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .my-image-box {
    flex: 1;
    padding-left: 2px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .my-image-item {
      width: 24%;
      height: 150px;
      margin-top: 20px;
    }
  }
}
</style>
