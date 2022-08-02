<template>
  <a-directory-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    :showIcon="true"
    :showLine="false"
    block-node
    :tree-data="list"
    @select="onSelect"
  >
    <template #icon="{expanded, dataRef}">
      <span v-if="dataRef.children&&dataRef.children.length">
        <span class="iconfont icon-wenjianjia2-mianxing" v-if="expanded"></span>
        <span class="iconfont icon-wenjianjia1-mianxing" v-else></span>
      </span>
      <span v-else><span class="iconfont icon-wenjianjia1-mianxing"></span></span>
    </template>
    <template #title="{ dataRef }">
      <span class="tree-title title">
        <span class="name">
          <span class="itemName">{{ dataRef.title }}</span>
        </span>
        <span class="btns" v-if="dataRef.key!=0">
          <span class="iconfont icon-shangyi"></span>
          <span class="iconfont icon-shangyi-copy"></span>
          <span class="iconfont icon-bianji"></span>
          <span class="iconfont icon-shanchu"></span>
        </span>
      </span>
    </template>
  </a-directory-tree>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SelectEvent } from "ant-design-vue/es/tree/Tree";
export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>(['0']);
    const selectedKeys = ref<string[]>(['0']);
    const list = [
      {
        title: '目录',
        key: '0',
        children: [
          {
            title: '一级1',
            key: '1',
            children: [
              {
                title: '1二级1',
                key: '1-1',
                children: [
                  {
                    title: '1三级1',
                    key: '1-1-1',
                  }
                ]
              },
              {
                title: '1二级2',
                key: '1-2',
                children: [
                  {
                    title: '12三级1',
                    key: '1-2-1',
                  }
                ]
              },
              {
                title: '1二级3',
                key: '1-3',
                children: [
                  {
                    title: '13三级1',
                    key: '1-3-1',
                  }
                ]
              },
            ]
          },
          {
            title: '一级2',
            key: '2',
            children: [
              {
                title: '2二级1',
                key: '2-1',
                children: [
                  {
                    title: '2三级1',
                    key: '2-1-1',
                  }
                ]
              },
              {
                title: '2二级2',
                key: '2-2',
                children: [
                  {
                    title: '2三级1',
                    key: '2-2-1',
                  }
                ]
              },
            ]
          },
          {
            title: '一级3',
            key: '3',
            children: [
              {
                title: '3二级1',
                key: '3-1',
                children: [
                  {
                    title: '3三级1',
                    key: '3-1-1',
                  }
                ]
              },
              {
                title: '3二级2',
                key: '3-2',
                children: [
                  {
                    title: '3三级2',
                    key: '3-2-1',
                  }
                ]
              },]
          },
        ]
      }
    ]
    const onSelect = (selectedKeys: string[], info: SelectEvent) => {
      console.log("selected", selectedKeys, info);
      // selectNode.value = info.selectedNodes.length ? info.selectedNodes[0] : {}
    };
    return {
      list,
      expandedKeys,
      selectedKeys,
      onSelect,
    };
  },
});
</script>

<style lang="less" scoped>
.tree-title {
  .name {}
  .btns {
    display: none;
    float: right;
    .iconfont {
      font-size: var(--font-size-14);
      color: var(--primary-color);
      margin-right: 8px;
    }
  }
  &:hover {
    .btns {
      display: inline-block;
    }
  }
}
</style>