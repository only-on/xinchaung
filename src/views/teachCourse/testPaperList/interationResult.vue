<template>
  <div v-layout-bg style="height: 100%" class="interation-result-box">
    <div class="interation-result-header">
      <span>{{ stupaperCount.paper_title }}</span>
      <div class="returnicon" @click="backPaperList"><span class="iconfont icon-fanhui"></span></div>
    </div>

    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="成绩统计">
        <a-row class="results-statistical-header">
          <a-col :span="3" align="left">
            已提交{{
              stupaperCount.submit_count + "/" + submitPeople.totalCount
            }}人
          </a-col>
          <a-col :span="3" align="left"
            >最高得{{ stupaperCount.max_score }}分</a-col
          >
          <a-col :span="3" align="left"
            >最低得{{ stupaperCount.min_score }}分</a-col
          >
          <a-col :span="3" align="left"
            >平均得{{ stupaperCount.average_score }}分</a-col
          >
          <a-col :span="12" align="right">
            共{{ stupaperCount.question_count }}题 总分{{
              stupaperCount.question_score
            }}分
          </a-col>
        </a-row>
        <a-table
          @change="changePage"
          :row-key="rowKey"
          :columns="columns"
          :data-source="stuData"
          :pagination="pagination"
          bordered
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
              <div
                style="
                  width: 100%;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  word-break: normal;
                "
              >
                {{ item.question_title }}
              </div>
              <!-- <div v-html="item.question_title"></div> -->
              <div v-if="item.question_type === '0'">
                <ul v-for="(it, j) in item.option" :key="j.toString()">
                  <li :class="it.option_code === item.answer ? 'green' : ''">
                    <span>选项{{ it.option_code }}：</span>
                    {{ it.content }}
                    <span
                      v-if="it.option_code === item.answer"
                      style="margin-left: 10px"
                      >(正确答案)</span
                    >
                  </li>
                </ul>
              </div>
              <div v-if="item.question_type === '1'">
                <ul class="green">
                  答案：
                  <span
                    style="margin-right: 10px"
                    v-for="(it, j) in item.option"
                    :key="j.toString()"
                  >
                    {{ it.content }}
                    <span v-if="j !== item.option.length - 1">,</span>
                  </span>
                </ul>
              </div>
            </div>
            <div class="itemRight">
              <div class="rote">
                <span class="comment">批注：</span>
                <span class="accuracy"
                  >【题目正确率：{{ item.precision + "%" }}】</span
                >
              </div>
              <div
                class="editcommemts"
                style="display: flex"
                :style="
                  stupaperCount.submit_count === 0
                    ? { cursor: 'not-allowed' }
                    : ''
                "
              >
                <a-textarea
                  class="textarea scroll-bar-customize"
                  v-model="item.question_desc"
                  :disabled="!item.editflag || stupaperCount.submit_count === 0"
                  style="width: 100%; height: 138px; margin-top: 14px"
                />
                <div
                  :class="
                    item.editflag
                      ? 'okbutton savebutton'
                      : 'okbutton editbutton'
                  "
                  :style="stupaperCount?.submit_count === 0?'pointer-events:none':''"
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
import { getDefaultPaperInfoApi, getAchievStatisApi,editQuestionApi } from "./api";
import { useRoute } from "vue-router";
import router from "src/routers";
type TreactiveData={
    stupaperCount: any,
      submitPeople: any,
      tabParams: {
        page: number,
        id: number,
      },
      stuData: any[],
      pagination: {
        pageSize: number,
        total: number,
        current: number,
      },
      accuracyData: any[],
}
export default defineComponent({
  name: "",
  components: {},
  setup: (props, context) => {
    const route = useRoute();
    const paper_id = route.query.paper_id as any as number;
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
        dataIndex: "username",
        key: "username",
      },
      {
        title: "班级",
        dataIndex: "classname",
        key: "classname",
        align: "left",
      },
      {
        title: "成绩",
        key: "ps_score",
        dataIndex: "ps_score",
        scopedSlots: { customRender: "ps_score" },
        align: "left",
      },
      {
        title: "答错",
        key: "wrong_count",
        dataIndex: "wrong_count",
        align: "center",
        scopedSlots: { customRender: "wrong_count" },
      },
    ];
    const reactiveData:TreactiveData = reactive({
      stupaperCount: {},
      submitPeople: {},
      tabParams: {
        page: 1,
        id: paper_id,
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
      getDefaultPaperInfoApi({ id: paper_id }).then((res: any) => {
        reactiveData.stupaperCount = res.data;
        reactiveData.accuracyData = res.data.question_list;
        reactiveData.accuracyData.forEach((item: any) => {
          item.editflag = true;
        });
      });
    }
    // 修改批注后点击确认
    function confirmModify(titleInfo: any, index: number) {
      var formdata = new FormData();
      formdata.append("question_id", titleInfo.question_id);
      formdata.append("question_title", titleInfo.question_title);
      formdata.append("question_code", titleInfo.question_code);
      formdata.append("question_type", titleInfo.question_type);
      formdata.append("question_score", titleInfo.question_score);
      formdata.append("question_sort", titleInfo.question_sort);
      formdata.append("is_sort", titleInfo.is_sort);
      formdata.append("question_desc", titleInfo.question_desc);
      titleInfo.option.forEach((it: any, i: any) => {
        formdata.append(`option[${i}][option_id]`, it.option_id);
        formdata.append(`option[${i}][option_code]`, it.option_code);
        formdata.append(`option[${i}][content]`, it.content);
        formdata.append(`option[${i}][option_score]`, it.option_score);
        formdata.append(`option[${i}][option_sort]`, it.option_sort);
      });
      if (titleInfo.question_type === "1") {
        titleInfo.answer.forEach((it: any) => {
          formdata.append("answer[]", it);
        });
      } else if (titleInfo.question_type === "0") {
        formdata.append("answer[]", titleInfo.answer);
      }
      formdata.append("precision", titleInfo.precision);
      formdata.append("course_id", paper_id.toString());
      editQuestionApi(formdata).then((res:any)=>{
          (reactiveData.accuracyData[index] as any).editflag = false
      })
    }
    // 成绩统计
    function getAchievStatis() {
      getAchievStatisApi(reactiveData.tabParams).then((res: any) => {
        reactiveData.submitPeople = res.data;
        reactiveData.stuData = res.data.list;
        reactiveData.pagination.current = res.data.page;
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
      if (key === '1') {
        getAchievStatis()
        getDefaultPaperInfo()
      } else {
        getDefaultPaperInfo()
      }
    }

    // 编辑
    function toEdit(titleInfo:any, index:number) {
        (reactiveData.accuracyData[index] as any).editflag = true
    }
    // 返回列表
    function backPaperList() {
        router.push({
            path:"/teacher/course/testPaperList",
            query:{
                courseid:(reactiveData.stupaperCount as any).course_id
            }
        })
    }
    const rowKey=(record:any)=> {
        return record.student_id
    }
    return {
      ...toRefs(reactiveData),
      changePage,
      columns,
      tabChange,
      confirmModify,
      backPaperList,
      toEdit,
      rowKey
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
      color: @theme-color;
      cursor: pointer;
      transition: 0.5s;
      &:hover {
        background: rgba(@theme-color, 0.5);
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
          background-color: #bb9cd6;
          border: 1px solid #8955b5;
        }
        .textarea:focus + .savebutton {
          background-color: #bb9cd6;
          border: 1px solid #8955b5;
        }
      }
    }
  }
}
</style>
