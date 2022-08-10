<template>
  <a-cascader
    v-model:value="props.formState.directoryId"
    :options="options"
    :load-data="loadData"
    placeholder="Please select"
    change-on-select
    :field-names="{ label: 'name', value: 'id' }"
    :allow-clear="false"
    @change="changeHandle"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const http = (request as any).QuestionBank;
interface IFormState {
  directoryId: any[]
}
const props = withDefaults(defineProps<{
  formState: IFormState,
  levelNum: number
}>(), {
  formState: () => {return {directoryId: [0]}},    // 响应式对象
  levelNum: 3   // 文件夹最大层级数
});
const options = ref([
  {
    id: 0,
    name: "目录",
    is_public: 1,
    has_children: 0,
    isLeaf: false,
    children: []
  }
])
const loadData = (selectedOptions: any) => {
  var targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;

  if (targetOption.id==0) {
    http.getDirectoryFirst().then((res: IBusinessResp) => {
      targetOption.loading = false;
      console.log(res)
      if (res.data?.length) {
        res.data.forEach((v: any) => {
          v.isLeaf = !v.has_children
          v.level = 1
        })
        targetOption.children = res.data
        console.log(targetOption)
        // options.value = [...targetOption];
      }
    })
  } else {
    http.getDirectoryChidren({urlParams: {directory_id: targetOption.id}}).then((res: IBusinessResp) => {
      targetOption.loading = false;
      if (res.data?.length) {
        res.data.forEach((v: any) => {
          v.isLeaf = targetOption.level==props.levelNum-1
          v.level = targetOption.level==props.levelNum-1?props.levelNum:targetOption.level+1
        })
        targetOption.children = res.data
        options.value = [...targetOption];
      }
    }).catch(() => {
      targetOption.loading = false;
      // targetOption.children = [
      //   {id: Math.ceil(Math.random()*100), name: '文件夹', isLeaf: targetOption.level==props.levelNum-1, level: targetOption.level==props.levelNum-1?props.levelNum:targetOption.level+1}
      // ]
      // // options.value = [...targetOption];
      // console.log(options.value)
    })
  }
};
const changeHandle = (value: any, selectedOptions: any) => {
  console.log(value)
  console.log(selectedOptions)
}
</script>