<template>
  <template v-if="props.isOperateTree">
    <div class="title">文件夹目录</div>
    <div class="create-btn pointer" @click="visible=true">新建文件夹</div>
  </template>
  <a-directory-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    :showIcon="true"
    :showLine="false"
    block-node
    :tree-data="treeData"
    @select="onSelect"
    :load-data="onLoadData"
    :field-names="fieldNames"
  >
    <template #icon="{expanded, dataRef}">
      <span v-if="dataRef.has_children">
        <span class="iconfont icon-wenjianjia2-mianxing" v-if="expanded"></span>
        <span class="iconfont icon-wenjianjia1-mianxing" v-else></span>
      </span>
      <span v-else><span class="iconfont icon-wenjianjia2-mianxing"></span></span>
    </template>
    <template #title="{ dataRef }">
      <span class="tree-title">
        <span class="name">{{ dataRef.name }}</span>
        <span class="btns" v-if="dataRef.id!=0&&props.isOperateTree">
          <span class="iconfont icon-shangyi" @click="upDirectory(dataRef)"></span>
          <span class="iconfont icon-shangyi-copy" @click="downDirectory(dataRef)"></span>
          <span class="iconfont icon-bianji" @click="editDirectory(dataRef)"></span>
          <span class="iconfont icon-shanchu" @click="deletDirectory(dataRef)"></span>
        </span>
      </span>
    </template>
  </a-directory-tree>
  <!-- 创建目录弹框 -->
  <a-modal v-model:visible="visible"  :title="`新建文件夹`" class="create-directory" :width="400">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item name="catalogue" label="选择创建路径">
        <a-cascader
          v-model:value="formState.directoryId"
          :options="options"
          :load-data="loadData"
          placeholder="Please select"
          change-on-select
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item label="文件夹名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入文件夹名称" />
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="submit()" @cancel="cancel()" :loading="loading"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { defineComponent, createVNode, ref, onMounted, reactive } from 'vue';
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import Submit from "src/components/submit/index.vue";
const http = (request as any).QuestionBank;
interface Props {
  isOperateTree: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isOperateTree: true,
});
const emit = defineEmits<{
  (e: "selectedTree", id: number): void;
}>();
const expandedKeys = ref<number[]>([0]);
const selectedKeys = ref<number[]>([0]);
const fieldNames = {
  title: 'name',
  key: 'id'
};
const list = ref([
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
])
const treeData = ref([
  {
    id: 0,
    name: "目录",
    is_public: 1,
    has_children: 0,
    children: []
  }
])
const onSelect = (selectedKeys: number[], info: any) => {
  console.log("selected", selectedKeys, info);
  // selectNode.value = info.selectedNodes.length ? info.selectedNodes[0] : {}
  emit("selectedTree", selectedKeys[0])
};
const onLoadData = (treeNode: any) => {
  return new Promise((resolve: any) => {
    if (!treeNode.dataRef.has_children||!treeNode.dataRef.id) {
      resolve();
      return;
    }
    http.getDirectoryChidren({urlParams: {directory_id: treeNode.dataRef.id}}).then((res: IBusinessResp) => {
      if (res.data?.length) {
        treeNode.dataRef.children = res.data
      }
      treeData.value = [...treeData.value];
      resolve();
    }).catch(() => {
      treeNode.dataRef.children = [
        {id: Math.ceil(Math.random()*100), name: '文件夹', has_children: 1}
      ]
      treeData.value = [...treeData.value];
      resolve();
    })
  });

}

// 获取第一层目录
function getDirectoryFirst() {
  http.getDirectoryFirst().then((res: IBusinessResp) => {
    console.log(res)
    if (res.data?.length) {
      treeData.value[0].has_children = 1
      treeData.value[0].children = res.data
    }
  })
}
onMounted(() => {
  getDirectoryFirst()
})

// 创建文件夹目录
const visible = ref(false)
const loading = ref(false)
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
}
const formState = reactive({
  name: '',
  directoryId: [0]
})
function submit() {
  loading.value = true
  console.log(formState)
  const param = {
    is_public: 0,
    name: formState.name,
    parent_id: formState.directoryId[formState.directoryId.length-1]
  }
  http.createDirectory({param}).then((res: IBusinessResp) => {
    loading.value = false
    visible.value = false
    console.log(treeData.value)
    treeData.value[0].children[0].children = [{
      id: 31324234,
      name: "目录111",
      is_public: 1,
      has_children: 0,
      isLeaf: false,
      children: []
    }]
    console.log(treeData.value)
  })
}
function cancel() {

}
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
        targetOption.children = res.data
        options.value = [...targetOption];
      }
    }).catch(() => {
      targetOption.loading = false;
      targetOption.children = [
        {id: Math.ceil(Math.random()*100), name: '文件夹', isLeaf: false}
      ]
      // options.value = [...targetOption];
    })
  }
};
function upDirectory(val: any) {}
function downDirectory(val: any) {}
function editDirectory(val: any) {}
function deletDirectory(val: any) {
  Modal.confirm({
    title: "确定要删除这个文件夹吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {

    }
  })
}
</script>

<style lang="less" scoped>
.tree-title {
  display: inline-block;
  width: 100%;
  .name { 
    display: inline-block;
    width: 100%;
  }
  .btns {
    display: none;
    // display: inline-block;
    width: 114px;
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(268deg,#fff7e6 2%, rgba(255,247,230,0.91) 87%, rgba(255,247,230,0.00) 98%);
    text-align: right;
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
.title {
  margin-top: 16px;
  color: var(--black-85);
  font-size: var(--font-size-16);
  line-height: 22px;
  margin-left: 10px;
}
.create-btn {
  height: 24px;
  line-height: 24px;
  margin: 10px;
  text-align: center;
  color: var(--brightBtn);
  background-color: var(--brightBtn-14);
  border-radius: 12px;
}
</style>