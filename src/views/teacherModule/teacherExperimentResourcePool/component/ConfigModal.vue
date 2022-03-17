<template>
    <div class="title">镜像选择</div>
    <a-select v-model:value="reactiveData.image_id" placeholder="请选择需要的镜像" style="width: 100%; max-width: 476px" @change="imageChange">
      <a-select-option :value="item.id" v-for="(item, index) in props.imageList" :key="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <div class="configs">镜像配置</div>
    <ImageConfig @change="configChange" :defaultConfig="reactiveData.flavor" ></ImageConfig>
</template>
<script lang="ts" setup>
import ImageConfig from "src/components/imageConfig/index.vue";
import { onMounted, reactive, Ref, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { SelectTypes } from "ant-design-vue/es/select";
import { Modal, message } from "ant-design-vue";
const http = (request as any).teacherImageResourcePool;

const reactiveData: any = reactive({
  flavor: {
    cpu: "",
    disk: "",
    ram: "",
    gpu: false,
  },
  imageName: '',
  image_id:'',
});

interface Props {
  defaultConfig: any;
  imageList:any
}
const props = withDefaults(defineProps<Props>(), {
  defaultConfig: () => {},
  imageList: ()=> [],
});

const emit = defineEmits<{
  (e: "selectedImage", val: any): void;
}>();
if(props.imageList && props.imageList.length){
  let val=props.imageList[0]
    reactiveData.image_id=val.id
    reactiveData.imageName=val.name
    emit("selectedImage", reactiveData);
}
if (props.defaultConfig.flavor && props.defaultConfig.image_id) {
  reactiveData.imageName = props.defaultConfig.imageName;
  reactiveData.image_id = props.defaultConfig.image_id;
  reactiveData.flavor = props.defaultConfig.flavor;
}


const configChange = (val: any) => {
  // console.log(val)
  reactiveData.flavor = val;
  emit("selectedImage", reactiveData);
};

const imageChange = (val:any) => {
  // console.log(val)
  // reactiveData.imageName=
  emit("selectedImage", reactiveData);
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
