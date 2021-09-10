<template>
  <div class="course-analysis"  v-layout-bg="{bg, size:'234px'}">
    <div class="course-analysis-top">
      <course-detail-top></course-detail-top>
    </div>
    <div class="course-analysis-content">
      <div class="condition">
        <div class="top">
          <div class="stu-gro">
            <span class="active">按学生分析</span>
            <span class="">按班级分析</span>
          </div>
          <div class="chapter">
            <span :class="{active: item.id === currentChapter}" v-for="item in data" :key="item.id" @click="selectChapter(item)">{{item.name}}</span>
          </div>
          <span class="more">更多<span class="icon-zhankai iconfont"></span></span>
        </div>
      </div>
      <div class="analysis-content">
        <div class="analysis-type experiment-typebox">
          <span class="title">实验:</span>
          <div class="experiment-list list" :class="{'noshow-all': !IsShowAllExperimen}">
            <span class="name" :class="{ active: currentExperiment === 0}">全部</span>
            <span class="name" :class="{ active: currentExperiment === list.id }" v-for="list in experimentList" :key="list.id" @click="selectExperiment(list)">{{list.name}}</span>
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
            <span class="active">按学生分析</span>
            <span class="">按班级分析</span>
          </div>
        </div>
        <div class="analysis-type classical-box">
          <span class="title">班级:</span>
          <div class="classical-list list">
            <span class="active">1</span>
            <span class="">2</span>
          </div>
        </div>
        <div class="echarts-box">
          <echarts-bar></echarts-bar>
          <div class="echarts-pie">
            <ratio-distribution :id="id1" :achievement="achievement">
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
            <ratio-distribution :id="id2" :teacherEva="teacherEva">
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
            <ratio-distribution :id="id3" :studentEva="studentEva">
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
        </div>
        <div class="score-box">
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
import score from './score.vue'

export default defineComponent({
  components: { courseDetailTop, echartsBar, ratioDistribution, score },
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
    let currentChapter = ref<number>()
    let currentExperiment = ref<number>(0)
    function getTreeList() {
      TreeTttp.getTreeList({
        param: {endpoint: 'env'}, 
        urlParams: {courseId: courseInfo.courseId}
      }).then((res: IBusinessResp) => {
        treeData.data = res.data
        selectChapter(res.data[0])
      })
    }
    // 点击章节
    function selectChapter(item: ITreeDataItem) {
      currentChapter.value = item.id
      treeData.experimentList = item.contents
      currentExperiment.value = 0
      selectExperiment(item, 'chapter')
    }
    // 点击实验
    function selectExperiment(list: ITreeDataItem, sign?: string) {
      if (sign) {
        getContentList(list.id)
      } else {
        currentExperiment.value = list.id
        getContentScore(list.id)
      }
    }
    function getContentList(id: number) {
      http.getContentList({param: {project_id: id}}).then((res: IBusinessResp) => {
        console.log(res)
        handleData(res.data)
      })
    }
    function getContentScore(id: number) {
      http.getContentScore({
        param: {
          course_id: courseInfo.courseId,
          type: 0,
          content_id: id,
          classes_id: ''
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        handleData(res.data)
      })
    }
    let ratio = reactive({
      achievement: [],
      studentEva: [],
      teacherEva: []
    })
    let score = reactive({
      highScore: [],
      lowScore: []
    })
    function handleData(data) {
      score.highScore = data.high
      score.lowScore = data.low
      ratio.achievement = data.score
      ratio.studentEva = data.student
      ratio.teacherEva = data.teacher
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
      ...toRefs(treeData),
      selectChapter,
      selectExperiment,
      currentChapter,
      currentExperiment,
      showAllExperimen,
      IsShowAllExperimen,
      id1: 'echarts-pie1',
      id2: 'echarts-pie2',
      id3: 'echarts-pie3',
      ...toRefs(score),
      ...toRefs(ratio),
      
    }
  },
}) 
</script>


<style lang="less" scoped>
.course-analysis {
  width: 1330px;
  height: 100%;
  margin: 0 auto;
  .course-analysis-top {
    height: 203px;
    margin-top: -46px;
  }
  .course-analysis-content {
    background-color: @white;
    // height: 100%;
    height: 583px;
    overflow-y: scroll;
    .condition {
      margin: 0 auto;
      width: 1196px;
      padding-top: 40px;
      .top {
        border-bottom: 1px solid #ebebeb;
        display: flex;
        .stu-gro {
          flex-shrink: 0;
          span {  
            padding: 0 10px;
            margin: 0 10px;
            padding-bottom: 5px; 
            color: rgba(0,0,0,.65);
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
            color: rgba(0,0,0,.65);
            cursor: pointer;
            &.active {
              color: @theme-color;
            }
          }
        }
        .more {
          flex-shrink: 0;
          margin-left: auto;
          color: rgba(0,0,0,.65);
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
        padding: 23px 0 16px;
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
            color: rgba(0,0,0,.65);
            margin: 0 12px;
            cursor: pointer;
          }
          .active {
            // padding: 6px 8px;
            background: #8955b5;
            border-radius: 4px;
            color: #fff;
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
        p {
          height: 40px;
          line-height: 40px;
          background: #f7edff;
          border-bottom: 1px solid #dcc0f4;
          color: #8955b5;
          font-size: 16px;
          text-align: center;
        }
      }
    }
    .score-box {
      margin: 0 auto;
      width: 1196px;
      .score {
        margin-top: 45px;
        display: flex;
        p {
          font-size: 16px;
          font-weight: 500;
          color: rgba(0,0,0,0.85);
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
    border-top: 1px solid #dcc0f4;
    border-right: 1px solid #dcc0f4;
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
</style>