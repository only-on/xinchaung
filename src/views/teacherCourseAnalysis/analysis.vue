<template>
  <div class="course-analysis"  v-layout-bg="{bg, size:'234px'}">
    <div class="course-analysis-top">
      <course-detail-top :courseInfo="courseInfo"></course-detail-top>
    </div>
    <div class="course-analysis-content">
      <div class="condition">
        <div class="top">
          <!-- <div class="stu-gro">
            <span :class="{active: isStudentType === 1}" @click="selectStudentType(1)">按学生分析</span>
            <span :class="{active: isStudentType === 2}" @click="selectStudentType(2)">按班级分析</span>
          </div> -->
          <!-- <div class="chapter">
            <span :class="{active: item.id === currentChapter}" v-for="item in data" :key="item.id" @click="selectChapter(item)">{{item.name}}</span>
          </div>
          <span class="more">更多<span class="icon-zhankai iconfont"></span></span> -->
          <a-tabs
            :default-active-key="currentChapter"
            @change="change"
          >
            <a-tab-pane v-for="(item) in data" :key="item.id" :tab="item.name"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="analysis-content setScrollbar">
        <div class="analysis-type experiment-typebox">
          <span class="title">实验:</span>
          <div class="experiment-list list" :class="{'noshow-all': !IsShowAllExperimen}">
            <span class="name" :class="{ active: currentExperiment === 0}" @click="selectExperiment(currentChapter, 'chapter')">全部</span>
            <span class="name" :class="{ active: currentExperiment === list.labelId }" v-for="list in experimentList" :key="list.labelId" @click="selectExperiment(list.labelId)">{{list.labelName}}</span>
          </div>
          <span class="open-close-btn" @click="showAllExperimen()">
            {{IsShowAllExperimen ? '收起' : '展开'}}
            <span class="icon-zhankai iconfont" v-if="!IsShowAllExperimen"></span>
            <span class="icon-shouqi iconfont" v-if="IsShowAllExperimen"></span>
          </span>
        </div>
        <div class="analysis-type type-box">
          <span class="title">类型:</span>
          <div class="type-list list">
            <span :class="{active: isStudentType === 0}" @click="selectStudentType(0)">按学生分析</span>
            <span :class="{active: isStudentType === 1}" @click="selectStudentType(1)">按班级分析</span>
          </div>
        </div>
        <div class="analysis-type classical-box" v-if="isStudentType === 1">
          <span class="title">班级:</span>
          <div class="classical-list list">
            <span class="active">1</span>
            <span class="">2</span>
          </div>
        </div>
        <div class="echarts-box">
          <echarts-bar v-if="isStudentType === 1 &&  type === 1"></echarts-bar>
          <div class="echarts-pie" v-if="type === 1 || isStudentType === 0">
            <ratio-distribution :id="id1" :achievement="achievement" :key="id1">
              <template v-slot:title>
                <p>成绩比例分布</p>
              </template>
              <template v-slot:default>
                <div class="achievement">
                  <a-row>
                    <a-col >成绩</a-col>
                    <a-col >A</a-col>
                    <a-col >B</a-col>
                    <a-col >C</a-col>
                    <a-col >D</a-col>
                  </a-row>
                  <a-row>
                    <a-col >学生数</a-col>
                    <a-col v-for="(score, index) in achievement" :key="index">{{score}}</a-col>
                  </a-row>
                </div>
              </template>
            </ratio-distribution>
            <ratio-distribution :id="id2" :teacherEva="teacherEva" :key="id2">
              <template v-slot:title>
                <p>教师评价比例分布</p>
              </template>
              <template v-slot:default>
                <div class="grade">
                  <a-row>
                    <a-col :span="4">评级</a-col>
                    <a-col :span="4">优秀</a-col>
                    <a-col :span="4">良好</a-col>
                    <a-col :span="4">合格</a-col>
                    <a-col :span="4">不合格</a-col>
                    <a-col :span="4">未评价</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="4">学生数</a-col>
                    <a-col v-for="(score, index) in teacherEva" :key="index">{{score}}</a-col>
                  </a-row>
                </div>
              </template>
            </ratio-distribution>
            <ratio-distribution :id="id3" :studentEva="studentEva" :key="id3">
              <template v-slot:title>
                <p>学生自评比例分布</p>
              </template>
              <template v-slot:default>
                <div class="start">
                  <a-row>
                    <a-col >星级</a-col>
                    <a-col >一星</a-col>
                    <a-col >二星</a-col>
                    <a-col >三星</a-col>
                    <a-col >四星</a-col>
                    <a-col >五星</a-col>
                    <a-col >未评价</a-col>
                  </a-row>
                  <a-row>
                    <a-col >学生数</a-col>
                    <a-col v-for="(score, index) in studentEva" :key="index">{{score}}</a-col>
                  </a-row>
                </div>
              </template>
            </ratio-distribution>
          </div>
          <div class="echarts-bar" v-if="isStudentType === 0">
            <experimentRatio v-for="(ratio, i) in experimentRatioIds" :id="ratio" :key="i" :experimentRatioTable="experimentRatioTable[i]">
              <template v-slot:title>
                <p>{{experimentRatioTitle[i]}}</p>
              </template>
              <template v-slot:default>
                <div class="bottom-table">
                  <a-row>
                    <a-col :span="12">{{experimentRatioTable[i].names[0]}}</a-col>
                    <a-col :span="12">{{experimentRatioTable[i].names[1]}}</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="12">{{experimentRatioTable[i].values[0]}}</a-col>
                    <a-col :span="12">{{experimentRatioTable[i].values[1]}}</a-col>
                  </a-row>
                </div>
              </template>
            </experimentRatio>
          </div>
        </div>
        <div class="score-box" v-if="type === 1 || isStudentType === 0">
          <div class="score">
            <div class="high">
              <p>最高分</p>
              <score :dataSource="highScore"></score>
            </div>
            <div class="low">
              <p>最低分</p>
              <score :dataSource="lowScore"></score>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import bg from 'src/assets/images/studentcourse/course-detail_bg.jpg'
