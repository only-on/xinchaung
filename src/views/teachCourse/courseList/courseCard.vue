<template>
  <div class="course-item">
    <div class="course-item-box">
      <div class="cover-box" @click="toDetail('experiment')">
        <img
          :src="data.url ? data.url : '/img/default/cover.png'"
          alt=""
          class="img"
        />
        <span
          class="curse-status"
          :class="
            data.state === 2
              ? 'not-start'
              : data.state === 3
              ? 'in-progress'
              : 'finish'
          "
          v-if="currentTab === 'myCourse'"
        >
          {{ courseStatus(data.state) }}
        </span>
      </div>
      <div class="course-base-statistics-box" v-if="currentTab === 'myCourse'">
        <div class="item-name">{{ data.name }}</div>
        <div class="base-statistics-box">
          <div class="remove-hover">
            <p>
              {{
                moment(data.start_time).format("YYYY.MM.DD") +
                " - " +
                moment(data.end_time).format("YYYY.MM.DD")
              }}
            </p>
            <div class="statistics-box">
              <div class="content-total-box">
                <span class="iconfont icon-shiyan"></span><span>实验</span
                ><span>{{ data.content_total }}</span>
              </div>
              <div class="time-total-box">
                <span class="iconfont icon-keshi"></span><span>课时</span
                ><span>{{ data.class_total }}</span>
              </div>
              <div class="student-total-box">
                <span class="iconfont icon-renshu"></span
                ><span>{{ data.student_total }}</span>
              </div>
            </div>
          </div>
          <div class="add-hover">
            <div class="action-head-box">
              <div class="action-head-left">
                <span>实验指导</span>
                <a-switch
                  v-model:checked="data.is_open"
                  checked-children="开"
                  un-checked-children="关"
                  class="aswitch-guide"
                  @change="
                    () => {
                      setGuideStatus(data);
                    }
                  "
                />
              </div>
              <div class="action-head-right">
                <span
                  @click="copyCourse(data.id)"
                  title="复制"
                  class="iconfont icon-fuzhi"
                ></span>
                <span
                  v-if="data.state === 2"
                  @click="deleteCourse(data.id)"
                  title="删除"
                  class="icon-shanchu iconfont"
                ></span>
                <span
                  v-if="data.state === 1 && currentTab === 'myCourse'"
                  @click="setArchive(data.id)"
                  title="归档"
                  class="icon-guidang iconfont"
                ></span>
              </div>
            </div>
            <div class="action-footer-box">
              <span @click="evalute(data)">评价</span>
              <span @click="analyse(data)">分析</span>
              <span @click="environment(data)">环境</span>
              <!-- <span @click="inClassinteraction(item)">随测</span> -->
              <router-link
                :to="{
                  path: '/teacher/teacherCourse/testPaperList',
                  query: { course_id: data.id },
                }"
                >随测</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="init-course-base-statistics-box"
        v-if="currentTab === 'initCourse'"
      >
        <h2>{{ data.name }}</h2>
        <div class="base-init-action">
          <span @click="toDetail('experiment')">实验</span><span @click="toDetail('resource')">资源</span
          ><span @click="saveToMy">保存到我的</span>
        </div>
        <div class="base-init-show">
          <div class="content-total-box">
            <span class="iconfont icon-shiyan"></span><span>实验</span
            ><span>{{ data.content_total }}</span>
          </div>
          <div class="time-total-box">
            <span class="iconfont icon-keshi"></span><span>课时</span
            ><span>{{ data.class_total }}</span>
          </div>
        </div>
      </div>
      <div
        class="archived-course-base-statistics-box"
        v-if="currentTab === 'archiveCourse'"
      >
        <h2>{{ data.name }}</h2>
        <div class="base-archived-action">
          <span>详情</span><span @click="downloadExport">导出</span>
        </div>
        <div class="archived-time-box">
          <span class="icon-jingli iconfont"></span
          ><span class="time"
            ><span style="margin-right: 8px">归档时间</span>
            {{ data.updated_at }}
          </span>
        </div>
      </div>
      <!----><!---->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import {
  settingGuideStateApi,
  copyCourseApi,
  deleteCourseApi,
  saveToCourseApi,
} from "./api";
import { message, Modal } from "ant-design-vue";
import { useRouter } from "vue-router";
import fileSaver from "file-saver";
export default defineComponent({
  props: ["courseData", "currentTab", "index"],
  setup(props, { emit }) {
    const router = useRouter();

    const data = props.courseData;
    const currentTab = props.currentTab;
    const index = props.index;

    // 开启、关闭课程指导
    function setGuideStatus(val: any) {
      settingGuideStateApi({
        courseId: val.id,
        guideStat: val.is_open ? "1" : "0",
      }).then((res: any) => {
        emit("updateData", data, index);
        message.success(res.info);
      });
    }
    // 复制课程
    function copyCourse(id: number) {
      copyCourseApi({ course_id: id }).then((res: any) => {
        message.success("复制成功");
        emit("update");
      });
    }
    function setArchive(id: number) {
      console.log(id);
    }
    function deleteCourse(id: number) {
      Modal.confirm({
        title: "确定要删除该课程吗？",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deleteCourseApi({ id: id }).then((res: any) => {
            console.log(res);
          });
        },
      });
    }
    function evalute(val: any) {
      router.push({
        path: "/teacher/teacherCourse/evalute",
        query: {
          courseId: val.id,
        },
      });
    }
    function analyse(val: any) {
      router.push({
        path: "/teacher/teacherCourse/analysis",
        query: {
          courseId: val.id,
        },
      });
    }
    // 环境
    function environment(val: any) {
      router.push({
        path: "/teacher/teacherCourse/virtualEnv",
        query: {
          courseId: val.id,
          type: "course",
          courseType: val.course_type,
        },
      });
    }

    // 保存到我的
    function saveToMy() {
      saveToCourseApi({ courseId: data.id }).then((res: any) => {
        
        message.success("操作成功");
      });
    }
    // 归档导出
    function downloadExport() {
      fileSaver.saveAs(
        "/teacher-course/course-export?course_id=" + data.id,
        "课程详情报表.xls"
      );
    }

    // 跳转详情
    function toDetail(type:string) {
      router.push({
        path:"/teacher/teacherCourse/detail",
        query:{
          course_id:data.id,
          currentTab:currentTab,
          type:type
        }
      })
    }
    // 判断课程进行状态
    function courseStatus(sort: number) {
      if (sort === 1) {
        return "已结束"; // 未开始
      } else if (sort === 2) {
        return "未开始"; // 已结束
      } else if (sort === 3) {
        return "进行中"; // 进行中
      } else {
        return "未知";
      }
    }
    return {
      downloadExport,
      data,
      currentTab,
      courseStatus,
      moment,
      setGuideStatus,
      setArchive,
      deleteCourse,
      copyCourse,
      environment,
      analyse,
      evalute,
      saveToMy,
      toDetail
    };
  },
});
</script>

