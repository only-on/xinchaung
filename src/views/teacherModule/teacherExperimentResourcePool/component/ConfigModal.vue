<template>
  <div class="title">镜像选择</div>
  <!-- <a-select style="width: 100%; max-width: 476px" v-model:value="reactiveData.imageName"  placeholder="请选择需要的镜像" :options="options" @change="imageChange"></a-select> -->
  <a-select
    v-model:value="reactiveData.imageName"
    placeholder="请选择需要的镜像"
    style="width: 100%; max-width: 476px"
    @change="imageChange"
  >
    <a-select-option :value="'环境1'">环境1</a-select-option>
    <a-select-option :value="'环境2'">环境2</a-select-option>
  </a-select>
  <div class="configs">镜像配置</div>
  <ImageConfig
    @change="configChange"
    :defaultConfig="reactiveData.configs"
  ></ImageConfig>
</template>
<script lang="ts" setup>
import ImageConfig from "src/components/imageConfig/index.vue";
import { onMounted, reactive, Ref, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { SelectTypes } from "ant-design-vue/es/select";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherImageResourcePool;

const reactiveData: any = reactive({
  configs: {
    cpu: "",
    disk: "",
    ram: "",
    gpu: false,
  },
  imageName: "环境1",
});

interface Props {
  defaultConfig: any;
}
const props = withDefaults(defineProps<Props>(), {
  defaultConfig: () => {},
});
if (props.defaultConfig.configs && props.defaultConfig.imageName) {
  reactiveData.imageName = props.defaultConfig.imageName;
  reactiveData.configs = props.defaultConfig.configs;
}
var options = ref<SelectTypes["options"]>([]);
const emit = defineEmits<{
  (e: "selectedImage", val: any): void;
}>();

const configChange = (val: any) => {
  reactiveData.configs = val;
  emit("selectedImage", reactiveData);
};

const imageChange = () => {
  emit("selectedImage", reactiveData);
};

const initData = () => {
  // options.length = 0;
  http.getList().then((res: IBusinessResp) => {
    // list.push(...res.data);
    // data.length?data.map((v:any)=>{
    //       v.value=v.id
    //       v.label=v.name
    //     }):'';
    // options.value.push(...data)

    // 每次打开配置默认值都一样   下面代码不需要
    // reactiveData.imageName=list[0].name
    emit("selectedImage", reactiveData);
  });
};
onMounted(() => {
  // console.log(2222222)
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
