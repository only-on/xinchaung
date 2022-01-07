<template>
  <div id="courseScore" v-layout-bg>
    <div class="courseScoreContent">
      <div class="course-info">
        <div class="course-info-left">
          <div class="card-pic">
            <!-- <img src="../../../../assets/images/stuAchievement/d3.jpg" alt=""> -->
            <img :src="courseDetail.url" alt="" />
          </div>
          <div class="card-info">
            <h3 class="card-info-top">{{ courseDetail.name }}</h3>
            <div class="card-info-bottom">
              <p>起止时间：{{ courseDetail.expire }}</p>
              <p>课程状态：{{ courseDetail.state }}</p>
              <p>
                <img
                  src="../../../../assets/images/stuAchievement/teacher.png"
                  alt=""
                  srcset=""
                />
                {{ courseDetail.teacher }}
              </p>
              <p class="resource" @click="toCourseResource(courseDetail.id)">
                课程资源&nbsp;>>
              </p>
            </div>
          </div>
        </div>
        <div class="card-score">
          <p class="score">
            <img src="../../../../assets/images/stuAchievement/icon_score.jpg" alt="" />
            课程得分：<span>{{ courseDetail.course_score }}</span>
          </p>
          <p class="order">
            <img src="../../../../assets/images/stuAchievement/icon_order.jpg" alt="" />
            班级排名： <span>{{ courseDetail.score_rank }}</span>
          </p>
          <p class="hihgest">
            <img src="../../../../assets/images/stuAchievement/icon_highest.jpg" alt="" />
            实验最高分： <span>{{ courseDetail.task_highest_score }}</span>
          </p>
          <p class="lowest">
            <img src="../../../../assets/images/stuAchievement/icon_lowest.png" alt="" />
            实验最低分： <span>{{ courseDetail.task_minimum_score }}</span>
          </p>
        </div>
      </div>
      <div class="course-content">
        <div class="content-info">
          <ul v-for="(item, index) in CourseScoreInfo" :key="index">
            <div class="courseChapter">
              <div>
                <img
                  src="../../../../assets/images/stuAchievement/project_icon.png"
                  alt=""
                />{{ item.chapter_name }}
              </div>
              <div>
                <span class="chapterScore">章节得分：{{ item.chapter_score }}</span>
                <span class="stowOrUnfold unfold" @click="expand(index)">
                  <span v-if="item.dis"
                    ><span class="icon iconfont icon-zhankai2-copy"></span>收起</span
                  >
                  <span v-else
                    ><span class="icon iconfont icon-shouqi-copy"></span>展开</span
                  >
                </span>
              </div>
            </div>
            <div v-if="item.dis">
              <li
                v-bind="{ class: flag }"
                class="exper-con"
                v-for="(itm, j) in item.children"
                :key="j"
              >
                <div class="task">
                  <div class="task-left">{{ itm.name }}</div>
                  <div
                    :class="itm.has_result ? 'task-right' : 'cant-check'"
                    @click="viewResults(index, j, itm.experdis, itm.has_result)"
                  >
                    <span class="iconfont icon-chakan1"></span>
                    <span> 查看成绩</span>
                  </div>
                </div>
                <div class="score-table" v-if="itm.experdis">
                  <!-- <a-table :columns="columns" :data-source="data" :bordered='true' :pagination="false">
                                </a-table> -->
                  <score-table :id="itm?.record_id"></score-table>
                  <!-- hahaha -->
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  inject,
  getCurrentInstance,
} from "vue";
import scoreTable from "../scoreTable/index.vue";
import { useRouter } from "vue-router";
import request from "../../../../api";
interface ObjectD {
  name?: string;
  has_result?: string;
  expername?: string;
  experdis?: boolean;
  record_id?: string;
}
interface ObjectArrType {
  chapter_name?: string;
  chapter_score?: number;
  children: ObjectD[];
  dis?: boolean;
  index?: string;
}
interface courseDetailType {
  id?: any;
  name?: string;
  url?: string;
  expire?: any;
  state?: any;
  teacher?: any;
  course_score?: number;
  score_rank?: any;
  task_highest_score?: any;
  task_minimum_score?: any;
}
interface State {
  courseDetail: courseDetailType;
  CourseScoreInfo: ObjectArrType[];
  columns: any[];
  data: any[];
  flag?: boolean;
}
export default defineComponent({
  name: "courseScore",
  components: {
    "score-table": scoreTable,
  },
  setup: (props, context) => {
    const router = useRouter();
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: 0,
    });
    const state: State = reactive({
      courseDetail: {},
      CourseScoreInfo: [],
      flag: false,
      columns: [
        { title: "实验得分", dataIndex: "name", key: "name" },
        {
          title: "重修得分",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "最终得分",
          dataIndex: "address",
          key: "address",
        },
        {
          title: "班级排名",
          key: "tags",
          dataIndex: "tags",
          scopedSlots: { customRender: "tags" },
        },
        {
          title: "班级最高分",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "实验习题",
          key: "tags1",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "实验报告",
          key: "tags2",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "自评结果",
          key: "tags2",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "教师评价",
          key: "tags2",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "成绩明细",
          key: "tags2",
          scopedSlots: { customRender: "action" },
        },
      ],
      data: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New ",
          tags: ["nice"],
          tags1: ["nice"],
          tags2: ["nice"],
        },
      ],
    });
    function expand(index: number) {
      console.log(index, "下标");
      state.CourseScoreInfo[index].dis = !state.CourseScoreInfo[index].dis;
    }
    function viewResults(index: number, j: number, c: any, ifcheck: any) {
      console.log(ifcheck);
      console.log(ifcheck);
      if (ifcheck) {
        console.log("展开");
        state.CourseScoreInfo[index].children[j].experdis = !state.CourseScoreInfo[index]
          .children[j].experdis;
      }
    }
    function getData() {
      const relateId = router.currentRoute.value.query.id;
      console.log(router.currentRoute.value.query.id);
      const infoRequest = (request as any).studentPerformance;
      infoRequest
        .experimentalResults({
          param: { type: "course", relate_id: relateId },
        })
        .then((res: any) => {
          console.log("获取课程成绩");
          console.log(res.data);
          state.courseDetail = res.data;
          state.CourseScoreInfo = res.data.tree;
        });
    }
    function toCourseResource(id: any) {
      console.log(id);
      router.push({ path: "/studentPerformance/courseResources", query: { id: id } });
    }
    onMounted(() => {
      getData();
      state.CourseScoreInfo.forEach((item: any, j) => {
        console.log(j, "第几个数的下标");
        if (j == 0) {
          item.dis = true;
        } else {
          item.dis = false;
        }
        console.log(item, item.children);
      });

      for (var i = 0; i < state.CourseScoreInfo.length; i++) {
        state.CourseScoreInfo[i].children?.forEach((item, index) => {
          item.experdis = true;
        });
      }
    });
    return { ...toRefs(state), expand, viewResults, toCourseResource, getData };
  },
});
</script>
<style lang="less" scoped>
.courseScoreContent {
  min-height: 750px;
  border-radius: 6px;
  background-color: var(--white-100);
  margin: 0 auto;
  padding: var(--pading-md) 21px var(--pading-md) var(--padding-sm);
  .course-info {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .course-info-left {
      display: flex;
      .card-pic {
        height: 166px;
        width: 290px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }
      .card-info {
        padding: 0px 21px;
        .card-info-top {
          margin: 0;
          white-space: nowrap;
          font-size: 22px;
          color: #333;
          font-weight: 600;
        }
        .card-info-bottom {
          img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          .resource {
            color: var(--purpleblue-6);
          }
        }
      }
    }
    .card-score {
      color: var(--purpleblue-6);
    }
  }
  .content-info {
    ul {
      //  padding-bottom: 30px;
      margin-bottom: 0px;
      background: url(../../../../assets/images/stuAchievement/line02.jpg) repeat-y 45px 0;
      .courseChapter {
        width: 100%;
        height: 46px;
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--purpleblue-6);
        background-color: #fdfaff;
        line-height: 46px;
        padding-left: 30px;
        color: var(--purpleblue-6);
        img {
          margin-right: 20px;
        }
      }
      .courseChapter:hover {
        background-color: #efddfb;
      }
      .chapterScore {
        font-size: 16px;
        color: #f36a1f;
        line-height: 44px;
      }
      .stowOrUnfold {
        margin: 12px 27px;
      }
      .exper-con {
        background: url(../../../../assets/images/stuAchievement/task_finish.png)
          no-repeat 38px 42px;
        .task {
          display: flex;
          justify-content: space-between;
          margin-left: 80px;
          height: 40px;
          line-height: 40px;
          padding: 30px 0 20px;
          box-sizing: content-box;
          border-bottom: 1px solid #ddd;
          .task-right {
            color: var(--purpleblue-6);
          }
          .cant-check {
            color: #ccc;
          }
          .icon-chakan1 {
            font-size: 20px;
          }
        }
        .score-table {
          margin-top: 30px;
          margin-left: 80px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.courseScoreContent {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px;
    text-align: center;
  }
  .ant-table-thead > tr > th {
    background-color: #f6f0fa !important;
  }
  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid var(--white-100);
  }
  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: var(--white-100);
  }
  .ant-radio-button-wrapper {
    display: none;
  }
  .footer-box {
    display: none;
  }
}
</style>
