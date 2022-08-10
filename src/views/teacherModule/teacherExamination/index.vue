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
  <a-spin :spinning="listData.loading" size="large" tip="Loading...">
    <div class="mainBox">
      <cardItem v-for="(item,index) in listData.data" :data="item" :key="index" @menuClick="menuClick" @operate="handleOperate"/>
    </div>
    <Pagination v-model:page="searchInfo.page" v-model:size="searchInfo.limit" :total="listData.total" @page-change="getList"/>
    <Empty v-if="!listData.data.length && !listData.loading" :type="EmptyType"/>
  </a-spin>
  <!-- 防作弊设置 -->
  <antiCheatingSetting v-model:visible="settingModal" :data="antiCheat" @save="saveSetting"/>
  <!-- 编辑基本信息 -->
  <editBaseInfo v-model:visible="editModal" :id="currentOperateId" :type="type" @updateInfo="getList"/>
</template>
<script lang="ts" setup>
import {ref, reactive, inject, provide, createVNode, computed, onMounted} from 'vue'
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from 'vue-router';
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import cardItem from "./component/cardItem.vue"
import antiCheatingSetting from "./component/antiCheatingSetting.vue";
import editBaseInfo from "./component/editBaseInfo.vue";
import Pagination from 'src/components/Pagination.vue'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import {initialData} from './utils'
interface IlistData {
  loading: Boolean;
  total: number,
  data: any[]
}
const http = (request as any).teacherExamination;
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
    keyName: "status",
    data: [
      { name: "全部", value: 0 },
      { name: "未开始", value: 2 },
      { name: "进行中", value: 3 },
      { name: "已结束", value: 1 },
    ],
  }
])
const listData = reactive<IlistData>({
  loading: false,
  total: 0,
  data: []
})
const settingModal = ref<boolean>(false)
const editModal = ref<boolean>(false)
const type = ref('考试')
provide('type', type)
const modelType = 2
const currentOperateId = ref() 
const searchInfo = reactive<any>({
  type: modelType,
  name: '',
  status: 0,
  page: 1,
  limit: 10,
})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.name === '' && searchInfo.status === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
const handleMenuClick = ({key}:{key:string}) => {
  router.push({
    path: '/teacher/teacherExamination/createExamination',
    query: {
      type: key
    }
  })
};
const searchFn = (key: string) => {
  searchInfo.name = key
  searchInfo.page = 1
  getList()
};
const classifyChange = (obj: any) => {
  Object.assign(searchInfo, obj)
  searchInfo.page = 1
  getList()
};
const getList = () => {
  listData.loading = true
  if (searchInfo.status === 0){
    searchInfo.status = ''
  }
  http.examsList({param: searchInfo}).then((res:IBusinessResp) => {
    listData.loading = false
    listData.data = res.data.list
    listData.total = res.data.page.totalCount
  }).catch(()=>{
    listData.loading = false
  })
}
// 删除
const deleteItem = () => {
  Modal.confirm({
    title: "确定要删除这个考试吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.delExam({urlParams:{ID: currentOperateId.value}}).then((res:IBusinessResp) => {
        message.success('删除成功')
        getList()
      })
    },
  });
}
// 编辑
const handleEdit = () => {}
const editCancel = () => {
  editModal.value= false
}
// 复用
const handleCopy = () => {}
// 防作弊相关
const antiCheat = reactive({})
const saveSetting = (data:any) => {
  http.setCheat({urlParams: {ID: currentOperateId.value}, param:data}).then((res:IBusinessResp) => {
    message.success('设置成功')
    getList()
  })
}
const menuClick = (type:string, val:any) => {
  currentOperateId.value = val.id
  switch (type) {
    case 'setting':
      settingModal.value = true
      if (val.cheat_info) {
        Object.assign(antiCheat, JSON.parse(JSON.stringify(val.cheat_info)))
      } else {
        Object.assign(antiCheat, JSON.parse(JSON.stringify(initialData)))
      }
      break;
    case 'edit':
      editModal.value = true
      break;
    case 'delete':
      deleteItem();
      break;
    case 'copy':
      handleCopy();
      break;
    case 'export':
      break;
  }
}
// 按钮点击
const handleOperate = (type:any,item:any) => {
  currentOperateId.value = item.id
  switch (type) {
    case 'review':
      router.push({
        path: '/teacher/teacherExamination/reviewExamination',
        query: {
          id: item.id,
          name: item.name
        }
      })
      break;
    case 'publish':
      http.publishExam({urlParams:{ID:currentOperateId.value}}).then((res:IBusinessResp) => {
        message.success('发布成功')
        getList()
      })
      break;
    case 'unpublish':
      http.unpublishExam({urlParams:{ID:currentOperateId.value}}).then((res:IBusinessResp) => {
        message.success('撤销发布成功')
        getList()
      })
      break;
  }
}
onMounted(()=>{
  getList()
})
</script>
<style lang="less" scoped>
.mainBox{
  margin: 20px 0;
}
</style>