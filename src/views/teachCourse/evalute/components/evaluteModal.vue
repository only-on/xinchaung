<template>
  <div class="modal">
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :width="modalType == 'evalute' ? 598 : 998"
    >
      <template #footer>
        <div  v-if="modalType == 'evalute'">
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
        </div>
        <div v-else></div>
      </template>
      <!-- 成绩明细 -->
      <results-detail v-if="modalType == 'score'" :scoreData="scoreData"></results-detail>
      <!-- 教师评价 -->
      <div v-if="modalType == 'evalute'">
        <p>请您给出评价：</p>
        <div class="radioBox">
          <a-radio-group :options="options" v-model:value="evaluteVal"/>
        </div>
      </div>
      <!-- 笔记 -->
      <div v-if="modalType == 'notes'">
        <div v-html="notesContent"></div>
      </div>
      <!-- 习题 -->
      <div v-if="modalType == 'exam'">
        <a-tabs v-model:activeKey="activeTab" :animated="false" @change="changeTab">
          <a-tab-pane key="first" tab="初学" v-if="examTabType.first">
            <exam-list :examData="examData"></exam-list>
          </a-tab-pane>
          <a-tab-pane key="rebuild" tab="重修" v-if="examTabType.rebuild">
            <exam-list :examData="examData"></exam-list>
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- 报告 -->
      <div v-if="modalType == 'report'">
        <report :reportData="reportData"></report>
      </div>
      <!-- 视频 -->
      <div v-if="modalType == 'video'">
        <a-tabs v-model:activeKey="videoActiveTab" :animated="false">
          <a-tab-pane key="first" tab="初学" v-if="videoTabType.first.show">
            <Video :videoUrl="videoTabType.first.url"/>
          </a-tab-pane>
          <a-tab-pane key="rebuild" tab="重修" v-if="videoTabType.rebuild.show">
            <Video :videoUrl="videoTabType.rebuild.url"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, inject } from "vue";
import ResultsDetail from "./resultsDetail.vue";
import Report from './report.vue'
import ExamList from "./examList.vue";
import Video from "./video.vue"
import request from "src/api/index";
import { Ihttp } from "../../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import {goHtml} from 'src/utils/common'
import {options, typeList} from './public'

export default defineComponent({
  components: {
    ResultsDetail,
    Report,
    ExamList,
    Video
  },
  props: ["openModal", "params", "type"],
  setup(props, { emit }) {
    const http = (request as Ihttp).teachCourse;
    const modalVisible = ref<boolean>(false);
    const scoreData = ref<any>({}) // 成绩数据
    const modalTitle=ref<string>('')
    const modalType = ref<string>('')
    const evaluteVal = ref<string>('') // 评价数据
    const notesContent = ref<string>('') // 笔记内容
    const reportData = ref<any>() //报告数据
    const activeTab = ref<string>('first');
    const videoActiveTab = ref<string>('first');
    const examTabType = reactive<any>({
      first: false,
      rebuild: false
    }) // 习题类型，初学/重修
    const examParams = reactive<any>({
      content_id: 0,
      student_id: 0,
      record_ids: []
    })
    const videoTabType =  reactive<any>({
      first: {
        show: false,
        url: ''
      },
      rebuild: {
        show: false,
        url: ''
      }
    }) // 视频类型，初学/重修
    var examData = reactive([])
    const refresh=inject('refresh') as Function
    function handleCancel() {
      modalVisible.value = false
      emit("close");
    }
    watch(
      () => props.openModal,
      (newVal) => {
        if (newVal) {
          modalVisible.value = true;
          if (props.type === 'score') {
            getScore(props.params.stuRecordId)
          } else if (props.type === 'evalute') {
            evaluteVal.value = props.params.evaluteNum + ''
          } else if (props.type === 'notes') {
            getNotes(props.params.noteId)
          } else if (props.type === 'report') {
            getReport(props.params.reportId)
          } else if (props.type === 'video') {
            getVideo(props.params.video_ids)
          } else if (props.type === 'exam') {
            // 习题初学
            let obj = {
              content_id: props.params.content_id,
              student_id: props.params.stu_id,
              record_ids: []
            }
            Object.assign(examParams, obj)
            if (props.params.quest_record_id.length) {
              examTabType.first = true
              activeTab.value = 'first'
              examParams.record_ids = props.params.quest_record_id
            }
            // 习题重修
            if (props.params.quest_rebuild_record_id.length) {
              examTabType.rebuild = true
              if (!examTabType.first) {
                activeTab.value = 'rebuild'
                examParams.record_ids = props.params.quest_rebuild_record_id
              }
            }
            getQuestions(examParams)
          }
        } else {
          modalVisible.value = false;
        }
      }
    );
    watch(()=>props.type, (newVal) => {
      modalType.value = newVal
      modalTitle.value = typeList.filter(item => item.value == newVal)[0].text
    })
    // 成绩明细
    function getScore (params:any) {
      http.getSocre({param: {tid: params}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          scoreData.value = res.data
        }
      })
    }
    // 笔记
    function getNotes (params:any) {
      http.showNotes({param: {id: params}}).then((res:IBusinessResp) => {
        if (res && res.data.notes) {
          notesContent.value = goHtml(res.data.notes)
        }
      })
    }
    // 报告
    function getReport(params:any) {
      http.reportView({param: {id: params}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          reportData.value = res.data
        }
      })
    }
    // 习题:初学/重修 切换
    function changeTab(params:any) {
      if (params == 'first') {
        examParams.record_ids = props.params.quest_record_id
      } else {
        examParams.record_ids = props.params.quest_rebuild_record_id
      }
      getQuestions(examParams)
    }
    // 习题
    function getQuestions(params:any){
      let urlParams = {
        content_id: params.content_id,
        student_id: params.student_id
      }
      examData.length = 0
      http.showQuestions({urlParams:urlParams, param:{record_ids: params.record_ids}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          examData.push(...res.data)
        }
      })
    }
    // 视频
    function getVideo(params:any) {
      http.showVideos({param:{video_ids:params}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          let result = res.data
          for (let i = 0; i < result.length; i++) {
            if (result[i].is_rebuild) {
              videoTabType.rebuild.show = true
              videoTabType.rebuild.url = result[i].path
            } else{
              videoTabType.first.show = true
              videoTabType.first.url = result[i].path
            }
          }
          if (videoTabType.first.show) {
            videoActiveTab.value = 'first'
          } else {
            videoActiveTab.value = 'rebuild'
          }
        }
      })
    }
    // 评价
    function handleOk () {
      let params = {
        id: props.params.stuRecordId,
        new_score: evaluteVal.value
      }
      http.changeEvaluate({param: params}).then((res:IBusinessResp) => {
        refresh()
      })
    }
    return {
      options,
      evaluteVal,
      modalVisible,
      scoreData,
      modalTitle,
      modalType,
      handleOk,
      handleCancel,
      notesContent,
      reportData,
      examTabType,
      activeTab,
      examData,
      videoActiveTab,
      videoTabType,
      changeTab
    };
  },
});
</script>
<style lang="less" scoped>
.radioBox{
  padding-left: 70px;
}
</style>
