<template>
    <div class="academicAnalysis">
       <div class="tree">
        <!-- <chapterTree
          :chartLoading="chartLoading"
          :chapterList="ChaptersTreeList"
          @selectExperiment="selectExperiment" 
         /> -->
         <chapterTree :courseId="courseId" @selectExperiment="selectExperiment" />
       </div>
       <div class="analy-right">
            <div>
                <distributionOfResults v-if="statisData" :statisData='statisData'></distributionOfResults>
            </div>
           <div class="achive-detail">
                <div class="achive-detail-header">
                        <div class="headline">
                            成绩详情
                        </div>
                        <div class="header-select">
                            <span class="lableclass">班级</span>
                            <a-select default-value="全部" style="width: 224px" @change="handleChange">
                                <a-select-option v-for="item in option" :key="item.id"
                                >{{ item.name }}
                                </a-select-option>
                            </a-select>
                    </div>
                </div>
                <a-table
      rowKey='username'
      :columns="columns"
      :data-source="data"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
              current: tableData.page,
              pageSize: tableData.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
    >
    <!-- <template #action='{record}'>
      <div class="action">
        <span class='delete' @click="deleteStu(record.id)">删除</span>
        <span @click="initPassward">初始化密码</span>
      </div>
    </template> -->
    </a-table>
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
const experitId:any=ref('')
option.value = [
  { id: "", name: "全部" },
  { id: 1, name: "班级1" },
  { id: 2, name: "班级2" },
  { id: 3, name: "班级3" },
];

const columns: any = ref();
const data: any = ref([]);
const statisData:any=ref()
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
columns.value = [
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
];
function handleChange(){

}
function onChange(){

}
function onShowSizeChange(){

}
function getChapterList(){
  http1.getChaptersTree({urlParams:{courseId:courseId}}).then((res:any)=>{
    console.log(res)
    ChaptersTreeList.value=res.data
  })
}
function getStugrandsList(){
  http.stuGrandsList({urlParams:{content_id:experitId.value}}).then((res:any)=>{
    if(res.code==1){
      data.value=res.data.list
    }
  })
}
function getStuStatis(){
    http.grandsStatisAnalysis({urlParams:{content_id:experitId.value}}).then((res:any)=>{
      if(res.code==1){
        statisData.value=res.data
      }
    })
}
function selectExperiment(val: any) {
  console.log(val);
  experitId.value=val.id
  getStuStatis()
  getStugrandsList()
}
onMounted(()=>{
  // getChapterList()
})
</script>
<style lang="less" scoped>
.academicAnalysis{
    width: 100%;
    height: 676px;
    display: flex;
}
   .tree{
       width: 300px;
       padding: 24px;
       margin-right: 16px;
       background-color: var(--white-100);
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
</style>