<template>
  <div
    v-layout-bg="{ size: '234px', bg: bg }"
    style="height: calc(100% - 24px); width: 1330px; margin: 0 auto"
    class="archive-detail-box"
  >
    <top></top>
    <div class="archive-detail-content">
      <div class="course-experiment-left">
        <drag-tree
          :treeData="treeData"
          @selectChapter="selectChapter"
          @selectExperiment="selectExperiment"
        ></drag-tree>
      </div>
      <div class="course-experiment-right">
        <div v-if="currentShowContent === 'chapter'" class="chapter-content">
          <div class="chapter-top">
            <span>已完成学生：<i>0</i>人</span>
            <span>未完成学生：<i>1</i>人</span>
          </div>
          <div class="search-box">
            <span>
              <label>学号：</label>
              <a-input />
            </span>
            <span>
              <label>姓名：</label>
              <a-input />
            </span>
            <a-button type="primary">查询</a-button>
            <a-button type="primary">清空</a-button>
            <a-button type="primary" class="study-score">习题成绩</a-button>
          </div>
          <a-table
            :data-source="chapterData"
            :columns="chapterColumns"
            :pagination="false"
          >
          </a-table>
          <a-pagination :default-current="6" :total="500" />
        </div>
        <div
          v-if="currentShowContent === 'experiment'"
          class="experiment-content"
        >
          <div class="experiment-top">
            <span>已提交：<i>0</i>人</span>
            <span>已评价<i>0</i>人</span>
            <span>最高分：<i>0</i>分</span>
            <span>最低分：<i>0</i>分</span>
            <span>平均分：<i>0</i>分</span>
          </div>
          <div class="search-box">
            <span>
              <label>学号：</label>
              <a-input />
            </span>
            <span>
              <label>姓名：</label>
              <a-input />
            </span>
            <span>
              <label>班级：</label>
              <a-input />
            </span>
            <a-button type="primary">查询</a-button>
            <a-button type="primary">清空</a-button>
            <div class="button-right">
              <a-button type="primary">成绩导出</a-button>
              <a-button type="primary">成果获取</a-button>
            </div>
          </div>
          <a-table
            :data-source="experimentData"
            :columns="experimentColumns"
            :pagination="false"
          >
          </a-table>
          <a-pagination :default-current="6" :total="500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  provide,
  ref,
} from "vue";
import bg from "src/assets/common/course-detail_bg.jpg";
import top from "./top.vue";
import storage from "src/utils/extStorage";
import { useRoute } from "vue-router";
import DragTree from "src/components/dragTree.vue";
import { getCourseTreeApi } from "../courseExperiment/api";
type TreactiveData = {
  tabs: any[];
  activeKey: string;
  treeData: any[];
  chapterParams: {};
  experimentData:any[]
  chapterData:any[]
};
export default defineComponent({
  components: {
    top,
    "drag-tree": DragTree,
  },
  setup() {
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "",
      navType: true,
      showContent: false,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const route = useRoute();
    const currentRole: number = storage.lStorage.get("role");
    const currentTab = route.query.currentTab;
    const course_id = route.query.course_id as any as number;
    const type = route.query.type;
    const chapter_id = ref("");
    const experiment_id = ref("");
    const currentShowContent = ref("chapter");
    const chapterColumns = [
      {
        dataIndex: "num",
        title: "学号",
      },
      {
        dataIndex: "name",
        title: "姓名",
      },
      {
        dataIndex: "name",
        title: "章节进度",
      },
      {
        dataIndex: "name",
        title: "进行中的实验",
      },
    ];
    const experimentColumns = [
      {
        dataIndex: "num",
        title: "学号",
      },
      {
        dataIndex: "name",
        title: "姓名",
      },
      {
        dataIndex: "name",
        title: "最终得分",
      },
      {
        dataIndex: "name",
        title: "花费时间",
      },
      {
        dataIndex: "name",
        title: "所属班级",
      },
      {
        dataIndex: "name",
        title: "查看",
      },
      {
        dataIndex: "name",
        title: "初学报告",
      },
      {
        dataIndex: "name",
        title: "重修报告",
      },
      {
        dataIndex: "name",
        title: "教师评价",
      },
    ];
    const reactiveData: TreactiveData = reactive({
      treeData: [],
      tabs: [],
      activeKey: "1",
      chapterData: [],
      chapterParams: {},
      experimentData:[]
    });
    if (type === "resource") {
      reactiveData.activeKey = "4";
    }
    provide("course_id", course_id);
    onMounted(() => {
      getCourseTree();
    });
    function tabChange(key: string) {
      console.log(key);
    }
    // 获取课程实验树
    function getCourseTree() {
      getCourseTreeApi({ course_id: course_id }).then((res: any) => {
        console.log(res);
        reactiveData.treeData = res.data;
      });
    }
    function selectChapter(val: any, isinit: boolean) {
      chapter_id.value = val.id;
      currentShowContent.value = "chapter";
    }
    function selectExperiment(val: any) {
      console.log(val);
      experiment_id.value = val.id;
      currentShowContent.value = "experiment";
    }
    return {
      tabChange,
      bg,
      ...toRefs(reactiveData),
      provide,
      selectChapter,
      selectExperiment,
      currentShowContent,
      chapterColumns,
      experimentColumns
    };
  },
});
</script>

<style lang="less">
.archive-detail-box {
  display: flex;
  flex-direction: column;
  .archive-detail-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    .course-experiment-left {
      width: 324px;
      height: 100%;
      background: @white;
      border-radius: 4px;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
    }
    .course-experiment-right {
      height: 100%;
      flex: 1;
      margin-left: 10px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
      padding: 5px;
      .chapter-content {
        border: 1px solid #ddd;
        width: 100%;
        height: 100%;
        .chapter-top {
          line-height: 46px;
          padding: 0 10px;
          border-bottom: 1px solid #ddd;
          > span {
            margin-right: 20px;
            i {
              font-style: normal;
              color: #fe891e;
              font-weight: 400;
              margin-right: 8px;
            }
          }
        }
        .search-box {
          display: flex;
          padding: 10px 10px;
          label {
            display: inline-block;
          }
          input {
            display: inline-block;
            width: 200px;
          }
          > button {
            margin-left: 15px;
            &.study-score {
              margin-left: auto;
            }
          }
        }
        .ant-table-wrapper {
          margin-top: 10px;
        }
        .ant-pagination {
          text-align: center;
          margin-top: 15px;
        }
      }
      .experiment-content {
        
        .experiment-top {
            padding:0 10px;
          line-height: 50px;
          border-bottom: 1px solid #ddd;
          > span {
            margin-right: 30px;
            i {
              margin-right: 6px;
              font-style: normal;
              color: #fe891e;
              font-weight: 400;
            }
          }
        }
        .search-box{
            display: flex;
            padding:0 10px;
            margin: 15px 0px;
            >span{
                width: 190px;
                >input{
                    width: 140px;
                }
            }
            >button{
                margin-left: 10px;
            }
            .button-right{
                margin-left: auto;
                >button{
                    margin-left: 10px;
                }
            }
        }
        .ant-pagination{
            margin-top: 15px;
            text-align: center;
        }
      }
    }
  }
}
</style>
