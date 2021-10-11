<template>
  <div class="evaluteProject">
    <div class="top">
      <span>
        已提交：<span>{{statistics.already}}</span> 人
      </span>
      <span>
        已评价：<span>{{statistics.evaluate}}</span> 人
      </span>
      <span>
        最高分：<span>{{statistics.high}}</span> 分
      </span>
      <span>
        最低分：<span>{{statistics.low}}</span> 分
      </span>
      <span>
        平均分：<span>{{statistics.average}}</span> 分
      </span>
    </div>
    <div class="content">
      <div class="search-box">
        <Search :courseId="courseId" @search="handleSearch"></Search>
          <div>
            <a-button type="primary" @click="handleExport">成绩导出</a-button>
            <a-button type="primary" @click="handleCreate" :disabled="btnLoading" v-show="!showBtn">{{btnLoading ? '成果获取中...' : '成果获取'}}</a-button>
            <a-button type="primary" @click="handleDownload" v-show="showBtn">成果下载</a-button>
          </div>
      </div>
      <a-table
      :loading="tableData.loading"
      :row-selection="{onChange: onSelectChange }"
      rowKey="id"
      :columns="columns"
      :data-source="tableData.data"
      :pagination="{current: form.page, pageSize: form.pageSize, total: tableData.total, onShowSizeChange: showSizeChange, showSizeChanger:true, onChange: pageChange,hideOnSinglePage:true}">
        <template #final_score="{ record, text }">
          <span :class="{'linkText': text !== '--'}" @click="checkDetail('score', record, text !== '--')">{{text}}</span>
        </template>
        <template #show="{record}">
          <span :class="['text', {'linkText': record.has_note}]" @click="checkDetail('notes', record.note_id, record.has_note)">笔记</span>
          <span :class="['text', {'linkText': record.has_question_record || record.has_rebuild_question_record}]" @click="checkDetail('exam', record, record.has_question_record || record.has_rebuild_question_record)">习题</span>
          <span :class="['text', {'linkText': record.has_video}]" @click="checkDetail('video', record.video_ids, record.has_video)">视频</span>
        </template>
        <template #has_report="{ record }">
          <span :class="['text', {'linkText': record.report_id}]" @click="checkDetail('report', record.report_id, record.report_id)">{{!record.has_report ? '未提交': record.is_report_scored && record.report_score ? record.report_score :'批阅'}}</span>
        </template>
        <template #has_rebuild_report="{ record }">
          <span :class="['text', {'linkText': record.report_rebuild_id}]" @click="checkDetail('report', record.report_rebuild_id, record.report_rebuild_id)">{{!record.has_rebuild_report ? '未提交': record.is_rebuildreport_scored && record.rebuild_report_score ? record.rebuild_report_score :'批阅'}}</span>
        </template>
        <template #can_evaluate="{record}">
          <span :class="['text', {'resultText': record.can_evaluate}]">
            <span class="evaluteText" v-if="!record.evaluated" @click="checkDetail('evalute', record, record.can_evaluate)">评价</span>
            <span v-if="record.can_evaluate && record.evaluated">
              <span :class="'result'+record.rank">{{showText(record.rank)}}</span>
              <i class="iconfont icon-bianji1" @click="checkDetail('evalute', record, record.can_evaluate)">{{}}</i>
            </span>
          </span>
        </template>
      </a-table>
    </div>
    <!-- 弹框 -->
    <evalute-modal :openModal="openModal" :params="modalParam" :type="modalType" @close="handleClose"></evalute-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent,reactive, Ref, ref, watch, provide, onMounted } from 'vue';
import request from "src/api/index";
import { Ihttp } from "../../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import EvaluteModal from './evaluteModal.vue'
import Search from './search.vue'
import {options, Iform} from './public'

