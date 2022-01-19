<template>
  <div v-layout-bg style="height: 100%" class="interation-result-box">
    <div class="interation-result-header">
      <span>{{ stupaperCount.testing_name }}</span>
      <div class="returnicon" @click="backPaperList">
        <span class="iconfont icon-fanhui"></span>
      </div>
    </div>

    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="成绩统计">
        <a-row class="results-statistical-header">
          <a-col :span="3" align="left">
            已提交{{
              stupaperCount.student_commit_counts +
              "/" +
              stupaperCount.student_total_counts
            }}人
          </a-col>
          <a-col :span="3" align="left"
            >最高得{{ stupaperCount.question_highest_score }}分</a-col
          >
          <a-col :span="3" align="left"
            >最低得{{ stupaperCount.question_lowest_score }}分</a-col
          >
          <a-col :span="3" align="left"
            >平均得{{ stupaperCount.question_average_score }}分</a-col
          >
          <a-col :span="12" align="right">
            共{{ stupaperCount.question_total_counts }}题 总分{{
              stupaperCount.question_total_score
            }}分
          </a-col>
        </a-row>
        <a-config-provider>
          <a-table
            @change="changePage"
            :row-key="rowKey"
            :columns="columns"
            :data-source="stuData"
            :pagination="false"
            bordered
          />
          <template #renderEmpty>
            <div><empty type="tableEmpty"></empty></div>
          </template>
        </a-config-provider>
        <page
          v-model:current="tabParams.page"
          v-model:pageSize="tabParams.limit"
          :total="pagination.total"
          @change="pageChange"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="题目正确率" force-render>
        <!-- scroll-bar-customize -->
        <div class="accurDataList">
          <div
            class="dataItem"
            v-for="(item, index) in accuracyData"
            :key="index"
          >
            <div class="itemLeft">
              <template v-if="item.question">
                <div
                  style="
                    width: 100%;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    word-break: normal;
                  "
                >
                  {{ item.question.question }}
                </div>
                <!-- <div v-html="item.question_title"></div> -->
                <div v-if="item.question.type_id == 3">
                  <ul
                    v-for="(it, j) in item.question.options"
                    :key="j.toString()"
                  >
                    <li
                      :class="
                        item.question.answers[0] &&
                        it.id == item.question.answers[0].answer
                          ? 'green'
                          : ''
                      "
                    >
                      <span>{{ it.option }}</span>
                      {{ it.content }}
                      <span
                        v-if="
                          item.question.answers[0] &&
                          it.id == item.question.answers[0].answer
                        "
                        style="margin-left: 10px"
                        >(正确答案)</span
                      >
                    </li>
                  </ul>
                </div>
                <div v-if="item.question.type_id == 1">
                  <ul>
                    <li
                      v-for="(it, j) in item.question.options"
                      :key="j.toString()"
                      :class="
                        item.question.answers[0] &&
                        it.id == item.question.answers[0].answer
                          ? 'green'
                          : ''
                      "
                    >
                      选项{{ toAbc(Number(j) + 1) }}：
                      {{ it.option }}
                      <!-- <span v-if="j !== item.option.length - 1">,</span> -->
                    </li>
                  </ul>
                </div>
                <div v-if="item.question.type_id == 4">
                  <ul class="green">
                    答案：
                    <span
                      v-for="(it, j) in item.question.answers"
                      :key="j.toString()"
                    >
                      {{ it.answer
                      }}{{ j !== item.question.answers.length - 1 ? "," : "" }}
                    </span>
                  </ul>
                </div>
                <div v-if="item.question.type_id == 5">
                  <div class="green">
                    答案：<span>
                      {{ item.question.answers[0].answer }}
                    </span>
                  </div>
                </div>
                <div v-if="item.question.type_id == 2">
                  <ul>
                    <li
                      v-for="(it, j) in item.question.options"
                      :key="j.toString()"
                      :class="getAnswers(item.question.answers).includes(it.id.toString())?'green':''"
                    >
                    选项{{ toAbc(Number(j) + 1) }}：
                      {{ it.option }}
                    </li>
                  </ul>
                </div>
              </template>
            </div>
            <div class="itemRight">
              <div class="rote">
                <span class="comment">批注：</span>
                <span class="accuracy"
                  >【题目正确率：{{ item.correct_rate + "%" }}】</span
                >
              </div>
              <div class="editcommemts" style="display: flex">
                <a-textarea
                  class="textarea scroll-bar-customize"
                  v-model:value="item.note"
                  :disabled="!item.editflag"
                  style="width: 100%; height: 138px; margin-top: 14px"
                />
                <div
                  :class="
                    item.editflag
                      ? 'okbutton savebutton'
                      : 'okbutton editbutton'
                  "
                >
                  <span
                    v-if="item.editflag"
                    @click="confirmModify(item, index)"
                    :class="
                      item.editflag ? 'iconfont icon-danxuanxuanzhong edit' : ''
                    "
                  ></span>
                  <span
                    v-else
                    @click="toEdit(item, index)"
                    :class="
                      !item.editflag ? 'iconfont icon-bianji1 editclass' : ''
                    "
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  Ref,
  inject,
  watch,
  reactive,
  toRefs,
} from "vue";
import {
  getDefaultPaperInfoApi,
  getAchievStatisApi,
  editQuestionApi,
  getTestPaperAccuracyApi,
} from "./api";
import { useRoute } from "vue-router";
import router from "src/routers";
import empty from "src/components/Empty.vue";
import page from "src/components/page/page.vue";
import { message } from "ant-design-vue";
type TreactiveData = {
  stupaperCount: any;
  tabParams: {
    page: number;
    id: number;
    limit: number;
  };
  stuData: any[];
  pagination: {
    pageSize: number;
    total: number;
    current: number;
  };
  accuracyData: any[];
};
export default defineComponent({
  name: "",
  components: {
    empty,
    page,
  },
  setup: (props, context) => {
    const route = useRoute();
    const paper_id = route.query.paper_id as any as number;
    const course_id = route.query.course_id as any as number;
    var updata = inject("updataNav") as Function;

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
    const columns = [
      {
        title: "姓名",
        align: "left",
        dataIndex: "user_name",
        key: "user_name",
      },
      {
        title: "班级",
        dataIndex: "class_name",
        key: "class_name",
        align: "left",
      },
      {
        title: "成绩",
        key: "score",
        dataIndex: "score",
        scopedSlots: { customRender: "score" },
        align: "left",
      },
      {
        title: "答错",
        key: "question_error_counts",
        dataIndex: "question_error_counts",
        align: "center",
        scopedSlots: { customRender: "question_error_counts" },
      },
    ];
    const reactiveData: TreactiveData = reactive({
      stupaperCount: {},
      tabParams: {
        page: 1,
        id: paper_id,
        limit: 15,
      },
      stuData: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
      accuracyData: [],
    });
    onMounted(() => {
      getDefaultPaperInfo();
      getAchievStatis();
    });

    // 获取试卷基本信息
    function getDefaultPaperInfo() {
      getDefaultPaperInfoApi({ test_id: paper_id }).then((res: any) => {
        reactiveData.stupaperCount = res.data;
      });
    }
    // 获取习题正确率
    function getTestPaperAccuracy() {
      getTestPaperAccuracyApi(reactiveData.tabParams.id).then((res: any) => {
        console.log(res);
        reactiveData.accuracyData = res.data;
        reactiveData.accuracyData.forEach((item: any) => {
          item.editflag = true;
        });
      });
    }
    // 修改批注后点击确认
    function confirmModify(titleInfo: any, index: number) {
      if (titleInfo.record_id == 0) {
        message.warn("学生随堂测试未提交");
        return;
      }
      editQuestionApi(
        { note: titleInfo.note },
        { record_id: titleInfo.record_id }
      ).then((res: any) => {
        (reactiveData.accuracyData[index] as any).editflag = false;
      });
    }
    // 成绩统计
    function getAchievStatis() {
      getAchievStatisApi(
        {
          page: reactiveData.tabParams.page,
          limit: reactiveData.tabParams.limit,
        },
        { test_id: reactiveData.tabParams.id }
      ).then((res: any) => {
        console.log(res);
        reactiveData.stuData = res.data.list;
        reactiveData.tabParams.page = res.data.page.currentPage;
        reactiveData.tabParams.limit = res.data.page.totalCount;
        reactiveData.pagination.total = res.data.totalCount;
      });
    }
    // 分页发生变化
    function changePage(e: any) {
      reactiveData.tabParams.page = e.current;
      getAchievStatis();
    }

    // tab发生变化时
    function tabChange(key: any) {
      if (key === "1") {
        getAchievStatis();
        getDefaultPaperInfo();
      } else {
        // getDefaultPaperInfo();
        getTestPaperAccuracy();
      }
    }

    // 分页发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.tabParams.page = page;
      reactiveData.tabParams.limit = pageSize;
    }
    // 编辑
    function toEdit(titleInfo: any, index: number) {
      (reactiveData.accuracyData[index] as any).editflag = true;
    }
    // 返回列表
    function backPaperList() {
      router.go(-1);
      // router.push({
      //     path:"/teacher/teacherCourse/testPaperList",
      //     query:{
      //         course_id:course_id
      //     }
      // })
    }
    function toAbc(i: number) {
      return String.fromCharCode(64 + i);
    }
    // 获取多选题答案
    function getAnswers(answers: any[]) {
      let arr: any = [];
      answers.map((item: any) => {
        arr.push(item.answer);
      });
      return arr;
    }
    const rowKey = (record: any) => {
      return record.student_id;
    };
    return {
      ...toRefs(reactiveData),
      changePage,
      columns,
      tabChange,
      confirmModify,
      backPaperList,
      toEdit,
      rowKey,
      pageChange,
      toAbc,
      getAnswers,
    };
  },
});
</script>

