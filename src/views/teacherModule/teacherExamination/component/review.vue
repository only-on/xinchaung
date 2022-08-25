<template>
  <div class="reviewExamination">
    <common-card title="学生成绩">
      <template #content>
        <div class="top">
          <div class="left">
            提交情况： <span class="submitNum">{{listData.submmit_num}}</span> /{{listData.all_num}}
            <a-input-search 
              v-model:value="searchInfo.name" 
              placeholder="请输入搜索关键词"
              @search="searchName"
              @keyup.enter="searchName">
            </a-input-search>
          </div>
          <div class="right">
            <a-button type="primary" class="brightBtn" @click="handleRecheck">代码查重</a-button>
            <a-button type="primary" @click="handleExport">导出成绩</a-button>
          </div>
        </div>
        <a-spin :spinning="listData.loading" size="large" tip="Loading...">
          <a-config-provider>
            <a-table
              :columns="columns"
              :data-source="listData.data"
              row-key="id"
              :pagination="false"
            >
              <template v-slot:bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'is_submit'">
                  {{record.is_submit ? '已提交' : '未提交'}}
                </template>
                <template v-if="column.dataIndex === 'total_score'">
                  {{record.total_score ? record.total_score : '--'}}
                  <a-tooltip placement="right" v-if="record.is_viewed">
                    <template #title>
                      <span>教师已查阅</span>
                    </template>
                    <span class="customIcon review">
                      <i class="iconfont icon-yipingyue"></i>
                    </span>
                  </a-tooltip>
                  <a-tooltip placement="right" v-if="record.is_modify">
                    <template #title>
                      <span>教师已调整得分</span>
                    </template>
                    <span class="customIcon edit">
                      <i class="iconfont icon-bianji2"></i>
                    </span>
                  </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'operation'">
                  <a-button type="link" @click="checkDetail(record.id)" :disabled="!record.is_submit">查看</a-button>
                </template>
              </template>
            </a-table>
            <template #renderEmpty>
              <Empty :type="EmptyType"/>
            </template>
          </a-config-provider>
          <Pagination
            v-model:page="searchInfo.page"
            v-model:size="searchInfo.limit"
            :total="listData.total"
            @page-change="getScoreList"
          />
        </a-spin>
      </template>
    </common-card>
    <!-- 代码查重 -->
    <a-drawer
      :destroyOnClose="true"
      :closable="false"
      placement="right"
      :visible="drawerVisible"
      width="700"
      @close="closeDrawer"
    >
      <template #title>
        <div class="headerBox flexCenter">
          <span>
            代码查重 <span class="title">相似度设置，只支持编程题</span>
          </span>
          <span class="iconfont icon-guanbi" @click="closeDrawer"></span>
        </div>
      </template>
      <div class="content">
        <a-row>
          <a-col :span="12">
            <span class="label">学生姓名</span> 
            <a-input v-model:value="recheckSearch.name"></a-input>
          </a-col>
          <a-col :span="12">
            <span class="label">语言</span>
            <lanuageSelect :inDrawer="true" @change="changeLanuage"/>
          </a-col>
          <a-col :span="12">
            <span class="label">相似度</span>
            <a-select v-model:value="recheckSearch.sim" placeholder="请选择">
              <a-select-option
                v-for="(item, index) in simList"
                :key="index"
                :value="item.value">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <div class="searchResult">
          <div v-for="(item,index) in recheckResult" :key="index">
            <div class="questiuon-title">
              编程题 第{{NoToCh(index+1)}}题 
              <span class="single_ellipsis" :title="item.question">{{item.question}}</span>
            </div>
            <a-table
              :columns="recheckColumns"
              :data-source="item.items"
              row-key="user_id"
              :pagination="false"
            >
            <template #expandedRowRender="{record:record1}">
              <a-table
                :columns="recheckInnerColumns"
                :data-source="record1.sims"
                row-key="solution_id"
                :pagination="false"
              >
                <template v-slot:bodyCell="{ column, record}">
                    <template v-if="column.dataIndex === 'sim'">
                      <span :class="['sim', record.sim <= 50 ? 'mild' : (record.sim > 50 && record.sim <= 80) ? 'medium' : 'serious']">{{record.sim + '%'}}</span>
                    </template>
                </template>
              </a-table>
            </template>
            </a-table>
          </div>
        </div>
        <Empty v-if="showEmpty" type="searchEmpty"/>
      </div>
      <template #footer>
        <Submit @submit="handleSearch" @cancel="closeDrawer" :loading="searchLoading" :okText="searchLoading ? '查询中' : '重新查询'"></Submit>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed, onMounted} from "vue";
