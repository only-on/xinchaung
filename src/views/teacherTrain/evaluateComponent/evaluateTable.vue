<template>
  <div class="evaluate-table">
    <a-config-provider>
      <a-table
        :rowKey="rowkey"
        :dataSource="tableList"
        :columns="columns"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows,
          onChange: onSelectChange,
        }"
        :hideOnSinglePage="true"
      >
        <!-- rowSelection -->
        <template #username="{ record }">
          <span>{{ record.user.username }}</span>
        </template>
        <template #name="{ record }">
          <span>{{ record.userProfile.name }}</span>
        </template>
        <template #used_time="{ record }">
          <span>{{ record.study_record?.used_time || "--" }}</span>
        </template>
        <!-- <template #class="{ record }">
                <span>{{ record.class || '--'}}</span>
              </template> -->
        <template #achievements="{ record }">
          <span
            :class="record.study_record.id ? 'operation-btn' : 'nosee'"
            @click="lookAchievements(record.study_record?.id, 'note')"
            >查看</span
          >
        </template>
        <template #video="{ record }">
          <span
            :class="record.study_record.id ? 'operation-btn' : 'nosee'"
            @click="lookAchievements(record.study_record?.id, 'video')"
            >查看</span
          >
        </template>
        <template #report="{ record }">
          <span
            :class="record.study_record.id ? 'operation-btn' : 'nosee'"
            @click="lookAchievements(record.study_record?.id, 'report')"
            >查看</span
          >
        </template>
        <template #result="{ record }">
          <span class="score" v-if="record.study_record?.status > 1"
            >{{ record.study_record.score }}分</span
          >
          <span
            class="operation-btn"
            v-if="record.study_record?.status > 1"
            @click="editScore(record)"
            >修改</span
          >
          <span
            v-else
            :class="record.study_record.id ? 'operation-btn' : 'nosee'"
            @click="Review(record.study_record?.id)"
            >批阅</span
          >
        </template>
        <!-- <template #env="{ record }">
                <span class="operation-btn disabled" @click="reset(record)">重置</span>
              </template> -->
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>

    <!-- <Empty v-else/> -->
    <div class="page-footer-box">
      <!-- show-quick-jumper  -->
      <!-- <a-pagination
        v-model:current="page.page" 
        :pageSize="page.pageSize" 
        :total="total" 
        @change="pageChange" 
        :hideOnSinglePage="true"
      /> -->
    </div>
  </div>
  <a-modal v-model:visible="visible" title="请输入分数：" @ok="handleOk" :width="420">
    <a-input-number v-model:value="score" :min="0" :max="100" style="width: 100%" />
  </a-modal>
  <look-achievements-modal
    :isShowAchievements="isShowAchievements"
    :lookAchievementsInfo="lookAchievementsInfo"
    @close="lookAchievementsClose"
  ></look-achievements-modal>
  <look-report-modal
    :isShowReport="isShowReport"
    :reportUrl="reportUrl"
    @close="lookReportClose"
  ></look-report-modal>
  <look-video-modal
    v-model:isShowVideo="isShowVideo"
    :videoUrl="videoUrl"
  ></look-video-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, ref, watch } from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ITeacherTrainHttp } from "./../typings";
import { message } from "ant-design-vue";
import lookAchievementsModal from "./lookAchievementsModal.vue";
import lookReportModal from "./lookReportModal.vue";
import lookVideoModal from "./lookVideoModal.vue";