<style lang="less">
.interation-result-box {
  .interation-result-header {
    display: flex;
    justify-content: space-between;
    > span {
      &:nth-child(1) {
        font-size: 20px;
      }
    }
    .returnicon {
      width: 38px;
      height: 38px;
      background-color: #ebeff8;
      border-radius: 50%;
      line-height: 38px;
      text-align: center;
      color: var(--purpleblue-6);
      cursor: pointer;
      transition: 0.5s;
      &:hover {
        background: rgba(var(--purpleblue-6), 0.5);
        cursor: pointer;
      }
    }
  }
  .results-statistical-header {
    margin-bottom: 10px;
  }
  .ant-table-pagination.ant-pagination {
    width: 100%;
    text-align: center;
  }
  .accurDataList {
    width: 100%;
    max-height: 600px;
    overflow: auto;
    .dataItem {
      display: flex;
      padding: 20px;
      background-color: #f9f9f9;
      justify-content: space-between;
      margin-bottom: 24px;
      .itemLeft {
        width: 48%;
        line-height: 28px;
        ul {
          padding-top: 16px;
          li {
            line-height: 20px;
            margin-bottom: 16px;
          }
        }
        .green {
          color: #00bb6b;
        }
      }
      .itemRight {
        width: 48%;
        .rote {
          display: flex;
          justify-content: space-between;
          .comment {
            color: black;
          }
          .accuracy {
            color: #ff8f00;
          }
        }
      }
      .okbutton {
        width: 24px;
        height: 138px;
        margin-top: 14px;
        line-height: 138px;
        text-align: center;
      }
      .savebutton {
        background-color: #f1f1f1;
        border: 1px solid #cecece;
      }
      .editbutton {
        background-color: #f1f1f1;
        border: 1px solid #cecece;
      }
      .editcommemts {
        .textarea {
          resize: none;
        }
        textarea.ant-input {
          max-width: 100%;
          height: auto;
          min-height: 32px;
          line-height: 1.5;
          vertical-align: bottom;
          transition: all 0.3s, height 0s;
          border-right: none;
          border-bottom-right-radius: 0px;
          border-top-right-radius: 0px;
        }
        .textarea:hover + .savebutton {
          background-color: var(--purpleblue-3);
          border: 1px solid var(--purpleblue-6);
        }
        .textarea:focus + .savebutton {
          background-color: var(--purpleblue-3);
          border: 1px solid var(--purpleblue-6);
        }
      }
    }
  }
}
</style>
