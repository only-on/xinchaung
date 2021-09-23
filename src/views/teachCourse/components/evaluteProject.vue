<template>
  <div class="evaluteProject">
    <div class="top">
      <span>
        已提交：<span>0</span> 人
      </span>
      <span>
        已评价：<span>0</span> 人
      </span>
      <span>
        最高分：<span>0</span> 分
      </span>
      <span>
        最低分：<span>0</span> 分
      </span>
      <span>
        平均分：<span>0</span> 分
      </span>
    </div>
    <div class="content">
      <div class="search-box">
          <a-form layout="inline" :form="form">
            <a-form-item label="学号"> 
              <a-input v-model:value="form.username" @pressEnter="handleSearch"></a-input>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="form.name" @pressEnter="handleSearch"></a-input>
            </a-form-item>
            <a-form-item label="班级">
              <a-input v-model:value="form.class" @pressEnter="handleSearch"></a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button type="primary" @click="hanldeClear">清空</a-button>
            </a-form-item>
          </a-form>
          <div>
            <a-button type="primary" @click="handleExport">成绩导出</a-button>
            <a-button type="primary" @click="handleCreate" :disabled="btnLoading">{{btnLoading ? '成果获取中...' : '成果获取'}}</a-button>
            <a-button type="primary" @click="handleDownload">成果下载</a-button>
          </div>
      </div>
      <a-table
      :loading="tableData.loading"
      :row-selection="{onChange: onSelectChange }"
      row-key="score"
      :columns="columns"
      :data-source="tableData.data"
      :pagination="{current: form.page, pageSize: form.pageSize, total: tableData.total, onShowSizeChange: showSizeChange, showSizeChanger:true, onChange: pageChange,hideOnSinglePage:true}">
        <template #score="{ record, text }">
          <span class="linkText" @click="checkDetail('score', record)">{{text}}</span>
        </template>
        <template #show="{record}">
          <span class="linkText" @click="checkDetail('notes', record)">笔记</span>
          <span class="linkText" @click="checkDetail('exam', record)">习题</span>
          <span class="linkText">视频</span>
        </template>
        <template #study_report="{ record }">
          <span class="linkText" @click="checkDetail('report', record)">查看</span>
        </template>
        <template #evalute="{record}">
          <!-- <span class="linkText" @click="checkDetail('evalute')">评价</span> -->
          <span class="resultText">
            <span class="result1">不合格</span>
            <i class="iconfont icon-bianji1" @click="checkDetail('evalute', record)"></i>
          </span>
        </template>
      </a-table>
    </div>
    <!-- 弹框 -->
    {{modalParam}}
    <evalute-modal :openModal="openModal" :params="modalParam" :type="modalType" @close="handleClose"></evalute-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent,reactive, Ref, ref, watch, provide } from 'vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import request from "src/api/index";
import { Ihttp } from "../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import EvaluteModal from './evaluteModal.vue'

interface Iform{
  class: string,
  username: string,
  name: string,
  page: number,
  pageSize: number
}
interface ItableData{
  loading: boolean,
  data: any[],
  total: number
}
interface ImodalParam{
  tid: number,
  type:string,
  course_id: number,
  task_id: number,
  stu_id: number,
  evaluteNum: number
}
const columns = [
  {
    title: '学号',
    dataIndex: 'username',
    align:'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align:'center'
  },
  {
    title: '最终得分',
    dataIndex: 'score',
    align:'center',
    slots: { customRender: 'score' }
  },
  {
    title: '花费时间',
    dataIndex: 'time',
    align:'center'
  },
  {
    title: '所属班级',
    dataIndex: 'class',
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
    dataIndex: 'study_report',
    align:'center',
    slots: { customRender: 'study_report' }
  },
  {
    title: '重修报告',
    dataIndex: 'rebuild_report',
    align:'center'
  },
  {
    title: '教师评价',
    dataIndex: 'evaluate',
    align:'center',
    slots: { customRender: 'evalute' }
  },
]
export default defineComponent({
  components: {
    EvaluteModal
  },
  props: ['contentId', 'courseId', 'chapterId'],
  setup(props) {
    const http = (request as Ihttp).teachCourse;
    var selectIds:any[] = reactive([])
    var btnLoading:Ref<boolean> = ref(false)
    var openModal:Ref<boolean> = ref(false)
    var courseId = ref<number>(0)
    var chapterId = ref<number>(0)
    var contentId = ref<number>(0)
    // score:成绩明细 notes:笔记 video:视频 report: 报告 exam:习题
    var modalType = ref<string>('')
    var modalParam = reactive<ImodalParam>({
      tid: 0,
      type: 'score',
      course_id: props.courseId,
      task_id: props.contentId,
      stu_id: 100,
      evaluteNum: 0
    })
    const form = reactive<Iform>({
      class: '',
      username: '',
      name: '',
      page: 1,
      pageSize: 2
    })
    const tableData = reactive<ItableData>({
      loading: false,
      data: [
        {
          score: 'D',
          show: '11',
          evaluate: 3
        }
      ],
      total: 0
    })
    provide('refresh', (data:any)=>{
      console.log('刷新了。。。', data)
    })
    watch([()=>props.contentId, ()=>props.chapterId,()=>props.courseId], ([nContentId, nChapterId, nCourseId]) => {
      contentId.value = nContentId
      chapterId.value = nChapterId
      courseId.value = nCourseId
      modalParam.course_id = nCourseId
      modalParam.task_id = nContentId
    })
    function handleSearch () {
      console.log(form)
    }
    function hanldeClear () {
      form.class = ''
      form.page = 1
      form.username = ''
      form.name = ''
    }
    function onSelectChange (selectedRowKeys: ColumnProps['key'][]) {
      selectIds.push(...selectedRowKeys)
      console.log(selectedRowKeys)
    }
    function pageChange(val:number){
      form.page = val
    }
    function showSizeChange(val:number, size:number){
      form.pageSize = size
    }
    // 成绩导出
    function handleExport () {
      const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
      let url=`${dev_base_url}/teacher-course/content-export`
      fetch(url,{
          method: 'post',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `content_id=${props.contentId} & course_student_id = ${selectIds}`
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
        content_id: props.contentId
      }
      http.resultCreate({ param: params }).then((res: IBusinessResp) => {
        console.log(res)
        // if (res && res.data) {
        //     console.log('res.data.id')
        //   let timer:any = setInterval(()=>{
        //     console.log('定时器执行')
        //     http.exportTaskView({param: {id: res.data.id}}).then((result:IBusinessResp) => {
        //       if (result && result.data.status == 'finished') {
        //         clearInterval(timer)
        //         timer = null
        //         btnLoading.value = false
        //       }
        //     })
        //   }, 5000)
        // }
      })
    }
    function handleDownload () {
    }
    // 查看最终得分
    function checkDetail (type:string, item:any) {
      openModal.value = true
      modalParam.tid = 505
      modalType.value = type
      if (type == 'evalute') {
        modalParam.evaluteNum = item.evaluate
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
      handleSearch,
      hanldeClear,
      onSelectChange,
      pageChange,
      handleExport,
      handleCreate,
      handleDownload,
      checkDetail,
      handleClose,
      showSizeChange
    }
  },
})
</script>
<style lang="less" scoped>
.evaluteProject{
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
    .linkText{
      cursor: pointer;
      color: @theme-color;
      margin-right: 5px;
      font-size: 14px;
    }
    :deep(.ant-table-thead > tr > th){
      padding: 12px;
    }
    .resultText{
      font-size: 14px;
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