import { useRoute, useRouter } from 'vue-router';
import CommonCard from "src/components/common/CommonCard.vue";
import Pagination from "src/components/Pagination.vue";
import Submit from "src/components/submit/index.vue";
import lanuageSelect from "src/views/shareModule/programAnswer/component/lanuageSelect.vue";
import {simList} from '../utils'
import {downloadUrl} from 'src/utils/download'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import {NoToCh} from 'src/utils/common'
interface Props {
  type: number;
}
const props = withDefaults(defineProps<Props>(), {
  type: 1
})
const http = props.type == 1 ? (request as any).teacherAssignment : (request as any).teacherExamination;
const route = useRoute()
const router = useRouter()
const examName = ref<any>(route.query.name)
const examId = ref<any>(route.query.id)
const modelType = ref<any>(props.type)
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: `${modelType.value == 1 ? '作业' : '考试'}评阅 - ${examName.value}`,
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

const columns = [
  {
    title: "姓名",
    dataIndex: ['user_profile', 'name'],
    key: "name",
    ellipsis: true
  },
  {
    title: "账号",
    dataIndex: "user_sno",
    key: "user_sno",
    ellipsis: true
  },
  {
    title: "班级",
    dataIndex: "classes_name",
    key: "classes_name",
  },
  {
    title: "提交状态",
    dataIndex: "is_submit",
    key: "is_submit",
  },
  {
    title: "提交时间",
    dataIndex: "submit_time",
    key: "submit_time",
  },
  {
    title: "评分",
    dataIndex: "total_score",
    key: "total_score",
  },
  {
    title: "专属解析",
    dataIndex: "operation",
    key: "operation",
  },
];
const recheckColumns = [
  {
    title: "查重学生姓名",
    dataIndex: 'name',
    key: "name",
  },
  {
    title: "代码满足查重条件的学生数",
    dataIndex: 'studentNum',
    key: "studentNum",
  },
]
const recheckInnerColumns = [
  {
    title: "提交编号",
    dataIndex: 'solution_id',
    key: "number",
  },
  {
    title: "相似学生姓名",
    dataIndex: 'name',
    key: "name",
  },
  {
    title: "语言",
    dataIndex: 'language_name',
    key: "language_name",
  },
  {
    title: "相似度",
    dataIndex: 'sim',
    key: "sim",
  }
]
interface IlistData {
  all_num: number,
  submmit_num: number,
  loading: Boolean;
  total: number,
  data: any[],

}
const listData = reactive<IlistData>({
  all_num: 0,
  submmit_num: 0,
  loading: false,
  total: 0,
  data: []
})
const searchInfo = reactive({
  type: modelType.value,
  name: '',
  page:1,
  limit: 10
})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.name === ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})
// 查看成绩详情
const checkDetail = (id: number | string) => {
  let pathObj = {
    1: '/teacher/teacherAssignment/teacherAssignmentAchievement',
    2: '/teacher/teacherExamination/teacherExaminationAchievement'
  }
  router.push({
    path: pathObj[modelType.value],
    query: {
      id: id
    }
  })
} 
// 导出成绩
const handleExport = () => {
  let url:string = `/api/v1/xinchuang/question/export/students/scores?exam_id=${examId.value}`
  const a:any = document.createElement('a')
  a.href = url
  document.body.append(a)
  a.click()
  document.body.removeChild(a)
}
// 代码查重
const drawerVisible = ref<boolean>(false)
const searchLoading = ref<boolean>(false)
const recheckSearch = reactive({
  type: modelType.value,
  name: '',
  language: '',
  sim: ''
})
const showEmpty = ref<boolean>(false)
const recheckResult = reactive<any>([])
const handleRecheck = () => {
  drawerVisible.value = true
  // 重置数据
  recheckResult.length = 0
  recheckSearch.name = ''
  recheckSearch.language = ''
  recheckSearch.sim = ''
}
const closeDrawer = () => {
  drawerVisible.value = false
  searchLoading.value = false
  showEmpty.value = false
}
const handleSearch = () => {
  searchLoading.value = true
  recheckResult.length = 0
  http.simSearch({urlParams:{ID: examId.value},param: recheckSearch}).then((res:IBusinessResp) => {
    Object.assign(recheckResult, res.data)
    recheckResult.forEach((item:any) => {
      item.items.forEach((innerItem:any) => {
        innerItem.studentNum = innerItem.sims.length
      })
    })
    if (!recheckResult.length) {
      showEmpty.value = true
    }
    searchLoading.value = false
  }).catch(()=>{
    searchLoading.value = false
  })
}
const changeLanuage = (val:any) => {
  recheckSearch.language = val.value
}
// 成绩列表
const getScoreList = () => {
  listData.loading = true
  http.studentsScores({urlParams: {exam: examId.value},param:searchInfo}).then((res:IBusinessResp) => {
    listData.all_num = res.data.all_num
    listData.submmit_num = res.data.submmit_num
    listData.data = res.data.list
    listData.total = res.data.page.totalCount
    listData.loading = false
  }).catch(()=>{
    listData.loading = false
  })
}
const searchName = () => {
  searchInfo.page = 1
  getScoreList()
}
onMounted(()=>{
  getScoreList()
})
</script>
<style lang="less" scoped>
.reviewExamination{
  .top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .left{
      display: flex;
      align-items: center;
      .submitNum{
        font-size: 16px;
        color: var(--primary-color);
      }
      .ant-input-search{
        width: 254px;
        margin-left: 20px;
        .ant-btn{
          height: 32px;
          border-left: 0;
        }
      }
    }
    .right{
      .ant-btn{
        margin-left:10px;
      }
    }
  }
  :deep(.ant-table){
    margin-bottom: 20px;
    .customIcon{
      border-radius: 4px;
      padding: 4px;
      margin-left: 5px;
      &.review{
        background: var(--primary-2);
        color: var(--primary-color);
      }
      &.edit{
        background: var(--brightBtn-24);
        color: var(--brightBtn);
      }
    }
  }
}
.ant-drawer{
  .headerBox{
    justify-content: space-between;
    .iconfont{
      cursor: pointer;
    }
  }
  .title{
    font-size: 12px;
    color: var(--black-25);
  }
  .content{
    .ant-col{
      margin-bottom: 20px;
      .label{
        text-align: right;
        display: inline-block;
        width: 60px;
        margin-right: 8px;
      }
    }
    .ant-input, .ant-select{
      width: 240px;
    }
    .searchResult{
      &>div{
        margin-bottom: 20px;
      }
      .questiuon-title{
        margin-bottom: 10px;
        display: flex;
        >span{
          flex: 1;
          margin-left: 10px;
          display: inline-block;
        }
      }
      .sim{
        padding: 5px 15px;
        &.serious{
          color: #F5222D;
          background: rgba(245,34,45,0.15);
        }
        &.medium{
          color: #FF9544;
          background: rgba(255,135,44,0.15);
        }
        &.mild{
          color: #FFCE5F;
          background: rgba(255,206,95,0.15);
        }
      }
    }
  }
}
</style>