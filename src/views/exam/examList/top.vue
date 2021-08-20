<template>
  <div class="exam-list-top">
    <div class="exam-top-img">
      <img src="../../../assets/exam/top-images.png" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-count">
        <span>总分：12</span>
        <span>试题数量：1</span>
        <span>通过分数：6</span>
      </div>
      <div>试卷名称</div>
      <div class="teacher-or-start-status">
        <span><i class="teacher-icon"></i>文和</span>
        <span class="exam-status">即将开始</span>
      </div>
    </div>
    <div class="exam-action">
      <span class="exam-time">
        <i>2021.08.19</i>
        10:10 ~ 10:12
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
      <p>考试描述</p>
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
      <a-button type="primary" @click="startExam">开始考试</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);
    const router = useRouter();
    const showModal = () => {
      visible.value = true;
    };
    const closeModal = () => {
      visible.value = false;
    };
    function startExam() {
      router.push({
        path: "/exam/examDoing",
      });
    }
    return {
      visible,
      showModal,
      closeModal,
      startExam,
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