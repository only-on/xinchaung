<template>
  <div class="task-statistic">
    <h3 class="title">任务统计</h3>
    <a-table 
      :rowKey="rowkey"
      :dataSource="tableList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
    />
    <div class="page-footer-box">
        <!-- show-quick-jumper  -->
      <a-pagination
        v-model:current="page.page" 
        :pageSize="page.pageSize" 
        :total="page.total" 
        @change="pageChange" 
        :hideOnSinglePage="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const data = reactive<IData>({
      tableList: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    })
    const getTaskStatisticList = () => {
      data.tableList = [
        {
          taskName: '项目名称框架介绍',
          KnowledgePoints: 'dashuju',
          lookNum: 2,
          unknownRate: '20%',
          correctNum: 5,
          errorNum: 5,
          correctRate: '100%'
        }
      ]
      data.page.total = 100
    }
    // 页码变化
    const pageChange = (page: number, pageSize: number) => {
      console.log(page, pageSize)
      data.page.page = page
      data.page.pageSize = pageSize
      getTaskStatisticList()
    }
    onMounted(() => {
      getTaskStatisticList()
    })
    return {
      columns,
      rowkey,
      ...toRefs(data),
      pageChange,
    }
  },
})
const rowkey = (record: {}, index: number) => {
  return index
}
const columns = [
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '知识点',
    dataIndex: 'KnowledgePoints',
    key: 'KnowledgePoints',
  },
  {
    title: '查看人数',
    dataIndex: 'lookNum',
    key: 'lookNum',
    width: 140,
  },
  {
    title: '不知道率',
    dataIndex: 'unknownRate',
    key: 'unknownRate',
    width: 140,
  },
  {
    title: '答对人数',
    dataIndex: 'correctNum',
    key: 'correctNum',
    width: 120,
  },
  {
    title: '打错人数',
    dataIndex: 'errorNum',
    key: 'errorNum',
    width: 120,
  },
  {
    title: '正确率',
    dataIndex: 'correctRate',
    key: 'correctRate',
    width: 120,
  },
]
interface ITableList {
  taskName: string
  KnowledgePoints: string
  lookNum: number
  unknownRate: string
  correctNum: number
  errorNum: number
  correctRate: string
}
interface IPage {
  page: number
  pageSize: number
  total: number
}
interface IData {
  tableList: ITableList[],
  page: IPage
}
</script>

<style lang="less" scoped>
.task-statistic {
  .title {
    font-size: 20px;
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
  }
}
</style>
