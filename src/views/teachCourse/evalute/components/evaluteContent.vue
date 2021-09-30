<template>
  <div class="evaluteContent">
    <!-- 章节 -->
    <div v-show="showChapter">
      <div class="top">
        <span>
          已完成学生：<span>{{chapterCompletion.done}}</span> 人
        </span>
        <span>
          未完成学生：<span>{{chapterCompletion.undone}}</span> 人
        </span>
      </div>
      <div class="content">
        <div class="search-box">
          <Search  :courseId="courseId" @search="handleSearch"></Search>
          <a-button type="primary" @click="checkResults">习题成绩</a-button>
        </div>
        <a-table
        :loading="tableData.loading"
        row-key="user_id"
        :columns="columns"
        :data-source="tableData.data"
        :pagination="{current: form.page, pageSize: form.pageSize, total: tableData.total, onChange: pageChange, onShowSizeChange: showSizeChange, showSizeChanger:true, hideOnSinglePage:true}"
        />
      </div>
    </div>
    <!-- 习题成绩 -->
    <div v-if="!showChapter">
      <div class="results-top">
        <ul>
          <li>
            <span>{{resultsInfo.scores || 0}}</span>
            <span>习题总分</span>
          </li>
          <li>
            <span>{{resultsInfo.questions_count}}</span>
            <span>习题总数</span>
          </li>
          <li>
            <span>{{resultsInfo.avg_score}}</span>
            <span>平均分</span>
          </li>
          <li>
            <span>{{resultsInfo.max_score}}</span>
            <span>最高分 </span>
          </li>
          <li>
            <span>{{resultsInfo.min_score}}</span>
            <span>最低分</span>
          </li>
          <li>
            <span>{{resultsInfo.student_submitted_count}}</span>
            <span>已提交人数</span>
          </li>
          <li>
            <span>{{resultsInfo.student_not_submitted_count}}</span>
            <span>未提交人数</span>
          </li>
        </ul>
        <a-button type="primary" @click="goBack"><i class="iconfont icon-fanhui"></i>返回</a-button>
      </div>
      <div class="results-content">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="学生成绩">
            <student-results :chapterId="chapterId" :courseId="courseId" tabType="student"/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="题目正确率" force-render>
            <student-results :chapterId="chapterId" :courseId="courseId" tabType="question"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive,Ref, provide, watch, onMounted } from 'vue'
import StudentResults from './studentResults.vue'
import Search from './search.vue'
import request from 'src/api/index'
import {Ihttp} from '../../typings'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Iform } from './public'

interface IListData{
  id: number,
  user_id: string,
  username: string,
  user_no: string,
  chapger_progress: string,
  ongoing_cnt: string
}
interface ItableData{
  loading: boolean,
  data: IListData[],
  total: number
}
interface Iresultsinfo{
  scores: number | string,
  questions_count: number | string,
  avg_score: number,
  max_score: number,
  min_score: number,
  student_submitted_count: number | string,
  student_not_submitted_count: number
}
interface Ichapter{
  done: number,
  undone: number
}
const columns = [
  {
    title: '学号',
    dataIndex: 'user_no',
    align:'center'
  },
  {
    title: '姓名',
    dataIndex: 'username',
    align:'center'
  },
  {
    title: '章节进度',
    dataIndex: 'chapter_progress',
    align:'center'
  },
  {
    title: '进行中的实验',
    dataIndex: 'ongoing_cnt',
    align:'center'
  },
]
export default defineComponent({
  components: {
    StudentResults,
    Search
  },
  props: ['courseId', 'chapterId', 'show'],
  setup(props) {
    const http=(request as Ihttp).teachCourse
    const showChapter:Ref<boolean> = ref(true)
    const chapterId:any = ref(0)
    const courseId:any = ref(0)
    const form = reactive<Iform>({
      classId: '',
      username: '',
      name: '',
      page: 1,
      pageSize: 5
    });
   
    var tableData = reactive<ItableData>({
      loading: false,
      data: [],
      total: 0
    })
    var chapterCompletion = reactive<Ichapter>({
      done: 0,
      undone: 0
    })
    var activeTab:Ref<string> = ref('1')
    var resultsInfo = ref<Iresultsinfo>({
      scores:0,
      questions_count: 0,
      avg_score: 0,
      max_score: 0,
      min_score: 0,
      student_submitted_count: 0,
      student_not_submitted_count: 0
    })
    var refresh:Ref<boolean> = ref(false)
    function pageChange(val:number){
      form.page = val
      getTableData()
    }
    function showSizeChange (val:number, size:number) {
      form.pageSize = size
      getTableData()
    }
    function handleSearch(val:any) {
      Object.assign(form,val)
      form.page = 1
      getTableData()
    }
    function hanldeClear () {
      form.classId = ''
      form.page = 1
      form.username = ''
      form.name = ''
      getTableData()
    }
    function checkResults () {
      refresh.value = false
      showChapter.value = false
      getBasicInfo()
    }
    function getBasicInfo () {
      http.getResultInfo({urlParams: {chapter_id: chapterId.value}}).then((res:IBusinessResp) => {
        refresh.value = true
        resultsInfo.value = res.data
      })
    }
    function goBack () {
      showChapter.value = true
      activeTab.value = '1'
    }
    function getTableData (showInfo:boolean = true) {
      tableData.loading = true
      tableData.data.length = 0
      let params = {
        course_id: courseId.value,
        item_id: chapterId.value,
        'query[stu_no]': form.username,
        'query[stu_name]': form.name,
        'query[classes_id]': form.classId,
        'pageinfo[index]': form.page,
        'pageinfo[size]': form.pageSize,
        with_chapater_completion: showInfo
      }
      http.evaluteProject({param: params}).then((res:IBusinessResp) => {
        tableData.loading = false
        let result = res.data
        Object.assign(chapterCompletion, result.chapter_completion)
        console.log(result.chapter_progress)
        if(result.chapter_progress.length == 0) return;
        tableData.data.push(...result.chapter_progress?.data)
        tableData.data.forEach((item:any) => {
          item.chapter_progress = (item.chapter_progress * 100).toFixed(0) + '%'
        })
        tableData.total = result.chapter_progress.total
      })
    }
    watch([()=>props.chapterId, ()=>props.courseId], ([nChapterId, nCourseId]) => {
      chapterId.value = nChapterId
      courseId.value = nCourseId
      form.page = 1
      form.pageSize = 5
      getTableData(true)
    })
    watch(()=>props.show, (newVal) => {
      if (newVal) {
        showChapter.value = true
      }
    })
    return {
      showChapter,
      form,
      columns,
      tableData,
      activeTab,
      resultsInfo,
      refresh,
      courseId,
      chapterId,
      pageChange,
      handleSearch,
      getTableData,
      hanldeClear,
      checkResults,
      goBack,
      chapterCompletion,
      showSizeChange
    }
  },
})
</script>
<style lang="less" scoped>
.evaluteContent{
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
    }
  }
  // 习题成绩
  .results-top{
    padding: 20px 20px 0;
    display: flex;
    justify-content: space-between;
    ul{
      display: flex;
      li{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: @theme-color;
        margin: 0 30px;
        position: relative;
        &:first-child{
          margin-left: 0;
        }
        &:not(:last-child)::after{
          content: '';
          display: block;
          width: 1px;
          height: 35px;
          background: #DAD9D9;
          position: absolute;
          right: -30px;
          top:0;
          bottom:0;
          margin-top: auto;
          margin-bottom: auto;
        }
        span:first-child{
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
  .results-content{
    padding: 0 20px;
  }
}
</style>
