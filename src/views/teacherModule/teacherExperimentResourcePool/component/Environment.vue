<template>
  <h3>实验环境</h3>
  <div>
    <ConfigModal></ConfigModal>
  </div>
  <div class="selectList flexCenter">
    <div class="add item flexCenter" @click.stop="visible = true">
      <div class="tianjia">
        <span class="iconfont icon-tianjia"></span>
        <span>添加实验环境</span>
      </div>
      <div class="limit">最多添加三个环境</div>
    </div>
    <div class="item" v-for="v in 3" :key="v">
      <div class="single-ellipsis">
        镜像名称需单行隐藏镜像名称需单行隐藏镜像名称需单行隐藏
      </div>
      <div class="content">
        <div class="info flexCenter">
          <span>内存：{{ "4" }}GB</span>
          <span>cpu：{{ "4" }}GB</span>
          <span>硬盘：{{ "4" }}GB</span>
          <span>GPU：否</span>
        </div>
        <div class="caozuo">
          <span class="iconfont icon-bianji1"></span>
          <span class="iconfont icon-shanchu"></span>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="visible" title="设置实验环境" @ok="handleOk">
    <ConfigModal></ConfigModal>
    <template #footer>
      <Submit @submit="handleOk" @cancel="cancel"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import ConfigModal from "./ConfigModal.vue";
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
interface Props {
  type: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  type: false,
});
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
var visible: Ref<boolean> = ref(false);
const configChange = (val: any) => {
  // console.log(val)
  reactiveData.configs = val;
};
const handleOk = () => {};
const cancel = () => {
  visible.value = false;
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
.selectList {
  .item {
    width: 240px;
    height: 100px;
    background: #f9f9f9;
    border-radius: 10px;
    margin-right: 1rem;
    padding: 10px;
    .single-ellipsis {
      color: var(--black-85);
    }
    .content {
      display: flex;
      margin-top: 14px;
      .info {
        flex-wrap: wrap;
        width: 80%;
        span {
          width: 50%;
          font-size: 12px;
          color: var(--black-45);
        }
      }
      .caozuo {
        display: flex;
        align-items: end;
        flex: 1;
        justify-content: space-around;
        span {
          cursor: pointer;
          color: var(--black-65);
        }
      }
    }
  }
  .add {
    cursor: pointer;
    background: #ffffff;
    border: 1px dashed var(--primary-color);
    color: var(--primary-color);
    flex-direction: column;
    justify-content: center;
    .limit {
      color: var(--black-25);
      font-size: 12px;
      padding-top: 10px;
    }
  }
}
</style>
