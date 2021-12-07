<template>
  <div class="course-detail-top">
    <div class="course-name-box">
      <span class="course-name"
        >{{ baseInfoData.name }}
        <i v-if="!baseInfoData.is_init" :class="['course-status', settingCss(baseInfoData.state)]">
          {{ courseStatus(baseInfoData.state) }}
        </i>
      </span>
      <span class="icon-fanhui iconfont" @click="backToList"></span>
    </div>
    <div class="course-desc">
      <p :title="baseInfoData.introduce">{{ baseInfoData.introduce }}</p>
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
        <span v-if="!baseInfoData.is_init">
          <i
            >{{ moment(baseInfoData.start_time).format("YYYY-MM-DD") }}
            -
            {{ moment(baseInfoData.end_time).format("YYYY-MM-DD") }}</i
          >
          <i>课程时间</i>
        </span>
      </div>
      <div class="base-right">
        <span
          v-role="[tab]"
          class="icon-mobandaishezhi iconfont"
          title="选择报告模板"
          @click="openSelectReport"
        ></span>
        <span
          v-role="[tab]"
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
    <editcourse-base
      v-model="formData"
      v-if="editVisible"
      v-model:checkout="checkout"
    ></editcourse-base>
  </a-modal>
  <a-modal
    title="选择实验报告"
    :visible="reportVisible"
    :footer="null"
    :width="800"
    class="report-modal"
    @cancel="closeReportModal"
  >
    <select-report @close="closeReportModal" type="course"></select-report>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch, ref,inject } from "vue";
import { getCourseDetailApi, updateCourseBaseApi } from "./api";
import { useRoute, useRouter } from "vue-router";
import storage from "src/utils/extStorage";
import editCourseBase from "src/components/course/editCourseBase.vue";
import moment from "moment";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";
import selectReport from "../courseExperiment/components/selectReport.vue";
type TreactiveData = {
  baseInfoData: any;
  editVisible: boolean;
  reportVisible: boolean;
};

export default defineComponent({
  components: {
    "editcourse-base": editCourseBase,
    "select-report": selectReport,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const course_id = route.query.course_id as any as number;
    const currentTab = route.query.currentTab;
    const currentRole: number = storage.lStorage.get("role");
    const formData = ref({});
    const checkout = ref({});
    // const tab = ref(-1);
    const reactiveData: TreactiveData = reactive({
      baseInfoData: {},
      editVisible: false,
      reportVisible: false,
    });
    onMounted(() => {
      getCourseDetail();
    });
    const tab=inject("tab")
    // watch(
    //   () => currentTab,
    //   () => {
    //     if (currentTab === "myCourse") {
    //       tab.value = 0;
    //     }
    //     if (currentTab === "initCourse") {
    //       tab.value = 1;
    //     }
    //   },
    //   { immediate: true }
    // );
    // 获取课程详情
    function getCourseDetail() {
      getCourseDetailApi({ course_id: course_id }).then((res: any) => {
        reactiveData.baseInfoData = res.data;
        (reactiveData.baseInfoData as any).created_at = moment(
          res.data.start_time
        );
        (reactiveData.baseInfoData as any).end_time = moment(res.data.end_time);
      });
    }
    // 打开编辑modal
    function openEditModal() {
      formData.value = cloneDeep(reactiveData.baseInfoData);
      reactiveData.editVisible = true;
    }
    // 提交编辑
    function submitEdit() {
      if (Object.keys(checkout.value).length === 0) {
        console.log(formData.value);
        
        const param = {
          name: (formData.value as any).name,
          start_time: moment((formData.value as any).created_at).format(
            "YYYY-MM-DD 00:00:00"
          ),
          end_time: moment((formData.value as any).end_time).format(
            "YYYY-MM-DD 23:59:59"
          ),
          introduce: (formData.value as any).introduce,
          course_category_id: (formData.value as any).course_category_id,
          course_direction_id: (formData.value as any).course_direction_id,
          url: (formData.value as any).url,
        };
        if (param.introduce) {
          if (param.introduce.length > 100) {
            message.warning("课程介绍长度不能超过100字符");
            return;
          }
        }
        let params = {
          urlParams: {
            course_id: course_id,
          },
          param: param,
        };
        updateCourseBaseApi({ ...params }).then((res: any) => {
          reactiveData.editVisible = false;
          reactiveData.baseInfoData = cloneDeep(formData.value);
        });
      } else {
        if ((checkout.value as any).errorFields[0]) {
          message.warn((checkout.value as any).errorFields[0].errors[0]);
        }
      }
    }
    // 取消编辑
    function editCancel() {
      reactiveData.editVisible = false;
    }
    // 打开更换实验报告弹窗
    function openSelectReport() {
      reactiveData.reportVisible = true;
    }
    // 关闭实验报告弹窗
    function closeReportModal() {
      reactiveData.reportVisible = false;
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
      if (![1, 3].includes(currentRole)) {
        return false;
      } else {
        if (currentRole == 1) {
          return true;
        }
        if (currentRole == 3 && currentTab === "myCourse") {
          return true;
        }
        return false;
      }
    };

    // 判断实验报告选择按钮
    const isReportShow = () => {
      if (currentRole == 3 && currentTab === "myCourse") {
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
      moment,
      formData,
      checkout,
      openSelectReport,
      closeReportModal,
      tab,
    };
  },
});
</script>

<style lang="less">
.course-detail-top {
  height: 205px;
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

