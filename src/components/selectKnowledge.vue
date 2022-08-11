<template>
  <a-tree-select
    v-model:value="value"
    tree-data-simple-mode
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="Please select"
    :load-data="onLoadData"
    :field-names="{
      children: 'children',
      title: 'knowledge_map_name',
      label: 'knowledge_map_name',
      value: 'id',
    }"
    :treeCheckable="true"
    :show-search="false"
    :allow-clear="false"
    @change="changeHandle"
    @dropdownVisibleChange="dropdownVisibleChange"
  />
</template>
<script lang="ts" setup>
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, onMounted, ref, watch } from 'vue';
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).QuestionBank;
const value = ref<string>();
const treeData = ref([
  { id: 1, pId: 0, value: '1', knowledge_map_name: 'Expand to load' },
  { id: 2, pId: 0, value: '2', knowledge_map_name: 'Expand to load' },
  { id: 3, pId: 0, value: '3', knowledge_map_name: 'Tree Node', isLeaf: true },
]);

watch(value, () => {
  console.log(value.value);
});
const onLoadData = (treeNode: any) => {
  return new Promise(resolve => {
    const { id } = treeNode.dataRef;
    http.getKnowledgeSub({urlParams: {id}}).then((res: IBusinessResp) => {
      if (!res) return
      res.data.forEach((v: any) => {
          v.isLeaf = v.level===3
          v.pId = id
          v.checkable = v.level===3
        })
      treeNode.dataRef.children = res.data
      console.log(treeNode)
      treeData.value = treeData.value.concat(res.data);
      console.log(treeData.value);
      resolve(true);
    })
  });
};
const getKnowledgeFirst = () => {
  http.getKnowledgeFirst().then((res: IBusinessResp) => {
    res.data.forEach((v: any) => {
      v.isLeaf = v.level===3
      v.pId = 0
      v.checkable = false
    })
    treeData.value = res.data
  })
}
const changeHandle = (value: any, label: any, extra: any) => {
  console.log(value)
  console.log(label)
  console.log(extra)
}
const dropdownVisibleChange = (open: boolean) => {
  console.log(open)
}
onMounted(() => {
  getKnowledgeFirst()
})
</script>

