<template>
  <div class="evaluate-table">
    <a-table 
      :rowKey="rowkey"
      :dataSource="tableList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
      :row-selection="rowSelection"
    >
      <template #type="{ record }">
        <span>{{ record.type}}</span>
      </template>
      <template #achievements="{ record }">
        <span class="operation-btn" @click="lookAchievements(228 | record.id)">查看</span>
      </template>
      <template #video="{ record }">
        <span class="operation-btn" @click="lookVideo(record.id)">查看</span>
      </template>
      <template #report="{ record }">
        <span class="operation-btn" @click="lookReport(record.id)">查看</span>
      </template>
      <template #result="{ record }">
        <span class="operation-btn" @click="Review(record.id)">批阅</span>
      </template>
      <template #env="{ record }">
        <span class="operation-btn disabled" @click="reset(record.id)">重置</span>
      </template>
    </a-table>
    <div class="page-footer-box">
        <!-- show-quick-jumper  -->
      <a-pagination
        v-model:current="page.page" 
        :pageSize="page.pageSize" 
        :total="total" 
        @change="pageChange" 
        :hideOnSinglePage="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, markRaw  } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperimentalHttp } from './../typings'
import { message } from 'ant-design-vue'

export default defineComponent({
  props: {
    tableList: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
    total: {
      type: Number,
      default: 0
    },
    selectedRows: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
  },
  emits: ['update:selectedRows', 'pageChange'],
  setup(props, {emit}) {
    const data = reactive<IData>({
      // tableList: [],
      page: {
        page: 1,
        pageSize: 10,
      }
    })
    const http=(request as ITeacherExperimentalHttp).teacherExperimental
    const columns = [
      {
        title: '学号',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '花费时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '实训成果',
        dataIndex: 'achievements',
        key: 'achievements',
        slots: { customRender: 'achievements' },
        width: 120,
      },
      {
        title: '操作视频',
        dataIndex: 'video',
        key: 'video',
        slots: { customRender: 'video' },
        width: 120,
      },
      {
        title: '实训报告',
        dataIndex: 'report',
        key: 'report',
        slots: { customRender: 'report' },
        width: 120,
      },
      {
        title: '所属班级',
        dataIndex: 'class',
        key: 'class',
      },
      {
        title: '实训成绩',
        dataIndex: 'result',
        key: 'result',
        slots: { customRender: 'result' },
        width: 120,
      },
      {
        title: '实训环境',
        dataIndex: 'env',
        key: 'env',
        slots: { customRender: 'env' },
        width: 120,
      },
    ]
    console.log(markRaw({obj: 1}))
    // 操作处理
    const operationHandle = reactive({
      // 查看成果
      lookAchievements: (id: number) => {
        http.showExperimentalNote({param: {train_student_id: id}})
          .then((res: IBusinessResp) => {
            console.log(res)
            if (res.data && res.data.length) {

            } else {
              message.warn('暂无实训成果！')
            }
          })
      },
      // 查看视频
      lookVideo: (id: number) => {
        message.warn('服务器没有该文件！')
      },
      // 查看报告
      lookReport: (id: number) => {
        message.warn('服务器没有该文件！')
      },
      // 批阅
      Review: (id: number) => {

      },
      // 重置
      reset: (id: number) =>{

      }
    })
    // 页码发生变化时
    const pageChange = (page: number, pageSize: number) => {
      data.page.page = page
      data.page.pageSize = pageSize
      emit('pageChange', page)
    }
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      data.page.page = current
      data.page.pageSize = size
    }
    
    const rowSelection = {
      onChange: (selectedRowKeys: (string | number)[], selectedRows: ITableList[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 1);
        emit('update:selectedRows', selectedRows)
      },
      onSelect: (record: ITableList, selected: boolean, selectedRows: ITableList[]) => {
        console.log(record, selected, selectedRows, 2);
      },
      onSelectAll: (selected: boolean, selectedRows: ITableList[], changeRows: ITableList[]) => {
        console.log(selected, selectedRows, changeRows, 3);
      },
    };
    const rowkey = (record: {}, index: number) => {
      return index
    }
    return {
      ...toRefs(props),
      ...toRefs(data),
      ...toRefs(operationHandle),
      columns,
      pageChange,
      onShowSizeChange,
      rowkey,
      rowSelection,
    }
  },
})
  interface ITableList {
    id: number
    num: number
    name: string
    time: string
    achievements: string
    video: string
    report: string
    class: string
    result: number
    env: number
  }
  interface IPage {
    page: number
    pageSize: number
    // total: number
  }
  interface IData {
    // tableList: ITableList[],
    page: IPage
  }
</script>

<style lang="less" scoped>
.theme-color{
  color: @theme-color;
}
.evaluate-table {
  .operation-btn {
    cursor: pointer;
    .theme-color();
    &.disabled {
      color: #949494;
      overflow: hidden;
      cursor: not-allowed;
    }
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
    margin-bottom: 48px;
  }
}
</style>