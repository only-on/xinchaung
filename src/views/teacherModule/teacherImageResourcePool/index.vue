<template>
  <div class="labelBox">
    <div class="label">
      <classify ref="classifyV" :list="classifyList"></classify>
    </div>
    <div class="add flexCenter">
      <a-input-search
        class="greenSearch"
        v-model:value="search.key"
        placeholder="请输入关键字查询"
        @search="searchFn"
      />
      <a-dropdown>
        <span class="addCircular iconfont icon-tianjia"></span>
        <template #overlay>
          <a-menu class="menu__group">
            <a-menu-item>
              <div @click="select()">本地上传</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="select()">在线制作</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import classify from "src/components/classify/index.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "镜像资源库", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});

const fromData: any = reactive({});
/**
 * 标签操作
 */
const classifyV = ref();
const classifyList: any = reactive([
  {
    title: "镜像属性",
    value: 0,
    keyName: "type",
    data: [
      { name: "全部", value: 0 },
      { name: "内置镜像", value: 1 },
      { name: "我的镜像", value: 2 },
    ],
  },
  {
    title: "镜像标签",
    value: 0,
    keyName: "label",
    data: [
      { name: "全部", value: 0 },
      { name: "数据标注", value: 1 },
      { name: "目标监测", value: 2 },
      { name: "数据标注", value: 3 },
      { name: "目标监测", value: 4 },
    ],
  },
]);
const labelSearch = computed(() => {
  return classifyV.value && classifyV.value.labelObj;
});

const search: any = reactive({
  key: "",
});
const searchFn = () => {
  let obj = {
    ...labelSearch.value,
    ...search,
  };
  console.log(obj);
  initData();
};
/**
 * 添加
 */
const select = () => {};
const initData = () => {
  // http.getList()
};
onMounted(() => {
  initData();
});
</script>
<style scoped lang="less">
.labelBox {
  display: flex;
  justify-content: space-between;

  .add {
    // width: 40%;
    // display: none;
  }
  .label {
    flex-grow: 1;
  }
}
</style>
