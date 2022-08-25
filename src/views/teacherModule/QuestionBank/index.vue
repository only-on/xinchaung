<template>
  <search-add
    v-if="!inDrawer"
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="createQuestionTypeList"
    :isShowAdd="isMyQuestion"
    :isReset="resetKeyword"
  ></search-add>
  <filter-condition :searchInfo="searchInfo" @searchFn="searchFn" :inDrawer="inDrawer" @add="handleDrawer"></filter-condition>
  <div class="question-content">
    <div class="left" v-if="isMyQuestion">
      <directory-tree :isOperateTree="inDrawer? false: true" @selectedTree="selectedTree"></directory-tree>
    </div>
    <div class="right">
      <a-spin :spinning="loading" size="large" tip="Loading...">
        <div class="mainBox">
          <question-list 
            :isOperation="isMyQuestion"
            @menuClick="menuClick"
            :questionList="questionListData"
            :inDrawer="inDrawer"
          ></question-list>
          <Empty v-if="!questionListData.length && !loading" :type="EmptyType" />
          <a-pagination
            v-model:current="pageInfo.page"
            :pageSize="pageInfo.pageLimit"
            :total="pageTotal"
            @change="pageChange"
            @showSizeChange="handleSizeChange"
            show-size-changer
            :hideOnSinglePage="true"
            :page-size-options="['10', '20', '30', '40', '50']"
          />
        </div>
      </a-spin>
    </div>
  </div>
  <div class="footer" v-if="bottomVisible && !inDrawer">
    <div class="bottom">
      <div class="left">
        <a-checkbox v-model:checked="checkedAll" @change="checkedAllHandle">全选</a-checkbox>
        <span class="selected-num">已选（{{checkedQuestionId.length}}题）</span>
      </div>
      <div class="center">
        <span v-if="isMyQuestion">
          <a-button class="btn" @click="batchOperateHandle('move')">批量移动到</a-button>
          <a-button class="btn" @click="batchOperateHandle('export')">批量导出</a-button>
          <a-button class="btn" @click="batchOperateHandle('public')">批量公开</a-button>
          <a-button class="btn" @click="batchOperateHandle('delete')">批量删除</a-button>
        </span>
        <!-- 1-作业，2-考试 -->
        <a-button class="btn" type="primary" @click="releaseVisible=true;releaseType=1">发布作业</a-button>
        <a-button class="btn" type="primary" @click="releaseVisible=true;releaseType=2">发布考试</a-button>
      </div>
      <div class="right">
        <span class="iconfont icon-guanbi pointer" @click="cancelBottom"></span>
      </div>
    </div>
  </div>
  <a-modal
    v-if="moveVisible"
    :visible="moveVisible"
    title="移动到"
    @cancel="moveCancel()"
  >
    <directory-tree :isOperateTree="false" @selectedTree="moveSelectedTree"></directory-tree>
    <template #footer>
      <Submit @submit="moveSubmit()" @cancel="moveCancel()" :loading="moveLoading" :okText="'移动到此'"></Submit>
    </template>
  </a-modal>
  <a-modal
    :visible="releaseVisible"
    :title="releaseTypeList[releaseType]+'发布设置'"
    @cancel="releaseCancel()"
    :width="900"
    class="release-modal"
  >
    <baseInfo ref="formRef" :formState="formState" :type="releaseTypeList[releaseType]"></baseInfo>
    <!-- 选择学生 -->
    <studentTable :courseId="formState.relation[formState.relation.length - 1]" ref="studentTableRef"/>
    <template #footer>
      <Submit @submit="releaseSubmit()" @cancel="releaseCancel()" :loading="releaseLoading" :okText="'发布'+releaseTypeList[releaseType]"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, createVNode, inject, watch, onMounted, computed } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import extStorage from "src/utils/extStorage";
import directoryTree from "./components/directoryTree.vue";
import filterCondition from "./components/filterCondition.vue"
import questionList from "./components/questionList.vue"
import { createQuestionTypeList, IQuestionList } from "./questionConfig"
import Submit from "src/components/submit/index.vue";
import baseInfo from "src/components/ReleasePaper/baseInfo.vue"
import studentTable from "src/views/teacherModule/teacherExamination/component/studentTable.vue"
const props =withDefaults(defineProps<{
  inDrawer?: boolean
  activeTab?:number
}>(), {
  inDrawer: false,
  activeTab: 0
})
const emit = defineEmits<{
  (e: "addData", val: any): void;
}>();
const router = useRouter();
const route = useRoute();
const http = (request as any).QuestionBank;
const httpExam = (request as any).teacherExamination;
const httpAssign = (request as any).teacherAssignment;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
if (!props.inDrawer) {
  updata({
    tabs: [
      { name: "公共题库", componenttype: 0 },
      { name: "我的题库", componenttype: 1 },
    ],
    showContent: false,
    componenttype: undefined,
    showNav: false,
  });
}
const { lStorage } = extStorage;
const uid = lStorage.get("uid")

