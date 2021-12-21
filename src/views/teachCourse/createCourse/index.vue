<template>
  <div v-layout-bg="{ size: '234px', bg: bg }" class="create-course-box">
    <a-steps :current="currentStep" class="create-steps-box">
      <template #progressDot="{ prefixCls }">
        <span :class="`${prefixCls}-icon-dot`" />
      </template>
      <a-step title="设置基本信息" />
      <a-step title="设置课程实验" />
      <a-step title="设置课程成员" />
      <a-step title="完成" />
    </a-steps>
    <div class="create-course-main">
      <template v-if="currentStep === 0">
        <edit-course-base ref="createForm" :type="true" v-model="baseInfo" />
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="next">下一步</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </template>
      <template v-if="currentStep === 1">
        <course-experiment />
        <div class="first-step-btn">
          <a-button @click="last">上一步</a-button>
          <a-button type="primary" @click="next">下一步</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <customer-infor :trainId="course_id" />
        <div class="first-step-btn">
          <a-button @click="last">上一步</a-button>
          <a-button type="primary" @click="next">下一步</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </template>
      <template v-if="currentStep === 3">
        <div class="finish-step-box">
          <img :src="finishBg" alt="" srcset="" />
          <p>干的漂亮。课程已创建成功！</p>
          <div class="finish-step-btn">
            <a-button type="primary" @click="goAdd">继续添加</a-button>
            <a-button type="primary" @click="lookCourse">查看课程</a-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  reactive,
  toRefs,
  watch,
  provide,
  onMounted,
} from "vue";
import bg from "src/assets/common/course-detail_bg.jpg";
import editCourseBase from "src/components/course/editCourseBase.vue";
import courseExperiment from "../courseExperiment/courseExperiment.vue";
import customerInfor from "src/views/teacherTrain/detail/customerInfor/index.vue";
import { useRouter, useRoute } from "vue-router";
import { createCourseBaseApi, updateCourseBaseApi } from "./api";
import { getCourseDetailApi } from "../courseDetail/api";
import { cloneDeep } from "lodash";
import moment from "moment";
import finishBg from "src/assets/images/teacherCourse/finishBg.png";
export default defineComponent({
  components: {
    "edit-course-base": editCourseBase,
    "course-experiment": courseExperiment,
    "customer-infor": customerInfor,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    let course_id: any = ref("");
    const tab = ref(0);
    watch(
      () => route.query,
      () => {
        course_id.value = route.query.course_id as any as number;
      },
      { deep: true, immediate: true }
    );
    provide("course_id", course_id.value);
    provide("tab", tab);
    var updata = inject("updataNav") as Function;
    const tabRef = ref(null);
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const reactiveData = reactive({
      currentStep: 0,
      baseInfo: {},
      createForm: null,
    });

    onMounted(() => {
      if (course_id.value) {
        getCourseDetail();
      }
    });
    // 获取课程详情
    function getCourseDetail() {
      getCourseDetailApi({ course_id: course_id.value }).then((res: any) => {
        reactiveData.baseInfo = res.data;
        (reactiveData.baseInfo as any).created_at = moment(res.data.created_at);
        (reactiveData.baseInfo as any).end_time = moment(res.data.end_time);
      });
    }
    function cancel() {
      router.push({
        path: "/teacher/teacherCourse",
      });
    }

    function save() {
      if (reactiveData.currentStep === 0) {
        (reactiveData.createForm as any)
          .validate()
          .then((res: any) => {
            let baseInfo: any = cloneDeep(reactiveData.baseInfo);
            const body = new FormData();
            body.append("name", baseInfo.name);
            body.append(
              "start_time",
              moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00"
            );
            body.append(
              "end_time",
              moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59"
            );
            body.append("introduce", baseInfo.introduce);
            body.append("course_category_id", baseInfo.course_category_id);
            body.append("course_direction_id", baseInfo.course_direction_id);
            body.append("url", baseInfo.url);
            let params: any = {
              name: baseInfo.name,
              start_time:
                moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00",
              end_time:
                moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59",
              introduce: baseInfo.introduce,
              course_category_id: baseInfo.course_category_id,
              course_direction_id: baseInfo.course_direction_id,
              url: baseInfo.url,
              is_available: 1,
            };
            if (course_id.value) {
              updateCourseBaseApi(params, { course_id: course_id.value }).then(
                (res: any) => {
                  router.push({
                    path: "/teacher/teacherCourse",
                  });
                }
              );
            } else {
              body.append("is_available", "1");
              createCourseBaseApi(body).then((res: any) => {
                router.push({
                  path: "/teacher/teacherCourse",
                });
              });
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        let baseInfo: any = cloneDeep(reactiveData.baseInfo);
        let params: any = {
          name: baseInfo.name,
          start_time:
            moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00",
          end_time:
            moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59",
          introduce: baseInfo.introduce,
          course_category_id: baseInfo.course_category_id,
          course_direction_id: baseInfo.course_direction_id,
          url: baseInfo.url,
          is_available: 1,
        };
        updateCourseBaseApi(params, { course_id: course_id.value }).then(
          (res: any) => {
            router.push({
              path: "/teacher/teacherCourse",
            });
          }
        );
      }
    }
    function next() {
      if (reactiveData.currentStep === 0) {
        (reactiveData.createForm as any)
          .validate()
          .then((res: any) => {
            let baseInfo: any = cloneDeep(reactiveData.baseInfo);
            const body = new FormData();
            body.append("name", baseInfo.name);
            body.append(
              "start_time",
              moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00"
            );
            body.append(
              "end_time",
              moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59"
            );
            body.append("introduce", baseInfo.introduce);
            body.append("course_category_id", baseInfo.course_category_id);
            body.append("course_direction_id", baseInfo.course_direction_id);
            body.append("url", baseInfo.url);
            let params: any = {
              name: baseInfo.name,
              start_time:
                moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00",
              end_time:
                moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59",
              introduce: baseInfo.introduce,
              course_category_id: baseInfo.course_category_id,
              course_direction_id: baseInfo.course_direction_id,
              url: baseInfo.url,
            };
            if (course_id.value) {
              updateCourseBaseApi(params, { course_id: course_id.value }).then(
                (res: any) => {
                  router.push({
                    path: "/teacher/teacherCourse/create",
                    query: {
                      course_id: course_id.value,
                    },
                  });
                  setTimeout(() => {
                    reactiveData.currentStep++;
                  }, 10);
                }
              );
            } else {
              body.append("is_available", "0");
              createCourseBaseApi(body).then((res: any) => {
                router.replace({
                  path: "/teacher/teacherCourse/create",
                  query: {
                    course_id: res.data.id,
                  },
                });
                setTimeout(() => {
                  reactiveData.currentStep++;
                }, 10);
              });
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else if (reactiveData.currentStep === 1) {
        reactiveData.currentStep++;
      } else if (reactiveData.currentStep === 2) {
        let baseInfo: any = cloneDeep(reactiveData.baseInfo);
        let params: any = {
          name: baseInfo.name,
          start_time:
            moment(baseInfo.created_at).format("YYYY-MM-DD") + " 00:00:00",
          end_time:
            moment(baseInfo.end_time).format("YYYY-MM-DD") + " 23:59:59",
          introduce: baseInfo.introduce,
          course_category_id: baseInfo.course_category_id,
          course_direction_id: baseInfo.course_direction_id,
          url: baseInfo.url,
          is_available: 1,
        };
        updateCourseBaseApi(params, { course_id: course_id.value }).then(
          (res: any) => {
            reactiveData.currentStep++;
          }
        );
      }
    }
    function last() {
      reactiveData.currentStep--;
    }

    // 继续添加课程
    function goAdd() {
      router.replace({
        path: "/teacher/teacherCourse/create",
      });
      setTimeout(() => {
        location.reload();
      });
    }
    // 查看课程
    function lookCourse() {
      router.push({
        path: "/teacher/teacherCourse",
      });
    }
    return {
      bg,
      ...toRefs(reactiveData),
      cancel,
      next,
      save,
      last,
      course_id,
      finishBg,
      goAdd,
      lookCourse,
      provide,
    };
  },
});
</script>

<style lang="less">
.create-course-box {
  height: calc(100% - 9px);
  display: flex;
  flex-direction: column;
  .create-steps-box {
    margin-top: 7px;
  }
  .create-course-main {
    padding: 39px 30px;
    height: 716px;
    .edit-course-base-form {
      .col-2 {
        margin-top: 30px;
        .ant-form-item-control-input-content {
          textarea {
            min-height: 305px !important;
          }
        }
      }
      .createuploadImgdiv {
        > div {
          height: 143px;
        }
      }
    }
    .first-step-btn {
      text-align: center;
      margin-top: 50px;
      > button {
        margin-left: 20px;
      }
    }
    .course-experiment-left,
    .course-experiment-right {
      border-radius: 4px;
      box-shadow: 0px 0px 10px 0px #e1e1e1;
    }
    .finish-step-box {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 144px;
        height: 140px;
      }
      p {
        font-size: 20px;
        margin-top: 32px;
        color: #a1a1a1;
      }
      .finish-step-btn {
        > button {
          margin-right: 24px;
        }
      }
    }
    .course-experiment-box{
      height: 100%;
    }
  }
}
</style>
