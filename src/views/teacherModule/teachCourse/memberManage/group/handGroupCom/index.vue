<template>
  <div>
    <a-transfer
      class="tree-transfer"
      :data-source="dataSource"
      :target-keys="targetKeys"
      :render="render"
      :show-select-all="false"
      @change="onChange"
      :showSearch='true'
    >
    <!-- onItemSelect -->
      <template #children="{ direction, selectedKeys }">
        <a-tree
          v-if="direction === 'left'"
          blockNode
          checkable
          checkStrictly
          defaultExpandAll
          :checkedKeys="[...selectedKeys, ...targetKeys]"
          :treeData="treeData"
        />
      </template>
    </a-transfer>
  </div>
</template>
<script lang="ts">
  //  @check="
  //           (_, props) => {
  //             onChecked(_, props, [...selectedKeys, ...targetKeys], onItemSelect);
  //           }
  //         "
  //         @select="
  //           (_, props) => {
  //             onChecked(_, props, [...selectedKeys, ...targetKeys], onItemSelect);
  //           }
  //         "
import { CheckEvent } from 'ant-design-vue/es/tree/Tree';
import { computed, defineComponent, ref } from 'vue';
interface Iprops{
  
}
interface TreeDataItem {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeDataItem[];
}
const tData: TreeDataItem[] = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-3' },
];

const transferDataSource: TreeDataItem[] = [];
function flatten(list: TreeDataItem[] = []) {
  list.forEach(item => {
    transferDataSource.push(item);
    flatten(item.children);
  });
}
flatten(JSON.parse(JSON.stringify(tData)));

function isChecked(selectedKeys: string[], eventKey: string) {
  return selectedKeys.indexOf(eventKey) !== -1;
}

function handleTreeData(data: TreeDataItem[], targetKeys: string[] = []): TreeDataItem[] {
  data.forEach(item => {
    item['disabled'] = targetKeys.includes(item.key);
    if (item.children) {
      handleTreeData(item.children, targetKeys);
    }
  });
  return data;
}
function render(item:any){
  return item.title
}

export default defineComponent({
  setup() {
    const targetKeys = ref<string[]>([]);

    const dataSource = ref<TreeDataItem[]>(transferDataSource);

    const treeData = computed<TreeDataItem[]>(() => {
      return handleTreeData(tData, targetKeys.value);
    });

    const onChange = (keys: string[]) => {
      targetKeys.value = keys;
    };
    const onChecked = (
      _: Record<string, string[]>,
      e: CheckEvent,
      checkedKeys: string[],
      onItemSelect: (n: any, c: boolean) => void,
    ) => {
      const { eventKey } = e.node;
      onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
    };
    return {
      targetKeys,
      dataSource,
      treeData,
      onChange,
      onChecked,
      render
    };
  },
});
</script>
<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>
