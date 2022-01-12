<template>
  <div class="course-info">
    <div class="name-box">
      <span class="name">{{data.name}}</span>
      <!-- <span class="status in-progress">进行中</span -->
      <span class="status" 
      :class="{'not-start': data.state === 2, 'in-progress': data.state === 3, 'finish': data.state !== 3 && data.state !== 2}"
      >{{courseStatus(data.state)}}
      </span>
      <span class="icon-fanhui iconfont" @click="goBack()"></span>
    </div>
    <div class="desc-box">
      <span class="desc" :title="data.introduce">{{data.introduce}}</span>
    </div>
    <div class="statistics">
      <div class="statistics-info chapter-box">
        <span>{{data.chapter_total}}</span>
        <span>章节</span>
      </div>
      <div class="statistics-info experiment-box">
        <span>{{data.content_total}}</span>
        <span>实验</span>
      </div>
      <div class="statistics-info type-box">
        <span>{{data.category ? data.category.name: ''}}</span>
        <span>课程方向</span>
      </div>
      <div class="statistics-info job-box">
        <span>{{data.direction ? data.direction.name: ''}}</span>
        <span>职业方向</span>
      </div>
      <div class="statistics-info time">
        <span> 
          {{data.start_time ? data.start_time.split(' ')[0] : ''}} - 
          {{data.end_time ? data.end_time.split(' ')[0] : ''}}
        </span>
        <span>课程时间</span>
      </div>
      <div class="operation-box" v-show="showOperate">
        <span class="icon-mobandaishezhi iconfont" title="选择报告模板" @click="openReportModal()"></span>
        <span class="icon-bianji1 iconfont" title="编辑" @click="detailVisible =true"></span>
      </div>
    </div>
  </div>
  <a-modal class="report-modal" title="选择实验报告" :footer="null" :visible="reportVisible" @cancel="reportVisible = false">
    <div class="search-top-box">
      <a-input-search v-model="name" placeholder="请输入查询关键字" style="width: 300px" @search="onSearch" />
    </div>
    <a-table 
      :rowKey="rowkey"
      :dataSource="reportList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
    >
      <template #type="{ record }">
        <span>{{ record.type === 'form' ? '在线报告' : '离线报告' }}</span>
      </template>
      <template #operation="{ record }">
        <a @click="selectReport(record.id)">选择</a>
      </template>
    </a-table>
    <div class="page-footer-box">
      <a-pagination
        show-size-changer
        :total="total"
        :page-size="pageSize"
        @change="pageChange"
        @showSizeChange="onShowSizeChange"
      />
    </div>
  </a-modal>
    <edit-detail :detail="data" :courseId="courseInfo.courseId" v-if="detailVisible" :detailVisible="detailVisible" @cancelDetail="cancelDetail"></edit-detail>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref, PropType } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ICourseAnalysisHttp, ICourseInfo, ITreeData, ITreeDataItem } from './typings'
import editDetail from './editDetail.vue'
import { useRouter, useRoute } from 'vue-router'
interface IreportList {
  type: string
  name: string
}
interface IDataSource {
  reportList: IreportList[],
  pageSize: number
  total: number
  page: number
  name: string
}

