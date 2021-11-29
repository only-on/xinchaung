<template>
  <div class="evaluate setScrollbar" v-layout-bg>
    <h3 class="title">实训考核</h3>
    <div class="condition">
      <a-form-item label="学号">
        <a-input @keyup.enter="query" v-model:value="searchInfo.name"/>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input @keyup.enter="query" v-model:value="searchInfo.nick"/>
      </a-form-item>
      <a-form-item label="班级">
        <a-input @keyup.enter="query" v-model:value="searchInfo.class"/>
      </a-form-item>
      <a-button type="primary" @click="query()">查询</a-button>
      <a-button type="primary" @click="clear()">清空</a-button>
      <div class="right">
        <a-button type="primary" class="upload" @click="exportResult()">导出成绩</a-button>
        <a-button type="primary" class="upload" @click="releaseResult()">发布成绩</a-button>
      </div>
    </div>
    <!-- v-model:selectedRows="{selectedRowKeys,onSelectChange }" -->
    <evaluate-table 
      :tableList="tableList" 
      :total="page.total" 
      v-model:selectedRows='selectedRows'
      @pageChange="pageChange"
      :trainId="trainInfo.trainId"
      :start='start'
    ></evaluate-table>
    <task-statistic 
    :trainId="trainInfo.trainId">
    </task-statistic>
  </div>
</template>

<script lang="ts">
import { defineComponent, createVNode , reactive, toRefs, inject,onMounted} from 'vue'
import evaluateTable from './evaluateComponent/evaluateTable.vue'
import TaskStatistic from './evaluateComponent/taskStatistic.vue'
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherTrainHttp } from './typings'
import { useRoute } from 'vue-router'
import  FileSaver  from 'file-saver'

export default defineComponent({
  components: { evaluateTable, TaskStatistic },
  setup() {
    let updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})

    let route = useRoute()
    console.log(route.query)
    const trainInfo: {trainId: any} = {
      trainId: route.query.trainId
    }
    // const trainInfo = {
    //   trainId: 50235
    // }

    const http=(request as ITeacherTrainHttp).teacherTrain
    const data = reactive<IData>({
      searchInfo: {
        id:trainInfo.trainId,
        limit:0,
        page:0,
        withs:'user,userProfile',
        name:'',
        nick:'',
        class:'',
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
      http.assessmentList({param:data.searchInfo}).then((res:any)=>{
        console.log(res)
        data.tableList=res.data.list
        data.page.total = res.data.page.totalCount
      })
      console.log(data.searchInfo, data.page.page)
    }
    // 查询
    const query = () => {
      getResourceList()
    }
    // 清空
    const clear = () => {
      data.searchInfo.name = ''
      data.searchInfo.nick = ''
      data.searchInfo.class = ''
      getResourceList()
    }
    // 页码变化
    const pageChange = (page: number) => {
      data.page.page = page
      getResourceList()
    }
    // const selectedRows=(val:any)=>{
    //    data.selectedRows=val
    // }
    // 导出成绩
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
            let ids = data.tableList.map(v => v.id)
              exportScore({
                train_id: trainInfo.trainId,
                id: ids
              })
          }
        });
        return 
      }
      let ids = data.selectedRows.map(v => v?.study_record?.id)
      exportScore({
        train_id: trainInfo.trainId,
        id: ids
      })
    }
    // 导出成绩调用接口
    const exportScore = (param: {train_id: string, id?: number[]}) => {
      // const dev_base_url = import.meta.env.VITE_APP_BASE_API || ''
      // console.log(dev_base_url, param)
      // let url = `${dev_base_url}/teacher-train/train-score-export`
      // fetch(url, {
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   body: param.train_student_id ? `train_id = ${param.train_id} & train_student_id = ${param.train_student_id}` : `train_id = ${param.train_id}`
      // }).then((res: any) => {     
      //   return res.arrayBuffer();
      // }).then(arraybuffer => {
      //   let blob = new Blob([arraybuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      //   var link = document.createElement('a');
      //   link.href = window.URL.createObjectURL(blob);
      //   link.download = '学生实训成绩报表.xls';
      //   link.click();
      //   window.URL.revokeObjectURL(link.href);
      // })
      // http.exportScore({param: param}).then((res: IBusinessResp) => {
      //   console.log(res)
      // })
       let development=process.env.NODE_ENV == 'development' ? true : false;
        let baseurl=development?'http://localhost:3000/proxyPrefix':""
        // FileSaver.saveAs(baseurl+url,name);
    }
    //发布成绩
    const releaseResult = (param: {train_id: string, id?: number[]}) =>{
      if (!data.selectedRows.length) {
        Modal.confirm({
          title: '发布成绩',
          icon: createVNode(ExclamationCircleOutlined),
          content: '是否发布所有学生成绩?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('发布全部')
             let ids = data.tableList.map(v => v.id)
              releaseScore({
                train_id: trainInfo.trainId,
                id: ids
              })
          }
        });
        return 
      }
      let ids = data.selectedRows.map(v => v.id)
      releaseScore({
        train_id: trainInfo.trainId,
        id: ids
      })
    }
    //发布成绩调用接口
    const releaseScore = (param: {train_id: string, id?: number[]}) => {
      // http.releaseScore({param: param}).then((res: IBusinessResp) => {
      //   console.log(res)
      // })
       http.releaseResults({param: param}).then((res:any)=>{
        message.success('发布成绩成功！')
        data.selectedRows=[]
        getResourceList()
      })
    }
    onMounted(() => {
      getResourceList()
    })
    return {
      trainInfo,
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
    score: number
    study_record:any
  }
  interface ISearchInfo {
    id: number
    limit: number
    page: number
    withs:string
    name: string
    nick: string
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>