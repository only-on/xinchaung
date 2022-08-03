<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :isShowAdd="true"
    :TypeList="typeList"
  />
  <classify
    :list="classifyList"
    @change="classifyChange"
  />
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="mainBox">
      <cardItem @menuClick="menuClick"/>
    </div>
    <Pagination v-model:page="pageInfo.page" v-model:size="pageInfo.size" :total="pageInfo.total" @page-change="pageChange"/>
    <Empty :type="EmptyType"/>
  </a-spin>
  <!-- 防作弊设置 -->
  <antiCheatingSetting v-model:visible="settingModal"/>
  <!-- 编辑基本信息 -->
  <editBaseInfo v-model:visible="editModal" type="考试"/>
</template>
<script lang="ts" setup>
import {ref, reactive, inject, provide, createVNode, computed} from 'vue'
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from 'vue-router';
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import cardItem from "./component/cardItem.vue"
import antiCheatingSetting from "./component/antiCheatingSetting.vue";
import editBaseInfo from "./component/editBaseInfo.vue";
import Pagination from 'src/components/Pagination.vue'
const router = useRouter()
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "考试", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const typeList = reactive([
  { name: "手动创建", key: "manual" },
  { name: "随机创建", key: "random" }
])
const classifyList = reactive([
  {
    title: "",
    value: 0,
    keyName: "state",
    data: [
      { name: "全部", value: 0 },
      { name: "未开始", value: 2 },
      { name: "进行中", value: 3 },
      { name: "已结束", value: 1 },
    ],
  }
])
const loading = ref<boolean>(false)
const settingModal = ref<boolean>(false)
const editModal = ref<boolean>(false)
const type = ref('考试')
provide('type', type)
const pageInfo = reactive({
  page: 1,
  size: 10,
  total: 20
})
const searchInfo = reactive({
  keyword: '',
  state: 0
})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.keyword === '' && searchInfo.state === 0){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
const handleMenuClick = ({key}:{key:string}) => {
  console.log(key)
  router.push({
    path: '/teacher/teacherExamination/createExamination',
    query: {
      type: key
    }
  })
};
const searchFn = (key: string) => {
  searchInfo.keyword = key
};
const classifyChange = (obj: any) => {
  Object.assign(searchInfo, obj)
};
const pageChange = () => {}
const menuClick = (type:string) => {
  console.log(type)
  switch (type) {
    case 'setting':
      settingModal.value = true
      break;
    case 'edit':
      editModal.value = true
      break;
    case 'delete':
      deleteItem();
      break;
    case 'copy':
      break;
    case 'export':
      break;
  }
}
const deleteItem = () => {
  Modal.confirm({
    title: "确定要删除这个考试吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      
    },
  });
}
</script>
<style lang="less" scoped>
.mainBox{
  margin: 20px 0;
}
</style>