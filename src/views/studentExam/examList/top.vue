<template>
  <div class="exam-list-top">
    <div class="exam-top-img">
      <img src="../../../assets/exam/top-images.png" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-count">
        <span>总分：{{startExamInfoData?.all_score}}</span>
        <span>试题数量：{{startExamInfoData?.questions_count}}</span>
        <span>通过分数：{{startExamInfoData?.pass_score}}</span>
      </div>
      <div>{{startExamInfoData?.name}}</div>
      <div class="teacher-or-start-status">
        <span><i class="teacher-icon"></i>{{startExamInfoData?.questions_count}}</span>
        <span class="exam-status">{{examStatus}}</span>
      </div>
    </div>
    <div class="exam-action">
      <span class="exam-time">
        <i>{{startExamInfoData?.start_date}}</i>
        {{startExamInfoData?.times}}
      </span>
      <a-button type="primary" @click="showModal">开始考试</a-button>
    </div>
  </div>
  <a-modal
    class="start-modal"
    width="700px"
    v-model:visible="visible"
    title="考试公告"
    @cancel="closeModal"
  >
    <div class="notice-content">
      <p>{{startExamInfoData?.description}}</p>
      <div>
        <p>考试须知:</p>
        <ul>
          <li>1、请使用FireFox或者Chrome浏览器；</li>
          <li>2、请在指定考试时间内完成考试；</li>
          <li>3、考试结束后，不可以再次进行答题。</li>
        </ul>
      </div>
    </div>
    <template v-slot:footer>
      <a-button type="primary" @click="toStartExam">开始考试</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref,inject,Ref,computed } from "vue";
import { useRouter } from "vue-router";
import {startedExam} from "../studentExam.model"
import {TStartedExam} from "../studentExam.type"
import storage from "src/utils/extStorage"
import {contrastTime} from "src/utils/common"

export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);
    const router = useRouter();
    let startExamInfoData:any=inject("startExamInfoData")
    let student_id= storage.lStorage.get("uid")

    const examStatus= computed(()=>{
      if (!startExamInfoData.value.start_day) return "未开始"
      let startTime=new Date(startExamInfoData.value.start_day+startExamInfoData.value.times.split("~")[1])
      return contrastTime(startTime,new Date())?"即将开始":"考试进行中"
    })
    const showModal = () => {
      visible.value = true;
    };
    const closeModal = () => {
      visible.value = false;
    };
    function startExam(){
      let params:TStartedExam={
      urlParams:{
        student_id:student_id,
        exam_id:startExamInfoData?.value.id
      }
    }
      startedExam(params).then((res=>{
        console.log(res);
        
      }))
    }
    function toStartExam() {
      console.log(1111);
      
      startExam()
      router.push({
        path: "/exam/examDoing",
        query:{
          paper_id:startExamInfoData?.value.id
        }
      });
    }
    return {
      visible,
      showModal,
      closeModal,
      toStartExam,
      startExamInfoData,
      examStatus
    };
  },
});
</script>

<style lang="less">
.exam-list-top {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  border-bottom: 1px solid #c5c5dc;
  .exam-info {
    margin-left: 25px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    > div {
      line-height: 45px;
      &.exam-count {
        > span {
          margin-right: 30px;
        }
      }
      &.teacher-or-start-status {
        .teacher-icon {
          display: inline-block;
          background-image: url(/src/assets/exam/teacher.png);
          background-size: 100%;
          width: 24px;
          height: 24px;
          vertical-align: sub;
          margin-right: 3px;
        }
        .exam-status {
          color: @gold-6;
          margin-left: 30px;
        }
      }
    }
  }
  .exam-action {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .exam-time {
      margin-bottom: 30px;
      background: @gold-6;
      border-radius: 20px;
      padding: 5px 10px;
      color: @white;
      i {
        font-style: normal;
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}
.start-modal {
  .ant-modal-header {
    text-align: center;
    border-bottom: none;
  }
  .ant-modal-footer {
    border-top: none;
    text-align: center;
    padding-bottom: 30px;
  }
  .notice-content {
    height: 500px;
    display: flex;
    flex-direction: column;
    > p {
      flex: 1;
      overflow: hidden;
    }
    > div {
      margin-top: auto;
      > p {
        color: @red-6;
      }
    }
  }
}
</style>