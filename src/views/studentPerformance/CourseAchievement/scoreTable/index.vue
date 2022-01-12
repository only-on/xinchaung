<template>
  <div class="scoreTable">
    <a-table
      :columns="columns"
      :data-source="data"
      :bordered="true"
      :pagination="false"
      rowKey="id"
    >
      <template #video="{ record }">
        <span class="detail" @click="lookResult(record.id, 'cvideo')">详情</span>
      </template>
      <template #exper="{ record }">
        <span class="detail" @click="lookResult(record.id, 'exper')">详情</span>
      </template>
      <template #report="{ record }">
        <span class="detail" @click="lookResult(record.id, 'report')">详情</span>
      </template>
      <template #rank="{ record }">
        <div v-if="record.rank">
          <div class="scoreStar">
            <a-rate :value="record?.rank" disabled />
          </div>
        </div>
        <div v-else>未评价</div>
      </template>
      <template #self_score="{ record }">
        <div v-if="record.self_score">
          <a-rate :value="record?.self_score" disabled />
        </div>
        <span v-else>未评价</span>
      </template>
      <template #courseDetail="{ record }">
        <span
          class="detail"
          @click="scoreDetails(record.start, record.rebuild, record.detail_show_config)"
          >成绩明细</span
        >
      </template>
    </a-table>
    <div>
      <a-modal
        class="scoreDetailModal"
        title="成绩明细"
        width="1000px"
        height="630px"
        :footer="null"
        :visible="visable"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <div>
          <a-tabs type="card" @change="change">
            <a-tab-pane key="1" tab="试验得分">
              <template v-if="activeKey == '1'">
                <test-score
                  :scoredata="start"
                  :detailShowConfig="detailShowConfig"
                  :activeKey="activeKey"
                ></test-score>
              </template>
            </a-tab-pane>
            <a-tab-pane v-if="rebuild?.id" key="2" tab="重修得分" force-render>
              <template v-if="activeKey == '2'">
                <test-score
                  :scoredata="rebuild"
                  :detailShowConfig="detailShowConfig"
                  :activeKey="activeKey"
                ></test-score>
              </template>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-modal>
    </div>
    <div>
      <a-modal
        :title="title"
        :footer="null"
        :visible="visableDetail"
        @ok="detailOk"
        @cancel="detailCancel"
        width="1000px"
      >
        <div>
          <component :is="componentName" :detailInfo="detailInfo"></component>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref, onMounted, toRefs } from "vue";
import { message } from "ant-design-vue";
import testScore from "../testScore/index.vue";
import request from "../../../../api";
import exper from "../../components/exper.vue";
import report from "../../components/report.vue";
import cvideo from "../../components/video.vue";
interface Istate {
  start: any;
  rebuild: any;
  detailShowConfig: any;
  scordata: any;
  panes: any[];
  activeKey: string;
  componentName: string;
  detailInfo: any;
  title: string;
}
export default defineComponent({
  name: "scoreTable",
  components: {
    "test-score": testScore,
    exper,
    report,
    cvideo,
  },
  props: ["id"],
  setup: (props, context) => {
    const infoRequest = (request as any).studentPerformance;
    const columns: any = [
      { title: "实验得分", dataIndex: "score", key: "score" },
      {
        title: "重修得分",
        dataIndex: "rebuild_score",
        key: "rebuild_score",
      },
      {
        title: "最终得分",
        dataIndex: "final_score",
        key: "final_score",
      },
      {
        title: "班级排名",
        key: "score_rank",
        dataIndex: "score_rank",
      },
      {
        title: "班级最高分",
        key: "max",
        dataIndex: "max",
      },
      {
        title: "操作视频",
        key: "video",
        dataIndex: "video",
        slots: { customRender: "video" },
      },
      {
        title: "实验习题",
        key: "exper",
        slots: { customRender: "exper" },
      },
      {
        title: "实验报告",
        key: "report",
        slots: { customRender: "report" },
      },
      {
        title: "自评结果",
        key: "self_score",
        slots: { customRender: "self_score" },
      },
      {
        title: "教师评价",
        key: "rank",
        dataIndex: "rank",
        slots: { customRender: "rank" },
        width: 140,
      },
      {
        title: "成绩明细",
        key: "courseDetail",
        slots: { customRender: "courseDetail" },
      },
    ];
    const data: any = ref([]);
    var confirmLoading: boolean = false;
    var ModalText: string = "你好啊";
    var visable: Ref<boolean> = ref(false);
    var visableDetail: Ref<boolean> = ref(false);

    const state: Istate = reactive({
      start: {},
      rebuild: {},
      detailShowConfig: [],
      scordata: {},
      panes: [
        { title: "试验得分", content: testScore, key: "1", scoredata: {} },
        { title: "Tab 2", content: "Content of Tab 2", key: "2", scoredata: {} },
      ],
      activeKey: "1",
      componentName: "exper",
      detailInfo: "",
      title: "",
    });
    //成绩明细弹框
    function scoreDetails(start: any, rebuild: any, detail_show_config: any) {
      visable.value = true;
      state.start = start;
      state.rebuild = rebuild;
      state.detailShowConfig = detail_show_config;
      state.panes[0].scoredata = state.start;
      state.panes[1].scoredata = state.rebuild;
    }
    function change(activeKey: any) {
      state.activeKey = activeKey;
    }
    //确认弹框
    function handleOk() {
      visable.value = false;
    }
    function handleCancel() {
      visable.value = false;
    }
    function getScore() {
      infoRequest.courseScore({ param: { id: props.id } }).then((res: any) => {
        console.log(res);
        data.value = [res.data];
      });
    }
    // function onEdit(targetKey:string, action:string){
    //    console.log(targetKey, action)
    // }
    function lookResult(id: any, type: any) {
      infoRequest.studentResults({ param: { id: id, type: type } }).then((res: any) => {
        console.log(res);
        if (res.data) {
          visableDetail.value = true;
          state.componentName = type;
          state.detailInfo = res.data;
          const types = {
            exper: "实验习题",
            cvideo: "操作视频",
            report: "实验报告",
          };
          state.title = types[type];
        } else {
          const warningMeaasge = {
            exper: "实验习题为空！",
            cvideo: "操作视频为空！",
            report: "暂无实验报告！",
          };
          message.warning(warningMeaasge[type]);
        }
      });
    }
    function detailOk() {
      visableDetail.value = false;
    }
    function detailCancel() {
      visableDetail.value = false;
    }
    onMounted(() => {
      getScore();
    });
    return {
      columns,
      data,
      confirmLoading,
      visable,
      ModalText,
      scoreDetails,
      change,
      handleOk,
      handleCancel,
      getScore,
      ...toRefs(state),
      lookResult,
      visableDetail,
      detailOk,
      detailCancel,
    };
  },
});
</script>
<style lang="less">
.detail {
  color: var(--purpleblue-6);
}
.scoreStar {
  display: flex;
}
.star {
  width: 22px;
  display: inline-block;
}
.scoreDetailModal {
  .ant-modal-header {
    background-color: var(--purpleblue-6);
  }
  .ant-modal-title {
    color: white;
  }
  .ant-modal-body {
    min-height: 630px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border-radius: 0px;
    border-left: 0px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab:nth-child(1) {
    border-left: 1px solid var(--gray-5);
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border-top: 2px solid var(--purpleblue-6);
  }
}
</style>