import { defineComponent, inject, onMounted, reactive, toRefs, ref } from 'vue'
import courseDetailTop from './courseDetailTop.vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ICourseAnalysisHttp, ITreeHttp, ICourseInfo, ITreeData, ITreeDataItem } from './typings'
import echartsBar from './echartsBar.vue'
import ratioDistribution from './ratioDistribution.vue'
import experimentRatio from './experimentRatio.vue'
import score from './score.vue'

export default defineComponent({
  components: { courseDetailTop, echartsBar, ratioDistribution, score, experimentRatio },
  setup() {
    let courseInfo = reactive<ICourseInfo>({
      type: 'course',
      courseType: 1,
      courseId: 501703,
    })
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})

    const http=(request as ICourseAnalysisHttp).teacherCourseAnalysis

    const TreeTttp=(request as ITreeHttp).courseTree
    // 课程目录树
    let treeData = reactive<ITreeData>({
      data: [],
      experimentList: []
    })
    let currentChapter = ref<number>(0)
    let currentExperiment = ref<number>(0)
    let isStudentType = ref<number>(0)
    function getTreeList() {
      TreeTttp.getTreeList({
        param: {endpoint: 'env'}, 
        urlParams: {courseId: courseInfo.courseId}
      }).then((res: IBusinessResp) => {
        treeData.data = res.data
        // selectChapter(res.data[0])
        change(res.data[0].id)
      })
    }

    function change(id: number) {
      currentChapter.value = id
      selectExperiment(id, 'chapter')
    }
    // 点击章节
    function selectChapter(item: ITreeDataItem) {
      currentChapter.value = item.id
      // treeData.experimentList = item.contents
      selectExperiment(item.id, 'chapter')
    }
    // 点击实验
    function selectExperiment(id: number, sign?: string) {
      if (isStudentType.value === 1 && type.value === 0) return
      if (sign) {
        currentExperiment.value = 0
        getContentList(id)
      } else {
        currentExperiment.value = id
        getContentScore(id)
      }
    }
    // 
    function getContentList(id: number | undefined) {
      http.getContentList({param: {project_id: id}}).then((res: IBusinessResp) => {
        console.log(res)
        handleData(res.data)
      })
    }
    function getContentScore(id: number) {
      http.getContentScore({
        param: {
          course_id: courseInfo.courseId,
          type: isStudentType.value,
          content_id: id,
          classes_id: 0
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        handleData(res.data)
      })
    }
    
    let ratio = reactive({
      achievement: [],  // 成绩比例分布
      studentEva: [],
      teacherEva: []
    })
    let score = reactive({   // 最高分 最低分
      highScore: [],
      lowScore: []
    })

    let experimentRatioTable = reactive([  
      {names: ["40分钟以下学生数","40分钟以上学生数"], values: [30, 10]},    // 用时比例分布
      {names: ["已提交学生数","未提交学生数"], values: [30, 10]},
      {names: ["全部正确学生数","有错误学生数"], values: [30, 10]},
      {names: ["全部正确学生数","有错误学生数"], values: [30, 10]}])
    let type = ref(0)  //0的时候 只有学生分析 1的时候 学生，班级都有
    function handleData(data: any) {
      if (data.list) {
        treeData.experimentList = data.list
      }
      if(!data.student.length) return
      type.value = 1
      score.highScore = data.high
      score.lowScore = data.low
      ratio.achievement = data.score
      ratio.studentEva = data.student
      ratio.teacherEva = data.teacher
      experimentRatioTable[0].values = data.time ? data.time : data.list_score.time
      experimentRatioTable[1].values = data.report ? data.report : data.list_score.report
      experimentRatioTable[2].values = data.question ? data.question : data.list_score.question
      experimentRatioTable[3].values = data.step ? data.step : data.list_score.step
    }
    // 选择学生或班级分析
    function selectStudentType(t: number) {
      isStudentType.value = t
      currentExperiment.value = 0
      if (t === 0) {   // 按学生分析
        getContentList(currentChapter.value)
      // } else if (t === 1 && type.value === 1) {
      } else {
        getContentList(currentChapter.value)
      }
    }

    // 展开实验
    let IsShowAllExperimen = ref(false)
    function showAllExperimen() {
      IsShowAllExperimen.value = !IsShowAllExperimen.value
    }

    onMounted(() => {
      getTreeList()
    })
    
    return {
      bg,
      courseInfo,
      ...toRefs(treeData),
      selectChapter,
      selectExperiment,
      currentChapter,
      currentExperiment,
      isStudentType,
      selectStudentType,
      showAllExperimen,
      IsShowAllExperimen,
      id1: 'echarts-pie1',
      id2: 'echarts-pie2',
      id3: 'echarts-pie3',
      experimentRatioIds: ['echarts-bar1', 'echarts-bar2', 'echarts-bar3', 'echarts-bar4'],
      experimentRatioTitle: ['任务用时比例分布', '任务报告比例分布', '任务习题比例分布', '任务步骤比例分布'],
      experimentRatioTable,
      ...toRefs(score),
      ...toRefs(ratio),
      type,
      change,
    }
  },
}) 
</script>


