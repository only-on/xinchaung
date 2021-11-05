<template>
  <div class="course-detail-top">
    <div class="course-name-box">
      <span class="course-name"
        >{{ baseInfoData.name }}
        <i :class="['course-status', settingCss(baseInfoData.state)]">
          {{ courseStatus(baseInfoData.state) }}
        </i>
      </span>
      <span class="icon-fanhui iconfont" @click="backToList"></span>
    </div>
    <div class="course-desc">
        <p :title="baseInfoData.introduce">{{baseInfoData.introduce}}</p>
    </div>
    <div class="course-base-info-box">
      <div class="base-left">
        <span>
          <i>{{ baseInfoData.chapter_total }}</i>
          <i>章节</i>
        </span>
        <span>
          <i>{{ baseInfoData.content_total }}</i>
          <i>实验</i>
        </span>
        <span>
          <i>{{ baseInfoData.category ? baseInfoData.category.name : "" }}</i>
          <i>课程方向</i>
        </span>
        <span v-if="currentTab === 'myCourse'">
          <i>{{ baseInfoData.direction ? baseInfoData.direction.name : "" }}</i>
          <i>职业方向</i>
        </span>
        <span v-if="currentTab === 'myCourse'">
          <i
            >{{
              baseInfoData.start_time
                ? baseInfoData.start_time.split(" ")[0]
                : ""
            }}
            -
            {{
              baseInfoData.end_time ? baseInfoData.end_time.split(" ")[0] : ""
            }}</i
          >
          <i>课程时间</i>
        </span>
      </div>
      <div class="base-right">
        <span
          v-if="isReportShow()"
          class="icon-mobandaishezhi iconfont"
          title="选择报告模板"
        ></span>
        <span
          v-if="isEditeShow()"
          class="icon-bianji1 iconfont"
          title="编辑"
          @click="openEditModal"
        ></span>
      </div>
    </div>
  </div>
  <a-modal
    :visible="editVisible"
    @ok="submitEdit"
    @cancel="editCancel"
    :width="800"
    title="编辑基础信息"
  >
  <editcourse-base v-if="editVisible"></editcourse-base>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { getCourseDetailApi } from "./api";
import { useRoute, useRouter } from "vue-router";
import storage from "src/utils/extStorage";
import editCourseBase from "src/components/course/editCourseBase.vue";
type TreactiveData={
    baseInfoData:any,
    editVisible:boolean
}

export default defineComponent({
  components: {
    "editcourse-base": editCourseBase,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const course_id = route.query.course_id as any as number;
    const currentTab = route.query.currentTab;
    const currentRole: number = storage.lStorage.get("role");
    const reactiveData:TreactiveData = reactive({
      baseInfoData: {},
      editVisible: false,
    });
    onMounted(() => {
      getCourseDetail();
    });
    // 获取课程详情
    function getCourseDetail() {
      getCourseDetailApi({ course_id: course_id }).then((res: any) => {
        console.log(res);
        reactiveData.baseInfoData = res.data;
      });
    }
    // 打开编辑modal
    function openEditModal() {
      reactiveData.editVisible = true;
    }
    // 提交编辑
    function submitEdit() {
      reactiveData.editVisible = false;
    }
    // 取消编辑
    function editCancel() {
      reactiveData.editVisible = false;
    }
    // 获取课程css状态
    function settingCss(state: number) {
      const cssObj = {
        1: "finish",
        2: "not-start",
        3: "in-progress",
      };
      return cssObj[state];
    }
    // 获取课程状态
    function courseStatus(state: number) {
      const cssObj = {
        1: "已结束",
        2: "未开始",
        3: "进行中",
      };
      return cssObj[state];
    }
    // 判断编辑按钮是否显示
    const isEditeShow = () => {
      if (![1, 4].includes(currentRole)) {
        return false;
      } else {
        if (currentRole == 1) {
          return true;
        }
        if (currentRole == 4 && currentTab === "myCourse") {
          return true;
        }
        return false;
      }
    };

    // 判断实验报告选择按钮
    const isReportShow = () => {
      if (currentRole == 4 && currentTab === "myCourse") {
        return true;
      }
      return false;
    };
    // 返回
    function backToList() {
      router.go(-1);
    }
    return {
      currentTab,
      ...toRefs(reactiveData),
      courseStatus,
      settingCss,
      isEditeShow,
      isReportShow,
      backToList,
      submitEdit,
      editCancel,
      openEditModal,
    };
  },
});
</script>

<style lang="less">
.course-detail-top {
  height: 189px;
  color: @white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .course-name-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    > span {
      &.course-name {
        font-size: 24px;
        color: #fff;
        line-height: 33px;
        letter-spacing: 2px;
        i {
          right: 0;
          padding: 3px 10px;
          background: #373737;
          font-size: 12px;
          text-align: center;
          vertical-align: text-bottom;
          margin-left: 10px;
          border-radius: 11px;
          height: 22px;
          font-style: normal;
          &.not-start {
            background: @white;
            color: #acacac;
          }

          &.in-progress {
            background: #60ae34;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
            color: @white;
          }

          &.finish {
            background: #4d4d4d;
            color: #8a8a8a;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
          }
        }
      }
      &.icon-fanhui {
        margin-top: 10px;
        margin-left: auto;
        display: inline-block;
        line-height: 40px;
        text-align: center;
        width: 40px;
        height: 40px;
        background: @theme-color;
        border-radius: 50%;
        color: @white;
        cursor: pointer;
        &:hover {
          background: rgba(@theme-color, 0.8);
        }
      }
    }
  }
  .course-base-info-box {
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
    .base-left {
      flex: 1;
      display: flex;
      flex-direction: row;
      > span {
        padding: 0 50px;
        border-right: 1px solid rgba(@white, 0.3);
        text-align: center;
        &:nth-child(1) {
          padding-left: 0;
        }
        &:last-child {
          border-right: none;
        }
        > i {
          font-style: normal;
          display: block;
          &:nth-child(1) {
            font-size: 14px;
          }
          &:nth-child(2) {
            font-size: 14px;
            color: rgba(@white, 0.65);
          }
        }
      }
    }
    .base-right {
      margin-left: auto;
      > span {
        display: inline-block;
        line-height: 40px;
        text-align: center;
        width: 40px;
        height: 40px;
        background: #ff8f00;
        border-radius: 50%;
        margin-left: 24px;
        color: @white;
        cursor: pointer;
        &:hover {
          background: rgba(#ff8f00, 0.8);
        }
      }
    }
  }
}
</style>

