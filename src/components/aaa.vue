<template>
  <a-directory-tree
    multiple
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
  >
    <a-tree-node v-for="item in list" :key="item.key">
      <template #icon="{expanded}">
        <span class="iconfont icon-kecheng1" v-if="expanded"></span>
        <span class="iconfont icon-zhangjie" v-else></span>
      </template>
      <template #title>
        <div class="title-content">
          <span>{{item.title}}</span>
          <span class="iconfont icon-zhangjie"></span>
        </div>
      </template>
      <template v-if="item.children?.length">
        <a-tree-node v-for="item1 in item.children" :key="item1.key" :title="item1.title">
          <template v-if="item1.children?.length">
            <a-tree-node v-for="item2 in item1.children" :key="item2.key" :title="item2.title">
              <template v-if="item2.children?.length">
                <a-tree-node v-for="item3 in item2.children" :key="item3.key" :title="item3.title"></a-tree-node>
              </template>
            </a-tree-node>
          </template>
        </a-tree-node>
      </template>
    </a-tree-node>
  </a-directory-tree>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
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
    return {
      list,
      expandedKeys,
      selectedKeys,
    };
  },
});
</script>

<style lang="less" scoped>
.ant-tree li{ 
  :deep(span.ant-tree-switcher) {
    display: none;
  }
  :deep(.ant-tree-node-content-wrapper) {
    .title-content {
      display: inline-block;
    }
  }
}
</style>