<style lang="less" scoped>
@opacity65-color: rgba(0,0,0,.65);
@opacity85-color: rgba(0,0,0,.85);
@echart-title-bgcolor: #f7edff;
@echart-table-bordercolor: #dcc0f4;
.course-analysis {
  width: @center-width;
  height: 100%;
  margin: 0 auto;
  .course-analysis-top {
    // height: 203px;
    // margin-top: -46px;
    height: 157px;
  }
  .course-analysis-content {
    background-color: @white;
    // height: 100%;
    // height: 583px;
    // overflow-y: scroll;
    .condition {
      margin: 0 auto;
      width: 1196px;
      padding-top: 20px;
      .top {
        border-bottom: 1px solid #ebebeb;
        display: flex;
        .stu-gro {
          flex-shrink: 0;
          span {  
            padding: 0 10px;
            margin: 0 10px;
            padding-bottom: 5px; 
            color: @opacity65-color;
            cursor: pointer;
            &.active {
              border-bottom: 1px solid @theme-color;
            }
          }
        }
        .chapter {
          width: 100%;
          span {  
            padding: 0 10px;
            margin: 0 10px;
            padding-bottom: 5px; 
            color: @opacity65-color;
            cursor: pointer;
            &.active {
              color: @theme-color;
            }
          }
        }
        .more {
          flex-shrink: 0;
          margin-left: auto;
          color: @opacity65-color;
          cursor: pointer;
          .iconfont {
            font-size: 12px;
            margin: 0 55px 0 6px;
          }
        }
      }
    }
    .analysis-content {
      margin: 0 auto;
      width: 1196px;
      height: 520px;
      overflow-y: auto;
      overflow-x: hidden;
      .analysis-type {
        display: flex;
        padding-top: 23px;
        border-bottom: 1px dashed #e9e9e9;
        span {
          padding: 6px 8px;
        }       
        .title {
          margin: 0 16px;
          flex-shrink: 0;
        }
        .list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          span {
            color: @opacity65-color;
            margin: 0 12px;
            cursor: pointer;
          }
          .active {
            // padding: 6px 8px;
            background: @theme-color;
            border-radius: 4px;
            color: @white;
          }
        }
      }
      
      .experiment-typebox {
        .experiment-list {
          width: 100%;
          flex-wrap: wrap;
          // line-height: 26px;
          display: flex;
          &.noshow-all {
            height: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .open-close-btn {
          color: @theme-color;
          font-size: 14px;
          margin-top: auto;
          margin-left: 10px;
          cursor: pointer;
          flex-shrink: 0;
          .iconfont {
            font-size: 12px;
            margin: 0 30px 0 5px;
          }
        }
      } 
    }
    .echarts-box {
      margin: 0 auto;
      width: 1196px;
      .echarts-pie {
        margin-top: 45px;
        display: flex;
        justify-content: center;
        p {
          height: 40px;
          line-height: 40px;
          background: @echart-title-bgcolor;
          border-bottom: 1px solid @echart-table-bordercolor;
          color: @theme-color;
          font-size: 16px;
          text-align: center;
        }
      }
    }
    .score-box {
      margin: 0 auto;
      width: 1196px;
      margin-bottom: 40px;
      .score {
        margin-top: 45px;
        display: flex;
        padding: 0 30px;
        p {
          font-size: 16px;
          font-weight: 500;
          color: @opacity85-color;
          margin: 0;
        }
        .high {
          flex: 1;
          margin-right: 160px;
        }
        .low {
          flex: 1;
        }
      }
    }
  }
}
.achievement {
  :deep(.ant-row) {
    .ant-col {
      width: 20%;
    }
  }
}
.grade {
  :deep(.ant-row) {
    .ant-col {
      width: 16.66666667%;
    }
  }
}
.start {
  :deep(.ant-row) {
    .ant-col {
      width: 14.2857%;
    }
  }
}
:deep(.ant-row) {
  .ant-col {
    width: 20%;
    height: 32px;
    text-align: center;
    border-top: 1px solid @echart-table-bordercolor;
    border-right: 1px solid @echart-table-bordercolor;
    line-height: 32px;
    font-size: 16px;
    color: #050101;
    &:last-child {
      border-right: none;
    }
    &:first-child {
      color: @theme-color;
    }
  }
}
.echarts-bar {
  display: flex;
  justify-content: center;
  margin-top: 35px;
  p {
    height: 51px;
    line-height: 51px;
    background: @echart-title-bgcolor;
    // border-bottom: 1px solid #dcc0f4;
    color: @theme-color;
    font-size: 16px;
    text-align: center;
    margin-bottom: 0;
  }
  :deep(.ant-row) {
    &:first-child {
      .ant-col {
        color: @theme-color;
      }
    }
    &:nth-child(2) {
      .ant-col {
        color: @opacity65-color;
      }
    }
     .ant-col {
      font-size: 14px;
      height: 57px;
      line-height: 57px;
    }
  }
}
:deep(.ant-tabs-nav) {
  .ant-tabs-tab {
    font-size: 14px;
    color: @opacity65-color;
  }
  .ant-tabs-tab-active {
    color: @theme-color;
  }
}
:deep(.ant-tabs-bar) {
  margin: 0;
}
.navList {
  margin: 0;
}
</style>