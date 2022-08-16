<template>
  <div>
    <a-drawer
    :title="props.docOrMp4Type === 1 ? '选择文档' : '选择视频'"
    class="select-docOrMp4-drawer"
    :destroyOnClose="true"
    :closable="true"
    placement="right"
    :visible="docOrMp4Drawer.visible"
    width="640"
    @close="closeDrawerDoc"
  >
  <SourceMaterial
    :activeFile="docOrMp4Drawer.activeFile"
    :tags="props.docOrMp4Type === 1?'实验文档':'视频'"
    @selectSourceMaterialFile="selectSourceMaterialFile"
  />
  </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import {
  Ref,
  ref,
  onMounted,
  reactive,
  defineProps,
  withDefaults,
  watch
} from "vue";

import iconList from "src/utils/iconList";
import { bytesToSize } from "src/utils/common"
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import SourceMaterial from './SourceMaterial.vue'
const http = (request as any).teacherMaterialResource;
// 采用ts专有声明，有默认值
interface Props {
  docOrMp4Type: number;
  visible: boolean;
  activeFile:any
}
const props = withDefaults(defineProps<Props>(), {
  docOrMp4Type:1,
  visible:false,
  activeFile: () => {},
});
const emit = defineEmits<{
  (e: "selectDocOrMp4File", val: any): void;
  (e: "closeDrawerDoc"): void;
}>();
const docOrMp4Drawer: any = reactive({
  visible: false,
  activeFile: {}, //  选择或上传的文档、视频
});

watch(()=>{return props.visible},(val:boolean)=>{
  docOrMp4Drawer.visible=props.visible
  // console.log(val)
},{immediate:true})

docOrMp4Drawer.activeFile={ ...props.activeFile}

const closeDrawerDoc = () => {
  emit("closeDrawerDoc");
};
const selectSourceMaterialFile=(val:any)=>{
  console.log(val)
  emit("selectDocOrMp4File", val);
}
</script>
<style scoped lang="less">
.select-docOrMp4-drawer {
  
}
.ant-pagination {
  text-align: center;
}
</style>