export default defineComponent({
  components: {editDetail},
  props: {
    courseInfo: {
      type: Object as PropType<ICourseInfo>,
      default: {}
    },
    showOperate: {
      default: true
    }
  },
  setup(props) {
    // let courseInfo = reactive<ICourseInfo>({
    //   type: 'course',
    //   courseType: 1,
    //   courseId: 501703,
    // })
    const router = useRouter()
    const route = useRoute()
    const http=(request as ICourseAnalysisHttp).teacherCourseAnalysis

    let courseDetail = reactive({
      data: {
        name: '',
        state: 0,
        introduce: '',
        content_total: 0,
        chapter_total: 0,
        category: {name: ''},
        direction: {name: ''},
        start_time: '',
        end_time: '',
        course_category_id: 0,
        course_direction_id: 0,
        desc: '', 
        url: ''
      }
    })
    function getCourseDetail() {
      http.getCourseDetail({
        urlParams: {
          courseId: props.courseInfo.courseId
        }
      }).then((res: IBusinessResp) => {
        console.log(res.data)
        courseDetail.data = res.data
      })
    }
    // 判断课程进行状态
    function courseStatus(sort: number) {
      if (sort === 1) {
        return '已结束' // 未开始
      } else if (sort === 2) {
        return '未开始' // 已结束
      } else if (sort === 3) {
        return '进行中' // 进行中
      } else {
        return '未知'
      }
    }

    let reportVisible = ref(false)
    let dataSource = reactive<IDataSource>({
      reportList: [],
      total: 0,
      pageSize: 10,
      page: 1,
      name: ''
    })
    // 选择实验报告
    function openReportModal() {
      console.log(111)
      reportVisible.value = true
      getReportTemplate()
    }
    function getReportTemplate () {
      http.getReportTemplate({
        param: {
          name: dataSource.name,
          page: dataSource.page,
          pageSize: dataSource.pageSize
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        dataSource.reportList = res.data.list
        dataSource.total = res.data.page.totalCount
        dataSource.pageSize = res.data.page.perPage
      })
    }
    let columns = [
      {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '模板类型',
        dataIndex: 'type',
        key: 'type',
        slots: { customRender: 'type' },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        slots: { customRender: 'operation' },
      },
    ]
    function selectReport(id: number) {
      console.log(222, id)
      http.saveReportTemplate({
        param: {
          owner_type: props.courseInfo.type,
          owner_id: props.courseInfo.courseId,
          template_id: id
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        reportVisible.value = false
      })
    }
    // 页码发生变化时
    function pageChange(page: number, pageSize: number) {
      dataSource.page = page
      dataSource.pageSize = pageSize
      getReportTemplate()
    }
    // pageSize 变化的回调
    function onShowSizeChange(current: number, size: number) {
      console.log(current, size)
      dataSource.page = current
      dataSource.pageSize = size
      getReportTemplate()
    }

    function onSearch(val: string) {
      dataSource.name = val
      getReportTemplate()
    }
    function rowkey(record: {}, index: number) {
      return index
    }

    function submitHandle() {
      console.log(courseDetail.data)
    }

    // 编辑
    let detailVisible = ref(false)
    function cancelDetail(data: any) {
      if (data) {
        getCourseDetail()
      }
      detailVisible.value = false
    }

    // 返回
    function goBack() {
      window.history.go(-1)
      // router.push('/teacher/teacherCourse/virtualEnv')
    }
    onMounted(() => {
      getCourseDetail()
    })
    return {
      ...toRefs(props),
      ...toRefs(courseDetail),
      courseStatus,
      openReportModal,
      reportVisible,
      columns,
      selectReport,
      ...toRefs(dataSource),
      onShowSizeChange,
      pageChange,
      rowkey,
      onSearch,
      detailVisible,
      submitHandle,
      cancelDetail,
      goBack,
    }
  },
})
</script>


<style lang="less" scoped>
.course-info {
  // padding: 0 70px;
  .name-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    .name {
      font-size: 24px;
      color: var(--white-100);
      line-height: 33px;
      letter-spacing: 2px;
    }
    .status {
      right: 0;
      padding: 3px 10px;
      background: #373737;
      font-size: 12px;
      text-align: center;
      vertical-align: text-bottom;
      margin-left: 24px;
      border-radius: 11px;
      height: 22px;
      &.not-start {
        background: var(--white-100);
        color: #acacac;
      }
      &.in-progress {
        background: #60ae34;
        box-shadow: 0px 2px 4px 0px var(--black-0-7);
        color: var(--white-100);
      }
      &.finish {
        color: var(--white-100);
        background: #989898;
        box-shadow: 0px 2px 4px 0px var(--black-0-7);
      }
    }
    .icon-fanhui {
      margin-left: auto;
      display: inline-block;
      line-height: 40px;
      text-align: center;
      width: 40px;
      height: 40px;
      background: var(--purpleblue-6);
      border-radius: 50%;
      color: var(--white-100);
      cursor: pointer;
    }
  }
  .desc-box {
    height: 66px;
    // margin-top: 12px;
    .desc {
      width: 926px;
      height: 50px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: var(--white-100);
      line-height: 24px;
      letter-spacing: 1px;
      display: block;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .statistics {
    display: flex;
    .statistics-info {
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.25);
      padding-right: 32px;
      padding-left: 32px;
      > span {
        text-align: center;

        &:nth-child(1) {
          color: var(--white-100);
          font-size: 14px;
        }

        &:nth-child(2) {
          color: rgba(255, 255, 255, 0.65);
          font-size: 12px;
        }
      }
      &.chapter-box {
        padding-left: 0;
      }
      &.time {
        Padding-right: 0;
        border-right: none;
      }
    }
    .operation-box {
    margin-left: auto;

      > span {
        display: inline-block;
        line-height: 40px;
        text-align: center;
        width: 40px;
        height: 40px;
        background: #ff8f00;
        border-radius: 50%;
        margin-left: 24px;
        color: var(--white-100);
        cursor: pointer;

        &:hover {
          background: #ffaf00;
        }
      }
    }
  }
}
:deep(.ant-table) .ant-table-content .ant-table-body > table {
  border: 1px solid #e8e8e8;
  .ant-table-thead > tr > th {
    border-bottom: 1px solid #e8e8e8;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #e8e8e8;
  }
}
.search-top-box {
  margin-bottom: 20px;
}
.page-footer-box {
  text-align: center;
  margin-top: 20px;
}
</style>