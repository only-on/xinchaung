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
      <cardItem v-for="(item,index) in listData.data" :type="modelType" :data="item" :key="index" @menuClick="menuClick" @operate="handleOperate"/>
    </div>
    <Pagination v-model:page="searchInfo.page" v-model:size="searchInfo.limit" :total="listData.total" @page-change="getList"/>
    <Empty v-if="!listData.data.length && !listData.loading" :type="EmptyType"/>
  </a-spin>
  <!-- 防作弊设置 -->
  <antiCheatingSetting v-model:visible="settingModal" :data="antiCheat" @save="saveSetting"/>
  <!-- 编辑基本信息 -->
  <editBaseInfo v-model:visible="editModal" :id="currentOperateId" :type="modelType == 1 ? '作业' : '考试'" @updateInfo="getList"/>
  <!-- 导出试卷 -->
  <a-modal :visible="exportVisible" title="导出试卷" :width="400" @cancel="cancelExport">
    <div>
      已为您导出了试卷对应的PDF文件
      <div class="exportContent">
        <img :src="iconList['pdf']" alt="">
        <span>{{exportName}}.pdf</span>
      </div>
    </div>
    <template #footer>
      <Submit @submit="saveExport" @cancel="cancelExport" okText="下载"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref, reactive, inject, provide, createVNode, computed, onMounted} from 'vue'
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from 'vue-router';
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import cardItem from "./cardItem.vue"
import antiCheatingSetting from "./antiCheatingSetting.vue";
import editBaseInfo from "./editBaseinfo.vue";
import Pagination from 'src/components/Pagination.vue'
import Submit from "src/components/submit/index.vue";
import iconList from 'src/utils/iconList'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import {initialData} from '../utils'
import {downloadUrl} from 'src/utils/download'
interface IlistData {
  loading: Boolean;
  total: number,
  data: any[]
}
interface Props {
  type: number;
}
const props = withDefaults(defineProps<Props>(), {
  type: 1
})
const modelType = ref<any>(props.type)
const httpAssignment = (request as any).teacherAssignment;
const httpExam = (request as any).teacherExamination;
const httpObj = {
  // 作业
  1: {
    'list': httpAssignment.assignmentList,
    'publish': httpAssignment.publishAssignment,
    'unpublish': httpAssignment.unpublishAssignment,
    'del': httpAssignment.delAssignment
  },
  // 考试
  2: {
    'list': httpExam.examsList,
    'publish': httpExam.publishExam,
    'unpublish': httpExam.unpublishExam,
    'del': httpExam.delExam,
    'setCheat': httpExam.setCheat
  }
}
const pathObj = {
  1: {
    create: '/teacher/teacherAssignment/createAssignment',
    review: '/teacher/teacherAssignment/reviewAssignment'
  },
  2: {
    create: '/teacher/teacherExamination/createExamination',
    review: '/teacher/teacherExamination/reviewExamination'
  }
}
const router = useRouter()
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: `${modelType.value == 1 ? '作业' : '考试'}`, componenttype: 0 }],
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
// provide('type', type)
const currentOperateId = ref() 
const searchInfo = reactive<any>({
  type: modelType.value,
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
    path: pathObj[modelType.value].create,
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
  httpObj[modelType.value].list({param: searchInfo}).then((res:IBusinessResp) => {
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
      httpObj[modelType.value].del({urlParams:{ID: currentOperateId.value}}).then((res:IBusinessResp) => {
        message.success('删除成功')
        getList()
      })
    },
  });
}
// 导出试卷相关
const exportVisible = ref<boolean>(false)
const exportName = ref<string>('')
const handleExport = (val:any) => {
  exportVisible.value = true
  exportName.value = val.name
}
const saveExport = () => {
  let url = `/api/v1/question/exams/${currentOperateId.value}/export-paper?type=${modelType.value}`
  const a:any = document.createElement('a')
  a.href = url
  document.body.append(a)
  a.click()
  document.body.removeChild(a)
  exportVisible.value = false
}
const cancelExport = () => {
  exportVisible.value = false
}
// 防作弊相关
const antiCheat = reactive({})
const saveSetting = (data:any) => {
  httpObj[modelType.value]?.setCheat({urlParams: {ID: currentOperateId.value}, param:data}).then((res:IBusinessResp) => {
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
      router.push({
        path: pathObj[modelType.value].create,
        query: {
          type: 'manual',
          id: val.id,
          isCopy: 'true'
        }
      })
      break;
    case 'export':
      handleExport(val)
      break;
  }
}
// 按钮点击
const handleOperate = (type:any,item:any) => {
  currentOperateId.value = item.id
  switch (type) {
    case 'review':
      router.push({
        path: pathObj[modelType.value].review,
        query: {
          id: item.id,
          name: item.name
        }
      })
      break;
    case 'publish':
      httpObj[modelType.value].publish({urlParams:{ID:currentOperateId.value}}).then((res:IBusinessResp) => {
        message.success('发布成功')
        getList()
      })
      break;
    case 'unpublish':
      httpObj[modelType.value].unpublish({urlParams:{ID:currentOperateId.value}}).then((res:IBusinessResp) => {
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
.exportContent{
  margin:20px 0;
  img{
    margin-right: 10px;
  }
}
</style>