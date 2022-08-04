<template>
  <div class="reviewExamination">
    <common-card title="学生成绩">
      <template #content>
        <div class="top">
          <div class="left">
            提交情况： <span class="submitNum">10</span> /100
            <a-input-search v-model:value="searchInfo.keyword" 
            placeholder="请输入搜索关键字"
            @search="getTableData"
            @keyup.enter="getTableData" ></a-input-search>
          </div>
          <div class="right">
            <a-button type="primary" class="brightBtn" @click="handleRecheck">代码查重</a-button>
            <a-button type="primary">导出成绩</a-button>
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
              <template v-slot:bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'operation'">
                  <a-button type="link">查看</a-button>
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
            @page-change="getTableData"
          />
        </a-spin>
      </template>
    </common-card>
    <!-- 代码查重 -->
    <a-drawer
      :destroyOnClose="true"
      :closable="true"
      placement="right"
      :visible="drawerVisible"
      width="700"
      @close="closeDrawer"
    >
      <template #title>
        代码查重 <span class="title">相似度设置，只支持编程题</span>
      </template>
      <div class="content">
        <a-row>
          <a-col :span="12">
            <span class="label">学生姓名</span> <a-input v-model:value="recheckSearch.name"></a-input>
          </a-col>
          <a-col :span="12">
            <span class="label">语言</span>
            <a-select v-model:value="recheckSearch.sim" placeholder="请选择">
              <a-select-option
                v-for="(item, index) in simListData"
                :key="index"
                :value="item.value">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <span class="label">相似度</span>
            <a-select v-model:value="recheckSearch.sim" placeholder="请选择">
              <a-select-option
                v-for="(item, index) in simListData"
                :key="index"
                :value="item.value">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <div class="searchResult">
          <span>编程题 第一题 题目名称写在这里</span>
          <a-table
            :columns="recheckColumns"
            :data-source="recheckTable"
            row-key="id"
            :pagination="false"
          >
          <template #expandedRowRender="{record}">
            <a-table
              :columns="recheckInnerColumns"
              :data-source="record.list"
              row-key="id"
              :pagination="false"
            >
              <template v-slot:bodyCell="{ column, record}">
                  <template v-if="column.dataIndex === 'sim'">
                    <span class="sim serious">{{record.sim}}</span>
                  </template>
              </template>
            </a-table>
          </template>
          </a-table>
        </div>
      </div>
      <template #footer>
        <Submit @submit="handleSearch" @cancel="closeDrawer" :loading="searchLoading" :okText="searchLoading ? '查询中' : '重新查询'"></Submit>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed} from "vue";
import { useRoute, useRouter } from 'vue-router';
import CommonCard from "src/components/common/CommonCard.vue";
import Pagination from "src/components/Pagination.vue";
import Submit from "src/components/submit/index.vue";
import {simList} from './utils'
const route = useRoute()
const examName = route.query.name
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: `考试评阅 - ${examName}`,
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
  },
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "班级",
    dataIndex: "classes",
    key: "classes",
  },
  {
    title: "提交状态",
    dataIndex: ['user_profile', 'grade'],
    key: "grade",
  },
  {
    title: "提交时间",
    dataIndex: ['user_profile', 'major'],
    key: "major",
  },
  {
    title: "评分",
    dataIndex: ['user_profile', 'department'],
    key: "department",
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
    dataIndex: 'num',
    key: "num",
  },
]
const recheckInnerColumns = [
  {
    title: "提交编号",
    dataIndex: 'number',
    key: "number",
  },
  {
    title: "相似学生姓名",
    dataIndex: 'name',
    key: "name",
  },
  {
    title: "语言",
    dataIndex: 'lanuage',
    key: "lanuage",
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
  keyword: '',
  page:1,
  limit: 10
})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.keyword === ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})
const getTableData = () => {

}
// 代码查重
const drawerVisible = ref<boolean>(false)
const simListData = simList
const searchLoading = ref<boolean>(false)
const recheckSearch = reactive({
  name: '',
  lanuage: '',
  sim: ''
})
const recheckTable = [
  {
    name: '张三',
    num: 5,
    list: [
      {
        number: 1111,
        name: '李四',
        lanuage: 'C',
        sim: '100%'
      }
    ]
  }
]
const handleRecheck = () => {
  drawerVisible.value = true
}
const closeDrawer = () => {
  drawerVisible.value = false
  searchLoading.value = false
}
const handleSearch = () => {
  searchLoading.value = true
}

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
}
.ant-drawer{
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
      margin-bottom: 20px;
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