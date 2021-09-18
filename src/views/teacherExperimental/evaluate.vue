<template>
  <div class="evaluate setScrollbar" v-layout-bg>
    <h3 class="title">实训考核</h3>
    <div class="condition">
      <a-form-item label="学号">
        <a-input v-model:value="searchInfo.num"/>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-model:value="searchInfo.name"/>
      </a-form-item>
      <a-form-item label="班级">
        <a-input v-model:value="searchInfo.class"/>
      </a-form-item>
      <a-button type="primary" @click="query()">查询</a-button>
      <a-button type="primary" @click="clear()">清空</a-button>
      <div class="right">
        <a-button type="primary" class="upload" @click="exportResult()">导出成绩</a-button>
        <a-button type="primary" class="upload" @click="releaseResult()">发布成绩</a-button>
      </div>
    </div>
    <evaluate-table 
      :tableList="tableList" 
      :total="page.total" 
      v-model:selectedRows="selectedRows"
      @pageChange="pageChange"
    ></evaluate-table>
    <task-statistic></task-statistic>
  </div>
</template>

<script lang="ts">
import { defineComponent,createVNode , reactive, toRefs } from 'vue'
import evaluateTable from './evaluateComponent/evaluateTable.vue'
import TaskStatistic from './evaluateComponent/taskStatistic.vue'
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperimentalHttp } from './typings'

export default defineComponent({
  components: { evaluateTable, TaskStatistic },
  setup() {
    const trainInfo = {
      trainId: 50235
    }
    const http=(request as ITeacherExperimentalHttp).teacherExperimental
    const data = reactive<IData>({
      searchInfo: {
        name: '',
        num: '',
        class: ''
      },
      tableList: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      selectedRows: []
    })
    // 获取列表数据
    const getResourceList = () => {
      console.log(data.searchInfo, data.page.page)
      data.tableList = [
        {
          id: 0,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
        {
          id: 1,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
        {
          id: 2,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
        {
          id: 0,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
        {
          id: 1,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
        {
          id: 2,
          num: 1,
          name: '111',
          time: '222',
          achievements: 'lsx',
          video: '1024kb',
          report: '2021.9.16',
          class: '大数据20级1班',
          result: 1,
          env: 1
        },
      ]
      data.page.total = 100
    }
    // 查询
    const query = () => {
      getResourceList()
    }
    // 清空
    const clear = () => {
      data.searchInfo.name = ''
      data.searchInfo.num = ''
      data.searchInfo.class = ''
      getResourceList()
    }
    // 页码变化
    const pageChange = (page: number) => {
      data.page.page = page
      getResourceList()
    }
    const exportResult = () =>{
      console.log('导出', data.selectedRows)
      if (!data.selectedRows.length) {
        Modal.confirm({
          title: '导出成绩',
          icon: createVNode(ExclamationCircleOutlined),
          content: '是否导出全部成绩',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('导出全部')
            exportScore({train_id: trainInfo.trainId})
          }
        });
        return 
      }
      let ids = data.selectedRows.map(v => v.id)
      exportScore({
        train_id: trainInfo.trainId,
        train_student_id: ids
      })
    }
    const exportScore = (param: {train_id: number, train_student_id?: number[]}) => {
      const dev_base_url = import.meta.env.VITE_APP_BASE_API || ''
      console.log(dev_base_url)
      let url = `${dev_base_url}/teacher-train/train-score-export`
      fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `train_id = ${param.train_id} & train_student_id = ${param.train_student_id}`
      }).then((res: any) => {     
        return res.arrayBuffer();
      }).then(arraybuffer => {
        let blob = new Blob([arraybuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = '学生实训成绩报表.xls';
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
      // http.exportScore({param: param}).then((res: IBusinessResp) => {
      //   console.log(res)
      // })
    }

    const releaseResult = () =>{
      if (!data.selectedRows.length) {
        Modal.confirm({
          title: '发布成绩',
          icon: createVNode(ExclamationCircleOutlined),
          content: '是否发布所有学生成绩?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('发布全部')
            releaseScore({train_id: trainInfo.trainId})
          }
        });
        return 
      }
      let ids = data.selectedRows.map(v => v.id)
      releaseScore({
        train_id: trainInfo.trainId,
        train_student_id: ids
      })
    }
    const releaseScore = (param: {train_id: number, train_student_id?: number[]}) => {
      http.releaseScore({param: param}).then((res: IBusinessResp) => {
        console.log(res)
      })
    }
    return {
      ...toRefs(data),
      query,
      clear,
      exportResult,
      releaseResult,
      pageChange,
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
  interface ISearchInfo {
    name: string
    num: string
    class: string
  }
  interface IPage {
    page: number
    pageSize: number
    total: number
  }
  interface IData {
    searchInfo: ISearchInfo,
    tableList: ITableList[],
    page: IPage,
    selectedRows: ITableList[]
  }
</script>

<style lang="less" scoped>
.font-size-14 {
  font-size: 14px;
}
.evaluate {
  width: @center-width;
  height: 100%;
  margin: 0 auto;
  background-color: @white;
  border-radius: 5px;
  padding: 40px;
  overflow: auto;
  .title {
    font-size: 20px;
  }
  .condition {
    display: flex;
    justify-content: flex-start;
    :deep(.ant-form-item) {
      margin-right: 10px;
      .ant-form-item-control .ant-input, 
      .ant-form-item-control .ant-select  {
        width: 165px;
        .font-size-14();
      }
      .ant-form-item-label > label {
        .font-size-14();
      }
    }
    :deep(.ant-btn-primary) {
      margin-right: 10px;
      .font-size-14();
    }
    .right {
      margin-left: auto;
    }
  }
  :deep(.ant-table) .ant-table-thead > tr > th,
  :deep(.ant-table) .ant-table-tbody > tr > td {
    .font-size-14();
  }
}
</style>