const currentTab = ref<number>(0);
const loading = ref<boolean>(false);
const pageInfo = reactive({
  page: 1,
  pageLimit: 10,
});
const pageTotal = ref<number>(0);
const checkedAll = ref(false)
let questionListData = reactive<any[]>([]);
const checkedBaseQuestionId = reactive<number[]>([])   // 选中的基本题型
const checkedQuestionId = props.inDrawer ? JSON.parse(JSON.stringify(inject('selectIds') as number[])) :reactive<number[]>([])
const bottomVisible = ref(false)
const isMyQuestion = computed(() => currentTab.value==1)
const EmptyType: any = computed(() => {
  let str = ''
  if(searchInfo.keyWord === ''&&searchInfo.kind === ''&&searchInfo.difficulty === ''&&searchInfo.usedBy === ''&&searchInfo.categoryId === 0&&!searchInfo.knowledgeIds.length){
    str = 'empty'
  }else{
    str = 'searchEmpty'
  }
  return str
})

// 搜索
const searchInfo = reactive({
  keyWord: '',
  kind: '',
  difficulty: '',
  usedBy: '',
  categoryId: 0,
  knowledgeIds: [],
})
const resetKeyword = ref<boolean>(false)  // 重置keyword
const searchFn = (key?: string) => {
  console.log(searchInfo)
  searchInfo.keyWord = key ? key : ''
  pageInfo.page = 1
  initData();
};
const pageChange = (page: number) => {
  pageInfo.page = page;
  initData();
};
const handleSizeChange = (page:number, size:number) => {
 pageInfo.page = page;
 pageInfo.pageLimit = size;
 initData();
}
// 添加题目
const handleDrawer = () => {
  let selectData:any = []
  questionListData.forEach((item:any)=>{
    if (item.checked) {
      selectData.push(item)
    }
  })
  if (!selectData.length) {
    message.warning('请选择要添加的数据')
    return
  }
  emit('addData', selectData)
}
const selectedTree = (id: number) => {  // 选择目录
  searchInfo.categoryId = id
  searchFn();
}
const handleMenuClick = ({ key }: { key: number|string }) => {  // 创建
  let name = ''
  let path:any=''
  createQuestionTypeList.forEach((v => {
    if (v.key === key){
      name = v.name
      path=v.path
    }
  }))
  router.push ({
    path:path,
    query:{value:key, name}
  })
};
// 全选
const checkedAllHandle = (e: any) => {
  console.log(e)
  questionListData.forEach((v: any) => {
    e.target.checked ? v.checked = true :v.checked = false
  })
}
// 隐藏底部操作按钮
function cancelBottom() {
  bottomVisible.value = false
  checkedQuestionId.length = 0
  checkedBaseQuestionId.length = 0
  questionListData.forEach((v: any) => {
    v.checked = false
  })
}
const componentList = ['getPublicQuestionsList', 'getMyQuestionsList',]
const initData = () => {
  const param = {...pageInfo, ...searchInfo};
  pageTotal.value=0
  loading.value=true
  questionListData.length = 0
  http[componentList[currentTab.value]]({param: param}).then((res: IBusinessResp) => {
    if (!res) return
    const {list, page} = res.data
    questionListData.push(...list)
    pageTotal.value = page.totalCount
    questionListData.forEach((v: any) => {
      // v.kind = v.kind ? v.kind : 'choice'
      // v.difficulty = v.difficulty ? v.difficulty : 'easy'
      // v.used_by = v.used_by ? v.used_by : 'exam'
      checkedQuestionId.includes(v.id) ? v.checked = true : ''
    })
    // questionListData.shift()
    console.log(questionListData)
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
};

const isBatchOperate = ref(false)  // 是否批量操作
const currentQuestionId = ref(0)
function menuClick(type:string, val: any) {
   console.log(type,val,'val')
  isBatchOperate.value = false
  currentQuestionId.value = val.id
  switch (type) {
    case 'edit':
      editQuestion(val.kind,val.id)
      break;
    case 'delete':
      deleteQuestion()
      break;
    case 'public':
      !val.is_public?publicQuestion():''
      break;
    case 'export':
      exportQuestion()
      break;
    case 'move':
      moveVisible.value = true
      break;
  }
}
function editQuestion(key: number,id:any) {
  console.log(key,'key')
  let name = ''
  let path=''
  let questionId:any=id
   // let kind:any={choice:1,judge:2,black:3,'short-answer':4,program:5,ai:6}
  let kind:any=[
    {key:'choice',value:1},
    {key:'judge',value:2},
    {key:'blank',value:3},
    {key:'short-answer',value:4},
    {key:'program',value:5},
    {key:'ai',value:6},
    {key:'sql',value:7},
  ]
  let typeNum:any=''
  kind.forEach((item:any,index:any)=> {
    if(item.key==key){
      console.log('hahhahahhah',item)
      typeNum=item.value
      return
    }
  });
  createQuestionTypeList.forEach((v => {
    if (v.key ==typeNum){
      console.log('hhhh ',v)
      name = v.name
      path=v.path
    }
  }))
  router.push ({
    path:path,
    query:{ questionId:questionId,value:typeNum,name:name}
  })
}
function deleteQuestion() {
  console.log('delete')
  Modal.confirm({
    title: `确定要删除${isBatchOperate.value?'选中':'这个'}题目吗？`,
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      const param = {
        questionIds: isBatchOperate.value?[...checkedQuestionId]:[currentQuestionId.value]
      }
      http.batchDeleteQuestion({param}).then((res: IBusinessResp) => {
        message.success('删除成功')
        successAfterHandle()
      })
    }
  })
}
function publicQuestion() {
  console.log('public')
  const param = {
    questionIds: isBatchOperate.value?[...checkedQuestionId]:[currentQuestionId.value]
  }
  http.batchPublicQuestion({param}).then((res: IBusinessResp) => {
    message.success('公开成功')
    successAfterHandle()
  })
}
function exportQuestion() {
  if (!checkedBaseQuestionId.length&&isBatchOperate.value) {
    message.warn('请选择基本题型导出')
    return
  }
  const dev_base_url = "";
  let url = `${dev_base_url}/api/v1/xinchuang/question/multiple/questions-export`;
  const param = {
    questionIds: isBatchOperate.value?[...checkedBaseQuestionId]:[currentQuestionId.value]
  }
  fetch(url, {
    method: "post",
    body: JSON.stringify(param),
    headers:{
      'Content-Type':'application/json',
    },
    // responseType: "arraybuffer"
  }).then((res: any) => {
    return res.blob();
  }).then((content: any) => {
    successAfterHandle()
    console.log(content)
    let blobUrl = window.URL.createObjectURL(content);
    const fileName = "习题export.xlsx";
    const link = document.createElement("a"); // 创建a标签
    link.download = fileName; // a标签添加属性
    link.style.display = "none";
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click(); // 执行下载
    URL.revokeObjectURL(link.href); // 释放url
    document.body.removeChild(link); // 释放标签
  })
}
// 移动到
function moveQuestion() {
  console.log('move')
  moveVisible.value = true
}
const moveVisible = ref(false)
const moveLoading = ref(false)
const moveCategoryId = ref(0)
function moveSelectedTree(id: number) {
  console.log(id)
  moveCategoryId.value = id
}
function moveSubmit() {
  moveLoading.value = true
  http.batchMoveQuestion({
    param: {
      questionIds: isBatchOperate.value?[...checkedQuestionId]:[currentQuestionId.value],
      directoryId: moveCategoryId.value
    }}).then((res: IBusinessResp) => {
      message.success('操作成功')
      moveLoading.value = false
      moveVisible.value = false
      pageInfo.page = 1
      successAfterHandle()
  }).catch(() => {
    moveLoading.value = false
  })
}
function moveCancel() {
  moveLoading.value = false
  moveVisible.value = false
  moveCategoryId.value = 0
}
function batchOperateHandle(val: string) {
  isBatchOperate.value = true
  switch (val) {
    case 'delete':
      deleteQuestion()
      break;
    case 'public':
      publicQuestion()
      break;
    case 'export':
      exportQuestion()
      break;
    case 'move':
      moveQuestion()
      break;
  }
}
function successAfterHandle() {
  cancelBottom()
  initData()
}

// 发布考试或作业
const formRef = ref()
const studentTableRef = ref()
const releaseType = ref(1)
const releaseTypeList = {
  1: '作业',
  2: '考试'
}
const formState = reactive({
  name: '',
  desc: '',
  date: [],
  relation: [0]
})
const releaseVisible = ref(false)
const releaseLoading = ref(false)
async function releaseSubmit() {
  console.log(formState)
  console.log(checkedQuestionId)
  await formRef.value.fromValidate()
  let params:any = {
    is_publish: true,  // 快捷发布考试
    course_id: formState.relation.length > 1 ? formState.relation[formState.relation.length - 1] : '',
    name: formState.name,
    started_at: formState.date[0] + ':00',
    closed_at: formState.date[1] + ':00',
    note: formState.desc
  }
  if (!studentTableRef.value?.studentIds.length) {
    message.warning('请选择学生')
    return
  }
  // 学生信息
  Object.assign(params, {student_ids: studentTableRef.value.studentIds})
  // 题目ids
  const obj: any[] = []
  checkedQuestionId.forEach((v: number) => {
    obj.push({
      id: v,
      score: 0
    })
  })
  Object.assign(params, {question_ids: obj} )
  console.log(params)
  if (releaseType.value === 1) {
    httpAssign.addAssignment({param: params}).then((res:IBusinessResp) => {
      releaseCancel()
      message.success('发布成功')
      successAfterHandle()
    }).catch(()=>{
      releaseLoading.value = false
    })
  } else {
    httpExam.addExam({param: params}).then((res:IBusinessResp) => {
      releaseCancel()
      message.success('发布成功')
      successAfterHandle()
    }).catch(()=>{
      releaseLoading.value = false
    })
  }
}
function releaseCancel() {
  releaseVisible.value = false
  releaseLoading.value = false
  Object.assign(formState, {
    name: '',
    desc: '',
    date: [],
    relation: [0]
  })
}

onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0
    configuration.componenttype = 0
  } else {
    currentTab.value = 1
    configuration.componenttype = 1
  }
})
// 重置条件进行查询
const resetSearch = () => {
  Object.assign(pageInfo, {
    page: 1,
    pageLimit: 10
  })
  Object.assign(searchInfo, { 
    keyWord: '',
    kind: '',
    difficulty: '',
    usedBy: '',
    categoryId: 0,
    knowledgeIds: [],
  })
  resetKeyword.value = !resetKeyword.value
  initData();
}
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    if (val == 0 || val == 1) {
      currentTab.value = Number(val);
      cancelBottom()
      resetSearch()
    }
  }
);
watch(
  () => {
    return questionListData;
  },
  (val) => {
    console.log(val)
    let i = 0
    val.forEach((v: any, k: number) => {
      if (!v.checked) {
        const index = checkedQuestionId.indexOf(v.id)
        if (index !== -1) {
          checkedQuestionId.splice(index, 1)
        }
        const i = checkedBaseQuestionId.indexOf(v.id)
        if (i !== -1) {
          checkedBaseQuestionId.splice(checkedBaseQuestionId.indexOf(v.id),1)
        }
      } else {
        i++
        if (!checkedQuestionId.includes(v.id)) {
          checkedQuestionId.push(v.id)
          bottomVisible.value = true
        }
        if (!checkedBaseQuestionId.includes(v.id) && !['program','ai','sql'].includes(v.kind)) {
          checkedBaseQuestionId.push(v.id)
        }
      }
    })
    pageTotal.value >= pageInfo.pageLimit ? checkedAll.value = i===pageInfo.pageLimit : checkedAll.value = i===pageTotal.value
  },
  {deep:true,immediate:true}
);
watch(()=>props.inDrawer, newVal => {
  newVal ? resetSearch() : ''
},{deep:true,immediate:true})
// 选择题目的抽屉
watch(()=>props.activeTab, newVal => {
  // newVal 1 公开题库 2 我的题库
  currentTab.value = newVal - 1
  initData()
})
</script>

<style lang="less" scoped>
.mainBox {
  // flex-wrap: wrap;
  // justify-content: space-between;
  // width: var(--center-width);
  // margin: 0 auto;
}
.question-content {
  display: flex;
  width: var(--center-width);
  margin: 0 auto;
  justify-content: space-between;
  margin-top: 24px;
  .left {
    width: 240px;
    height: 692px;
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07); 
    margin-right: 16px;
    .tit {
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
  }
  .right {
    flex: 1;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--white);
  box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.07);
  z-index: 2;
  .bottom {
    padding: 18px 0;
    display: flex;
    width: var(--center-width);
    margin: 0 auto;
    justify-content: space-between;
    .left {
      line-height: 33px;
      .selected-num {
        margin-left: 16px;
      }
    }
    .center {
      .btn {
        margin-right: 16px;
      }
    }
    .right {
      line-height: 32px;
      margin-right: 18px;
    }
  }
}
</style>

<style lang="less">
  .release-modal {
    .ant-modal-body {
      max-height: 621px;
      overflow: auto;
    }
  }
</style>
