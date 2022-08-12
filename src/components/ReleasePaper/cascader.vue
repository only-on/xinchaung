<template>
  <a-cascader
    v-model:value="relation"
    :options="options"
    :load-data="loadData"
    placeholder="Please select"
    :field-names="{ label: 'name', value: 'id' }"
    @change="changeHandle"
    :allow-clear="false"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const http = (request as any).teachCourse;
interface Props {
  relation: any[]
}
const props = withDefaults(defineProps<Props>(), {
  relation: () => [],
});
const emit = defineEmits<{
  (e: "update:relation", val: any): void;
}>();
const relation = ref(props.relation)
const options = ref([
  {
    id: 0,
    name: "否",
    isLeaf: true,
    children: [],
    level: 0
  },
  {
    id: 1,
    name: "有",
    isLeaf: false,
    children: [],
    level: 0
  }
])
const loadData = (selectedOptions: any) => {
  var targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;

  if (targetOption.level === 0) {
    http.courseCategory().then((res: IBusinessResp) => {
      targetOption.loading = false;
      if (res.data?.length) {
        res.data.forEach((v: any) => {
          v.isLeaf = false
          v.level = 1
        })
      }
      targetOption.children = res.data
      // console.log(targetOption)
      // options.value = [...targetOption];
    })
  }
  if (targetOption.level === 1) {
    http.getDirectiveCourseList({urlParams: {tagName: targetOption.name}}).then((res: IBusinessResp) => {
      targetOption.loading = false;
      if (res.data?.length) {
        res.data.forEach((v: any) => {
          v.isLeaf = true
          v.level = 2
        })
      }
      targetOption.children = res.data
      // console.log(targetOption)
      // options.value = [...targetOption];
    })
  }
};
const changeHandle = (value: any, selectedOptions: any) => {
  // console.log(value)
  // console.log(selectedOptions)
  // console.log(relation.value)
  emit("update:relation", relation.value)
}
// watch(()=> props.relation, (newVal:any) => {
//   console.log(newVal)
//   relation.value = props.relation
// },{deep:true,immediate:true})
</script>

<style lang="less" scoped>

</style>