export default defineComponent({
  components: { lookAchievementsModal, lookReportModal, lookVideoModal },
  props: {
    trainId: {
      type: String,
    },
    tableList: {
      type: Array as PropType<ITableList[]>,
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
    selectedRows: {
      type: Array as PropType<ITableList[]>,
      default: [],
    },
    role: {},
  },
  emits: ["update:selectedRows", "pageChange"],
  setup(props, { emit }) {
    const data = reactive<IData>({
      selectedRowKeys: [],
      // tableList: [],
      page: {
        page: 1,
        pageSize: 10,
      },
    });
    const http = (request as ITeacherTrainHttp).teacherTrain;
    const columns1 = [
      {
        title: "学号",
        dataIndex: "username",
        key: "username",
        slots: { customRender: "username" },
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        slots: { customRender: "name" },
      },
      {
        title: "花费时间",
        dataIndex: "used_time",
        key: "used_time",
        slots: { customRender: "used_time" },
      },
      {
        title: "实训成果",
        dataIndex: "achievements",
        key: "achievements",
        slots: { customRender: "achievements" },
      },
      {
        title: "操作视频",
        dataIndex: "video",
        key: "video",
        slots: { customRender: "video" },
      },
      {
        title: "实训报告",
        dataIndex: "report",
        key: "report",
        slots: { customRender: "report" },
      },
      {
        title: "所属班级",
        dataIndex: "classes",
        key: "classes",
      },
      // slots: { customRender: 'class' },
      {
        title: "实训成绩",
        dataIndex: "result",
        key: "result",
        slots: { customRender: "result" },
      },
    ];
    const columns = props.role !== "2" ? columns1 : columns1.splice(0, 6);
    // let isShowVideo = ref(false);
    // 操作处理
    const operationHandle = reactive({
      // 查看成果,视频,报告
      isShowAchievements: false,
      lookAchievementsInfo: [],
      isShowVideo: false,
      videoUrl: "",
      isShowReport: false,
      reportUrl: "",
      lookAchievements: (id: number, type: string) => {
        console.log(id);
        http.assessmentDetails({ param: { id: id, type: type } }).then((res: any) => {
          console.log(res);
          if (res.data?.length) {
            switch (type) {
              case "note":
                operationHandle.isShowAchievements = true;
                operationHandle.lookAchievementsInfo = res.data;
                return;
              case "video":
                operationHandle.isShowVideo = true;
                operationHandle.videoUrl = res.data;
                return;
              case "report":
                operationHandle.isShowReport = true;
                operationHandle.reportUrl = res.data;
                return;
            }
          } else {
            const warningMessage = {
              note: "暂无实训成果!",
              video: "服务器没有该文件！",
              report: "服务器没有该文件！",
            };
            message.warn(warningMessage[type]);
          }
        });
      },
      lookAchievementsClose: () => {
        operationHandle.isShowAchievements = false;
      },
      lookReportClose: () => {
        operationHandle.isShowReport = false;
      },
      // 批阅
      visible: false,
      score: null,
      contentId: 0,
      Review: (id: number) => {
        operationHandle.visible = true;
        operationHandle.contentId = id;
      },
      handleOk: () => {
        http
          .setExperimentalScore({
            urlParams: { id: operationHandle.contentId },
            param: { score: operationHandle.score },
          })
          .then((res: any) => {
            console.log(res);
            operationHandle.visible = false;
          });
        // http.setExperimentalScore({
        //   param: {
        //     // train_student_content_id: operationHandle.contentId,
        //     train_student_content_id: 84,
        //     score: operationHandle.score
        //   }
        // }).then((res: IBusinessResp) => {
        //   console.log(res)
        //   operationHandle.score = 0
        //   operationHandle.visible = false
        //   // emit('pageChange', data.page.page)
        // })
      },
      editScore: (list: ITableList) => {
        operationHandle.visible = true;
        operationHandle.contentId = list.id;
        // operationHandle.score = list.score
      },
      // 重置
      // reset: (list: ITableList) =>{
      //   http.resetExperimentalServer({
      //     param: {
      //       train_id: props.trainId,
      //       train_student_content_id: list.id
      //     }
      //   }).then((res: IBusinessResp) => {
      //     console.log(res, data.page.page)
      //     // emit('pageChange', data.page.page)
      //   })
      // }
    });
    // 页码发生变化时
    const pageChange = (page: number, pageSize: number) => {
      data.page.page = page;
      data.page.pageSize = pageSize;
      emit("pageChange", page);
    };
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      data.page.page = current;
      data.page.pageSize = size;
    };
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      console.log(selectedRows, "hhhhhhhhh哈哈哈");
      data.selectedRowKeys = selectedRowKeys;
      emit("update:selectedRows", selectedRows);
    };
    const rowkey = (record: {}, index: number) => {
      return index;
    };
    watch(
      () => props.selectedRows,
      (val: any) => {
        if (!val.length) {
          data.selectedRowKeys = [];
        }
      }
    );
    return {
      ...toRefs(props),
      ...toRefs(data),
      ...toRefs(operationHandle),
      columns,
      pageChange,
      onShowSizeChange,
      rowkey,
      onSelectChange,
    };
  },
});
interface ITableList {
  id: number;
  num: number;
  name: string;
  time: string;
  achievements: string;
  video: string;
  report: string;
  class: string;
  result: number;
  env: number;
  score: number;
}
interface IPage {
  page: number;
  pageSize: number;
  // total: number
}
interface IData {
  // tableList: ITableList[],
  page: IPage;
  selectedRowKeys: any[];
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme-color;
}
.evaluate-table {
  .score {
    margin-right: 10px;
  }
  .operation-btn {
    cursor: pointer;
    .theme-color();
    &.disabled {
      color: #949494;
      overflow: hidden;
      cursor: not-allowed;
    }
  }
  .nosee {
    pointer-events: none;
    color: @avatar-bg;
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
    margin-bottom: 48px;
  }
}

:deep(.ant-modal) {
  :deep(.ant-input-number) {
    width: 100%;
  }
}
:deep(.ant-modal-body) {
  height: 750px;
}
</style>
