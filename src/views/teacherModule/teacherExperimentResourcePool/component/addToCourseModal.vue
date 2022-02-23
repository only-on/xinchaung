<template>
  <a-modal
    :visible="props.isShow"
    title="添加到"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-tree
      :show-line="true"
      :show-icon="true"
      :default-expanded-keys="defaultExpandedKeys"
      @select="onSelect"
    >
      <!-- <template #icon><carry-out-outlined /></template> -->
      <a-tree-node v-for="list in courseList" :key="list.id" :title="list.name">
        <template #icon>
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-kecheng1"></use>
          </svg>
        </template>
        <a-tree-node
          v-for="item in list.content"
          :title="item.name"
          :key="item.id"
        >
          <template #icon>
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-zhangjie"></use>
            </svg>
          </template>
          <template #switcherIcon></template>
        </a-tree-node>
      </a-tree-node>
    </a-tree>
  </a-modal>
</template>

<script lang="ts" setup="props">
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
} from "vue";
import { SelectEvent } from "ant-design-vue/es/tree/Tree";
import { CarryOutOutlined, FormOutlined } from "@ant-design/icons-vue";
const props = withDefaults(defineProps<{ isShow: boolean }>(), {
  isShow: false,
});
const emit = defineEmits<{
  (e: "update:isShow", isShow: boolean): void;
}>();

const handleOk = () => {};
const handleCancel = () => {
  emit("update:isShow", false);
};

const onSelect = (selectedKeys: string[], info: SelectEvent) => {
  console.log("selected", selectedKeys, info);
};
let courseList = ref([
  { id: 1, name: "课程1", content: [{ id: 11, name: "章节11" }] },
  {
    id: 2,
    name: "课程2",
    content: [
      { id: 21, name: "章节21" },
      { id: 22, name: "章节22" },
      { id: 23, name: "章节23" },
    ],
  },
  {
    id: 3,
    name: "课程3",
    content: [
      { id: 31, name: "章节31" },
      { id: 32, name: "章节32" },
      { id: 33, name: "章节33" },
    ],
  },
]);
let defaultExpandedKeys = reactive([1]);
</script>

<style lang="less" scoped></style>
