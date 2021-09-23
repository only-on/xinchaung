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
        <problem-sets></problem-sets>
      </div>
      <!-- 报告 -->
      <div v-if="modalType == 'report'">
        <report></report>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, Ref, ref, toRefs, watch } from "vue";
import ResultsDetail from "./resultsDetail.vue";
import ProblemSets from "./problemSets.vue"
import Report from './report.vue'
import request from "src/api/index";
import { Ihttp } from "../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import {goHtml} from 'src/utils/common'
interface Itype{
  value: string,
  text: string
}
const options = [
  { label: '不合格', value: '1' },
  { label: '合格', value: '2' },
  { label: '良好', value: '3' },
  { label: '优秀', value: '4' },
];
export default defineComponent({
  components: {
    ResultsDetail,
    ProblemSets,
    Report
  },
  props: ["openModal", "params", "type"],
  setup(props, { emit }) {
    const http = (request as Ihttp).teachCourse;
    var modalVisible: Ref<boolean> = ref(false);
    var scoreData = ref<any>({})
    var modalTitle=ref<string>('')
    var modalType = ref<string>('')
    var typeList = reactive<Itype[]>([
      {
        value: 'score',
        text: '成绩明细'
      },
      {
        value: 'notes',
        text: '实验笔记'
      },
      {
        value: 'video',
        text: '操作视频'
      },
      {
        value: 'report',
        text: '实验报告'
      },
      {
        value: 'exam',
        text: '实验习题'
      },
      {
        value: 'evalute',
        text: '教师评价'
      }
    ])
    var evaluteVal = ref<string>('')
    var notesContent = ref<string>('')
    function handleCancel() {
      modalVisible.value = false
      emit("close");
    }
    // 评价
    function handleOk () {
      let params = {
        course_student_id: props.params.stu_id,
        course_content_record_id: props.params.task_id,
        course_id: props.params.course_id,
        new_score: evaluteVal.value
      }
      http.changeEvaluate({param: params}).then((res:IBusinessResp) => {
        console.log('评价成功')
        handleCancel()
      })
    }
    watch(
      () => props.openModal,
      (newVal) => {
        if (newVal) {
          modalVisible.value = true;
          console.log(props.params)
          console.log(props.type == 'score')
          let params = {
            tid: props.params.tid,
            type: props.type,
            course_id: props.params.course_id,
            task_id: props.params.task_id,
            stu_id: props.params.stu_id,
          }
          if (props.type == 'score') {
            getScore(params)
          } else if (props.type == 'evalute') {
            evaluteVal.value = props.params.evaluteNum + ''
          } else if (props.type == 'notes') {
            getNotes(params)
          }
        }
      }
    );
    // watch(props.params, (newVal) => {
    //   http.getSocre({param: newVal}).then((res:IBusinessResp) => {
    //     scoreData.value = res.data
    //   })
    // });
    watch(()=>props.type, (newVal) => {
      modalType.value = newVal
      modalTitle.value = typeList.filter(item => {
        return item.value == newVal
      })[0].text
    })
    // 成绩明细
    function getScore (params:any) {
      http.getSocre({param: params}).then((res:IBusinessResp) => {
        scoreData.value = res.data
        console.log(scoreData.value)
      })
    }
    // 笔记
    function getNotes (params:any) {
      http.showNotes({param: params}).then((res:IBusinessResp) => {
        if (res && res.data.notes) {
          notesContent.value = goHtml(res.data.notes)
        }
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
      notesContent
    };
  },
});
</script>
<style lang="less" scoped>
.modal {
  .ant-modal-content {
    .ant-modal-close-x {
      height: 40px;
      color: #fff;
      line-height: 40px;
    }
    .radioBox{
      padding-left: 80px;
    }
  }
  :deep(.ant-modal-header) {
    background-color: @theme-color;
    padding: 0;
    height: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-color: #f4f4f4;
    .ant-modal-title {
      line-height: 40px;
      font-weight: bold;
      padding-left: 15px;
      color: #fff;
      font-size: 15px;
    }
  }
}
</style>
