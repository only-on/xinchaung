<template>
    <div class="academicAnalysis">
       <div class="tree myChapter textScrollbar">
         <chapterTree :courseId="Number(courseId)" @selectExperiment="selectExperiment" />
       </div>
       <div class="analy-right">
            <div>
                <distributionOfResults v-if="statisData" :legend='legend' :experType='experType' :experitId='experitId' :statisData='statisData'></distributionOfResults>
            </div>
           <div class="achive-detail">
                <div class="achive-detail-header">
                        <div class="headline">
                            成绩详情
                        </div>
                        <div class="header-select">
                          <a-form-item label="班级">
                            <a-input v-model:value='className'  @keyup.enter="onSearch"></a-input>
                          </a-form-item>
                    </div>
                </div>
                <div class="tableHeight">
                  <a-config-provider>
                      <a-table
                        rowKey='username'
                        :columns="columns"
                        :data-source="data"
                        :pagination="
                          tableData.total > 10
                            ? {
                                hideOnSinglePage: false,
                                showSizeChanger:false,
                                total: tableData.total,
                                current: tableData.page,
                                pageSize: tableData.limit,
                                onChange: onChange,
                                onShowSizeChange: onShowSizeChange,
                              }
                            : false
                            "
                          >
                          </a-table>
                        <template #renderEmpty>
                          <div><Empty :height='80' :text='ifSearch?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
                        </template>
                      </a-config-provider> 
                </div>
            </div> 
       </div>
    </div>
</template>
<script lang="ts" setup>
import distributionOfResults from './distributionOfResults/index.vue'
import { ref, toRefs, onMounted,reactive} from "vue";
import chapterTree from "../courseDetail/components/Chapter/ChapterList.vue";
import { useRouter ,useRoute } from 'vue-router';
import request from 'src/api/index'
const http=(request as any).teacherAcademicAnalysis;
const http1=(request as any).teachCourse;
const route=useRoute()
const courseId:any=route.query.courseId
const chartLoading:any=ref(false)
const ChaptersTreeList:any=ref([])
const Editable:any=ref(false)
const option: any = ref();
const experitId:any=ref('0')
const experType:any=ref()
const className:any=ref('')
const ifSearch:any=ref(false)
const legend1:any=ref(['最终成绩', '实验报告', '自动评分', '随测'])
const legend:any=ref()
option.value = [
  { id: "", name: "全部" },
  { id: 1, name: "班级1" },
  { id: 2, name: "班级2" },
  { id: 3, name: "班级3" },
];

const columns: any = ref();
const data: any = ref([]);
const echartsData:any=ref()
const statisData:any=ref()
echartsData.value={
          maxScore:0,
          statisData:0,
          avgScore:0,
          ExperimentalReportSubmissionRate:0,
          inClassTestAccuracyRate:0,
          automaticScoringCorrectRate:0,
          finalScoreDistributionOfScores:[],
          experimentalReportDistributionOfScores:[],
          automaticScoringDistributionOfScores:[],
          inClassTestDistributionOfScores:[]
        }
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
const columns1:any= [
  {
    title: "学号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "className",
    key: "className",
  },
  {
    title: "成绩",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "自动评分得分",
    dataIndex: "automaticScore",
    key: "automaticScore",
  },
  {
    title: "报告得分",
    dataIndex: "reportScore",
    key: "reportScore",
  },
  {
    title: "随测得分",
    dataIndex: "inClassTestScore",
    key: "inClassTestScore",
  },
];

function onChange(page: any, pageSize: any) {
  tableData.page=page
  getStugrandsList()
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
  getStugrandsList()
}
function getStugrandsList(){
  http.stuGrandsList({urlParams:{content_id:experitId.value},param:{className:className.value,limit:tableData.limit,page:tableData.page}}).then((res:any)=>{
    if(res.code==1){
      data.value=res.data.list
      tableData.total=res.data.page?.totalCount
    }
  })
}
function onSearch(){
  tableData.page=1
  if(className.value){
    ifSearch.value=true
  }else{
    ifSearch.value=false
  }
  getStugrandsList()
}
const columnDataShow:any=ref([])
function getStuStatis(){
    http.grandsStatisAnalysis({urlParams:{content_id:experitId.value}}).then((res:any)=>{
      console.log(res.data?.length,'res.data?.length')
      columns.value=columns1
      legend.value=legend1.value
      if(res.code&&res.data?.length!==0){
        statisData.value=res.data
        //过滤columns
        if(res.data?.automaticScoringCorrectRate==null){
          columns.value=columns.value.filter((item:any)=>{
            return item.key!=='automaticScore'
          })
          legend.value=legend.value.filter((jt:any)=>{
            return jt!=='自动评分'
          })
        }
        if(res.data?.experimentalReportSubmissionRate==null){
          columns.value=columns.value.filter((item:any)=>{
            return item.key!=='reportScore'
          })
          legend.value=legend.value.filter((jt:any)=>{
            return jt!=='实验报告'
          })
        }
        if(res.data?.inClassTestAccuracyRate==null){
          columns.value=columns.value.filter((item:any)=>{
            return item.key!=='inClassTestScore'
          })
          legend.value=legend.value.filter((jt:any)=>{
            return jt!=='随测'
          })
        }
      }else{
        statisData.value=echartsData.value
      }
    })
}
function selectExperiment(val: any) {
  console.log(val);
  experitId.value=val.id
  experType.value=val.type
  getStuStatis()
  getStugrandsList()
}
</script>
<style lang="less" scoped>
.academicAnalysis{
    width: 100%;
    display: flex;
}
   .tree{
       width: 300px;
       padding: 24px;
       margin-right: 16px;
       background-color: var(--white-100);
   } 
   .myChapter{
        padding:0 24px;
        min-height:700px;
        max-height: 850px;
        overflow: auto;
        // padding-right: 10px;
      }
   .analy-right{
       flex: 1;
       background-color: var(--white-100);
       padding: 24px;
   }
   .achive-detail-header{
       display: flex;
       justify-content: space-between;
       margin-top: 30px;
       .headline{
           font-size: 16px;
           font-weight: 400;
       }
       .lableclass{
           margin-right: 10px;
       }
   }
   .header-select{
     display: flex;
   }
   .tableHeight{
     height:400px;
     overflow-y: auto;
   }
</style>