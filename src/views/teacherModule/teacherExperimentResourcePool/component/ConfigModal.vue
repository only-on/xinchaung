<template>
    <div class="title">镜像选择</div>
    <a-select v-model:value="reactiveData.image_id" placeholder="请选择需要的镜像" style="width: 100%; max-width: 476px" @change="imageChange">
      <a-select-option :value="item.id" v-for="(item, index) in props.imageList" :key="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <div class="configs">镜像配置</div>
    <ImageConfig @change="configChange" :defaultConfig="reactiveData.flavor" />
</template>
<script lang="ts" setup>
import ImageConfig from "src/components/imageConfig/index.vue";
import { onMounted, reactive, Ref, ref ,watch} from "vue";

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
watch(()=>props.defaultConfig, newVal => {
  if (newVal.flavor && newVal.image_id) {
    reactiveData.imageName = newVal.imageName;
    reactiveData.image_id = newVal.image_id;
    reactiveData.flavor = newVal.flavor;
  }
},{deep:true,immediate:true})
const configChange = (val: any) => {
  // console.log(val)
  reactiveData.flavor = val;
  emit("selectedImage", reactiveData);
};

const imageChange = (val:any) => {
  // console.log(val)
  var item=props.imageList.filter((item:any) => {
    return val === item.id
  });
  // console.log(item)
  reactiveData.image_id=val
  reactiveData.imageName=item[0].name
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
