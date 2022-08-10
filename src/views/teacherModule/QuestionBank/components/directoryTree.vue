<template>
  <template v-if="props.isOperateTree">
    <div class="title">文件夹目录</div>
    <div class="create-btn pointer" @click="visible=true">新建文件夹</div>
  </template>
  <a-directory-tree
    v-if="treeData[0].children.length"
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
        <span class="name single_ellipsis" :title="dataRef.name">{{ dataRef.name }}</span>
        <span class="btns" v-if="dataRef.id!=0&&props.isOperateTree">
          <span class="iconfont icon-shangyi" @click.stop="upDirectory(dataRef)"></span>
          <span class="iconfont icon-shangyi-copy" @click.stop="downDirectory(dataRef)"></span>
          <span class="iconfont icon-bianji" @click.stop="editDirectory(dataRef)"></span>
          <span class="iconfont icon-shanchu" @click.stop="deletDirectory(dataRef)"></span>
        </span>
      </span>
    </template>
  </a-directory-tree>
  <!-- 创建目录弹框 -->
  <a-modal v-model:visible="visible"  :title="`新建文件夹`" class="create-directory" :width="400">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item name="catalogue" label="选择创建路径">
        <directory-cascader :formState="formState" :levelNum="2"></directory-cascader>
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
import directoryCascader from 'src/components/ReleasePaper/directoryCascader.vue';
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
  return new Promise(async(resolve: any) => {
    if (!treeNode.dataRef.has_children||!treeNode.dataRef.id) {
      resolve();
      return;
    }
    const data = await getDirectorySub(treeNode.dataRef)
    treeNode.dataRef.children = data
    treeData.value = [...treeData.value];
    resolve();
    // http.getDirectoryChidren({urlParams: {directory_id: treeNode.dataRef.id}}).then((res: IBusinessResp) => {
    //   res.data.forEach((v: any) => {
    //     v.pid = treeNode.dataRef.id
    //   })
    //   if (res.data?.length) {
    //     treeNode.dataRef.children = res.data
    //   }
    //   treeData.value = [...treeData.value];
    //   resolve();
    // }).catch(() => {
    //   treeNode.dataRef.children = [
    //     {id: Math.ceil(Math.random()*100), name: '文件夹', has_children: 1}
    //   ]
    //   treeData.value = [...treeData.value];
    //   resolve();
    // })
  });

}

// 获取第一层目录
function getDirectoryFirst() {
  treeData.value[0].children = []
  expandedKeys.value = [0]
  http.getDirectoryFirst().then((res: IBusinessResp) => {
    console.log(res)
    res.data.forEach((v: any, k: number) => {
      v.pid = 0
      v.index = k
    })
    loading.value = false
    if (res.data?.length) {
      treeData.value[0].has_children = 1
      treeData.value[0].children = res.data
    }
  })
}
// 获取第二层目录
function getDirectorySub(val: any) {
  return new Promise((resolve: any) => {
    http.getDirectoryChidren({urlParams: {directory_id: val.id}}).then((res: IBusinessResp) => {
      res.data.forEach((v: any, k: number) => {
        if (val.pid) {
          v.pPindex = val.index
          v.pindex = val.pindex
        } else {
          v.pindex = val.index
        }
        v.pid = val.id
        v.index = k
      })
      resolve(res.data)
    })
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
  directoryId: ['目录', '文件夹1', '文件夹2']
})
function submit() {
  loading.value = true
  console.log(formState)
  const param = {
    name: formState.name,
    // parent_id: formState.directoryId[formState.directoryId.length-1]
  }
  if (formState.directoryId[formState.directoryId.length-1]) {
    Object.assign(param, {parent_id: formState.directoryId[formState.directoryId.length-1]})
  }
  http.createDirectory({param}).then(async(res: IBusinessResp) => {
    loading.value = false
    visible.value = false
    const pid = formState.directoryId[formState.directoryId.length-1]
    // if (pid) {
    //   let data = await getDirectorySub(pid)
    //   val.children = data
    //   treeData.value = [...[val]];
    // } else {
      getDirectoryFirst()
    // }
  })
}
function cancel() {
  visible.value = false
}
function upDirectory(val: any) {
  const params = {
    original_directory_id: val.id,
    destination_directory_id: treeData.value[0].children[val.index-1].id
  }
  http.moveBeforeDirectory({urlParams: params}).then(async(res: IBusinessResp) => {
    if (!val.pid) {
      getDirectoryFirst()
    } else {
      let data = await getDirectorySub(treeData.value[0].children[val.pindex])
      // treeData.value[0]
      treeData.value[0].children[val.pindex].children = data
          //   val.children = data
    }
  })
}
function downDirectory(val: any) {
  console.log(val)
  const params = {
    original_directory_id: val.id,
    destination_directory_id: treeData.value[0].children[val.index+1].id
  }
  http.moveAfterDirectory({urlParams: params}).then(async(res: IBusinessResp) => {
    if (!val.pid) {
      getDirectoryFirst()
    } else {
      let data = await getDirectorySub(treeData.value[0].children[val.pindex])
      treeData.value[0].children[val.pindex].children = data
          //   val.children = data
    }
  })
}
function editDirectory(val: any) {}
function deletDirectory(val: any) {
  Modal.confirm({
    title: "确定要删除这个文件夹吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.deleteDirectory({urlParams: {directory_id: val.id}}).then(async(res: IBusinessResp) => {
        // if (val.pid) {
        //   let data = await getDirectorySub(val.pid)
        //   val.children = data
        //   treeData.value = [...[val]];
        // } else {
          getDirectoryFirst()
        // }
      })
    }
  })
}

// 获取层级信息
function getLevelInfo(current: any, upper: any) {
  console.log(current)
  console.log(upper)
}
</script>

<style lang="less" scoped>
.tree-title {
  display: inline-block;
  width: 100%;
  .name { 
    display: inline-block;
    width: 150px
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