<template>
  <div class="title">镜像选择</div>
  <a-select
    v-model:value="imageList"
    placeholder="请选择需要的镜像"
    style="width: 100%; max-width: 476px"
  >
    <a-select-option value="shanghai">Zone one</a-select-option>
    <a-select-option value="beijing">Zone two</a-select-option>
  </a-select>
  <div class="configs">镜像配置</div>
  <ImageConfig :configs="configs" @change="configChange"></ImageConfig>
</template>
<script lang="ts" setup>
import ImageConfig from "src/components/imageConfig/index.vue";
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
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherImageResourcePool;
const configs: any = reactive([
  {
    name: "内存",
    data: [2, 4, 6, 8],
    unit: "GB",
    value: 2,
    type: "select",
    key: "ram",
  },
  {
    name: "CPU",
    data: [1, 2, 3, 4],
    unit: "GB",
    value: 1,
    type: "select",
    key: "cpu",
  },
  {
    name: "硬盘",
    data: [30, 40, 50, 100],
    unit: "GB",
    value: 30,
    type: "select",
    key: "disk",
  },
  {
    name: "GPU",
    data: [
      { name: "是", value: true },
      { name: "否", value: false },
    ],
    value: false,
    type: "radio",
    key: "gpu",
  },
]);
const reactiveData: any = reactive({
  configs: {
    cpu: {},
    disk: {},
    ram: {},
    gpu: false,
  },
});
const imageList: any = reactive([]);

const configChange = (val: any) => {
  // console.log(val)
  reactiveData.configs = val;
};
const initData = () => {
  http.getList().then((res: IBusinessResp) => {
    // list.push(...res.data);
  });
};
onMounted(() => {
  // initData();
});
</script>
<style scoped lang="less">
h3 {
  padding-bottom: 2rem;
}
.title {
  padding-bottom: 10px;
}
.configs {
  margin: 2rem 0 1rem 0;
}
</style>
