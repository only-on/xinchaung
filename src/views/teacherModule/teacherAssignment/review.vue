<template>
  <div class="reviewExamination">
    <common-card title="学生成绩">
      <template #content>
        <div class="top">
          <div class="left">
            提交情况： <span class="submitNum">10</span> /100
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
                <template v-if="column.dataIndex === 'is_submmit'">
                  {{record.is_submmit ? '已提交' : '未提交'}}
                </template>
                <template v-if="column.dataIndex === 'total_score'">
                  {{record.total_score ? record.total_score : '--'}}
                </template>
                <template v-if="column.dataIndex === 'operation'">
                  <a-button type="link" @click="checkDetail(record.id)" :disabled="!record.is_submmit">查看</a-button>
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
            <span>{{item.question}}</span>
            <a-table
              :columns="recheckColumns"
              :data-source="item.items"
              row-key="user_id"
              :pagination="false"
            >
            <template #expandedRowRender="{record1}">
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
import {simList} from 'src/views/teacherModule/teacherExamination/utils'
import {downloadUrl} from 'src/utils/download'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teacherAssignment;
const route = useRoute()
const router = useRouter()
const examName = ref<any>(route.query.name)
const examId = ref<any>(route.query.id)
const modelType = 1
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: `作业评阅 - ${examName.value}`,
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
    dataIndex: "classes",
    key: "classes",
  },
  {
    title: "提交状态",
    dataIndex: "is_submmit",
    key: "is_submmit",
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
  loading: Boolean;
  total: number,
  data: any[]
}
const listData = reactive<IlistData>({
  loading: false,
  total: 0,
  data: []
})
const searchInfo = reactive({
  type: modelType,
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
  router.push({
    path: '/teacher/teacherAssignment/teacherAssignmentAchievement',
    query: {
      id: id
    }
  })
} 
// 导出成绩
const handleExport = () => {

}
// 代码查重
const drawerVisible = ref<boolean>(false)
const searchLoading = ref<boolean>(false)
const recheckSearch = reactive({
  type: modelType,
  name: '',
  language: '',
  sim: ''
})
const recheckResult = reactive<any>(
[
  {
            "id":77, // 编程题目ID
            "question":"测试编程题", // 编程题目名称
            "items": [
                {
                    "user_id":102,   // 查重学生ID(参考者)
                    "name":"lmm",   // 查重学生姓名(参考者)
            studentNum: 3,
                    "sims":[
                        {
                            "solution_id":1001,   // 提交编号
                            "name":"test",   // 相似学生姓名
                            "language_name":"c",   // 语言名称
                            "language":0,   // 语言编号
                            "sim":80,   // 相似度值
                        },
                        {
                            "solution_id":1001,
                            "name":"test",
                            "language_name":"c",
                            "language":0,
                            "sim":70,
                        }
                    ]
                },
                {
                    "user_id":103,
                    "name":"aaa",
            studentNum: 3,
                    "sims":[
                        {
                            "solution_id":1001,
                            "name":"test",
                            "language_name":"c",
                            "language":0,
                            "sim":80,
                        },
                        {
                            "solution_id":1001,
                            "name":"test",
                            "language_name":"c",
                            "language":0,
                            "sim":90,
                        }
                    ]
                }
            ]
        }
]

)
const handleRecheck = () => {
  drawerVisible.value = true
}
const closeDrawer = () => {
  drawerVisible.value = false
  searchLoading.value = false
}
const handleSearch = () => {
  searchLoading.value = true
  recheckResult.length = 0
  http.simExam({urlParams:{ID: examId.value},param: recheckSearch}).then((res:IBusinessResp) => {
    Object.assign(recheckResult, res.data)
    recheckResult.forEach((item:any) => {
      item.items.forEach((innerItem:any) => {
        innerItem.studentNum = innerItem.sims.length
      })
    })
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
      >span{
        display: inline-block;
        margin-bottom: 5px;
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