<style lang="less">
.course-list {
  .course-item {
    width: 25%;
    margin-top: 20px;
    height: 280px;
    cursor: pointer;
    &:nth-child(4n + 1) {
      padding-right: 15px;
    }
    &:nth-child(4n + 2) {
      padding-left: 5px;
      padding-right: 10px;
    }
    &:nth-child(4n + 3) {
      padding-left: 10px;
      padding-right: 5px;
    }
    &:nth-child(4n + 4) {
      padding-left: 15px;
    }
    .course-item-box {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 4px 0 rgb(164 36 167 / 14%);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .cover-box {
        height: 166px;
        width: 100%;
        position: relative;
        flex-shrink: 0;
        cursor: pointer;
        overflow: hidden;
        .img {
          width: 100%;
          height: 100%;
          transition: 0.5s;
          border-radius: 5px;
        }
        .curse-status {
          position: absolute;
          right: 0;
          padding: 4px 14px;
          background: #373737;
          top: 18px;
          border-bottom-left-radius: 14px;
          border-top-left-radius: 14px;
          font-size: 14px;
          text-align: center;
          line-height: 1;
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
            background: #373737;
            color: #8a8a8a;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
          }
        }
      }
      .course-base-statistics-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .item-name {
          height: 22px;
          line-height: 22px;
          font-size: 16px;
          margin-top: 8px;
          padding-bottom: 11px;
          font-weight: 600;
          padding: 0 13px;
          word-break: normal;
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .base-statistics-box {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          cursor: pointer;
          .remove-hover {
            height: 100%;
            flex-direction: column;
            justify-content: space-between;
            padding: 0 13px;
            > p {
              color: #8c8c8c;
              height: 20px;
              line-height: 20px;
              margin-top: 13px;
              margin-bottom: 15px;
            }
            .statistics-box {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: 18px;
              line-height: 18px;
              margin-bottom: 18px;
              > div {
                height: 12px;
                line-height: 16px;
                &.content-total-box {
                  width: 33%;
                  text-align: left;
                  border-right: 1px solid #e9e9e9;
                  > span {
                    font-size: 13px;
                    color: #8f8f8f;
                    margin-right: 6px;
                  }
                }
                &.time-total-box {
                  width: 33%;
                  text-align: center;
                  border-right: 1px solid #e9e9e9;
                  > span {
                    font-size: 13px;
                    color: #8f8f8f;
                    margin-right: 6 px;
                  }
                }
                &.student-total-box {
                  width: 33%;
                  text-align: center;
                  > span {
                    font-size: 13px;
                    color: #8f8f8f;
                    margin-right: 6px;
                  }
                }
              }
            }
          }
        }
      }
      .add-hover {
        display: none;
        height: 100%;
        flex-direction: column;
        justify-content: space-around;
        cursor: pointer;
        overflow: hidden;
        .action-head-box {
          padding: 13px;
          padding-bottom: 0;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .action-head-left {
            > span {
              color: #8c8c8c;
              font-size: 14px;
            }
            .aswitch-guide.ant-switch-checked {
              background-color: #f29b43;
            }
            > button {
              width: 42px;
              height: 22px;
              margin-left: 10px;
            }
          }
          .action-head-right {
            > span {
              margin-left: 15px;
              font-size: 14px;
              color: #000;
            }
          }
        }
        .action-footer-box {
          height: 40px;
          display: flex;
          flex-direction: row;
          background-color: #fafafa;
          border-top: 1px solid #e9e9e9;
          margin-top: 7px;
          > span,
          > a {
            margin: auto 0;
            flex: 1;
            height: 18px;
            text-align: center;
            border-right: 1px solid #e9e9e9;
            color: #8f8f8f;
            font-size: 14px;
          }
          > a {
            &:last-child {
              border-right: none;
            }
          }
        }
      }

      .init-course-base-statistics-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        > h2 {
          color: #000;
          font-size: 16px;
          font-weight: 700;
          margin-top: 15px;
          padding: 0 15px;
        }
        .base-init-show {
          display: flex;
          flex-direction: row;
          margin-bottom: 22px;
          padding-left: 15px;
          .content-total-box {
            padding-right: 16px;
            border-right: 1px solid #e9e9e9;
            > span {
              font-size: 13px;
              color: #8f8f8f;
              margin-right: 6px;
            }
          }
          .time-total-box {
            padding-left: 16px;
            > span {
              font-size: 13px;
              color: #8f8f8f;
              margin-right: 6px;
            }
          }
        }
        .base-init-action {
          height: 40px;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          text-align: center;
          background: #fafafa;
          display: none;
          border-top: 1px solid #e9e9e9;
          > span {
            width: 33.333333%;
            &:nth-child(1) {
              border-right: 1px solid #e9e9e9;
            }
            &:nth-child(2) {
              border-right: 1px solid #e9e9e9;
            }
          }
        }
      }

      .archived-course-base-statistics-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        > h2 {
          color: #000;
          font-size: 16px;
          font-weight: 700;
          margin-top: 15px;
          padding: 0 15px;
        }
        .base-archived-action {
          height: 40px;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          text-align: center;
          background: #fafafa;
          display: none;
          > span {
            width: 50%;
            &:nth-child(1) {
              border-right: 1px solid #e9e9e9;
            }
          }
        }
        .archived-time-box {
          padding-left: 15px;
          margin-bottom: 30px;
          > span {
            font-size: 13px;
            color: #8f8f8f;
            margin-right: 6px;
          }
        }
      }
      &:hover {
        .remove-hover {
          display: none;
        }
        .add-hover {
          display: flex;
        }
        .init-course-base-statistics-box {
          .base-init-action {
            display: flex;
          }
          .base-init-show {
            display: none;
          }
        }
        .archived-course-base-statistics-box {
          .base-archived-action {
            display: flex;
          }
          .archived-time-box {
            display: none;
          }
        }
      }
    }
  }
}
</style>
