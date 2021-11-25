<template>
  <div class="task-statistic">
    <h3 class="title">任务统计</h3>
    <div>
       <a-config-provider>
          <a-table 
            :rowKey="rowkey"
            :dataSource="tableList" 
            :columns="columns"  
          >
          </a-table>
          <template #renderEmpty>
              <div><empty type="tableEmpty"></empty></div>
          </template>
        </a-config-provider>
    </div>
    <!-- :pagination='false'  -->
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
import Empty from 'src/components/Empty.vue'
import request from 'src/api/index'
import { ITeacherTrainHttp } from './../typings'
export default defineComponent({
  components:{
    Empty
  },
  props: {
    trainId: {
      type: String
    },
  },
  setup(props, {emit}) {
    const http=(request as ITeacherTrainHttp).teacherTrain
    const pagination = reactive<any>({
      hideOnSinglePage:false,
      total:1,
    })
    const data = reactive<IData>({
      tableList: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    })
    const getTaskStatisticList = () => {
      http.assessmentStatistic({param:{id:props.trainId}}).then((res:any)=>{
        console.log(res,'统计芙蓉如风')
        data.tableList=res.data.list
        data.page.total = res.data.page.totalCount
      })
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
      pagination,
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
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '知识点',
    dataIndex: 'KnowledgePoints',
    key: 'KnowledgePoints',
  },
  {
    title: '查看人数',
    dataIndex: 'is_see_count',
    key: 'is_see_count',
    width: 140,
  },
  {
    title: '不知道率',
    dataIndex: 'not_see_accuracy',
    key: 'not_see_accuracy',
    width: 140,
  },
  {
    title: '答对人数',
    dataIndex: 'right_count',
    key: 'right_count',
    width: 120,
  },
  {
    title: '打错人数',
    dataIndex: 'wrong_count',
    key: 'wrong_count',
    width: 120,
  },
  {
    title: '正确率',
    dataIndex: 'right_accuracy',
    key: 'right_accuracy',
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
