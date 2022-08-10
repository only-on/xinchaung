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
  <a-modal v-model:visible="visible"  :title="(formState.id?'编辑':'新建')+`文件夹`" class="create-directory" :width="400" @cancel="cancel()">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item name="catalogue" label="选择创建路径" v-if="!formState.id">
        <directory-cascader :formState="formState" :levelNum="2" @selectedHandle="selectedHandle"></directory-cascader>
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
const treeData = ref<ITreeList[]>([
  {
    id: 0,
    name: "目录",
    has_children: 0,
    children: [],
    pid: 0,  // 父级目录id
    index: 0,  // 当前目录索引
    pindex: 0, // 父级目录索引
    pPindex: 0, // 父级的父级目录索引
    directoryName: [],  // 当前目录路径
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
      v.directoryName = [treeData.value[0].name]
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
      val.directoryName.push(val.name)
      res.data.forEach((v: any, k: number) => {
        if (val.pindex) {
          v.pPindex = val.pindex
          v.pindex = val.index
        } else {
          v.pindex = val.index
        }
        v.pid = val.id
        v.index = k
        v.directoryName = [...val.directoryName]
      })
      console.log(res.data)
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
const formRef = ref()
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
}
const formState = reactive<IFormState>({
  id: 0,
  name: '',
  directoryId: ['目录'],
  parentId: 0
})
function selectedHandle() {
  formState.parentId = formState.directoryId[formState.directoryId.length-1]
}
function submit() {
  formRef.value.validate().then(() => {
    loading.value = true
    console.log(formState)
    const param = {
      name: formState.name,
      // parent_id: formState.directoryId[formState.directoryId.length-1]
    }
    if (formState.parentId) {
      Object.assign(param, {parent_id: formState.parentId})
    }
    if (formState.id) {
      editDirectorySubmit()
      return
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
  })
}
function editDirectorySubmit() {
  http.updateDirectory({
    param: {name: formState.name}, 
    urlParams: {directory_id: formState.id}})
  .then((res: IBusinessResp) => {
    loading.value = false
    visible.value = false
    successHandle(formState)
  })
}
function cancel() {
  visible.value = false
  loading.value = false
  Object.assign(formState, {id: 0, name: '', directoryId: [0], parentId: 0})
}
function upDirectory(val: any) {
  if (val.index === 0) {
    message.warn('已经是第一个了~')
    return
  }
  const params = {
    original_directory_id: val.id,
    destination_directory_id: getLevelInfo(val, 'upper').children[val.index-1].id
  }
  http.moveBeforeDirectory({urlParams: params}).then(async(res: IBusinessResp) => {
    successHandle(val)
  })
}
function downDirectory(val: any) {
  if (!getLevelInfo(val, 'upper').children[val.index+1]) {
    message.warn('已经是最后一个了~')
    return
  }
  console.log(val)
  const params = {
    original_directory_id: val.id,
    destination_directory_id: getLevelInfo(val, 'upper').children[val.index+1].id
  }
  http.moveAfterDirectory({urlParams: params}).then(async(res: IBusinessResp) => {
    successHandle(val)
  })
}
function editDirectory(val: any) {
  visible.value = true
  Object.assign(formState, {...val})
  formState.directoryId = val.directoryName
  formState.parentId = val.pid
}
function deletDirectory(val: any) {
  Modal.confirm({
    title: "确定要删除这个文件夹吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.deleteDirectory({urlParams: {directory_id: val.id}}).then(async(res: IBusinessResp) => {
        successHandle(val)
      })
    }
  })
}

// 操作成功后的处理
async function successHandle(val: any) {
  if (!val.pid) {
    getDirectoryFirst()
  } else {
    let data: any = await getDirectorySub(getLevelInfo(val, 'upper'))
    getLevelInfo(val, 'upper').children = data
        //   val.children = data
  }
}

// 获取层级信息
function getLevelInfo(val: any, type: string) {
  if (type === 'current') {  // 当前层级
    if (val.pPindex||val.pPindex===0) { // 第三层文件夹
      return treeData.value[0].children[val.pPindex].children[val.pindex].children[val.index]
    } else if (val.pindex||val.pindex===0) {  // 第二层文件夹
      return treeData.value[0].children[val.pindex].children[val.index]
    } else {
      return treeData.value[0].children[val.index]
    }
  } else {   // 上一层
    if (val.pPindex || val.pPindex===0) { // 第三层文件夹
      return treeData.value[0].children[val.pPindex].children[val.pindex]
    } else if (val.pindex||val.pindex===0) {  // 第二层文件夹
      return treeData.value[0].children[val.pindex]
    } else {
      return treeData.value[0]
    }
  }
}
interface IFormState {
  id: number
  name: string
  directoryId: (number|string)[]
  parentId: number|string
}
interface ITreeList {
  id: number
  name: string
  has_children: number
  children: ITreeList[]
  pid?: number
  index: number
  pindex?: number
  pPindex?: number
  directoryName?: string[]
}
</script>

<style lang="less" scoped>
.tree-title {
  display: inline-block;
  width: 100%;
  .name { 
    display: inline-block;
    width: 150px;
    vertical-align: bottom;
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