interface ItableData{
  loading: boolean,
  data: IlistData[],
  total: number
}
interface IlistData{
  id: number
}
interface ImodalParam{
  type:string,
  course_id: number,
  content_id: number,
  stu_id: number,
  evaluteNum: number,
  reportId?: number,
  noteId?:number,
  quest_rebuild_record_id?: any[],
  quest_record_id?: any[],
  stuRecordId?: number,
  video_ids?: any[]
}
interface Istatistics{
  already: number | string,
  evaluate: number | string,
  high: number | string,
  low: number | string,
  average: number | string
}
const columns = [
  {
    title: '学号',
    dataIndex: 'stu_no',
    align:'center'
  },
  {
    title: '姓名',
    dataIndex: 'stu_name',
    align:'center'
  },
  {
    title: '最终得分',
    dataIndex: 'final_score',
    align:'center',
    slots: { customRender: 'final_score' }
  },
  {
    title: '花费时间',
    dataIndex: 'used_time',
    align:'center'
  },
  {
    title: '所属班级',
    dataIndex: 'class_name',
    align:'center'
  },
  {
    title: '查看',
    dataIndex: 'show',
    align:'center',
    width: 150,
    slots: { customRender: 'show' }
  },
  {
    title: '初学报告',
    dataIndex: 'has_report',
    align:'center',
    slots: { customRender: 'has_report' }
  },
  {
    title: '重修报告',
    dataIndex: 'has_rebuild_report',
    align:'center',
    slots: { customRender: 'has_rebuild_report' }
  },
  {
    title: '教师评价',
    dataIndex: 'can_evaluate',
    align:'center',
    slots: { customRender: 'can_evaluate' }
  },
]
export default defineComponent({
  components: {
    EvaluteModal,
    Search
  },
  props: ['contentId', 'courseId', 'chapterId', 'show'],
  setup(props) {
    const http = (request as Ihttp).teachCourse;
    var selectIds:any[] = reactive([])
    var btnLoading = ref<boolean>(false)
    var showBtn = ref<boolean>(false)
    var openModal = ref<boolean>(false)
    var courseId = ref<number>(props.courseId)
    var contentId = ref<number>(props.contentId)
    var resultId = ref<number>(0)
    // score:成绩明细 notes:笔记 video:视频 report: 报告 exam:习题
    var modalType = ref<string>('')
    var modalParam = reactive<ImodalParam>({
      type: 'score',
      course_id: props.courseId,
      content_id: props.contentId,
      stu_id: 0,
      evaluteNum: 0
    })
    var statistics = reactive<Istatistics>({
      already: 0,
      evaluate: 0,
      high: 0,
      low: 0,
      average: 0
    })
    const form = reactive<Iform>({
      classId: '',
      username: '',
      name: '',
      page: 1,
      pageSize: 10
    })
    const tableData = reactive<ItableData>({
      loading: false,
      data: [],
      total: 0
    })
    provide('refresh', ()=>{
      openModal.value = false
      getTableList()
    })
    watch([()=>props.contentId,()=>props.courseId], ([nContentId, nCourseId]) => {
      contentId.value = nContentId
      courseId.value = nCourseId
      modalParam.course_id = nCourseId
      modalParam.content_id = nContentId
      reset()
    })
    onMounted(()=>{
      reset()
    })
    function reset() {
      btnLoading.value = false
      showBtn.value = false
      resultId.value = 0
      form.classId = ''
      form.name = ''
      form.username = ''
      form.page = 1
      form.pageSize = 10
      getTableList()
    }
    function getTableList () {
      tableData.loading = true
      tableData.data.length = 0
      let params = {
        course_id: courseId.value,
        content_id: contentId.value,
        'query[stu_no]': form.username,
        'query[stu_name]': form.name,
        'query[classes_id]': form.classId,
        'pageinfo[index]': form.page,
        'pageinfo[size]': form.pageSize,
        with_content_statistics: true
      }
      http.evaluteContent({param: params}).then((res:IBusinessResp) => {
        tableData.loading = false
        if (res&&res.data) {
          Object.assign(statistics, res.data.content_statistics)
          let result = res.data.learning_records
          if (result.length == 0) {
            tableData.total = 0
            return
          }
          tableData.total = result.total
          tableData.data.push(...result.data)
        }
      })
    }
    function handleSearch (val:any) {
      Object.assign(form,val)
      form.page = 1
      getTableList()
    }
    function onSelectChange (selectedRowKeys: (string | number)[], selectedRows: any[]) {
      selectIds.length = 0
      selectedRows.forEach((item:any) => {
        selectIds.push(item.course_student_id)
      })
    }
    function pageChange(val:number){
      form.page = val
      getTableList()
    }
    function showSizeChange(val:number, size:number){
      form.pageSize = size
      getTableList()
    }
    // 评价显示
    function showText(val:any) {
      for (let i=0; i< options.length; i++) {
        if(options[i].value == val){
          return options[i].label
        }
      }
    }
    // 成绩导出
    function handleExport () {
      const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
      let url=`${dev_base_url}/teacher-course/content-export`
      let bodyParam = `content_id=${props.contentId}`
      for (let i = 0; i < selectIds.length; i++) {
        bodyParam+='&course_student_id[]='+selectIds[i]
      }
      fetch(url,{
          method: 'post',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParam
      }).then((res:any) => {     
          return res.arrayBuffer();
      }).then(arraybuffer => {
          let blob = new Blob([arraybuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = '学生成绩报表.xls';
          link.click();
          window.URL.revokeObjectURL(link.href);
      })
    }
    // 成功获取
    function handleCreate () {
      btnLoading.value= true
      let params = {
        course_id: props.courseId,
        content_id: props.contentId,
        course_student_id: selectIds
      }
      http.resultCreate({ param: params }).then((res: IBusinessResp) => {
        if (res && res.data) {
          resultId.value = res.data.id
          let timer:any = setInterval(()=>{
            http.exportTaskView({param: {id: resultId.value}}).then((result:IBusinessResp) => {
              if (result && result.data.status == 'finished') {
                clearInterval(timer)
                timer = null
                btnLoading.value = false
                showBtn.value = true
              }
            })
          }, 5000)
        }
      })
    }
    // 成果下载
    function handleDownload () {
      var url = "/course-export-task/download?id=" + resultId.value;
      var a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.download = '成果';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // 查看最终得分
    function checkDetail (type:string, val:any, canClick:boolean) {
      if(!canClick) return;
      openModal.value = true
      modalType.value = type
      switch (type){
        case 'evalute':
          modalParam.stuRecordId = val.id
          modalParam.evaluteNum = val.rank
          break;
        case 'report':
          modalParam.reportId = val
          break;
        case 'notes':
          modalParam.noteId = val
          break;
        case 'exam':
          modalParam.stu_id = val.stu_id
          modalParam.quest_record_id = val.quest_record_id
          modalParam.quest_rebuild_record_id = val.quest_rebuild_record_id
          break;
        case 'score':
          modalParam.stuRecordId = val.id
          modalParam.stu_id = val.stu_id
          break;
        case 'video':
          modalParam.video_ids = val
          break;
        default:
          break;
      }
    }
    function handleClose () {
      openModal.value = false
    }
    return{
      form,
      tableData,
      columns,
      btnLoading,
      openModal,
      modalParam,
      modalType,
      statistics,
      showBtn,
      handleSearch,
      onSelectChange,
      pageChange,
      handleExport,
      handleCreate,
      handleDownload,
      checkDetail,
      handleClose,
      showSizeChange,
      showText
    }
  },
})
</script>
<style lang="less" scoped>
.evaluteProject{
  .ant-btn{
    padding: 2px 10px;
    font-size: 14px;
  }
  .top{
    padding: 15px 20px;
    color: #8E8C8C;
    border-bottom: 1px solid #e6e6e6;
    &>span{
      margin-right: 60px;
      &>span{
        color: #FF9103
      }
    }
  }
  .content{
    padding: 30px 20px;
    .search-box{
      display: flex;
      justify-content: space-between;
      margin-bottom:30px;
      .ant-form{
        .ant-input{
          width: 120px;
        }
      }
      .ant-btn:not(:last-of-type){
        margin-right: 10px;
      }
    }
    :deep(.ant-table){
      font-size: 14px;
      .ant-table-tbody > tr > td{
        padding: 16px 10px;
      }
    }
    :deep(.ant-table-pagination.ant-pagination){
      float: none;
      text-align: center;
    }
    .text{
      color: #c9c9c9;
      margin-right: 5px;
      font-size: 14px;
      cursor: default;
    }
    .linkText{
        cursor: pointer;
        color: @theme-color;
      }
    :deep(.ant-table-thead > tr > th){
      padding: 12px;
    }
    .resultText{
      font-size: 14px;
      margin-right: 0;
      .evaluteText{
        color: @theme-color;
        cursor: pointer;
      }
      i{
        color: @theme-color;
        font-size: 14px;
        margin-left: 2px;
        cursor: pointer;
      }
      .result1{
        color: #ee555d;
      }
      .result2{
        color: #fda32f;
      }
      .result3{
        color:#30c7a7;
      }
      .result4{
        color: #29b1e9;
      }
    }
    
  }
}
</style>
