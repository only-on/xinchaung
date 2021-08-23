<template>
  <a-tree :tree-data="treeData" show-icon v-model:selectedKeys="selectedKeys" @select="selectedChange" :checkable="false">
    <template #program>
      <span class="iconfont icon-program"></span>
    </template>
    <template #zhuomianshiyan>
      <span class="iconfont icon-zhuomianshiyan"></span>
    </template>
  </a-tree>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

const treeData: TreeDataItem[] = [
  {
    title: '第一章',
    key: '0-0',
    // slots: {
    //   icon: 'smile',
    // },
    children: [
      { title: '1445', key: '0-0-0', slots: { icon: 'program' } },
      { title: 'leaf', key: '0-0-1', slots: { icon: 'program' } },
      { title: 'tree', key: '0-0-2', slots: { icon: 'zhuomianshiyan' } },
      { title: '验证实验', key: '0-0-3', slots: { icon: 'zhuomianshiyan' } },
    ],
  },
  {
    title: '第二章',
    key: '0-1',
    // slots: {
    //   icon: 'smile',
    // },
    children: [
      { title: '不知道', key: '0-1-0', slots: { icon: 'meh' } },
      { title: '假的', key: '0-1-1', slots: { icon: 'meh' } },
    ]
  },
  {
    title: '第三章',
    key: '0-2',
    // slots: {
    //   icon: 'smile',
    // },
    children: []
  }
];

export default defineComponent({
  setup(props, {emit}) {
    function selectedChange(selectedkeys:any, e:any) {
      console.log(selectedkeys);
      console.log(e.selectedNodes);
      let node = {
        taskId: 533005,
        type: 'course',
        name: '',
        courseId: 501703,
        grouped: 0
      }
      emit('selectNode', node)
    }

    onMounted(() => {
      // let nodes = treeData[0].children[0]
      let node = {
        taskId: 533005,
        type: 'course',
        name: '',
        courseId: 501703,
        grouped: 0
      }
      emit('selectNode', node)
    })
    return {
      selectedKeys: ref(['0-0-3']),
      treeData,
      selectedChange
    };
  },
});
</script>

<style lang="less" scope>
.ant-tree li .ant-tree-child-tree {
  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    color: @theme-color;
    background-color: #eaeaea;
  } 
  .ant-tree-node-content-wrapper:hover {
    color: @icon-color-hover;
    background-color: #eaeaea;
  }
  .ant-tree-node-content-wrapper:hover .ant-tree-title {
    color:  @theme-color;
    background-color: #eaeaea;
  }
  .ant-tree-iconEle .anticon svg {
    color: @theme-color;
  }
  .ant-tree-iconEle {
    color: @theme-color;
  }
  .ant-tree-switcher  {
    display: none;
  }
}
</style>

